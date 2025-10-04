from datetime import datetime
from enum import Enum
from typing import Optional, List, Dict, Any
from bson import ObjectId
import bcrypt

class UserRole(str, Enum):
    buyer = 'buyer'
    seller = 'seller'
    admin = 'admin'

class User:
    def __init__(self, email: str, password_hash: str, name: Optional[str] = None, 
                 avatar_url: Optional[str] = None, role: str = UserRole.buyer.value, 
                 created_at: Optional[datetime] = None, _id: Optional[ObjectId] = None):
        self._id = _id or ObjectId()
        self.email = email
        self.password_hash = password_hash
        self.name = name
        self.avatar_url = avatar_url
        self.role = role
        self.created_at = created_at or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            '_id': self._id,
            'email': self.email,
            'password_hash': self.password_hash,
            'name': self.name,
            'avatar_url': self.avatar_url,
            'role': self.role,
            'created_at': self.created_at
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'User':
        return cls(
            _id=data['_id'],
            email=data['email'],
            password_hash=data['password_hash'],
            name=data.get('name'),
            avatar_url=data.get('avatar_url'),
            role=data.get('role', UserRole.buyer.value),
            created_at=data.get('created_at', datetime.utcnow())
        )

    def set_password(self, password: str) -> None:
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    def check_password(self, password: str) -> bool:
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))

    @property
    def id(self):
        return str(self._id)

class Store:
    def __init__(self, owner_id: str, name: str, description: Optional[str] = None,
                 logo_url: Optional[str] = None, rating: float = 0.0, _id: Optional[ObjectId] = None):
        self._id = _id or ObjectId()
        self.owner_id = owner_id
        self.name = name
        self.description = description
        self.logo_url = logo_url
        self.rating = rating

    def to_dict(self) -> Dict[str, Any]:
        return {
            '_id': self._id,
            'owner_id': self.owner_id,
            'name': self.name,
            'description': self.description,
            'logo_url': self.logo_url,
            'rating': self.rating
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Store':
        return cls(
            _id=data['_id'],
            owner_id=data['owner_id'],
            name=data['name'],
            description=data.get('description'),
            logo_url=data.get('logo_url'),
            rating=data.get('rating', 0.0)
        )

    @property
    def id(self):
        return str(self._id)

class Product:
    def __init__(self, title: str, price: float, condition: str, category: str, 
                 seller_id: str, description: Optional[str] = None, discount: float = 0.0,
                 images_json: str = '[]', brand: Optional[str] = None, model: Optional[str] = None,
                 store_id: Optional[str] = None, stock: int = 0, specifications: Optional[Dict[str, str]] = None,
                 created_at: Optional[datetime] = None, updated_at: Optional[datetime] = None,
                 _id: Optional[ObjectId] = None):
        self._id = _id or ObjectId()
        self.title = title
        self.description = description
        self.price = price
        self.discount = discount
        self.condition = condition
        self.images_json = images_json
        self.brand = brand
        self.model = model
        self.category = category
        self.seller_id = seller_id
        self.store_id = store_id
        self.stock = stock
        self.specifications = specifications or {}
        self.created_at = created_at or datetime.utcnow()
        self.updated_at = updated_at or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            '_id': self._id,
            'title': self.title,
            'description': self.description,
            'price': self.price,
            'discount': self.discount,
            'condition': self.condition,
            'images_json': self.images_json,
            'brand': self.brand,
            'model': self.model,
            'category': self.category,
            'seller_id': self.seller_id,
            'store_id': self.store_id,
            'stock': self.stock,
            'specifications': self.specifications,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Product':
        return cls(
            _id=data['_id'],
            title=data['title'],
            description=data.get('description'),
            price=data['price'],
            discount=data.get('discount', 0.0),
            condition=data['condition'],
            images_json=data.get('images_json', '[]'),
            brand=data.get('brand'),
            model=data.get('model'),
            category=data['category'],
            seller_id=data['seller_id'],
            store_id=data.get('store_id'),
            stock=data.get('stock', 0),
            specifications=data.get('specifications', {}),
            created_at=data.get('created_at', datetime.utcnow()),
            updated_at=data.get('updated_at', datetime.utcnow())
        )

    @property
    def id(self):
        return str(self._id)

class CartItem:
    def __init__(self, user_id: str, product_id: str, quantity: int = 1,
                 added_at: Optional[datetime] = None, _id: Optional[ObjectId] = None):
        self._id = _id or ObjectId()
        self.user_id = user_id
        self.product_id = product_id
        self.quantity = quantity
        self.added_at = added_at or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            '_id': self._id,
            'user_id': self.user_id,
            'product_id': self.product_id,
            'quantity': self.quantity,
            'added_at': self.added_at
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'CartItem':
        return cls(
            _id=data['_id'],
            user_id=data['user_id'],
            product_id=data['product_id'],
            quantity=data.get('quantity', 1),
            added_at=data.get('added_at', datetime.utcnow())
        )

    @property
    def id(self):
        return str(self._id)

class Order:
    def __init__(self, buyer_id: str, total_price: float, payment_status: str = 'pending',
                 delivery_status: str = 'processing', created_at: Optional[datetime] = None,
                 items: Optional[List['OrderItem']] = None, _id: Optional[ObjectId] = None):
        self._id = _id or ObjectId()
        self.buyer_id = buyer_id
        self.total_price = total_price
        self.payment_status = payment_status
        self.delivery_status = delivery_status
        self.created_at = created_at or datetime.utcnow()
        self.items = items or []

    def to_dict(self) -> Dict[str, Any]:
        return {
            '_id': self._id,
            'buyer_id': self.buyer_id,
            'total_price': self.total_price,
            'payment_status': self.payment_status,
            'delivery_status': self.delivery_status,
            'created_at': self.created_at,
            'items': [item.to_dict() for item in self.items]
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Order':
        items = [OrderItem.from_dict(item) for item in data.get('items', [])]
        return cls(
            _id=data['_id'],
            buyer_id=data['buyer_id'],
            total_price=data['total_price'],
            payment_status=data.get('payment_status', 'pending'),
            delivery_status=data.get('delivery_status', 'processing'),
            created_at=data.get('created_at', datetime.utcnow()),
            items=items
        )

    @property
    def id(self):
        return str(self._id)

class OrderItem:
    def __init__(self, product_id: str, quantity: int, price: float, _id: Optional[ObjectId] = None):
        self._id = _id or ObjectId()
        self.product_id = product_id
        self.quantity = quantity
        self.price = price

    def to_dict(self) -> Dict[str, Any]:
        return {
            '_id': self._id,
            'product_id': self.product_id,
            'quantity': self.quantity,
            'price': self.price
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'OrderItem':
        return cls(
            _id=data['_id'],
            product_id=data['product_id'],
            quantity=data['quantity'],
            price=data['price']
        )

    @property
    def id(self):
        return str(self._id)