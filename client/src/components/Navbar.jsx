import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useSearch } from "../context/SearchContext";

function Navbar() {
  const { cart } = useCart();
  const { search, setSearch } = useSearch();
  const location = useLocation();
  const navigate = useNavigate();

  // read user from localStorage if present
  let user;
  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    user = null;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    // reload to ensure UI updates where necessary
    window.location.reload();
  };

  return (
    <nav style={styles.navbar}>
      {/* Logo */}
      <Link to="/" style={styles.logo}>
        🛍 ShopEasy
      </Link>

      {/* Search Box (Only on Products Page) */}
      {location.pathname === "/products" && (
        <div style={styles.searchContainer}>
          <span style={styles.searchIcon}>🔍</span>

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.search}
          />
        </div>
      )}

      {/* Navigation Links */}
      <div style={styles.links}>
        <Link to="/" style={styles.link}>
          🏠 Home
        </Link>

        <Link to="/products" style={styles.link}>
          📦 Products
        </Link>

        {user?.role === "admin" && (
          <Link to="/admin" style={styles.link}>
            Admin
          </Link>
        )}

        <Link to="/cart" style={styles.link}>
          🛒 Cart
          <span style={styles.badge}>{cart.length}</span>
        </Link>

        {/* Show greeting when logged in, otherwise Login link */}
        {user ? (
          <>
            <span style={styles.greeting}>
              Hello, {user.name || user.username || user.email} <span role="img" aria-label="wave">👋</span>
            </span>
            <button style={styles.logoutBtn} onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" style={styles.loginBtn}>
            👤 Login
          </Link>
        )}
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    position: "sticky",
    top: 0,
    zIndex: 1000,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "linear-gradient(90deg, #06b6d4, #0ea5a4)",
    padding: "10px 24px",
    boxShadow: "var(--shadow)",
    gap: "16px",
    flexWrap: "wrap",
  },

  logo: {
    color: "white",
    textDecoration: "none",
    fontSize: "22px",
    fontWeight: "800",
    letterSpacing: 0.4,
  },

  searchContainer: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    background: "white",
    borderRadius: "30px",
    maxWidth: "640px",
    overflow: "hidden",
    padding: "6px 8px",
    margin: "0 12px",
  },

  searchIcon: {
    padding: "0 12px",
    fontSize: "18px",
    color: "#999",
  },

  search: {
    width: "100%",
    padding: "10px 12px",
    border: "none",
    outline: "none",
    fontSize: "15px",
  },

  links: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
    flexWrap: "wrap",
  },

  link: {
    color: "white",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "15px",
  },

  badge: {
    background: "var(--cta)",
    color: "white",
    borderRadius: "50%",
    padding: "4px 8px",
    marginLeft: "8px",
    fontSize: "12px",
    fontWeight: "700",
  },

  loginBtn: {
    background: "white",
    color: "var(--primary)",
    textDecoration: "none",
    padding: "8px 14px",
    borderRadius: "20px",
    fontWeight: "700",
  },

  greeting: {
    color: "white",
    fontWeight: 600,
    marginRight: "8px",
  },

  logoutBtn: {
    background: "transparent",
    color: "white",
    border: "1px solid rgba(255,255,255,0.14)",
    padding: "6px 10px",
    borderRadius: "14px",
    cursor: "pointer",
    fontWeight: 700,
  },

};

export default Navbar;