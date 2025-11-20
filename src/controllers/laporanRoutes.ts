import { Router } from "express";
import { authenticateToken } from "../middleware/authMiddleware";
import { getLaporan } from "./laporanController";

const router = Router();
router.use(authenticateToken);
router.get('/', getLaporan);

export default router;