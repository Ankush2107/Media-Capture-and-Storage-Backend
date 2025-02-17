require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const mediaRoutes = require("./routes/mediaRoutes");
const bodyParser = require("body-parser");
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/media", mediaRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}...`));