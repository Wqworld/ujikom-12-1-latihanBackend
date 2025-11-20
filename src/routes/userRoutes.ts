import { Router } from "express";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser
} from "../controllers/userController";
import { authenticateToken, authorizeRole } from "../middleware/authMiddleware";

const router = Router();

router.use(authenticateToken); // Cek Token dulu
router.use(authorizeRole(["ADMIN"])); // PASTIKAN CUMA ADMIN YANG LEWAT

router.get("/", getAllUsers);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;