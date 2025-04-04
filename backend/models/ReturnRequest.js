const mongoose = require("mongoose");

const returnSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  contactNo: { type: String, required: true },
  email: { type: String, required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  purchasedDate: { type: Date, required: true },
  paymentMethod: { type: String, required: true },
  returnReason: { type: String, enum: ["Wrong Item Received", "Duplicate Order", "Late Delivery", "Others"], required: true },
  otherReason: { type: String },
  refundMethod: { type: String, enum: ["Store Credits", "Replacement"], required: true },
  status: { type: String, enum: ["Pending", "Item Received", "Refund Approved", "Refund Rejected"], default: "Pending" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ReturnRequest", returnSchema);
