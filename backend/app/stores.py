
from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from . import db
from .models import Store, User

bp = Blueprint('stores', __name__)

@bp.get('')
def list_stores():
    stores = Store.query.order_by(Store.id.desc()).all()
    return [{'id': s.id, 'name': s.name, 'description': s.description, 'logo': s.logo_url, 'rating': s.rating, 'ownerId': s.owner_id} for s in stores]

@bp.post('')
@jwt_required()
def create_store():
    uid = int(get_jwt_identity())
    user = User.query.get_or_404(uid)
    if user.role not in ('seller', 'admin'):
        return {'message': 'seller or admin required'}, 403
    data = request.get_json() or {}
    s = Store(owner_id=uid, name=data.get('name'), description=data.get('description'), logo_url=data.get('logo'))
    db.session.add(s)
    db.session.commit()
    return {'id': s.id, 'name': s.name, 'description': s.description, 'logo': s.logo_url, 'rating': s.rating, 'ownerId': s.owner_id}, 201

@bp.get('/<int:sid>')
def get_store(sid: int):
    s = Store.query.get_or_404(sid)
    return {'id': s.id, 'name': s.name, 'description': s.description, 'logo': s.logo_url, 'rating': s.rating, 'ownerId': s.owner_id}

@bp.patch('/<int:sid>')
@jwt_required()
def update_store(sid: int):
    uid = int(get_jwt_identity())
    s = Store.query.get_or_404(sid)
    if s.owner_id != uid:
        return {'message': 'not owner'}, 403
    data = request.get_json() or {}
    if 'name' in data:
        s.name = data['name']
    if 'description' in data:
        s.description = data['description']
    if 'logo_url' in data:
        s.logo_url = data['logo_url']
    db.session.commit()
    return {'id': s.id, 'name': s.name, 'description': s.description, 'logo': s.logo_url, 'rating': s.rating, 'ownerId': s.owner_id}

@bp.delete('/<int:sid>')
@jwt_required()
def delete_store(sid: int):
    uid = int(get_jwt_identity())
    s = Store.query.get_or_404(sid)
    if s.owner_id != uid:
        return {'message': 'not owner'}, 403
    db.session.delete(s)
    db.session.commit()
    return {'deleted': True}
