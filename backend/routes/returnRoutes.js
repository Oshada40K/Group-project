const express = require("express");
const router = express.Router();
const {
  createReturnRequest,
  getReturnRequests,
  updateReturnRequestStatus,
  getDeliveredOrders,
  getReturnRequestsUser,
  deleteReturnRequest
} = require("../controllers/returnController");

// Route to get all return requests
router.get("/", getReturnRequests);

// Route to get all return requests (user view)
router.get("/requests", getReturnRequestsUser);

// Route to create a new return request
router.post("/request-return", createReturnRequest);

// Route to update return request status (approved/rejected)
router.patch("/update-status/:id", updateReturnRequestStatus);

// Route to get delivered orders for the return form
router.get("/delivered-orders", getDeliveredOrders);

// Route to delete a return request
router.delete("/delete/:id", deleteReturnRequest);

module.exports = router;
