



import React, { useEffect, useState } from 'react';
import { getNotes, updateNote, createNote, deleteNote } from '../config/api';
import { Pencil, Trash2 } from 'lucide-react';
import userAvatar from '../assets/image.png';
import { toast } from 'react-toastify';

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
      toast.success('Note created!');
    } catch {
      setError('Failed to create note');
      toast.error('Failed to create note');
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
    } catch {
      setError('Failed to load notes');
      toast.error('Failed to load notes');
    }
    setLoading(false);
  };


  const handleEdit = (id: string, content: string) => {
    setEditingId(id);
    setEditContent(content);
  };

  const handleDelete = async (id: string) => {
    toast.info(
      <span>
        Are you sure you want to delete this note?
        <button
          style={{ marginLeft: 12, background: '#ef4444', color: 'white', borderRadius: 6, padding: '2px 10px', fontWeight: 600, border: 'none', cursor: 'pointer' }}
          onClick={async (e) => {
            e.stopPropagation();
            toast.dismiss();
            try {
              await deleteNote(id);
              setNotes((prev) => prev.filter((n) => n._id !== id));
              toast.success('Note deleted!');
            } catch {
              setError('Failed to delete note');
              toast.error('Failed to delete note');
            }
          }}
        >
          Delete
        </button>
        <button
          style={{ marginLeft: 8, background: '#e5e7eb', color: '#374151', borderRadius: 6, padding: '2px 10px', fontWeight: 600, border: 'none', cursor: 'pointer' }}
          onClick={() => toast.dismiss()}
        >
          Cancel
        </button>
      </span>,
      { autoClose: false, closeOnClick: false, draggable: false }
    );
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
      toast.success('Note updated!');
    } catch {
      setError('Failed to update note');
      toast.error('Failed to update note');
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditContent('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-100 font-sans flex flex-col items-center pt-6 px-2">
      <div className="w-full max-w-md flex items-center justify-between font-semibold text-lg mb-4 px-2 sm:px-0">
        <div className="flex items-center gap-2">
          <img
            src={user.avatar || userAvatar}
            alt="User Avatar"
            className="w-10 h-10 rounded-full object-cover border-2 border-blue-400 shadow"
            style={{ background: '#e0e7ef' }}
          />
          <span className="hidden sm:inline text-xl font-bold text-blue-700">Dashboard</span>
        </div>
        <button className="text-blue-600 cursor-pointer text-base underline hover:text-blue-800 transition" onClick={onSignOut}>Sign Out</button>
      </div>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-5 sm:p-8 flex flex-col items-center gap-3 border border-slate-200">
        <div className="flex flex-col items-center w-full mb-2">
          <div className="text-xl sm:text-2xl font-bold mb-1 text-blue-800 text-center">Welcome, {user.name}!</div>
          <div className="text-sm sm:text-base text-gray-500 mb-2 text-center break-all">{user.email}</div>
        </div>
        {/* Create Note button and modal-like textarea */}
        {!showCreate ? (
          <button
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-base shadow mb-2 transition"
            onClick={() => setShowCreate(true)}
          >
            + Create Note
          </button>
        ) : (
          <div className="w-full flex flex-col gap-2 mb-2">
            <textarea
              className="rounded-lg px-3 py-2 border border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none min-h-[60px] text-base transition"
              placeholder="Write your note..."
              value={newNoteContent}
              onChange={e => setNewNoteContent(e.target.value)}
              disabled={creating}
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-1 font-semibold shadow disabled:opacity-50 transition"
                onClick={handleCreateNote}
                disabled={creating || !newNoteContent.trim()}
              >
                {creating ? 'Saving...' : 'Save'}
              </button>
              <button
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded px-4 py-1 font-semibold shadow transition"
                onClick={handleCreateCancel}
                disabled={creating}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        {error && <div className="text-red-500 text-sm mb-2 w-full text-center">{error}</div>}
        <div className="w-full mt-2">
          <div className="text-lg font-semibold mb-2 text-blue-700">Notes</div>
          <div className="flex flex-col gap-3">
            {loading ? (
              <div className="text-center text-gray-400">Loading...</div>
            ) : notes.length === 0 ? (
              <div className="text-center text-gray-400">No notes yet.</div>
            ) : (
              notes.map((note) => (
                <div key={note._id} className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 flex items-center justify-between shadow-sm hover:shadow-md transition">
                  {editingId === note._id ? (
                    <>
                      <input
                        className="flex-1 rounded-lg px-2 py-1 border border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base transition mb-2 sm:mb-0 sm:mr-2"
                        value={editContent}
                        onChange={handleEditChange}
                        autoFocus
                        placeholder="Edit note..."
                        title="Edit note"
                      />
                      {/* Buttons below input on mobile, inline on desktop */}
                      <div className="w-full flex flex-row gap-2 sm:w-auto sm:flex-row sm:items-center">
                        <div className="w-full flex flex-col gap-2 sm:flex-row sm:w-auto sm:gap-2">
                          <button
                            className="w-full sm:w-auto flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full px-4 py-2 shadow transition text-base sm:rounded px-3 py-1 sm:text-base"
                            style={{ minWidth: 40, minHeight: 40 }}
                            onClick={() => handleEditSave(note._id)}
                            aria-label="Save"
                          >
                            <span className="sm:hidden text-lg">✔</span>
                            <span className="hidden sm:inline">Save</span>
                          </button>
                          <button
                            className="w-full sm:w-auto flex items-center justify-center bg-gray-400 hover:bg-gray-500 text-white font-semibold rounded-full px-4 py-2 shadow transition text-base sm:bg-gray-300 sm:hover:bg-gray-400 sm:text-gray-800 sm:rounded sm:px-3 sm:py-1 sm:text-base"
                            style={{ minWidth: 40, minHeight: 40 }}
                            onClick={handleEditCancel}
                            aria-label="Cancel"
                          >
                            <span className="sm:hidden text-lg">✖</span>
                            <span className="hidden sm:inline">Cancel</span>
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="truncate max-w-[140px] sm:max-w-[180px] text-base text-gray-800">{note.content}</span>
                      <span className="flex items-center ml-2 gap-1">
                        <button className="text-blue-600 hover:bg-blue-100 rounded p-1 transition" onClick={() => handleEdit(note._id, note.content)} title="Edit">
                          <Pencil size={18} />
                        </button>
                        <button className="text-red-600 hover:bg-red-100 rounded p-1 transition" onClick={() => handleDelete(note._id)} title="Delete">
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
