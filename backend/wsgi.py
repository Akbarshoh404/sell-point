from app import create_app
from app.seed import run as seed_run

app = create_app()

# Optional: enable seeding via env var at startup (no-op if already seeded)
try:
    import os
    if os.getenv('SEED_DB', '0') == '1':
        with app.app_context():
            seed_run()
except Exception:
    pass
