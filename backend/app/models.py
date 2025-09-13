
from datetime import datetime
from enum import Enum
from typing import Optional, List
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import Index, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from . import db

class UserRole(str, Enum):
    buyer = 'buyer'
    seller = 'seller'
    admin = 'admin'

class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(unique=True, index=True)
    password_hash: Mapped[str]
    name: Mapped[Optional[str]]
    avatar_url: Mapped[Optional[str]]
    role: Mapped[str] = mapped_column(default=UserRole.buyer.value)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)

    stores: Mapped[List['Store']] = relationship(back_populates='owner')
    cart_items: Mapped[List['CartItem']] = relationship(back_populates='user')
    orders: Mapped[List['Order']] = relationship(back_populates='buyer')

    def set_password(self, password: str) -> None:
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)

class Store(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    owner_id: Mapped[int] = mapped_column(db.ForeignKey('user.id'))
    name: Mapped[str]
    description: Mapped[Optional[str]]
    logo_url: Mapped[Optional[str]]
    rating: Mapped[float] = mapped_column(default=0.0)

    owner: Mapped['User'] = relationship(back_populates='stores')
    products: Mapped[List['Product']] = relationship(back_populates='store')

    __table_args__ = (UniqueConstraint('owner_id', 'name', name='uq_store_owner_name'),)

class Product(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str]
    description: Mapped[Optional[str]]
    price: Mapped[float]
    discount: Mapped[float] = mapped_column(default=0.0)
    condition: Mapped[str]
    images_json: Mapped[str] = mapped_column(default='[]')
    brand: Mapped[Optional[str]]
    model: Mapped[Optional[str]]
    category: Mapped[str]
    seller_id: Mapped[int] = mapped_column(db.ForeignKey('user.id'))
    store_id: Mapped[Optional[int]] = mapped_column(db.ForeignKey('store.id'))
    stock: Mapped[int] = mapped_column(default=0)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(default=datetime.utcnow, onupdate=datetime.utcnow)

    seller: Mapped['User'] = relationship()
    store: Mapped[Optional['Store']] = relationship(back_populates='products')
    specifications: Mapped[List['ProductSpecification']] = relationship(back_populates='product', cascade='all, delete-orphan')

Index('ix_product_category_brand', Product.category, Product.brand)

class ProductSpecification(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    product_id: Mapped[int] = mapped_column(db.ForeignKey('product.id'), index=True)
    key: Mapped[str] = mapped_column(index=True)
    value: Mapped[str] = mapped_column(index=True)

    product: Mapped['Product'] = relationship(back_populates='specifications')
    __table_args__ = (Index('ix_spec_product_key_value', 'product_id', 'key', 'value'),)

class CartItem(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(db.ForeignKey('user.id'), index=True)
    product_id: Mapped[int] = mapped_column(db.ForeignKey('product.id'))
    quantity: Mapped[int] = mapped_column(default=1)
    added_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)

    user: Mapped['User'] = relationship(back_populates='cart_items')
    product: Mapped['Product'] = relationship()

    __table_args__ = (UniqueConstraint('user_id', 'product_id', name='uq_cartitem_user_product'),)

class Order(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    buyer_id: Mapped[int] = mapped_column(db.ForeignKey('user.id'), index=True)
    total_price: Mapped[float]
    payment_status: Mapped[str] = mapped_column(default='pending')
    delivery_status: Mapped[str] = mapped_column(default='processing')
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)

    buyer: Mapped['User'] = relationship(back_populates='orders')
    items: Mapped[List['OrderItem']] = relationship(back_populates='order', cascade='all, delete-orphan')

class OrderItem(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    order_id: Mapped[int] = mapped_column(db.ForeignKey('order.id'), index=True)
    product_id: Mapped[int] = mapped_column(db.ForeignKey('product.id'))
    quantity: Mapped[int]
    price: Mapped[float]

    order: Mapped['Order'] = relationship(back_populates='items')
    product: Mapped['Product'] = relationship()
