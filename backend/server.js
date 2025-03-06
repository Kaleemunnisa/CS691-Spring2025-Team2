const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err.message));

// Import Routes
const aiRoutes = require("./routes/aiRoutes");
const clothingRoutes = require("./routes/clothingRoutes");
const weatherRoutes = require("./routes/weatherRoutes");
const uploadRoutes = require('./routes/uploadRoutes');

app.use('/api/upload', uploadRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/clothing", clothingRoutes);
app.use("/api/weather", weatherRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
