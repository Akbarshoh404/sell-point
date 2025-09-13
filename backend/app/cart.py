
from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from . import db
from .models import CartItem, Product

bp = Blueprint('cart', __name__)

@bp.get('')
@jwt_required()
def list_cart():
    uid = int(get_jwt_identity())
    items = CartItem.query.filter_by(user_id=uid).all()
    return [{'id': i.id, 'productId': i.product_id, 'quantity': i.quantity} for i in items]

@bp.post('')
@jwt_required()
def add_cart():
    uid = int(get_jwt_identity())
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
@jwt_required()
def update_cart(item_id: int):
    uid = int(get_jwt_identity())
    data = request.get_json() or {}
    item = CartItem.query.get_or_404(item_id)
    if item.user_id != uid:
        return {'message': 'not owner'}, 403
    if 'quantity' in data:
        item.quantity = max(1, int(data['quantity']))
    db.session.commit()
    return {'id': item.id, 'productId': item.product_id, 'quantity': item.quantity}

@bp.delete('/<int:item_id>')
@jwt_required()
def remove_cart(item_id: int):
    uid = int(get_jwt_identity())
    item = CartItem.query.get_or_404(item_id)
    if item.user_id != uid:
        return {'message': 'not owner'}, 403
    db.session.delete(item)
    db.session.commit()
    return {'deleted': True}
