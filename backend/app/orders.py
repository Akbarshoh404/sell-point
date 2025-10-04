from flask import Blueprint, request
from bson import ObjectId
from . import get_db
from .models import CartItem, Order, OrderItem, Product

bp = Blueprint('orders', __name__)

@bp.post('')
def create_order():
    uid = request.args.get('user_id', type=str)
    if not uid:
        return {'message': 'user_id required'}, 400
    
    db = get_db()
    
    # Get cart items for user
    cart_items_data = db.cart_items.find({'user_id': uid})
    cart_items = [CartItem.from_dict(ci) for ci in cart_items_data]
    
    if not cart_items:
        return {'message': 'cart empty'}, 400
    
    # Calculate total and validate stock
    total = 0.0
    order_items = []
    
    for ci in cart_items:
        try:
            product_data = db.products.find_one({'_id': ObjectId(ci.product_id)})
        except:
            return {'message': f'invalid product_id format: {ci.product_id}'}, 400
        
        if not product_data:
            return {'message': f'product not found: {ci.product_id}'}, 400
        
        product = Product.from_dict(product_data)
        
        if product.stock < ci.quantity:
            return {'message': f'insufficient stock for product {ci.product_id}'}, 400
        
        item_price = (product.price - product.discount) * ci.quantity
        total += item_price
        
        order_item = OrderItem(
            product_id=ci.product_id,
            quantity=ci.quantity,
            price=product.price - product.discount
        )
        order_items.append(order_item)
    
    # Create order
    order = Order(
        buyer_id=uid,
        total_price=total,
        payment_status='cod',
        delivery_status='processing',
        items=order_items
    )
    
    # Insert order into database
    order_data = order.to_dict()
    result = db.orders.insert_one(order_data)
    order._id = result.inserted_id
    
    # Update product stock and remove cart items
    for ci in cart_items:
        # Update product stock
        db.products.update_one(
            {'_id': ObjectId(ci.product_id)},
            {'$inc': {'stock': -ci.quantity}}
        )
        
        # Remove cart item
        db.cart_items.delete_one({'_id': ci._id})
    
    return {
        'id': order.id,
        'totalPrice': order.total_price,
        'paymentStatus': order.payment_status,
        'deliveryStatus': order.delivery_status
    }, 201

@bp.get('')
def list_orders():
    uid = request.args.get('user_id', type=str)
    if not uid:
        return {'message': 'user_id required'}, 400
    
    db = get_db()
    orders_data = db.orders.find({'buyer_id': uid}).sort('created_at', -1)
    orders = [Order.from_dict(o) for o in orders_data]
    
    return [{
        'id': o.id,
        'totalPrice': o.total_price,
        'paymentStatus': o.payment_status,
        'deliveryStatus': o.delivery_status,
        'createdAt': o.created_at.isoformat()
    } for o in orders]