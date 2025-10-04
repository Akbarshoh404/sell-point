from flask import Blueprint, request
from bson import ObjectId
from . import get_db
from .models import Store, User

bp = Blueprint('stores', __name__)

@bp.get('')
def list_stores():
    db = get_db()
    stores_data = db.stores.find().sort('_id', -1)
    stores = [Store.from_dict(s) for s in stores_data]
    
    return [{
        'id': s.id,
        'name': s.name,
        'description': s.description,
        'logo': s.logo_url,
        'rating': s.rating,
        'ownerId': s.owner_id
    } for s in stores]

@bp.post('')
def create_store():
    uid = request.args.get('user_id', type=str)
    if not uid:
        return {'message': 'user_id required'}, 400
    
    db = get_db()
    
    try:
        user_data = db.users.find_one({'_id': ObjectId(uid)})
    except:
        return {'message': 'invalid user_id format'}, 400
    
    if not user_data:
        return {'message': 'user not found'}, 404
    
    user = User.from_dict(user_data)
    if user.role not in ('seller', 'admin'):
        return {'message': 'seller or admin required'}, 403
    
    data = request.get_json() or {}
    
    # Check if store name already exists for this owner
    existing_store = db.stores.find_one({
        'owner_id': uid,
        'name': data.get('name')
    })
    if existing_store:
        return {'message': 'store name already exists for this owner'}, 400
    
    store = Store(
        owner_id=uid,
        name=data.get('name'),
        description=data.get('description'),
        logo_url=data.get('logo')
    )
    
    store_data = store.to_dict()
    result = db.stores.insert_one(store_data)
    store._id = result.inserted_id
    
    return {
        'id': store.id,
        'name': store.name,
        'description': store.description,
        'logo': store.logo_url,
        'rating': store.rating,
        'ownerId': store.owner_id
    }, 201

@bp.get('/<store_id>')
def get_store(store_id: str):
    db = get_db()
    
    try:
        store_data = db.stores.find_one({'_id': ObjectId(store_id)})
    except:
        return {'message': 'invalid store_id format'}, 400
    
    if not store_data:
        return {'message': 'store not found'}, 404
    
    store = Store.from_dict(store_data)
    
    return {
        'id': store.id,
        'name': store.name,
        'description': store.description,
        'logo': store.logo_url,
        'rating': store.rating,
        'ownerId': store.owner_id
    }

@bp.patch('/<store_id>')
def update_store(store_id: str):
    uid = request.args.get('user_id', type=str)
    if not uid:
        return {'message': 'user_id required'}, 400
    
    db = get_db()
    
    try:
        store_data = db.stores.find_one({'_id': ObjectId(store_id)})
    except:
        return {'message': 'invalid store_id format'}, 400
    
    if not store_data:
        return {'message': 'store not found'}, 404
    
    store = Store.from_dict(store_data)
    if store.owner_id != uid:
        return {'message': 'not owner'}, 403
    
    data = request.get_json() or {}
    update_data = {}
    
    if 'name' in data:
        # Check if new name already exists for this owner
        existing_store = db.stores.find_one({
            'owner_id': uid,
            'name': data['name'],
            '_id': {'$ne': ObjectId(store_id)}
        })
        if existing_store:
            return {'message': 'store name already exists for this owner'}, 400
        update_data['name'] = data['name']
    
    if 'description' in data:
        update_data['description'] = data['description']
    if 'logo_url' in data:
        update_data['logo_url'] = data['logo_url']
    
    # Update in database
    if update_data:
        db.stores.update_one(
            {'_id': ObjectId(store_id)},
            {'$set': update_data}
        )
    
    # Get updated store
    updated_data = db.stores.find_one({'_id': ObjectId(store_id)})
    updated_store = Store.from_dict(updated_data)
    
    return {
        'id': updated_store.id,
        'name': updated_store.name,
        'description': updated_store.description,
        'logo': updated_store.logo_url,
        'rating': updated_store.rating,
        'ownerId': updated_store.owner_id
    }

@bp.delete('/<store_id>')
def delete_store(store_id: str):
    uid = request.args.get('user_id', type=str)
    if not uid:
        return {'message': 'user_id required'}, 400
    
    db = get_db()
    
    try:
        store_data = db.stores.find_one({'_id': ObjectId(store_id)})
    except:
        return {'message': 'invalid store_id format'}, 400
    
    if not store_data:
        return {'message': 'store not found'}, 404
    
    store = Store.from_dict(store_data)
    if store.owner_id != uid:
        return {'message': 'not owner'}, 403
    
    db.stores.delete_one({'_id': ObjectId(store_id)})
    return {'deleted': True}