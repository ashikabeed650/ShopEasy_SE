import { Link, Routes, Route } from "react-router-dom";
import Layout from "./Layout";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />

        {/* Product Details */}
        <Route path="products/:id" element={<ProductDetails />} />

        <Route path="cart" element={<Cart />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="admin" element={<Admin />} />
        <Route
          path="*"
          element={
            <div style={{ padding: "64px 24px", textAlign: "center" }}>
              <h1>Page not found</h1>
              <Link to="/">Return to ShopEasy</Link>
            </div>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;