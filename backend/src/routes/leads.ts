import { Router } from 'express';
import {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
  exportLeadsCSV,
  getLeadStats,
} from '../controllers/leadController';
import { authenticate, authorize } from '../middleware/auth';
import { leadValidation, leadQueryValidation, mongoIdValidation } from '../middleware/validation';

const router = Router();

router.use(authenticate);

router.get('/stats', getLeadStats);
router.get('/export', exportLeadsCSV);
router.get('/', leadQueryValidation, getLeads);
router.get('/:id', mongoIdValidation, getLead);
router.post('/', leadValidation, createLead);
router.put('/:id', mongoIdValidation, leadValidation, updateLead);
router.delete('/:id', mongoIdValidation, authorize('admin'), deleteLead);

export default router;
