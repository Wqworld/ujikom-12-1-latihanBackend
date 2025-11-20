import { Router } from "express";
import { createKategori, deleteKategori, getAllKategori, getKategoriById, updateKategori } from "../controllers/kategoriControllers";
import { authenticateToken, authorizeRole } from "../middleware/authMiddleware";

const router = Router();

router.use(authenticateToken)

router.get('/', authorizeRole(["ADMIN","KASIR"]) ,getAllKategori);
router.post('/', authorizeRole(["ADMIN"]) , createKategori);
router.get('/:id', authorizeRole(["ADMIN"]) , getKategoriById);
router.put('/:id', authorizeRole(["ADMIN"]) ,  updateKategori);
router.delete('/:id', authorizeRole(["ADMIN"]) , deleteKategori);

export default router;