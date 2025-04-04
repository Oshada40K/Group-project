const ReturnRequest = require("../models/ReturnRequest");
const Order = require("../models/OrderModel");

// ✅ Get Return Requests (for listing)
exports.getReturnRequests = async (req, res) => {
  try {
    const returnRequests = await ReturnRequest.find()
      .populate('orderId', 'customerName') // Populate orderId with customerName from the Order model
      .select("customerName contactNo email orderId returnReason otherReason refundMethod status createdAt");

    res.json(returnRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getReturnRequestsUser = async (req, res) => { 
  try {
    const returnRequests = await ReturnRequest.find()
    .select("customerName contactNo email orderId returnReason otherReason refundMethod status createdAt");
    res.json(returnRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get Delivered Orders for Return Selection
exports.getDeliveredOrders = async (req, res) => {
  try {
    const orders = await Order.find({ status: "Delivered" }).select("_id customerName contactNo email purchasedDate paymentMethod");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Submit a Return Request (Only within 7 Days)
exports.createReturnRequest = async (req, res) => {
  const { customerName, contactNo, email, orderId, purchasedDate, paymentMethod, returnReason, otherReason, refundMethod } = req.body;

  const currentDate = new Date();
  const purchaseDate = new Date(purchasedDate);
  const timeDiff = currentDate - purchaseDate;
  const daysDiff = timeDiff / (1000 * 60 * 60 * 24);

  if (daysDiff > 7) {
    return res.status(400).json({ message: "Return period expired (Allowed within 7 days of purchase)." });
  }

  try {
    const returnRequest = new ReturnRequest({
      customerName,
      contactNo,
      email,
      orderId,
      purchasedDate,
      paymentMethod,
      returnReason,
      otherReason,
      refundMethod
    });

    await returnRequest.save();
    res.status(201).json({ message: "Return request submitted successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Admin Updates Return Status (Item Received & Refund Approval)
exports.updateReturnRequestStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const updatedReturn = await ReturnRequest.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(updatedReturn);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete a Return Request
exports.deleteReturnRequest = async (req, res) => {
  try {
    const deletedRequest = await ReturnRequest.findByIdAndDelete(req.params.id);
    if (!deletedRequest) {
      return res.status(404).json({ message: "Return request not found." });
    }
    res.json({ message: "Return request deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};