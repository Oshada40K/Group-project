const express = require("express");
const Order = require("../models/OrderModel");

const router = express.Router();

// ✅ Add a New Order with Status "Delivered" (Dummy Order)
router.post("/add-order", async (req, res) => {
  try {
    const { customerName, contactNo, email, paymentMethod } = req.body;

    const newOrder = new Order({
      customerName,
      contactNo,
      email,
      paymentMethod,
      status: "Delivered" // Default to Delivered
    });

    await newOrder.save();
    res.status(201).json({ message: "Order added successfully!", order: newOrder });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
