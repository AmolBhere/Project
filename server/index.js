import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import UserModel from "./models/User.js";

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

mongoose.connect(MONGO_URL)
  .then(() => console.log("Database connected successfully."))
  .catch((error) => console.log(error));

app.use(cors());

app.get("/getContacts", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Parse page parameter, default to 1 if not provided
    const limit = parseInt(req.query.limit) || 10; // Parse limit parameter, default to 10 if not provided

    const skip = (page - 1) * limit; // Calculate number of documents to skip

    // Fetch paginated data from UserModel, skipping and limiting as required
    const userData = await UserModel.find().skip(skip).limit(limit);
    
    res.json(userData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
