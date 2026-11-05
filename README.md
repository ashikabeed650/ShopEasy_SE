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
npm run dev
```

For local development with MongoDB Compass, start your local MongoDB server, then copy `backend/.env.example` to `backend/.env`. The example connects to `mongodb://127.0.0.1:27017/shopeasy` on port `5055`. Set a private `JWT_SECRET`. To add any missing sample products, run `npm run seed` from `backend`; it does not delete existing products.

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

For local frontend development, copy `client/.env.example` to `client/.env`; it points to the local backend at `http://localhost:5055/api`.

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

## 🚀 Deploying the API to Render and the frontend to Vercel

The React frontend can remain on Vercel while the Express API runs on Render and uses MongoDB Atlas. MongoDB Compass is the desktop client for viewing and managing the Atlas database; it is not the database server. The repository-root `render.yaml` defines the `shopeasy-api` web service.

### 1. Deploy the backend to Render

- In Render, create a **Blueprint** from this GitHub repository and apply the `render.yaml` configuration. The service uses the `backend` directory, `npm ci`, and `npm start`.
- Set the service's `MONGO_URI` to the Atlas connection string for the `shopeasy` database. URL-encode special characters in the database user's password. Use a database user with only the permissions the app needs; never use an Atlas website password.
- Render generates a private `JWT_SECRET` for the service. Keep backend secrets out of the frontend project and source control.
- In Atlas **Network Access**, allow the Render service's outbound IP addresses. Prefer the service's listed/static outbound addresses; do not allow all IPs (`0.0.0.0/0`) unless you intentionally accept that exposure.
- After deployment, verify the Render service root responds and `/api/products` returns the product list.

### 2. Point the Vercel frontend to Render

- In the Vercel frontend project's **Settings → Environment Variables**, set `VITE_API_URL` to the Render service URL followed by `/api` (for example, `https://<render-service>.onrender.com/api`).
- Redeploy the frontend so the new API URL is included in its build. The repository-root `vercel.json` serves the client when the Vercel project's Root Directory is the repository root; alternatively, use `client` and its Vercel configuration.
- The client Vercel rewrite supports direct visits and refreshes on routes such as `/products` and `/cart`.

For local development with MongoDB Compass, use the local connection in `backend/.env` and the local API URL in the client environment. Keep local and Atlas connection strings separate.

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
