import os
from flask import Flask
from pymongo import MongoClient
from flask_cors import CORS

# Global MongoDB client
mongo_client = None
db = None

def create_app():
    global mongo_client, db
    
    app = Flask(__name__)
    
    # Configure MongoDB connection
    mongodb_url = os.getenv('MONGODB_URL', 'mongodb://localhost:27017/')
    database_name = os.getenv('DATABASE_NAME', 'sellpoint')
    
    mongo_client = MongoClient(mongodb_url)
    db = mongo_client[database_name]
    
    app.config['JSON_SORT_KEYS'] = False
    app.config['UPLOADS_DIR'] = os.path.join(os.path.dirname(__file__), '..', 'uploads')
    app.config['UPLOADS_URL_PREFIX'] = '/api/uploads'
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')

    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Import and register blueprints
    from .auth import bp as auth_bp
    from .products import bp as products_bp
    from .stores import bp as stores_bp
    from .cart import bp as cart_bp
    from .orders import bp as orders_bp
    from .users import bp as users_bp
    from .uploads import bp as uploads_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(products_bp, url_prefix='/api/products')
    app.register_blueprint(stores_bp, url_prefix='/api/stores')
    app.register_blueprint(cart_bp, url_prefix='/api/cart')
    app.register_blueprint(orders_bp, url_prefix='/api/orders')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    app.register_blueprint(uploads_bp, url_prefix=app.config['UPLOADS_URL_PREFIX'])

    # Create indexes for better performance
    with app.app_context():
        create_indexes()

    @app.get('/api/health')
    def health():
        return {'status': 'ok', 'database': 'mongodb'}

    return app

def create_indexes():
    """Create MongoDB indexes for better performance"""
    # User indexes
    db.users.create_index("email", unique=True)
    db.users.create_index("role")
    
    # Product indexes
    db.products.create_index("category")
    db.products.create_index("brand")
    db.products.create_index("seller_id")
    db.products.create_index("store_id")
    db.products.create_index([("title", "text"), ("description", "text")])
    
    # Store indexes
    db.stores.create_index("owner_id")
    db.stores.create_index([("owner_id", 1), ("name", 1)], unique=True)
    
    # Cart indexes
    db.cart_items.create_index("user_id")
    db.cart_items.create_index([("user_id", 1), ("product_id", 1)], unique=True)
    
    # Order indexes
    db.orders.create_index("buyer_id")
    db.orders.create_index("created_at")

def get_db():
    """Get the MongoDB database instance"""
    return db