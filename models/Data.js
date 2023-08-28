import mongoose from "mongoose";
const DataSchema = new mongoose.Schema(
  {
    link: {
      type: String,
    },
    content: {
      type: String,
    },
    commentContent: {
      type: String,
    },
    imgId: {
      type: String,
    },
    videoId: {
      type: String,
    },
    videoUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Data", DataSchema);
