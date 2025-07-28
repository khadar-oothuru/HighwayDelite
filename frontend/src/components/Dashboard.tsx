



import React, { useEffect, useState } from 'react';
import { getNotes, updateNote, createNote, deleteNote } from '../config/api';
import { Pencil, Trash2, Check, X, LogOut } from 'lucide-react';
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

  // Softer color palette for notes (200-level Tailwind colors)
  const noteColors = [
    '#bfdbfe', // blue-200
    '#fef08a', // yellow-200
    '#bbf7d0', // green-200
    '#e5e7eb', // gray-200
    '#bae6fd', // sky-200
    '#fbcfe8', // pink-200
    '#ddd6fe', // purple-200
    '#fecaca', // red-200
    '#c7d2fe', // indigo-200
    '#fde68a', // amber-200
  ];

  // Assign a color to each note randomly but equally distributed
  let colorIndex = 0;
  const noteColorMap: Record<string, string> = {};
  const getNoteColor = (id: string) => {
    if (!noteColorMap[id]) {
      noteColorMap[id] = noteColors[colorIndex % noteColors.length];
      colorIndex++;
    }
    return noteColorMap[id];
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
        <button
          className="flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold px-4 py-2 rounded-lg shadow-sm border border-blue-200 transition focus:outline-none focus:ring-2 focus:ring-blue-300"
          onClick={onSignOut}
        >
          <LogOut size={18} className="mr-1" /> Sign Out
        </button>
      </div>

      {/* Create Note button/area OUTSIDE the card */}
      <div className="w-full max-w-md flex flex-col items-center mb-4">
        {!showCreate ? (
          <button
            className="w-full py-3 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-bold text-lg shadow-lg mb-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
            onClick={() => setShowCreate(true)}
            style={{ letterSpacing: '0.03em' }}
          >
            <span style={{ fontSize: '1.25rem', marginRight: 8 }}>+</span> Create Note
          </button>
        ) : (
          <div className="w-full flex flex-col gap-2 mb-2 bg-white rounded-2xl shadow-xl border border-blue-200 p-4 animate-fade-in">
            <textarea
              className="rounded-lg px-4 py-3 border-2 border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none min-h-[70px] text-base transition placeholder-gray-400 bg-blue-50 font-medium"
              placeholder="Write your note..."
              value={newNoteContent}
              onChange={e => setNewNoteContent(e.target.value)}
              disabled={creating}
              autoFocus
              maxLength={500}
              style={{ boxShadow: '0 2px 8px 0 rgba(59,130,246,0.07)' }}
            />
            <div className="flex gap-2 justify-end mt-1">
              <button
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg px-6 py-2 font-semibold shadow-md transition-all duration-150 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
                onClick={handleCreateNote}
                disabled={creating || !newNoteContent.trim()}
                style={{ letterSpacing: '0.02em' }}
              >
                {creating ? 'Saving...' : 'Save'}
              </button>
              <button
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg px-6 py-2 font-semibold shadow-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-gray-300"
                onClick={handleCreateCancel}
                disabled={creating}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Notes title outside the card */}
      <div className="w-full max-w-md flex items-start mb-2">
        <div className="text-lg font-semibold text-blue-700">Notes</div>
      </div>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-5 sm:p-8 flex flex-col items-center gap-3 border border-slate-200">
        <div className="flex flex-col items-center w-full mb-2">
          <div className="text-xl sm:text-2xl font-bold mb-1 text-blue-800 text-center">Welcome, {user.name}!</div>
          <div className="text-sm sm:text-base text-gray-500 mb-2 text-center break-all">{user.email}</div>
        </div>
        {error && <div className="text-red-500 text-sm mb-2 w-full text-center">{error}</div>}
        <div className="w-full mt-2">
          <div className="flex flex-col gap-3">
            {loading ? (
              <div className="text-center text-gray-400">Loading...</div>
            ) : notes.length === 0 ? (
              <div className="text-center text-gray-400">No notes yet.</div>
            ) : (
              notes.map((note) => (
                <div
                  key={note._id}
                  className="border border-slate-200 rounded-xl px-3 py-4 sm:py-2 flex items-center justify-between shadow-sm hover:shadow-md transition min-h-[64px] sm:min-h-[48px] w-full"
                  style={{ background: getNoteColor(note._id) }}
                >
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
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2 ml-2 sm:ml-0">
                        <button
                          className="w-8 h-8 flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-full shadow transition text-base focus:outline-none focus:ring-2 focus:ring-emerald-200"
                          style={{ fontSize: '1.1rem' }}
                          onClick={() => handleEditSave(note._id)}
                          aria-label="Save"
                          title="Save"
                        >
                          <Check size={18} />
                        </button>
                        <button
                          className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-full shadow transition text-base focus:outline-none focus:ring-2 focus:ring-gray-200"
                          style={{ fontSize: '1.1rem' }}
                          onClick={handleEditCancel}
                          aria-label="Cancel"
                          title="Cancel"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="text-base text-gray-800 break-words whitespace-pre-line">{note.content}</span>
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
