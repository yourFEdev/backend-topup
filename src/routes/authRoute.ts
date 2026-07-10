import express from "express";
import {
  registerUser,
  loginUser,
  getUserById,
  getUsers,
} from "../controllers/authController";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/user", getUsers);
router.get("/user/:id", getUserById);

export default router;
