import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { getProductImageUrl } from "../api/api";
import "./Admin.css";

const emptyProduct = {
  name: "",
  brand: "",
  category: "",
  description: "",
  image: "",
  price: "",
  originalPrice: "",
  discount: "",
  stock: "",
};

const fields = [
  { name: "name", label: "Product name", type: "text" },
  { name: "brand", label: "Brand", type: "text" },
  { name: "category", label: "Category", type: "text" },
  { name: "image", label: "Image path or URL", type: "text" },
  { name: "price", label: "Price", type: "number", min: 0, step: "0.01" },
  { name: "originalPrice", label: "Original price", type: "number", min: 0, step: "0.01" },
  { name: "discount", label: "Discount (%)", type: "number", min: 0, max: 100, step: 1 },
  { name: "stock", label: "Stock", type: "number", min: 0, step: 1 },
];

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

function Admin() {
  const [user] = useState(getStoredUser);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadProducts = useCallback(async () => {
    try {
      const response = await api.get("/products");
      if (!Array.isArray(response.data)) {
        throw new Error("The product API returned an invalid response.");
      }
      setProducts(response.data);
      setError("");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Unable to load products."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.role !== "admin") return undefined;

    let active = true;
    api.get("/products")
      .then((response) => {
        if (!Array.isArray(response.data)) {
          throw new Error("The product API returned an invalid response.");
        }
        if (active) {
          setProducts(response.data);
          setError("");
        }
      })
      .catch((requestError) => {
        if (active) {
          setError(
            requestError.response?.data?.message ||
              requestError.message ||
              "Unable to load products."
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [user?.role]);

  const resetForm = () => {
    setForm(emptyProduct);
    setEditingId(null);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      brand: product.brand,
      category: product.category,
      description: product.description,
      image: product.image,
      price: String(product.price),
      originalPrice: String(product.originalPrice),
      discount: String(product.discount),
      stock: String(product.stock),
    });
    setError("");
    setNotice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    const productData = {
      ...form,
      price: Number(form.price),
      originalPrice: Number(form.originalPrice),
      discount: Number(form.discount),
      stock: Number(form.stock),
    };

    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, productData);
        setNotice("Product updated successfully.");
      } else {
        await api.post("/products", productData);
        setNotice("Product created successfully.");
      }
      resetForm();
      await loadProducts();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Unable to save this product."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}"?`)) return;

    setError("");
    setNotice("");
    try {
      await api.delete(`/products/${product._id}`);
      setProducts((current) =>
        current.filter((item) => item._id !== product._id)
      );
      if (editingId === product._id) resetForm();
      setNotice("Product deleted successfully.");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Unable to delete this product."
      );
    }
  };

  if (!localStorage.getItem("token")) {
    return (
      <section className="admin-access">
        <h1>Administrator login required</h1>
        <p>Please sign in with an administrator account to manage products.</p>
        <Link to="/login">Go to login</Link>
      </section>
    );
  }

  if (user?.role !== "admin") {
    return (
      <section className="admin-access">
        <h1>Access denied</h1>
        <p>Your account does not have permission to manage products.</p>
        <Link to="/products">Return to products</Link>
      </section>
    );
  }

  return (
    <section className="admin-page">
      <header className="admin-heading">
        <div>
          <p className="admin-eyebrow">CATALOG MANAGEMENT</p>
          <h1>Manage products</h1>
          <p>Create, update, and remove products in your store.</p>
        </div>
        <Link className="admin-store-link" to="/products">
          View store
        </Link>
      </header>

      {error && <p className="admin-message admin-error" role="alert">{error}</p>}
      {notice && <p className="admin-message admin-success" role="status">{notice}</p>}

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-form-heading">
          <h2>{editingId ? "Edit product" : "Add a product"}</h2>
          {editingId && (
            <button className="admin-text-button" type="button" onClick={resetForm}>
              Cancel editing
            </button>
          )}
        </div>

        <div className="admin-fields">
          {fields.map((field) => (
            <label className="admin-field" key={field.name}>
              <span>{field.label}</span>
              <input
                name={field.name}
                type={field.type}
                min={field.min}
                max={field.max}
                step={field.step}
                value={form[field.name]}
                onChange={handleChange}
                required
              />
            </label>
          ))}
          <label className="admin-field admin-description">
            <span>Description</span>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              required
            />
          </label>
        </div>
        <p className="admin-hint">
          For bundled images, use paths such as <code>/images/headphones.jpg</code>.
        </p>
        <button className="admin-primary-button" type="submit" disabled={saving}>
          {saving ? "Saving..." : editingId ? "Save changes" : "Create product"}
        </button>
      </form>

      <div className="admin-list-heading">
        <h2>Products</h2>
        <span>{products.length} total</span>
      </div>

      {loading ? (
        <p className="admin-empty">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="admin-empty">No products yet. Add the first product above.</p>
      ) : (
        <div className="admin-product-list">
          {products.map((product) => (
            <article className="admin-product" key={product._id}>
              <img src={getProductImageUrl(product.image)} alt="" />
              <div className="admin-product-info">
                <h3>{product.name}</h3>
                <p>{product.brand} · {product.category}</p>
                <p>Price: {product.price} · Stock: {product.stock}</p>
              </div>
              <div className="admin-product-actions">
                <button type="button" onClick={() => handleEdit(product)}>
                  Edit
                </button>
                <button
                  className="admin-delete-button"
                  type="button"
                  onClick={() => handleDelete(product)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default Admin;
