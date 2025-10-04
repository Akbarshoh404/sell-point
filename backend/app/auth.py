from flask import Blueprint, request, session
from bson import ObjectId
from . import get_db
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
    
    db = get_db()
    
    # Check if user already exists
    existing_user = db.users.find_one({'email': email})
    if existing_user:
        return {'message': 'email already registered'}, 400
    
    # Create new user
    user = User(email=email, name=name, role=role)
    user.set_password(password)
    
    # Insert user into database
    user_data = user.to_dict()
    result = db.users.insert_one(user_data)
    user_data['_id'] = result.inserted_id
    
    return {
        'user': {
            'id': str(result.inserted_id),
            'email': user.email,
            'role': user.role,
            'name': user.name
        }
    }, 201

@bp.post('/login')
def login():
    data = request.get_json() or {}
    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''
    
    if not email or not password:
        return {'message': 'email and password required'}, 400
    
    db = get_db()
    
    # Find user by email
    user_data = db.users.find_one({'email': email})
    if not user_data:
        return {'message': 'invalid credentials'}, 401
    
    user = User.from_dict(user_data)
    
    # Check password
    if not user.check_password(password):
        return {'message': 'invalid credentials'}, 401
    
    # Store user info in session
    session['user_id'] = str(user._id)
    session['user_email'] = user.email
    session['user_role'] = user.role
    
    return {
        'user': {
            'id': user.id,
            'email': user.email,
            'role': user.role,
            'name': user.name
        }
    }

@bp.post('/logout')
def logout():
    session.clear()
    return {'message': 'logged out successfully'}

@bp.get('/me')
def me():
    user_id = request.args.get('user_id', type=str)
    if not user_id:
        return {'message': 'user_id required'}, 400
    
    db = get_db()
    
    # Find user by ID
    try:
        user_data = db.users.find_one({'_id': ObjectId(user_id)})
    except:
        return {'message': 'invalid user_id format'}, 400
    
    if not user_data:
        return {'message': 'not found'}, 404
    
    user = User.from_dict(user_data)
    
    return {
        'id': user.id,
        'email': user.email,
        'role': user.role,
        'name': user.name,
        'avatar_url': user.avatar_url
    }

@bp.get('/session')
def get_session():
    """Get current session information"""
    if 'user_id' not in session:
        return {'authenticated': False}, 401
    
    return {
        'authenticated': True,
        'user_id': session.get('user_id'),
        'user_email': session.get('user_email'),
        'user_role': session.get('user_role')
    }