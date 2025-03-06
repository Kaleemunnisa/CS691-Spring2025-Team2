const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

app.use(cors({
    origin: "http://localhost:3000", // Allow frontend requests
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true, // Allow cookies 
    exposedHeaders: ['set-cookie']
}));

app.use(express.json());
app.use(cookieParser());
app.options("*", cors());

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err.message));

// Import Routes
const authRoutes = require('./routes/authRoutes');
const aiRoutes = require("./routes/aiRoutes");
const clothingRoutes = require("./routes/clothingRoutes");
const weatherRoutes = require("./routes/weatherRoutes");
const uploadRoutes = require('./routes/uploadRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/clothing", clothingRoutes);
app.use("/api/weather", weatherRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
