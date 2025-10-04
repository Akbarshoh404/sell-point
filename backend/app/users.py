from flask import Blueprint, request
from bson import ObjectId
from . import get_db
from .models import User, CartItem, Order

bp = Blueprint('users', __name__)

def _serialize_user(u: User):
    return {
        'id': u.id,
        'email': u.email,
        'role': u.role,
        'name': u.name,
        'avatar_url': u.avatar_url
    }

@bp.get('')
def list_users():
    db = get_db()
    users_data = db.users.find().sort('_id', 1)
    users = [User.from_dict(u) for u in users_data]
    
    return [_serialize_user(u) for u in users]

@bp.get('/<user_id>')
def get_user(user_id: str):
    db = get_db()
    
    try:
        user_data = db.users.find_one({'_id': ObjectId(user_id)})
    except:
        return {'message': 'invalid user_id format'}, 400
    
    if not user_data:
        return {'message': 'user not found'}, 404
    
    user = User.from_dict(user_data)
    return _serialize_user(user)

@bp.patch('/<user_id>')
def update_user(user_id: str):
    db = get_db()
    
    try:
        user_data = db.users.find_one({'_id': ObjectId(user_id)})
    except:
        return {'message': 'invalid user_id format'}, 400
    
    if not user_data:
        return {'message': 'user not found'}, 404
    
    user = User.from_dict(user_data)
    data = request.get_json() or {}
    update_data = {}
    
    if 'name' in data:
        update_data['name'] = data['name']
    if 'avatar_url' in data:
        update_data['avatar_url'] = data['avatar_url']
    
    # Update in database
    if update_data:
        db.users.update_one(
            {'_id': ObjectId(user_id)},
            {'$set': update_data}
        )
    
    # Get updated user
    updated_data = db.users.find_one({'_id': ObjectId(user_id)})
    updated_user = User.from_dict(updated_data)
    
    return _serialize_user(updated_user)

@bp.get('/<user_id>/cart')
def get_user_cart(user_id: str):
    db = get_db()
    
    try:
        user_data = db.users.find_one({'_id': ObjectId(user_id)})
    except:
        return {'message': 'invalid user_id format'}, 400
    
    if not user_data:
        return {'message': 'user not found'}, 404
    
    items_data = db.cart_items.find({'user_id': user_id})
    items = [CartItem.from_dict(i) for i in items_data]
    
    return [{'id': i.id, 'productId': i.product_id, 'quantity': i.quantity} for i in items]

@bp.get('/<user_id>/orders')
def get_user_orders(user_id: str):
    db = get_db()
    
    try:
        user_data = db.users.find_one({'_id': ObjectId(user_id)})
    except:
        return {'message': 'invalid user_id format'}, 400
    
    if not user_data:
        return {'message': 'user not found'}, 404
    
    orders_data = db.orders.find({'buyer_id': user_id}).sort('created_at', -1)
    orders = [Order.from_dict(o) for o in orders_data]
    
    return [{
        'id': o.id,
        'totalPrice': o.total_price,
        'paymentStatus': o.payment_status,
        'deliveryStatus': o.delivery_status,
        'createdAt': o.created_at.isoformat()
    } for o in orders]