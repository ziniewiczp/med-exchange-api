import { model, Schema } from "mongoose";

const userSchema = new Schema({
  email: { type: String, unique: true },
  password: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

userSchema.path("email").required(true, "User email cannot be blank.");
userSchema.path("password").required(true, "User password cannot be blank.");

export default model("User", userSchema);

