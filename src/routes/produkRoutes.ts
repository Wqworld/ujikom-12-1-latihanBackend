import {Router} from 'express';
import { upload } from '../utils/uploadFiles';
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware';
import { createProduk, deleteProduk, getAllProduk, getProdukById, updateProduk } from '../controllers/produkController';

const router = Router();

router.use(authenticateToken);
router.get('/', getAllProduk);
router.post('/', authorizeRole(["ADMIN"]), upload.single("gambar"), createProduk);
router.get('/:id', authorizeRole(["ADMIN","KASIR"]), getProdukById);
router.put('/:id', authorizeRole(["ADMIN"]), upload.single("gambar"), updateProduk);
router.delete('/:id', authorizeRole(["ADMIN"]), deleteProduk);

export default router;