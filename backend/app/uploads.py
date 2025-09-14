import os
import uuid
from flask import Blueprint, current_app, request, jsonify, send_from_directory

bp = Blueprint('uploads', __name__)

ALLOWED_EXTENSIONS = {'.png', '.jpg', '.jpeg', '.gif', '.webp'}

@bp.post('')
def upload_file():
    if 'file' not in request.files:
        return {'message': 'file field is required'}, 400
    file = request.files['file']
    if file.filename == '':
        return {'message': 'empty filename'}, 400
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        return {'message': 'unsupported file type'}, 400
    uploads_dir = current_app.config.get('UPLOADS_DIR')
    os.makedirs(uploads_dir, exist_ok=True)
    new_name = f"{uuid.uuid4().hex}{ext}"
    path = os.path.join(uploads_dir, new_name)
    file.save(path)
    url_prefix = current_app.config.get('UPLOADS_URL_PREFIX', '/uploads')
    return jsonify({ 'url': f"{url_prefix}/{new_name}" })

@bp.get('/<path:filename>')
def serve_upload(filename: str):
    uploads_dir = current_app.config.get('UPLOADS_DIR')
    return send_from_directory(uploads_dir, filename)

