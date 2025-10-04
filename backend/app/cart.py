from flask import Blueprint, request
from bson import ObjectId
from . import get_db
from .models import CartItem, Product

bp = Blueprint('cart', __name__)

@bp.get('')
def list_cart():
    uid = request.args.get('user_id', type=str)
    if not uid:
        return {'message': 'user_id required'}, 400
    
    db = get_db()
    items_data = db.cart_items.find({'user_id': uid})
    items = [CartItem.from_dict(i) for i in items_data]
    
    return [{'id': i.id, 'productId': i.product_id, 'quantity': i.quantity} for i in items]

@bp.post('')
def add_cart():
    uid = request.args.get('user_id', type=str)
    if not uid:
        return {'message': 'user_id required'}, 400
    
    data = request.get_json() or {}
    product_id = data.get('productId')
    quantity = int(data.get('quantity', 1))
    
    if not product_id:
        return {'message': 'productId required'}, 400
    
    db = get_db()
    
    # Check if product exists
    try:
        product_data = db.products.find_one({'_id': ObjectId(product_id)})
    except:
        return {'message': 'invalid product_id format'}, 400
    
    if not product_data:
        return {'message': 'product not found'}, 404
    
    # Check if item already exists in cart
    existing_item = db.cart_items.find_one({
        'user_id': uid,
        'product_id': product_id
    })
    
    if existing_item:
        # Update quantity
        new_quantity = existing_item['quantity'] + quantity
        db.cart_items.update_one(
            {'_id': existing_item['_id']},
            {'$set': {'quantity': new_quantity}}
        )
        return {'id': str(existing_item['_id']), 'productId': product_id, 'quantity': new_quantity}, 201
    else:
        # Create new cart item
        cart_item = CartItem(user_id=uid, product_id=product_id, quantity=quantity)
        cart_item_data = cart_item.to_dict()
        result = db.cart_items.insert_one(cart_item_data)
        cart_item._id = result.inserted_id
        
        return {'id': cart_item.id, 'productId': cart_item.product_id, 'quantity': cart_item.quantity}, 201

@bp.patch('/<item_id>')
def update_cart(item_id: str):
    uid = request.args.get('user_id', type=str)
    if not uid:
        return {'message': 'user_id required'}, 400
    
    data = request.get_json() or {}
    
    db = get_db()
    
    try:
        item_data = db.cart_items.find_one({'_id': ObjectId(item_id)})
    except:
        return {'message': 'invalid item_id format'}, 400
    
    if not item_data:
        return {'message': 'cart item not found'}, 404
    
    item = CartItem.from_dict(item_data)
    if item.user_id != uid:
        return {'message': 'not owner'}, 403
    
    if 'quantity' in data:
        new_quantity = max(1, int(data['quantity']))
        db.cart_items.update_one(
            {'_id': ObjectId(item_id)},
            {'$set': {'quantity': new_quantity}}
        )
        
        return {'id': item.id, 'productId': item.product_id, 'quantity': new_quantity}
    
    return {'id': item.id, 'productId': item.product_id, 'quantity': item.quantity}

@bp.delete('/<item_id>')
def remove_cart(item_id: str):
    uid = request.args.get('user_id', type=str)
    if not uid:
        return {'message': 'user_id required'}, 400
    
    db = get_db()
    
    try:
        item_data = db.cart_items.find_one({'_id': ObjectId(item_id)})
    except:
        return {'message': 'invalid item_id format'}, 400
    
    if not item_data:
        return {'message': 'cart item not found'}, 404
    
    item = CartItem.from_dict(item_data)
    if item.user_id != uid:
        return {'message': 'not owner'}, 403
    
    db.cart_items.delete_one({'_id': ObjectId(item_id)})
    return {'deleted': True}