import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  phone_number: String,
});

const UserModel = mongoose.model("users", userSchema);

export default UserModel;
