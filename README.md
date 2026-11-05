# 🛒 CodeAlpha - Simple E-commerce Store

A Full Stack MERN E-commerce Store developed as part of the **CodeAlpha Web Development Internship**.

---

## 📖 Project Overview

This project is a responsive e-commerce web application that allows users to browse products, view product details, register, log in, manage their shopping cart, and place orders. User information and order details are securely stored in MongoDB using a Node.js and Express.js backend.

---

## ✨ Features

- 🔐 User Registration
- 🔑 User Login with JWT Authentication
- 🛍️ Product Listing
- 📄 Product Details Page
- 🔍 Product Search
- 🛒 Shopping Cart Management
- ➕ Increase / Decrease Product Quantity
- ❌ Remove Products from Cart
- 📦 Order Placement
- 💾 MongoDB Database Integration
- 🌐 REST API Integration
- 📱 Fully Responsive Design (Mobile, Tablet & Desktop)

---

## 🛠️ Tech Stack

### Frontend

- React.js
- React Router DOM
- CSS3
- Vite

### Backend

- Node.js
- Express.js
- REST API

### Database

- MongoDB
- Mongoose ODM

### Authentication

- JWT (JSON Web Token)

---

## 📂 Project Structure

```text
CodeAlpha_SimpleEcommerceStore
│
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── server.js
│   └── package.json
│
├── client
│   ├── public
│   ├── src
│   ├── components
│   ├── pages
│   ├── context
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## ⚙️ Installation

### Clone the Repository

```bash
git clone https://github.com/ashikabeed650/CodeAlpha_SimpleEcommerceStore.git
```

### Backend Setup

```bash
cd backend
npm install
npm run seed
npm run dev
```

Before seeding, copy `backend/.env.example` to `backend/.env` and set `MONGO_URI` and `JWT_SECRET`. The seed command adds missing sample products and does not delete existing products.

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

For local frontend development, copy `client/.env.example` to `client/.env` and set `VITE_API_URL=http://localhost:5000/api`.

---

## 📸 Application Features

- 🏠 Home Page
- 🛍️ Products Page
- 📄 Product Details
- 👤 User Registration
- 🔐 User Login
- 🛒 Shopping Cart
- 📦 Order Processing
- 📱 Responsive User Interface
- 💾 MongoDB User & Order Storage

---

## 📄 API Endpoints

### Authentication

- POST `/api/auth/register`
- POST `/api/auth/login`

### Products

- GET `/api/products`
- GET `/api/products/:id`
- POST `/api/products` (administrator)
- PUT `/api/products/:id` (administrator)
- DELETE `/api/products/:id` (administrator; products in order history are retained)

### Orders

- POST `/api/orders`
- GET `/api/orders`

---

## 👨‍💻 Developer

**Ashik Abeed**

Web Development Intern – CodeAlpha

📧 Email: ashikabeed650@gmail.com

🌐 GitHub: https://github.com/ashikabeed650

---

## 📌 Internship Task

**Task 1 – Simple E-commerce Store**

Developed as part of the **CodeAlpha Web Development Internship**.

---

## 📄 License

This project is created for educational and internship purposes under the CodeAlpha Web Development Internship Program.

---

## ⭐ Acknowledgement

I would like to thank **CodeAlpha** for providing this opportunity to build a real-world Full Stack MERN application and enhance my web development skills.

---

## 🚀 Deploying to Vercel

The frontend and backend are separate Vercel projects in this repository. Deploy the backend first, then configure the frontend to use its URL.

### 1. Prepare MongoDB and seed products

Create a MongoDB database and allow connections from your hosting environment. Copy `backend/.env.example` to `backend/.env`, enter the MongoDB connection string and a long, private JWT secret, then run `npm run seed` from the `backend` directory. Never commit `.env` or enter backend secrets in the frontend project.

### 2. Deploy the backend

- Import the repository as a new Vercel project and set **Root Directory** to `backend`.
- Add `MONGO_URI` and `JWT_SECRET` under the backend project's **Settings → Environment Variables**.
- Deploy. The backend's `vercel.json` configures the API function and includes the product images.
- Verify the deployment root responds, and that `/api/products` returns the seeded products.

### 3. Deploy the frontend

- Import the same repository as a second Vercel project. The repository-root `vercel.json` builds and serves the frontend when the project's **Root Directory** is left at the repository root. Alternatively, set **Root Directory** to `client` to use the client-specific Vercel configuration.
- `client/.env.production` sets the public `VITE_API_URL` to the backend deployment URL followed by `/api`. Update it if you use a different backend, or override `VITE_API_URL` under the frontend project's **Settings → Environment Variables**.
- Deploy. The client Vercel rewrite supports direct visits and refreshes on routes such as `/products` and `/cart`.

If the product API returns a database error, check the backend project's `MONGO_URI` and MongoDB network access.

## 📝 Recent updates

- Added entrance and hover animations to the Home hero, CTA and category cards (CSS keyframes in client/src/index.css).
- Re-added user greeting in the navigation bar: "Hello, <name>" with a Logout button (client/src/components/Navbar.jsx).
- Fixed order Authorization flow by automatically attaching the JWT token to outgoing API requests via a request interceptor (client/src/api/api.js). This prevents malformed/masked headers and 401s when placing orders.
- Address-on-map checkout remains available (react-leaflet + Nominatim reverse geocoding). Orders now store address.display_name and coordinates in the backend.
- Added administrator-only product creation, editing, and deletion at `/admin`.
- Product management endpoints require a signed-in user whose MongoDB `role` is `admin`.

### Granting administrator access

Register the account normally, then use MongoDB Shell against the configured database:

```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

Sign out and sign back in to refresh the role shown in the frontend. The backend checks the user role on every product write request. Product deletion is rejected when an order references that product, preserving order history.

Notes:
- The API client now appends Authorization: Bearer <token> from localStorage. If you prefer explicit header control per-call, revert the interceptor in client/src/api/api.js.
- Pushing to remote requires proper git remote and permissions; see below for commit/push status.
