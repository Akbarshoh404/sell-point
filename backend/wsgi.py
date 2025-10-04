from app import create_app
from app.seed import run as seed_run
import os

app = create_app()

# Optional: enable seeding via env var at startup (no-op if already seeded)
try:
    if os.getenv('SEED_DB', '0') == '1':
        with app.app_context():
            seed_run()
except Exception:
    pass

if __name__ == '__main__':
    # Run the Flask app directly
    app.run(host='0.0.0.0', port=5001, debug=True)
