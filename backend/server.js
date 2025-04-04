const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const returnRoutes = require("./routes/returnRoutes");
const orderRoutes = require("./routes/orderRoutes");



const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Routes
app.use("/api/returns", returnRoutes);
app.use("/api/orders", orderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
