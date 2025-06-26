import { Router } from 'express';
import summaryController from '../controllers/summaryController';
import authMiddleware from '../middlewares/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.post('/send', summaryController.sendManualSummary);

export default router;