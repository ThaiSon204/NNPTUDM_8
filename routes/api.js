const express = require('express');
const router = express.Router();

// Nhúng 2 model từ thư mục models vào
const Product = require('../models/Product');
const Inventory = require('../models/Inventory');

// 1. Tạo Product
router.post('/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 2. Get all inventory (có join với product)
router.get('/inventory', async (req, res) => {
  try {
    const inventories = await Inventory.find().populate('product');
    res.json(inventories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Get inventory by ID (có join với product)
router.get('/inventory/:id', async (req, res) => {
  try {
    const inventory = await Inventory.findById(req.params.id).populate('product');
    if (!inventory) return res.status(404).json({ message: 'Inventory not found' });
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Add_stock: Tăng stock
router.post('/inventory/add-stock', async (req, res) => {
  const { product, quantity } = req.body;
  try {
    const inventory = await Inventory.findOneAndUpdate(
      { product: product },
      { $inc: { stock: quantity } },
      { new: true }
    );
    res.json(inventory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 5. Remove_stock: Giảm stock
router.post('/inventory/remove-stock', async (req, res) => {
  const { product, quantity } = req.body;
  try {
    const inventory = await Inventory.findOneAndUpdate(
      { product: product, stock: { $gte: quantity } },
      { $inc: { stock: -quantity } },
      { new: true }
    );
    if (!inventory) return res.status(400).json({ message: 'Không đủ hàng trong kho' });
    res.json(inventory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 6. Reservation: Giảm stock, tăng reserved
router.post('/inventory/reservation', async (req, res) => {
  const { product, quantity } = req.body;
  try {
    const inventory = await Inventory.findOneAndUpdate(
      { product: product, stock: { $gte: quantity } },
      { $inc: { stock: -quantity, reserved: quantity } },
      { new: true }
    );
    if (!inventory) return res.status(400).json({ message: 'Không đủ hàng để reserve' });
    res.json(inventory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 7. Sold: Giảm reserved, tăng soldCount
router.post('/inventory/sold', async (req, res) => {
  const { product, quantity } = req.body;
  try {
    const inventory = await Inventory.findOneAndUpdate(
      { product: product, reserved: { $gte: quantity } },
      { $inc: { reserved: -quantity, soldCount: quantity } },
      { new: true }
    );
    if (!inventory) return res.status(400).json({ message: 'Không đủ hàng đang reserve để bán' });
    res.json(inventory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;