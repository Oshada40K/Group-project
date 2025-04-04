import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ReturnList = () => {
  const [returns, setReturns] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchReturnRequests = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/returns");
        setReturns(res.data);
      } catch (error) {
        console.error("Error fetching return requests:", error);
      }
    };
    fetchReturnRequests();
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/returns/update-status/${id}`, { status: newStatus });
      setReturns((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: newStatus } : r))
      );
    } catch (error) {
      alert("Error updating return status");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/returns/delete/${id}`);
      setReturns((prev) => prev.filter((r) => r._id !== id));
    } catch (error) {
      alert("Error deleting return request");
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Return Requests Report", 20, 10);
    const date = new Date();
    doc.setFontSize(10);
    doc.text(`Generated on: ${date.toLocaleString()}`, 20, 16);
    
    const statuses = ["Pending", "Item Received", "Refund Approved", "Refund Rejected"];
    statuses.forEach((status, index) => {
      const filtered = returns.filter((request) => request.status === status);
      doc.text(`${status} Requests`, 20, 26 + index * 50);
      autoTable(doc, {
        startY: 31 + index * 50,
        head: [["Customer", "Order ID", "Reason", "Refund Method", "Status"]],
        body: filtered.map((request) => [
          request.customerName,
          request.orderId._id,
          request.returnReason === "Others" ? request.otherReason : request.returnReason,
          request.refundMethod,
          request.status,
        ]),
      });
    });
    doc.save("Return_Requests_Report.pdf");
  };

  const filteredReturns = returns.filter((r) =>
    r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.orderId._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.returnReason.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.refundMethod.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex">
      <div className="flex flex-col w-full">
        <main className="p-4">
          <h2 className="text-2xl mb-4">Return Requests</h2>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by Customer Name, Order ID, Reason, Refund Method, or Status"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <button onClick={generatePDF} className="bg-blue-600 text-white p-2 rounded mb-4 hover:bg-blue-700">Download PDF Report</button>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">Customer</th>
                <th className="border border-gray-300 p-2">Order ID</th>
                <th className="border border-gray-300 p-2">Reason</th>
                <th className="border border-gray-300 p-2">Refund Method</th>
                <th className="border border-gray-300 p-2">Status</th>
                <th className="border border-gray-300 p-2">Update</th>
                <th className="border border-gray-300 p-2">Delete</th>
              </tr>
            </thead>
            <tbody>
              {filteredReturns.map((r) => (
                <tr key={r._id}>
                  <td className="border border-gray-300 p-2">{r.customerName}</td>
                  <td className="border border-gray-300 p-2">{r.orderId._id}</td>
                  <td className="border border-gray-300 p-2">{r.returnReason === "Others" ? r.otherReason : r.returnReason}</td>
                  <td className="border border-gray-300 p-2">{r.refundMethod}</td>
                  <td className="border border-gray-300 p-2">{r.status}</td>
                  <td className="border border-gray-300 p-2">
                    <select
                      value={r.status}
                      onChange={(e) => handleStatusUpdate(r._id, e.target.value)}
                      className="block w-full p-2 border border-gray-300 rounded"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Item Received">Item Received</option>
                      <option value="Refund Approved">Refund Approved</option>
                      <option value="Refund Rejected">Refund Rejected</option>
                    </select>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <button 
                      onClick={() => handleDelete(r._id)}
                      className="bg-red-600 text-white p-2 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
};

export default ReturnList;
