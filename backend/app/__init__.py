
import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///sellpoint.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JSON_SORT_KEYS'] = False

    CORS(app, resources={r"/api/*": {"origins": "*"}})

    db.init_app(app)

    from .models import User
    from .auth import bp as auth_bp
    from .products import bp as products_bp
    from .stores import bp as stores_bp
    from .cart import bp as cart_bp
    from .orders import bp as orders_bp
    from .users import bp as users_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(products_bp, url_prefix='/api/products')
    app.register_blueprint(stores_bp, url_prefix='/api/stores')
    app.register_blueprint(cart_bp, url_prefix='/api/cart')
    app.register_blueprint(orders_bp, url_prefix='/api/orders')
    app.register_blueprint(users_bp, url_prefix='/api/users')

    with app.app_context():
        db.create_all()

    @app.get('/api/health')
    def health():
        return {'status': 'ok'}

    return app