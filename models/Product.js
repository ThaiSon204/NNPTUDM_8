const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true }
});

// Yêu cầu: Mỗi khi tạo product thì sẽ tạo 1 inventory tương ứng
productSchema.post('save', async function(doc) {
  try {
    // Gọi model Inventory theo cách này để tránh lỗi vòng lặp (circular dependency)
    const Inventory = mongoose.model('Inventory'); 
    await Inventory.create({
      product: doc._id,
      stock: 0,
      reserved: 0,
      soldCount: 0
    });
    console.log(`Đã tạo Inventory tự động cho Product: ${doc._id}`);
  } catch (error) {
    console.error('Lỗi khi tạo Inventory tự động:', error);
  }
});

module.exports = mongoose.model('Product', productSchema);