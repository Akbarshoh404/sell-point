
from flask import Blueprint, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from . import db
from .models import User, UserRole

bp = Blueprint('auth', __name__)

@bp.post('/register')
def register():
    data = request.get_json() or {}
    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''
    name = data.get('name')
    role = data.get('role') or UserRole.buyer.value
    if not email or not password:
        return {'message': 'email and password required'}, 400
    if User.query.filter_by(email=email).first():
        return {'message': 'email already registered'}, 400
    user = User(email=email, name=name, role=role)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    token = create_access_token(identity=str(user.id))
    return {'access_token': token, 'user': {'id': user.id, 'email': user.email, 'role': user.role, 'name': user.name}}, 201

@bp.post('/login')
def login():
    data = request.get_json() or {}
    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''
    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return {'message': 'invalid credentials'}, 401
    token = create_access_token(identity=str(user.id))
    return {'access_token': token, 'user': {'id': user.id, 'email': user.email, 'role': user.role, 'name': user.name}}

@bp.get('/me')
@jwt_required()
def me():
    uid = get_jwt_identity()
    user = User.query.get(int(uid))
    if not user:
        return {'message': 'not found'}, 404
    return {'id': user.id, 'email': user.email, 'role': user.role, 'name': user.name, 'avatar_url': user.avatar_url}
