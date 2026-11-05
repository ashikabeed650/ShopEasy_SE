import mongoose from "mongoose";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

const getProductData = (body) => {
  const textFields = ["name", "brand", "category", "description", "image"];
  const product = {};

  for (const field of textFields) {
    if (typeof body?.[field] !== "string" || !body[field].trim()) {
      return { error: `${field} is required.` };
    }
    product[field] = body[field].trim();
  }

  const toNumber = (value) =>
    typeof value === "number"
      ? value
      : typeof value === "string" && value.trim()
        ? Number(value)
        : Number.NaN;
  const price = toNumber(body.price);
  const originalPrice = toNumber(body.originalPrice);
  const discount = toNumber(body.discount);
  const stock = toNumber(body.stock);

  if (!Number.isFinite(price) || price < 0) {
    return { error: "Price must be a non-negative number." };
  }
  if (!Number.isFinite(originalPrice) || originalPrice < 0) {
    return { error: "Original price must be a non-negative number." };
  }
  if (!Number.isFinite(discount) || discount < 0 || discount > 100) {
    return { error: "Discount must be between 0 and 100." };
  }
  if (!Number.isInteger(stock) || stock < 0) {
    return { error: "Stock must be a non-negative whole number." };
  }

  Object.assign(product, { price, originalPrice, discount, stock });
  return { product };
};

// Get All Products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  const result = getProductData(req.body);
  if (result.error) {
    return res.status(400).json({ message: result.error });
  }

  try {
    const product = await Product.create(result.product);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ message: "Product not found" });
  }

  const result = getProductData(req.body);
  if (result.error) {
    return res.status(400).json({ message: result.error });
  }

  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      result.product,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ message: "Product not found" });
  }

  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const hasOrderHistory = await Order.exists({
      "products.product": product._id,
    });
    if (hasOrderHistory) {
      return res.status(409).json({
        message: "This product is in an order and cannot be deleted.",
      });
    }

    await product.deleteOne();
    res.json({ message: "Product deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Product
export const getProductById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};