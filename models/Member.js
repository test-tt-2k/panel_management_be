import mongoose from "mongoose";
const MemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    username: {
      type: String,
    },
    password: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Member", MemberSchema);
