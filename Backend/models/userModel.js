import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Nama wajib diisi"],
    unique: [true, "Nama sudah terdaftar"],
  },
  email: {
    type: String,
    required: [true, "Email wajib diisi"],
    unique: [true, "Email sudah terdaftar"],
    validate: {
      validator: validator.isEmail,
      message: "Email tidak valid",
    },
  },
  password: {
    type: String,
    required: [true, "Password wajib diisi"],
    minLength: [6, "Password minimal 6 karakter"],
  },
  role: {
    type: String,
    enum: ["user", "owner"],
    default: "user",
  },
});

userSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
