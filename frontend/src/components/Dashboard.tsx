



import React, { useEffect, useState } from 'react';
import { getNotes, updateNote, createNote, deleteNote } from '../config/api';
import { Pencil, Trash2 } from 'lucide-react';

interface Props {
  onSignOut: () => void;
  user: {
    name: string;
    email: string;
    dateOfBirth?: string;
    avatar?: string;
  };
}


const Dashboard: React.FC<Props> = ({ onSignOut, user }) => {
  const [notes, setNotes] = useState<Array<{ _id: string; content: string; createdAt?: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [creating, setCreating] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const handleCreateNote = async () => {
    if (!newNoteContent.trim()) return;
    setCreating(true);
    setError(null);
    try {
      const res = await createNote({ title: '', content: newNoteContent });
      setNotes((prev) => [res.data, ...prev]);
      setNewNoteContent('');
      setShowCreate(false);
    } catch (err) {
      setError('Failed to create note');
    }
    setCreating(false);
  };

  const handleCreateCancel = () => {
    setShowCreate(false);
    setNewNoteContent('');
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getNotes();
      setNotes(res.data);
    } catch (err: any) {
      setError('Failed to load notes');
    }
    setLoading(false);
  };


  const handleEdit = (id: string, content: string) => {
    setEditingId(id);
    setEditContent(content);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this note?')) return;
    try {
      await deleteNote(id);
      setNotes((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      setError('Failed to delete note');
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditContent(e.target.value);
  };

  const handleEditSave = async (id: string) => {
    try {
      await updateNote(id, { content: editContent });
      setNotes((prev) => prev.map((n) => (n._id === id ? { ...n, content: editContent } : n)));
      setEditingId(null);
      setEditContent('');
    } catch (err) {
      setError('Failed to update note');
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditContent('');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col items-center pt-8">
      <div className="w-[350px] flex items-center justify-between font-semibold text-lg mb-4">
        <span className="text-2xl">🌟</span> Dashboard
        <button className="text-blue-600 cursor-pointer text-base underline" onClick={onSignOut}>Sign Out</button>
      </div>
      <div className="w-[350px] bg-white rounded-xl shadow p-6 flex flex-col items-center gap-3">
        <div className="text-xl font-bold mb-1">Welcome, {user.name} !</div>
        <div className="text-base text-gray-500 mb-3">Email: {user.email}</div>
        {/* Create Note button and modal-like textarea */}
        {!showCreate ? (
          <button
            className="w-full py-2 bg-blue-600 text-white rounded-md font-semibold text-base shadow mb-2"
            onClick={() => setShowCreate(true)}
          >
            Create Note
          </button>
        ) : (
          <div className="w-full flex flex-col gap-2 mb-2">
            <textarea
              className="rounded px-2 py-1 border border-gray-300 resize-none min-h-[60px]"
              placeholder="Write your note..."
              value={newNoteContent}
              onChange={e => setNewNoteContent(e.target.value)}
              disabled={creating}
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <button
                className="bg-blue-600 text-white rounded px-3 py-1 font-semibold shadow disabled:opacity-50"
                onClick={handleCreateNote}
                disabled={creating || !newNoteContent.trim()}
              >
                {creating ? 'Saving...' : 'Save'}
              </button>
              <button
                className="bg-gray-200 text-gray-700 rounded px-3 py-1 font-semibold shadow"
                onClick={handleCreateCancel}
                disabled={creating}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        <div className="w-full mt-3">
          <div className="text-lg font-semibold mb-2">Notes</div>
          <div className="flex flex-col gap-3">
            {loading ? (
              <div className="text-center text-gray-400">Loading...</div>
            ) : notes.length === 0 ? (
              <div className="text-center text-gray-400">No notes yet.</div>
            ) : (
              notes.map((note) => (
                <div key={note._id} className="bg-white border border-slate-200 rounded-lg px-4 py-3 flex items-center justify-between shadow-sm">
                  {editingId === note._id ? (
                    <>
                      <input
                        className="flex-1 rounded px-2 py-1 border border-gray-300 mr-2"
                        value={editContent}
                        onChange={handleEditChange}
                        autoFocus
                      />
                      <button className="text-green-600 font-semibold mr-1" onClick={() => handleEditSave(note._id)}>Save</button>
                      <button className="text-gray-500" onClick={handleEditCancel}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <span className="truncate max-w-[180px]">{note.content}</span>
                      <span className="flex items-center ml-2 gap-1">
                        <button className="text-blue-600 hover:bg-blue-50 rounded p-1" onClick={() => handleEdit(note._id, note.content)} title="Edit">
                          <Pencil size={18} />
                        </button>
                        <button className="text-red-600 hover:bg-red-50 rounded p-1" onClick={() => handleDelete(note._id)} title="Delete">
                          <Trash2 size={18} />
                        </button>
                      </span>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
