
from flask import Blueprint, request
from . import db
from .models import CartItem, Product

bp = Blueprint('cart', __name__)

@bp.get('')
def list_cart():
    uid = request.args.get('user_id', type=int)
    if not uid:
        return {'message': 'user_id required'}, 400
    items = CartItem.query.filter_by(user_id=uid).all()
    return [{'id': i.id, 'productId': i.product_id, 'quantity': i.quantity} for i in items]

@bp.post('')
def add_cart():
    uid = request.args.get('user_id', type=int)
    if not uid:
        return {'message': 'user_id required'}, 400
    data = request.get_json() or {}
    product_id = int(data.get('productId'))
    quantity = int(data.get('quantity', 1))
    Product.query.get_or_404(product_id)
    item = CartItem.query.filter_by(user_id=uid, product_id=product_id).first()
    if item:
        item.quantity += quantity
    else:
        item = CartItem(user_id=uid, product_id=product_id, quantity=quantity)
        db.session.add(item)
    db.session.commit()
    return {'id': item.id, 'productId': item.product_id, 'quantity': item.quantity}, 201

@bp.patch('/<int:item_id>')
def update_cart(item_id: int):
    uid = request.args.get('user_id', type=int)
    if not uid:
        return {'message': 'user_id required'}, 400
    data = request.get_json() or {}
    item = CartItem.query.get_or_404(item_id)
    if item.user_id != uid:
        return {'message': 'not owner'}, 403
    if 'quantity' in data:
        item.quantity = max(1, int(data['quantity']))
    db.session.commit()
    return {'id': item.id, 'productId': item.product_id, 'quantity': item.quantity}

@bp.delete('/<int:item_id>')
def remove_cart(item_id: int):
    uid = request.args.get('user_id', type=int)
    if not uid:
        return {'message': 'user_id required'}, 400
    item = CartItem.query.get_or_404(item_id)
    if item.user_id != uid:
        return {'message': 'not owner'}, 403
    db.session.delete(item)
    db.session.commit()
    return {'deleted': True}
