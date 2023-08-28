import express from "express";
import multer from "multer";
import {
  create,
  list,
  deleteData,
  getDetail,
  updateData,
} from "../controllers/data.js";

var upload = multer();
const router = express.Router();

var upload = multer();

router.delete("/:id", deleteData);
router.put("/:id", updateData);
router.post("/", upload.fields([{ name: "img" }, { name: "video" }]), create);
router.get("/:id", getDetail);
router.get("/", list);

export default router;
