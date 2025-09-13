
from flask import Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from . import db
from .models import CartItem, Order, OrderItem, Product

bp = Blueprint('orders', __name__)

@bp.post('')
@jwt_required()
def create_order():
    uid = int(get_jwt_identity())
    cart_items = CartItem.query.filter_by(user_id=uid).all()
    if not cart_items:
        return {'message': 'cart empty'}, 400
    total = 0.0
    for ci in cart_items:
        p = Product.query.get(ci.product_id)
        if not p or p.stock < ci.quantity:
            return {'message': f'insufficient stock for product {ci.product_id}'}, 400
        total += (p.price - p.discount) * ci.quantity
    order = Order(buyer_id=uid, total_price=total, payment_status='cod', delivery_status='processing')
    db.session.add(order)
    db.session.flush()
    for ci in cart_items:
        p = Product.query.get(ci.product_id)
        p.stock -= ci.quantity
        db.session.add(OrderItem(order_id=order.id, product_id=ci.product_id, quantity=ci.quantity, price=p.price - p.discount))
        db.session.delete(ci)
    db.session.commit()
    return {'id': order.id, 'totalPrice': order.total_price, 'paymentStatus': order.payment_status, 'deliveryStatus': order.delivery_status}, 201

@bp.get('')
@jwt_required()
def list_orders():
    uid = int(get_jwt_identity())
    orders = Order.query.filter_by(buyer_id=uid).order_by(Order.created_at.desc()).all()
    return [{'id': o.id, 'totalPrice': o.total_price, 'paymentStatus': o.payment_status, 'deliveryStatus': o.delivery_status, 'createdAt': o.created_at.isoformat()} for o in orders]
