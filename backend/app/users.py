from flask import Blueprint, request
from .models import User, CartItem, Order

bp = Blueprint('users', __name__)

def _serialize_user(u: User):
    return { 'id': u.id, 'email': u.email, 'role': u.role, 'name': u.name, 'avatar_url': u.avatar_url }

@bp.get('')
def list_users():
    users = User.query.order_by(User.id.asc()).all()
    return [_serialize_user(u) for u in users]

@bp.get('/<int:uid>')
def get_user(uid: int):
    u = User.query.get_or_404(uid)
    return _serialize_user(u)

@bp.get('/<int:uid>/cart')
def get_user_cart(uid: int):
    items = CartItem.query.filter_by(user_id=uid).all()
    return [{ 'id': i.id, 'productId': i.product_id, 'quantity': i.quantity } for i in items]

@bp.get('/<int:uid>/orders')
def get_user_orders(uid: int):
    orders = Order.query.filter_by(buyer_id=uid).order_by(Order.created_at.desc()).all()
    return [{ 'id': o.id, 'totalPrice': o.total_price, 'paymentStatus': o.payment_status, 'deliveryStatus': o.delivery_status, 'createdAt': o.created_at.isoformat() } for o in orders]

