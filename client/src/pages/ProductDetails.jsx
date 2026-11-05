import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import api, { getProductImageUrl } from "../api/api";
import { useCart } from "../context/CartContext";
import RelatedProducts from "../components/RelatedProducts";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cart } = useCart();

  const [result, setResult] = useState({
    id: null,
    product: null,
    loading: true,
    error: "",
  });

  useEffect(() => {
    let active = true;

    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        if (active) {
          setResult({ id, product: res.data, loading: false, error: "" });
        }
      } catch (requestError) {
        if (active) {
          setResult({
            id,
            product: null,
            loading: false,
            error:
              requestError.response?.data?.message ||
              "Unable to load this product. Check the backend connection.",
          });
        }
      }
    };

    fetchProduct();
    return () => {
      active = false;
    };
  }, [id]);

  const loading = result.id !== id || result.loading;
  const product = result.id === id ? result.product : null;
  const error = result.id === id ? result.error : "";

  if (loading) {
    return (
      <div style={styles.notFound}>
        <h2>Loading...</h2>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={styles.notFound} role="alert">
        <h2>{error || "Product not found"}</h2>
        <Link to="/products">Back to products</Link>
      </div>
    );
  }

  const handleBuyNow = () => {
    if (product.stock < 1) return;
    addToCart(product);
    navigate("/cart");
  };
  const quantityInCart =
    cart.find((item) => item._id === product._id)?.quantity || 0;
  const canAddToCart = product.stock > quantityInCart;

  return (
    <>
      <div style={styles.container}>
        <div style={styles.imageSection}>
          <img
            src={getProductImageUrl(product.image)}
            alt={product.name}
            style={styles.image}
          />

          <button
            style={{
              ...styles.cartBtn,
              ...(canAddToCart ? {} : styles.disabledButton),
            }}
            onClick={() => addToCart(product)}
            disabled={!canAddToCart}
          >
            {product.stock === 0
              ? "Out of Stock"
              : canAddToCart
                ? "Add to Cart"
                : "Stock Limit Reached"}
          </button>

          <button
            style={{
              ...styles.buyBtn,
              ...(product.stock > 0 ? {} : styles.disabledButton),
            }}
            onClick={handleBuyNow}
            disabled={product.stock < 1}
          >
            Buy Now
          </button>
        </div>

        <div style={styles.info}>
          <h1 style={styles.title}>{product.name}</h1>

          <p style={styles.brand}>
            Brand: {product.brand}
          </p>

          <div style={styles.rating}>
            ⭐ {product.rating} ({product.reviews} Reviews)
          </div>

          <div style={styles.priceBox}>
            <span style={styles.price}>₹{product.price}</span>

            <span style={styles.oldPrice}>
              ₹{product.originalPrice}
            </span>

            <span style={styles.discount}>
              {product.discount}% OFF
            </span>
          </div>

          <p style={styles.stock}>
            In Stock ({product.stock})
          </p>

          <h3>Description</h3>

          <p style={styles.desc}>
            {product.description}
          </p>
        </div>
      </div>

      <RelatedProducts currentProductId={product._id} />
    </>
  );
}

const styles = {
  container: {
    maxWidth: "1180px",
    margin: "0 auto",
    display: "flex",
    gap: "24px",
    padding: "40px 24px 24px",
    background: "var(--bg)",
    flexWrap: "wrap",
  },
  imageSection: {
    flex: "1 1 420px",
    background: "var(--card-bg)",
    padding: "28px",
    borderRadius: "18px",
    border: "1px solid var(--border)",
    boxShadow: "0 18px 45px rgba(15, 23, 42, 0.08)",
  },
  image: {
    width: "100%",
    maxWidth: "520px",
    height: "470px",
    objectFit: "contain",
  },
  info: {
    flex: "1 1 460px",
    background: "var(--card-bg)",
    padding: "38px",
    borderRadius: "18px",
    border: "1px solid var(--border)",
    boxShadow: "0 18px 45px rgba(15, 23, 42, 0.08)",
    textAlign: "left",
  },
  title: {
    color: "var(--text-h)",
    fontSize: "clamp(30px, 4vw, 48px)",
    lineHeight: "1.08",
    margin: "0 0 18px",
    letterSpacing: "0",
  },
  brand: {
    color: "#666",
    marginTop: "8px",
    fontSize: "14px",
  },
  rating: {
    display: "inline-block",
    color: "#087f5b",
    background: "#e8f7f0",
    borderRadius: "999px",
    padding: "7px 12px",
    margin: "14px 0",
    fontWeight: "700",
  },
  priceBox: {
    display: "flex",
    gap: "12px",
    alignItems: "baseline",
    margin: "20px 0 24px",
  },
  price: {
    fontSize: "36px",
    fontWeight: "800",
    color: "var(--primary)",
  },
  oldPrice: {
    textDecoration: "line-through",
    color: "#999",
    fontSize: "14px",
  },
  discount: {
    color: "var(--accent)",
    fontWeight: "700",
  },
  stock: {
    color: "#16803c",
    fontWeight: "700",
    marginBottom: "28px",
  },
  desc: {
    lineHeight: "1.8",
    color: "var(--muted)",
    fontSize: "17px",
  },
  cartBtn: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(90deg, var(--cta), var(--accent))",
    color: "#fff",
    border: "none",
    marginTop: "24px",
    cursor: "pointer",
    borderRadius: "10px",
    fontWeight: "700",
  },
  buyBtn: {
    width: "100%",
    padding: "12px",
    background: "transparent",
    color: "var(--primary)",
    border: "2px solid var(--primary)",
    marginTop: "10px",
    cursor: "pointer",
    borderRadius: "10px",
    fontWeight: "700",
  },
  disabledButton: {
    cursor: "not-allowed",
    opacity: 0.6,
  },
  notFound: {
    textAlign: "center",
    padding: "100px",
  },
};

export default ProductDetails;