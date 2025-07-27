import express from 'express';
import { createNote, deleteNote, getNotes } from '../controllers/notesController';
import { authenticateJWT } from '../middleware/auth';

const router = express.Router();

router.use(authenticateJWT);
router.post('/', createNote);
router.get('/', getNotes);
router.delete('/:id', deleteNote);

export default router;
