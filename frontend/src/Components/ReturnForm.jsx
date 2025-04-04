import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ReturnForm = () => {
  const [orders, setOrders] = useState([]);
  const [returnRequests, setReturnRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    orderId: "",
    customerName: "",
    contactNo: "",
    email: "",
    purchasedDate: "",
    paymentMethod: "",
    returnReason: "",
    otherReason: "",
    refundMethod: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchDeliveredOrders = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/returns/delivered-orders");
        setOrders(res.data);
      } catch (error) {
        console.error("Error fetching delivered orders:", error);
      }
    };

    const fetchReturnRequests = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/returns/requests");
        setReturnRequests(res.data);
      } catch (error) {
        console.error("Error fetching return requests:", error);
      }
    };

    fetchDeliveredOrders();
    fetchReturnRequests();
  }, []);

  const handleOrderChange = (orderId) => {
    const selectedOrder = orders.find((order) => order._id === orderId);
    if (selectedOrder) {
      setFormData({
        ...formData,
        orderId: selectedOrder._id,
        customerName: selectedOrder.customerName,
        contactNo: selectedOrder.contactNo,
        email: selectedOrder.email,
        purchasedDate: selectedOrder.purchasedDate,
        paymentMethod: selectedOrder.paymentMethod,
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.orderId) newErrors.orderId = "Order ID is required";
    if (!formData.returnReason) newErrors.returnReason = "Return reason is required";
    if (formData.returnReason === "Others" && !formData.otherReason) newErrors.otherReason = "Please specify the reason";
    if (!formData.refundMethod) newErrors.refundMethod = "Refund method is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const purchaseDate = new Date(formData.purchasedDate);
    const currentDate = new Date();
    const timeDiff = currentDate - purchaseDate;
    const daysDiff = timeDiff / (1000 * 60 * 60 * 24);

    if (daysDiff > 7) {
      alert("You can only return items within 7 days of purchase.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/returns/request-return", formData);
      alert("Return request submitted successfully!");
      window.location.reload();
    } catch (error) {
      alert(error.response?.data?.message || "Error submitting return request");
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Return Requests Report", 20, 10);

    const date = new Date();
    const formattedDate = date.toLocaleString();
    doc.setFontSize(10);
    doc.text(`Generated on: ${formattedDate}`, 20, 16);

    const statuses = ["Pending", "Item Received", "Refund Approved", "Refund Rejected"];
    statuses.forEach((status, index) => {
      const filtered = returnRequests.filter((request) => request.status === status);
      doc.text(`${status} Requests`, 20, 26 + index * 50);
      autoTable(doc, {
        startY: 31 + index * 50,
        head: [["Order ID", "Customer Name", "Return Reason", "Refund Method", "Status", "Submitted Date"]],
        body: filtered.map((request) => [
          request.orderId,
          request.customerName,
          request.returnReason,
          request.refundMethod,
          request.status,
          new Date(request.createdAt).toLocaleDateString(),
        ]),
      });
    });

    doc.save("Return_Requests_Report.pdf");
  };

  const filteredRequests = returnRequests.filter((request) =>
    request.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 border-t">
      <div className="flex flex-col w-full">
        <main className="p-4">
          <h6 className="text-2xl mb-4">Return an Item</h6>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label>Order ID:</label>
              <select
                required
                value={formData.orderId}
                onChange={(e) => handleOrderChange(e.target.value)}
                className="block w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Select Delivered Order</option>
                {orders.map((order) => (
                  <option key={order._id} value={order._id}>
                    {order._id} - {order.customerName}
                  </option>
                ))}
              </select>
              {errors.orderId && <p className="text-red-500 text-xs mt-1">{errors.orderId}</p>}
            </div>

            <div>
              <label>Customer Name:</label>
              <input
                type="text"
                value={formData.customerName}
                readOnly
                className="block w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label>Contact Number:</label>
              <input
                type="text"
                value={formData.contactNo}
                readOnly
                className="block w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label>Email:</label>
              <input
                type="email"
                value={formData.email}
                readOnly
                className="block w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label>Purchased Date:</label>
              <input
                type="text"
                value={formData.purchasedDate}
                readOnly
                className="block w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label>Payment Method:</label>
              <input
                type="text"
                value={formData.paymentMethod}
                readOnly
                className="block w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label>Return Reason:</label>
              <select
                required
                value={formData.returnReason}
                onChange={(e) => setFormData({ ...formData, returnReason: e.target.value })}
                className="block w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Select a Reason</option>
                <option value="Wrong Item Received">Wrong Item Received</option>
                <option value="Duplicate Order">Duplicate Order</option>
                <option value="Late Delivery">Late Delivery</option>
                <option value="Others">Others</option>
              </select>
              {errors.returnReason && <p className="text-red-500 text-xs mt-1">{errors.returnReason}</p>}
            </div>

            {formData.returnReason === "Others" && (
              <div>
                <label>Other Reason:</label>
                <input
                  type="text"
                  placeholder="Specify reason"
                  onChange={(e) => setFormData({ ...formData, otherReason: e.target.value })}
                  className="block w-full p-2 border border-gray-300 rounded"
                />
                {errors.otherReason && <p className="text-red-500 text-xs mt-1">{errors.otherReason}</p>}
              </div>
            )}

            <div>
              <label>Preferred Refund Method:</label>
              <select
                required
                value={formData.refundMethod}
                onChange={(e) => setFormData({ ...formData, refundMethod: e.target.value })}
                className="block w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Select Refund Method</option>
                <option value="Store Credits">Store Credits</option>
                <option value="Replacement">Replacement</option>
              </select>
              {errors.refundMethod && <p className="text-red-500 text-xs mt-1">{errors.refundMethod}</p>}
            </div>

            <button type="submit" className="bg-black hover:bg-gray-600 text-white p-2 rounded">Submit Return Request</button>
          </form>

          <h2 className="text-2xl mt-8 mb-4">My Return Requests</h2>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by Order ID, Customer Name, or Status"
              value={searchTerm}
              onChange={handleSearchChange}
              className="block w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <button onClick={generatePDF} className="bg-blue-600 text-white p-2 rounded mb-4 hover:bg-blue-700">Download PDF Report</button>
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-black dark:text-black">
              <thead className="text-xs text-black uppercase bg-gray-50 dark:bg-gray-700 dark:text-white">
                <tr>
                  <th className="px-6 py-3">Order ID</th>
                  <th className="px-6 py-3">Customer Name</th>
                  <th className="px-6 py-3">Return Reason</th>
                  <th className="px-6 py-3">Refund Method</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Submitted Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((request) => (
                  <tr key={request._id}>
                    <td className="border border-gray-300 p-2">{request.orderId}</td>
                    <td className="border border-gray-300 p-2">{request.customerName}</td>
                    <td className="border border-gray-300 p-2">{request.returnReason}</td>
                    <td className="border border-gray-300 p-2">{request.refundMethod}</td>
                    <td className="border border-gray-300 p-2">{request.status}</td>
                    <td className="border border-gray-300 p-2">{new Date(request.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReturnForm;