import express from "express";
import {
  listMember,
  createMember,
  deleteMember,
  login,
} from "../controllers/member.js";

const router = express.Router();

router.delete("/:id", deleteMember);
router.post("/login", login);
router.post("/", createMember);
router.get("/", listMember);

export default router;
