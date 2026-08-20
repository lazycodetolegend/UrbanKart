# UrbanKart — MERN Stack E-Commerce Application

A full-featured e-commerce marketplace built with MongoDB, Express.js, React (Vite), and Node.js.

## Features

### Customer-Facing
- 🏠 **Home Page** — Hero banner, featured products, category tiles, promotional banner
- 🛍️ **Product Listing** — Grid with search, category filter, price range, sort options, pagination
- 📦 **Product Detail** — Image gallery, reviews, quantity selector, related products
- 🛒 **Shopping Cart** — Add/remove items, quantity control, price summary
- 💳 **Checkout** — Multi-step (Address → Summary → Payment with Razorpay/COD)
- 🔐 **Authentication** — Register, login, logout with JWT httpOnly cookies
- 👤 **User Profile** — Edit profile, manage addresses
- 📋 **Order History** — Order list with status tracking timeline
- ❤️ **Wishlist** — Save/remove favorite products
- ⭐ **Reviews** — Purchase-gated product reviews with star ratings

### Admin Panel (/admin)
- 📊 **Dashboard** — Sales stats, best sellers, low stock alerts
- 📦 **Product Management** — Full CRUD with image upload
- 🏷️ **Category Management** — Add/edit/delete categories
- 📋 **Order Management** — View all orders, update status
- 👥 **User Management** — View registered users

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite, React Router v6, Tailwind CSS v3 |
| Backend | Node.js + Express.js (REST API) |
| Database | MongoDB (Mongoose ODM) |
| Auth | JWT (httpOnly cookies) + bcryptjs |
| Payments | Razorpay (test mode) + COD fallback |
| State | React Context API (Auth, Cart, Wishlist) |
| Image Upload | Multer (local /uploads) |

## Prerequisites

- Node.js v18+
- MongoDB Atlas account (free tier works)
- Razorpay account (optional, for payment testing)

## Getting Started

### 1. Clone & Install

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment

Create `server/.env` from the example:

```bash
cp server/.env.example server/.env
```

Edit `server/.env` with your values:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/urbankart
JWT_SECRET=your_strong_secret_key_change_this
JWT_EXPIRE=7d
COOKIE_EXPIRE=7
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
RAZORPAY_KEY_ID=your_razorpay_key_id        # Optional
RAZORPAY_KEY_SECRET=your_razorpay_key_secret  # Optional
```

### 3. Seed Demo Data

```bash
cd server
npm run seed
```

This creates:
- **Admin account**: admin@urbankart.com / password123
- **User account**: john@example.com / password123
- **5 categories**: Electronics, Fashion, Home & Kitchen, Books, Beauty
- **20 products** with realistic names and prices

### 4. Run Development Servers

In two separate terminals:

```bash
# Terminal 1 — Backend (port 5000)
cd server
npm run dev

# Terminal 2 — Frontend (port 5173)
cd client
npm run dev
```

Visit **http://localhost:5173** to start shopping!

## Configuration Notes

### MongoDB Atlas
1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a database user with read/write permissions
3. Whitelist your IP address (or use 0.0.0.0/0 for development)
4. Copy the connection string to `MONGO_URI` in `.env`

### Razorpay (Optional)
1. Sign up at [razorpay.com](https://razorpay.com)
2. Get test mode API keys from Dashboard → Settings → API Keys
3. Add them to `.env`
4. Without Razorpay keys, the checkout falls back to **Cash on Delivery**

### Image Upload
- Product images are stored locally in `server/uploads/`
- Supports JPEG, PNG, WebP (max 5MB)
- Access via `/uploads/filename.jpg`

## API Reference

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/auth/register` | POST | Public | Create account |
| `/api/auth/login` | POST | Public | Login |
| `/api/auth/logout` | POST | Auth | Logout |
| `/api/auth/me` | GET | Auth | Current user |
| `/api/products` | GET | Public | List products (search, filter, sort, paginate) |
| `/api/products/featured` | GET | Public | Featured products |
| `/api/products/:id` | GET | Public | Product detail with reviews |
| `/api/products` | POST | Admin | Create product |
| `/api/products/:id` | PUT | Admin | Update product |
| `/api/products/:id` | DELETE | Admin | Delete product |
| `/api/categories` | GET | Public | All categories |
| `/api/orders` | POST | Auth | Place order |
| `/api/orders/my` | GET | Auth | User's orders |
| `/api/orders/:id` | GET | Auth | Order detail |
| `/api/reviews/:productId` | POST | Auth | Create review |
| `/api/users/wishlist/:id` | POST | Auth | Toggle wishlist |
| `/api/payments/razorpay/order` | POST | Auth | Create Razorpay order |
| `/api/admin/stats` | GET | Admin | Dashboard statistics |

## Project Structure

```
UrbanKart/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   │   ├── admin/         # AdminLayout
│   │   │   ├── auth/          # ProtectedRoute, AdminRoute
│   │   │   ├── layout/        # Header, Footer, Layout
│   │   │   ├── product/       # ProductCard
│   │   │   └── ui/            # Spinner, StarRating
│   │   ├── context/           # Auth, Cart, Wishlist contexts
│   │   ├── pages/             # All page components
│   │   │   └── admin/         # Admin panel pages
│   │   ├── services/          # Axios API client
│   │   └── utils/             # formatPrice helper
│   └── package.json
│
├── server/                    # Express backend
│   ├── config/                # DB connection
│   ├── controllers/           # Route handlers
│   ├── middleware/             # Auth, validation, error handler
│   ├── models/                # Mongoose schemas
│   ├── routes/                # API routes
│   ├── utils/                 # JWT helper, seeder
│   └── package.json
│
└── .gitignore
```

## Design

- **Color Palette**: Deep navy (#131921) header/footer, amber/orange (#FF9900) accents, white backgrounds
- **Font**: Inter (Google Fonts)
- **Style**: Amazon-inspired marketplace with premium feel — sticky header, search bar, category navigation

---

Built with ❤️ using the MERN stack.
"# UrbanKart" 
