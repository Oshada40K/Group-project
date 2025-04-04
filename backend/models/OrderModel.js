const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  contactNo: { type: String, required: true },
  email: { type: String, required: true },
  purchasedDate: { type: Date, default: Date.now },
  paymentMethod: { type: String, enum: ["Credit Card", "PayPal", "Cash on Delivery"], required: true },
  status: { type: String, enum: ["Pending", "Shipped", "Delivered"], default: "Delivered" }
});

module.exports = mongoose.model("Order", orderSchema);
