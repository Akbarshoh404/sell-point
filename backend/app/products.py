
import json
from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import and_, or_
from . import db
from .models import Product, ProductSpecification, User

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
        'specifications': {s.key: s.value for s in p.specifications},
    }

@bp.get('')
def list_products():
    q = request.args.get('q')
    category = request.args.get('category')
    brand = request.args.get('brand')
    model = request.args.get('model')
    condition = request.args.get('condition')
    price_min = request.args.get('price_min', type=float)
    price_max = request.args.get('price_max', type=float)
    in_stock = request.args.get('in_stock')

    query = Product.query

    if q:
        like = f"%{q}%"
        query = query.filter(or_(Product.title.ilike(like), Product.description.ilike(like)))
    if category:
        query = query.filter(Product.category == category)
    if brand:
        query = query.filter(Product.brand == brand)
    if model:
        query = query.filter(Product.model == model)
    if condition:
        query = query.filter(Product.condition == condition)
    if price_min is not None:
        query = query.filter(Product.price >= price_min)
    if price_max is not None:
        query = query.filter(Product.price <= price_max)
    if in_stock is not None:
        query = query.filter(Product.stock > 0)

    spec_filters = {k[5:]: v for k, v in request.args.items() if k.startswith('spec_')}
    for key, value in spec_filters.items():
        query = query.join(ProductSpecification).filter(and_(ProductSpecification.key == key, ProductSpecification.value == value))

    sort = request.args.get('sort')
    if sort == 'price_asc':
        query = query.order_by(Product.price.asc())
    elif sort == 'price_desc':
        query = query.order_by(Product.price.desc())
    else:
        query = query.order_by(Product.created_at.desc())

    page = request.args.get('page', type=int, default=1)
    size = request.args.get('size', type=int, default=20)
    items = query.paginate(page=page, per_page=size, error_out=False)
    return {
        'items': [_serialize_product(p) for p in items.items],
        'page': items.page,
        'pages': items.pages,
        'total': items.total,
    }

@bp.get('/<int:pid>')
def get_product(pid: int):
    p = Product.query.get_or_404(pid)
    return _serialize_product(p)

@bp.post('')
@jwt_required()
def create_product():
    uid = int(get_jwt_identity())
    user = User.query.get_or_404(uid)
    if user.role not in ('seller', 'admin'):
        return {'message': 'seller or admin required'}, 403
    data = request.get_json() or {}
    specs = data.pop('specifications', {}) or {}
    images = data.pop('images', []) or []
    p = Product(
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
    )
    db.session.add(p)
    db.session.flush()
    for k, v in specs.items():
        db.session.add(ProductSpecification(product_id=p.id, key=str(k), value=str(v)))
    db.session.commit()
    return _serialize_product(p), 201

@bp.put('/<int:pid>')
@bp.patch('/<int:pid>')
@jwt_required()
def update_product(pid: int):
    uid = int(get_jwt_identity())
    p = Product.query.get_or_404(pid)
    if p.seller_id != uid:
        return {'message': 'not owner'}, 403
    data = request.get_json() or {}
    for field in ['title', 'description', 'brand', 'model', 'category', 'condition']:
        if field in data:
            setattr(p, field, data[field])
    if 'price' in data:
        p.price = float(data['price'])
    if 'discount' in data:
        p.discount = float(data['discount'])
    if 'stock' in data:
        p.stock = int(data['stock'])
    if 'images' in data:
        p.images_json = json.dumps(data.get('images') or [])
    if 'specifications' in data:
        ProductSpecification.query.filter_by(product_id=p.id).delete()
        for k, v in (data.get('specifications') or {}).items():
            db.session.add(ProductSpecification(product_id=p.id, key=str(k), value=str(v)))
    db.session.commit()
    return _serialize_product(p)

@bp.delete('/<int:pid>')
@jwt_required()
def delete_product(pid: int):
    uid = int(get_jwt_identity())
    p = Product.query.get_or_404(pid)
    if p.seller_id != uid:
        return {'message': 'not owner'}, 403
    db.session.delete(p)
    db.session.commit()
    return {'deleted': True}
