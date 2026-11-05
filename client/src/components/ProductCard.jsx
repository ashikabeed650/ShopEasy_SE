import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getProductImageUrl } from "../api/api";

function ProductCard({ product }) {
  const { addToCart, cart } = useCart();
  const quantityInCart =
    cart.find((item) => item._id === product._id)?.quantity || 0;
  const stock = Number.isInteger(product.stock) ? product.stock : 0;
  const canAddToCart = stock > quantityInCart;

  const handleAddToCart = () => {
    if (!canAddToCart) return;
    addToCart(product);
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="product-card" style={styles.card}>
      <div style={styles.discount}>
        {product.discount}% OFF
      </div>

      <Link
        to={`/products/${product._id}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <img
          src={getProductImageUrl(product.image)}
          alt={product.name}
          style={styles.image}
        />

        <p style={styles.brand}>{product.brand}</p>

        <h3 style={styles.name}>{product.name}</h3>
      </Link>

      <div style={styles.rating}>
        ⭐ {product.rating}
        <span style={styles.reviews}>
          ({product.reviews} Reviews)
        </span>
      </div>

      <div style={styles.priceBox}>
        <span style={styles.price}>₹{product.price}</span>

        <span style={styles.oldPrice}>
          ₹{product.originalPrice}
        </span>
      </div>

      <p style={styles.delivery}>✓ Free Delivery</p>

      <button
        style={{
          ...styles.button,
          ...(canAddToCart ? {} : styles.disabledButton),
        }}
        onClick={handleAddToCart}
        disabled={!canAddToCart}
      >
        {stock === 0 ? "Out of Stock" : canAddToCart ? "Add to Cart" : "Stock Limit Reached"}
      </button>
    </div>
  );
}

const styles = {
  card: {
    position: "relative",
    background: "var(--card-bg)",
    borderRadius: "12px",
    padding: "18px",
    boxShadow: "var(--shadow)",
    cursor: "pointer",
    transition: "transform .15s ease, box-shadow .15s ease",
  },

  discount: {
    position: "absolute",
    top: "12px",
    left: "12px",
    background: "var(--accent)",
    color: "#fff",
    padding: "6px 10px",
    borderRadius: "18px",
    fontSize: "12px",
    fontWeight: "700",
  },

  image: {
    width: "100%",
    height: "200px",
    objectFit: "contain",
    marginBottom: "12px",
  },

  brand: {
    color: "#777",
    fontSize: "13px",
  },

  name: {
    fontSize: "16px",
    margin: "8px 0",
    minHeight: "42px",
    color: "var(--muted)",
  },

  rating: {
    color: "#0f9d58",
    fontWeight: "700",
    marginBottom: "8px",
  },

  reviews: {
    color: "#999",
    marginLeft: "6px",
    fontWeight: "500",
  },

  priceBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "10px",
  },

  price: {
    fontSize: "20px",
    fontWeight: "800",
    color: "var(--primary)",
  },

  oldPrice: {
    color: "#999",
    textDecoration: "line-through",
  },

  delivery: {
    color: "#4caf50",
    fontWeight: "600",
    marginBottom: "12px",
  },

  button: {
    width: "100%",
    padding: "12px",
    background: "linear-gradient(90deg, var(--cta), var(--accent))",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "700",
  },

  disabledButton: {
    cursor: "not-allowed",
    opacity: 0.6,
  },
};

export default ProductCard;