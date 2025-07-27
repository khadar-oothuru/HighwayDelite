import { Request, Response } from 'express';
import Note from '../models/Note';

export const createNote = async (req: Request, res: Response) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ message: 'Content required' });
  const note = new Note({ user: (req as any).userId, content });
  await note.save();
  res.status(201).json(note);
};

export const deleteNote = async (req: Request, res: Response) => {
  const { id } = req.params;
  const note = await Note.findOne({ _id: id, user: (req as any).userId });
  if (!note) return res.status(404).json({ message: 'Note not found' });
  await note.deleteOne();
  res.json({ message: 'Note deleted' });
};

export const getNotes = async (req: Request, res: Response) => {
  const notes = await Note.find({ user: (req as any).userId }).sort({ createdAt: -1 });
  res.json(notes);
};


// Update note by id
export const updateNote = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { content } = req.body;
  if (!content) return res.status(400).json({ message: 'Content required' });
  const note = await Note.findOneAndUpdate(
    { _id: id, user: (req as any).userId },
    { content },
    { new: true }
  );
  if (!note) return res.status(404).json({ message: 'Note not found' });
  res.json(note);
};
