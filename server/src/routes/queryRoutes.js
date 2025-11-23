import { Router } from 'express';
import { getQueries, getQueryById, createQuery, updateQuery, deleteQuery } from '../controllers/queryController.js';

const router = Router();

router.get('/', getQueries);
router.get('/:id', getQueryById);
router.post('/', createQuery);
router.put('/:id', updateQuery);
router.delete('/:id', deleteQuery);

export default router;