import json
from . import get_db
from .models import User, Store, Product, UserRole

def run():
    db = get_db()
    
    # Basic users
    buyer_data = db.users.find_one({'email': 'buyer@example.com'})
    if not buyer_data:
        buyer = User(email='buyer@example.com', name='Buyer One', role=UserRole.buyer.value)
        buyer.set_password('password')
        buyer_data = buyer.to_dict()
        db.users.insert_one(buyer_data)
        buyer_id = str(buyer_data['_id'])
    else:
        buyer_id = str(buyer_data['_id'])
    
    seller_data = db.users.find_one({'email': 'seller@example.com'})
    if not seller_data:
        seller = User(email='seller@example.com', name='Seller Pro', role=UserRole.seller.value)
        seller.set_password('password')
        seller_data = seller.to_dict()
        db.users.insert_one(seller_data)
        seller_id = str(seller_data['_id'])
    else:
        seller_id = str(seller_data['_id'])
    
    # Store
    store_data = db.stores.find_one({'owner_id': seller_id, 'name': 'Pro Tech'})
    if not store_data:
        store = Store(
            owner_id=seller_id,
            name='Pro Tech',
            description='Quality electronics',
            logo_url='/api/uploads/demo-store.png',
            rating=4.7
        )
        store_data = store.to_dict()
        db.stores.insert_one(store_data)
        store_id = str(store_data['_id'])
    else:
        store_id = str(store_data['_id'])
    
    # Products
    if not db.products.find_one():
        products = [
            {
                'title': 'Galaxy S24 Ultra 256GB',
                'price': 1199.0,
                'discount': 100.0,
                'condition': 'new',
                'brand': 'Samsung',
                'model': 'S24 Ultra',
                'category': 'phones',
                'stock': 10,
                'images_json': json.dumps(['/api/uploads/demo-phone.png']),
                'specifications': {'ram': '12GB', 'storage': '256GB', 'batteryCapacity': '5000mAh'}
            },
            {
                'title': 'MacBook Pro 14" M3 16GB/512GB',
                'price': 1999.0,
                'discount': 150.0,
                'condition': 'new',
                'brand': 'Apple',
                'model': 'MacBook Pro 14',
                'category': 'laptops',
                'stock': 5,
                'images_json': json.dumps(['/api/uploads/demo-laptop.png']),
                'specifications': {'ram': '16GB', 'storage': '512GB SSD', 'processor': 'Apple M3'}
            },
        ]
        
        for pd in products:
            product = Product(
                title=pd['title'],
                description=None,
                price=pd['price'],
                discount=pd['discount'],
                condition=pd['condition'],
                images_json=pd['images_json'],
                brand=pd['brand'],
                model=pd['model'],
                category=pd['category'],
                seller_id=seller_id,
                store_id=store_id,
                stock=pd['stock'],
                specifications=pd['specifications']
            )
            product_data = product.to_dict()
            db.products.insert_one(product_data)
    
    return {'seeded': True}