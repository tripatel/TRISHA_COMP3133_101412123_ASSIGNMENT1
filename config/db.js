const mongoose = require("mongoose");

// MongoDB Connection without .env
const MONGO_URI = "mongodb+srv://trisha:trisha%401601@restaurant-cluster.xj0za.mongodb.net/COMP3133_101412123_assignment1?retryWrites=true&w=majority&appName=restaurant-cluster";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
