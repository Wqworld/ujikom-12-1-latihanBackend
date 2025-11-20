import { Router } from "express";
import {
  getAllDiskon,
  createDiskon,
  updateDiskon,
  deleteDiskon,
  getDiskonById
} from "../controllers/diskonController";
import { authenticateToken, authorizeRole } from "../middleware/authMiddleware";

const router = Router();

router.use(authenticateToken);

// Kasir & Admin boleh lihat
router.get("/", authorizeRole(["ADMIN", "KASIR"]), getAllDiskon);

// Sisanya cuma Admin
router.post("/", authorizeRole(["ADMIN"]), createDiskon);
router.get("/:id", authorizeRole(["ADMIN"]), getDiskonById);
router.put("/:id", authorizeRole(["ADMIN"]), updateDiskon);
router.delete("/:id", authorizeRole(["ADMIN"]), deleteDiskon);

export default router;