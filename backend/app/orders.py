
from flask import Blueprint, request
from . import db
from .models import CartItem, Order, OrderItem, Product

bp = Blueprint('orders', __name__)

@bp.post('')
def create_order():
    uid = request.args.get('user_id', type=int)
    if not uid:
        return {'message': 'user_id required'}, 400
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
def list_orders():
    uid = request.args.get('user_id', type=int)
    if not uid:
        return {'message': 'user_id required'}, 400
    orders = Order.query.filter_by(buyer_id=uid).order_by(Order.created_at.desc()).all()
    return [{'id': o.id, 'totalPrice': o.total_price, 'paymentStatus': o.payment_status, 'deliveryStatus': o.delivery_status, 'createdAt': o.created_at.isoformat()} for o in orders]
