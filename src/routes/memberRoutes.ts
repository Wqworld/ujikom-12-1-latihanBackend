import { Router } from 'express';
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware';
import { createMember, deleteMember, getAllMember, getMemberById, updateMember } from '../controllers/memberController';

const router = Router();

router.use(authenticateToken)
router.get('/',authorizeRole(["ADMIN", "KASIR"]), getAllMember);
router.post('/', authorizeRole(["ADMIN", "KASIR"]), createMember);
router.get('/:id',authorizeRole(["ADMIN", "KASIR"]), getMemberById);
router.put('/:id',authorizeRole(["ADMIN"]), updateMember);
router.delete('/:id',authorizeRole(["ADMIN"]), deleteMember);

export default router