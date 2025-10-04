import json
from flask import Blueprint, request
from bson import ObjectId
from . import get_db
from .models import Product, User

bp = Blueprint('products', __name__)

def _serialize_product(p: Product):
    return {
        'id': p.id,
        'title': p.title,
        'description': p.description,
        'price': p.price,
        'discount': p.discount,
        'condition': p.condition,
        'images': json.loads(p.images_json or '[]'),
        'brand': p.brand,
        'model': p.model,
        'category': p.category,
        'sellerId': p.seller_id,
        'storeId': p.store_id,
        'stock': p.stock,
        'createdAt': p.created_at.isoformat(),
        'updatedAt': p.updated_at.isoformat() if p.updated_at else None,
        'specifications': p.specifications,
    }

@bp.get('')
def list_products():
    db = get_db()
    
    # Build query filters
    query = {}
    
    q = request.args.get('q')
    if q:
        query['$or'] = [
            {'title': {'$regex': q, '$options': 'i'}},
            {'description': {'$regex': q, '$options': 'i'}}
        ]
    
    category = request.args.get('category')
    if category:
        query['category'] = category
    
    brand = request.args.get('brand')
    if brand:
        query['brand'] = brand
    
    model = request.args.get('model')
    if model:
        query['model'] = model
    
    condition = request.args.get('condition')
    if condition:
        query['condition'] = condition
    
    price_min = request.args.get('price_min', type=float)
    price_max = request.args.get('price_max', type=float)
    if price_min is not None or price_max is not None:
        price_query = {}
        if price_min is not None:
            price_query['$gte'] = price_min
        if price_max is not None:
            price_query['$lte'] = price_max
        query['price'] = price_query
    
    in_stock = request.args.get('in_stock')
    if in_stock is not None:
        query['stock'] = {'$gt': 0}
    
    # Handle specification filters
    spec_filters = {k[5:]: v for k, v in request.args.items() if k.startswith('spec_')}
    for key, value in spec_filters.items():
        query[f'specifications.{key}'] = value
    
    # Build sort
    sort = request.args.get('sort')
    sort_field = 'created_at'
    sort_direction = -1  # descending
    
    if sort == 'price_asc':
        sort_field = 'price'
        sort_direction = 1
    elif sort == 'price_desc':
        sort_field = 'price'
        sort_direction = -1
    
    # Pagination
    page = request.args.get('page', type=int, default=1)
    size = request.args.get('size', type=int, default=20)
    skip = (page - 1) * size
    
    # Execute query
    cursor = db.products.find(query).sort(sort_field, sort_direction).skip(skip).limit(size)
    products = [Product.from_dict(p) for p in cursor]
    
    # Get total count
    total = db.products.count_documents(query)
    pages = (total + size - 1) // size
    
    return {
        'items': [_serialize_product(p) for p in products],
        'page': page,
        'pages': pages,
        'total': total,
    }

@bp.get('/<product_id>')
def get_product(product_id: str):
    db = get_db()
    
    try:
        product_data = db.products.find_one({'_id': ObjectId(product_id)})
    except:
        return {'message': 'invalid product_id format'}, 400
    
    if not product_data:
        return {'message': 'product not found'}, 404
    
    product = Product.from_dict(product_data)
    return _serialize_product(product)

@bp.post('')
def create_product():
    uid = request.args.get('user_id', type=str)
    if not uid:
        return {'message': 'user_id required'}, 400
    
    db = get_db()
    
    try:
        user_data = db.users.find_one({'_id': ObjectId(uid)})
    except:
        return {'message': 'invalid user_id format'}, 400
    
    if not user_data:
        return {'message': 'user not found'}, 404
    
    user = User.from_dict(user_data)
    if user.role not in ('seller', 'admin'):
        return {'message': 'seller or admin required'}, 403
    
    data = request.get_json() or {}
    specs = data.pop('specifications', {}) or {}
    images = data.pop('images', []) or []
    
    product = Product(
        title=data.get('title'),
        description=data.get('description'),
        price=float(data.get('price', 0)),
        discount=float(data.get('discount', 0)),
        condition=data.get('condition', 'new'),
        images_json=json.dumps(images),
        brand=data.get('brand'),
        model=data.get('model'),
        category=data.get('category'),
        seller_id=uid,
        store_id=data.get('storeId'),
        stock=int(data.get('stock', 0)),
        specifications=specs
    )
    
    product_data = product.to_dict()
    result = db.products.insert_one(product_data)
    product._id = result.inserted_id
    
    return _serialize_product(product), 201

@bp.put('/<product_id>')
@bp.patch('/<product_id>')
def update_product(product_id: str):
    uid = request.args.get('user_id', type=str)
    if not uid:
        return {'message': 'user_id required'}, 400
    
    db = get_db()
    
    try:
        product_data = db.products.find_one({'_id': ObjectId(product_id)})
    except:
        return {'message': 'invalid product_id format'}, 400
    
    if not product_data:
        return {'message': 'product not found'}, 404
    
    product = Product.from_dict(product_data)
    if product.seller_id != uid:
        return {'message': 'not owner'}, 403
    
    data = request.get_json() or {}
    update_data = {}
    
    # Update fields
    for field in ['title', 'description', 'brand', 'model', 'category', 'condition']:
        if field in data:
            update_data[field] = data[field]
    
    if 'price' in data:
        update_data['price'] = float(data['price'])
    if 'discount' in data:
        update_data['discount'] = float(data['discount'])
    if 'stock' in data:
        update_data['stock'] = int(data['stock'])
    if 'images' in data:
        update_data['images_json'] = json.dumps(data.get('images') or [])
    if 'specifications' in data:
        update_data['specifications'] = data.get('specifications') or {}
    
    update_data['updated_at'] = product.updated_at
    
    # Update in database
    db.products.update_one(
        {'_id': ObjectId(product_id)},
        {'$set': update_data}
    )
    
    # Get updated product
    updated_data = db.products.find_one({'_id': ObjectId(product_id)})
    updated_product = Product.from_dict(updated_data)
    
    return _serialize_product(updated_product)

@bp.delete('/<product_id>')
def delete_product(product_id: str):
    uid = request.args.get('user_id', type=str)
    if not uid:
        return {'message': 'user_id required'}, 400
    
    db = get_db()
    
    try:
        product_data = db.products.find_one({'_id': ObjectId(product_id)})
    except:
        return {'message': 'invalid product_id format'}, 400
    
    if not product_data:
        return {'message': 'product not found'}, 404
    
    product = Product.from_dict(product_data)
    if product.seller_id != uid:
        return {'message': 'not owner'}, 403
    
    db.products.delete_one({'_id': ObjectId(product_id)})
    return {'deleted': True}