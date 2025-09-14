# SellPoint – Multi‑Vendor Electronics Marketplace ✨🛒

SellPoint is a multi-vendor electronics marketplace where both individuals and stores can sell electronics such as phones, laptops, PCs, gaming consoles, and accessories. It supports dynamic specifications per category, advanced filtering, secure authentication, and basic cart/orders.

## Features

- Authentication: JWT-based (register, login, me)
- User roles: buyer, seller, admin
- Stores: professional sellers can manage store info and products
- Products: common fields + dynamic specifications for each category
- Filtering & search: text search and category-specific spec filters (e.g., RAM, battery)
- Cart & orders: add/update/remove cart items, create orders (MVP Cash on Delivery)
- Admin-ready: placeholders for user/product management and approvals

## Tech Stack ⚙️

- Backend: Python, Flask, SQLAlchemy, JWT, CORS
- Database: SQLite (dev default) or PostgreSQL via `DATABASE_URL`
- Frontend: React (Vite) + TypeScript + TailwindCSS + Zustand (planned in `frontend/`)
- Deployment: Docker + docker-compose (API + Postgres)

## Monorepo Structure 📁

```
backend/         Flask API (runnable now)
  app/
    __init__.py  Flask app factory, blueprints
    models.py    Users, Stores, Products, Specifications, Cart, Orders
    auth.py      Register, Login, Me (JWT)
    products.py  CRUD + listing with filters
    stores.py    CRUD for stores
    cart.py      Cart endpoints
    orders.py    Order creation + listing
  wsgi.py        WSGI entrypoint
  requirements.txt
  .env.example

frontend/        React app (Vite) – scaffold planned

docker-compose.yml
.env.example
README.md
```

## Quickstart 🧪

### Prerequisites

- Python 3.11+
- Node 18+ and npm (for frontend)
- Docker & docker-compose (optional)

### Backend (Local)

```
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
flask --app wsgi:app run --host 0.0.0.0 --port 5001
```

- API base URL: `http://localhost:5001`
- Default DB: SQLite file `sellpoint.db` in `backend/`

To use PostgreSQL locally, set `DATABASE_URL` in `backend/.env`:
```
DATABASE_URL=postgresql+psycopg2://user:password@localhost:5432/sellpoint
```

### Frontend (Local)

Scaffold is planned; once created:
```
cd frontend
npm install
npm run dev -- --host
```
- Frontend: `http://localhost:5173`
- Proxies or `.env` would point to API at `http://localhost:5001`

### Docker (API + Postgres) 🐳

```
cp .env.example .env
docker compose up --build
```

- API: `http://localhost:5001`
- Postgres: `localhost:5432` (user/pass/db: `sellpoint`)

## Environment Variables 🔧

Root `.env` (for docker-compose):
```
BACKEND_PORT=5001
DATABASE_URL=postgresql+psycopg2://sellpoint:sellpoint@db:5432/sellpoint
JWT_SECRET_KEY=change-me
FLASK_ENV=development
FLASK_DEBUG=1
```

Backend `.env.example` (local dev):
```
FLASK_ENV=development
FLASK_DEBUG=1
JWT_SECRET_KEY=change-me
DATABASE_URL=sqlite:///sellpoint.db
```

## API Overview (MVP) 📚

- Auth (no JWT; pass `user_id` where needed)
  - POST `/api/auth/register`: { email, password, name?, role? } → user
  - POST `/api/auth/login`: { email, password } → user
  - GET `/api/auth/me?user_id=ID`

- Products
  - GET `/api/products` query params:
    - `q`, `category`, `brand`, `model`, `condition`, `price_min`, `price_max`, `in_stock`
    - spec filters via `spec_*`, e.g. `spec_ram=16`, `spec_cpu=Intel`
    - `sort`: `newest` (default), `price_asc`, `price_desc`
    - pagination: `page`, `size`
  - GET `/api/products/:id`
  - POST `/api/products` (seller/admin)
  - PATCH `/api/products/:id` (owner)
  - DELETE `/api/products/:id` (owner)

- Stores
  - GET `/api/stores`
  - GET `/api/stores/:id`
  - POST `/api/stores` (seller/admin)
  - PATCH `/api/stores/:id` (owner)
  - DELETE `/api/stores/:id` (owner)

- Users
  - GET `/api/users` list
  - GET `/api/users/:id`
  - PATCH `/api/users/:id` { name?, avatar_url? }
  - GET `/api/users/:id/cart`
  - GET `/api/users/:id/orders`

- Cart (requires `user_id` query)
  - GET `/api/cart`
  - POST `/api/cart` { productId, quantity }
  - PATCH `/api/cart/:itemId` { quantity }
  - DELETE `/api/cart/:itemId`

- Orders (requires `user_id` query)
  - POST `/api/orders` (creates order from current cart, decrements stock)
  - GET `/api/orders` (buyer’s orders)

- Uploads
  - POST `/api/uploads` (form-data field `file`) → { url }
  - GET `/api/uploads/:filename`

## Data Model (Simplified) 🧱

- `User`: id, email, password_hash, name, avatar_url, role, created_at
- `Store`: id, owner_id, name, description, logo_url, rating
- `Product`: id, title, description, price, discount, condition, images_json, brand, model, category, seller_id, store_id, stock, timestamps
- `ProductSpecification`: id, product_id, key, value
- `CartItem`: id, user_id, product_id, quantity, added_at
- `Order`: id, buyer_id, total_price, payment_status, delivery_status, created_at
- `OrderItem`: id, order_id, product_id, quantity, price

Notes:
- Dynamic specs via key/value (`ProductSpecification`)
- Image handling is served from `/api/uploads` (local). Swap to S3/Cloudinary later.

## Auth Notes

- JWT Bearer tokens
- Include header: `Authorization: Bearer <token>`
- Roles:
  - buyer: default
  - seller: can create stores/products, manage inventory
  - admin: can manage/approve

## Filtering & Search

- Full-text-like search on `title/description` using `q` (ILIKE)
- Range filters for price
- Category-specific spec filters via `spec_*` query params
- Sort by newest or price

## Roadmap

- Media storage via S3/Cloudinary
- Payments integration (Stripe/PayPal/Click/Payme)
- ElasticSearch for faster search
- Admin dashboards for approvals and reports
- Bulk upload (CSV) for sellers
- Reviews and ratings

## Contributing

- Fork and PRs welcome
- Follow conventional commit messages
- Run linters/tests before submitting (TBD for this repo)

## License

- Copyright ©
- License to be determined by repository owner
