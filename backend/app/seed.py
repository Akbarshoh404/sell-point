import json
from . import db
from .models import User, Store, Product, ProductSpecification, UserRole

def run():
    # Basic users
    if not User.query.filter_by(email='buyer@example.com').first():
        buyer = User(email='buyer@example.com', name='Buyer One', role=UserRole.buyer.value)
        buyer.set_password('password')
        db.session.add(buyer)
    else:
        buyer = User.query.filter_by(email='buyer@example.com').first()
    if not User.query.filter_by(email='seller@example.com').first():
        seller = User(email='seller@example.com', name='Seller Pro', role=UserRole.seller.value)
        seller.set_password('password')
        db.session.add(seller)
    else:
        seller = User.query.filter_by(email='seller@example.com').first()
    db.session.flush()
    # Store
    store = Store.query.filter_by(owner_id=seller.id, name='Pro Tech').first()
    if not store:
        store = Store(owner_id=seller.id, name='Pro Tech', description='Quality electronics', logo_url='/api/uploads/demo-store.png', rating=4.7)
        db.session.add(store)
        db.session.flush()
    # Products
    if not Product.query.first():
        products = [
            {
                'title': 'Galaxy S24 Ultra 256GB', 'price': 1199.0, 'discount': 100.0, 'condition': 'new',
                'brand': 'Samsung', 'model': 'S24 Ultra', 'category': 'phones', 'stock': 10,
                'images': ['/api/uploads/demo-phone.png'],
                'specs': {'ram': '12GB', 'storage': '256GB', 'batteryCapacity': '5000mAh'}
            },
            {
                'title': 'MacBook Pro 14" M3 16GB/512GB', 'price': 1999.0, 'discount': 150.0, 'condition': 'new',
                'brand': 'Apple', 'model': 'MacBook Pro 14', 'category': 'laptops', 'stock': 5,
                'images': ['/api/uploads/demo-laptop.png'],
                'specs': {'ram': '16GB', 'storage': '512GB SSD', 'processor': 'Apple M3'}
            },
        ]
        for pd in products:
            p = Product(
                title=pd['title'], description=None, price=pd['price'], discount=pd['discount'],
                condition=pd['condition'], images_json=json.dumps(pd['images']), brand=pd['brand'],
                model=pd['model'], category=pd['category'], seller_id=seller.id, store_id=store.id, stock=pd['stock']
            )
            db.session.add(p)
            db.session.flush()
            for k, v in pd['specs'].items():
                db.session.add(ProductSpecification(product_id=p.id, key=k, value=str(v)))
    db.session.commit()
    return {'seeded': True}

