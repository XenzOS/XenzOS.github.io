import { useState, useEffect } from 'react';
import AppBase from './AppBase';
import { FiPlus, FiTrash2, FiEdit, FiSave } from 'react-icons/fi';

interface NotesAppProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Note {
  id: string;
  title: string;
  content: string;
  lastEdited: string;
}

export default function NotesApp({ isOpen, onClose }: NotesAppProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Load notes from localStorage
  useEffect(() => {
    const savedNotes = localStorage.getItem('xenzos_notes');
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (e) {
        console.error('Error loading notes:', e);
        setNotes([]);
      }
    } else {
      // Create a demo note if no notes exist
      const demoNote: Note = {
        id: Date.now().toString(),
        title: 'Welcome to Notes',
        content: 'This is your first note in XenzOS. You can create, edit, and delete notes. Try it out!',
        lastEdited: new Date().toLocaleDateString()
      };
      setNotes([demoNote]);
      localStorage.setItem('xenzos_notes', JSON.stringify([demoNote]));
    }
  }, []);

  // Save notes to localStorage when changed
  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem('xenzos_notes', JSON.stringify(notes));
    }
  }, [notes]);

  // Set the selected note content when a note is selected
  useEffect(() => {
    if (selectedNote) {
      const note = notes.find(n => n.id === selectedNote);
      if (note) {
        setTitle(note.title);
        setContent(note.content);
      }
    } else {
      setTitle('');
      setContent('');
    }
  }, [selectedNote, notes]);

  // Create a new note
  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'New Note',
      content: '',
      lastEdited: new Date().toLocaleDateString()
    };
    
    setNotes([...notes, newNote]);
    setSelectedNote(newNote.id);
    setTitle(newNote.title);
    setContent(newNote.content);
    setIsEditing(true);
  };

  // Delete the selected note
  const deleteNote = (id: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      setNotes(notes.filter(note => note.id !== id));
      if (selectedNote === id) {
        setSelectedNote(notes.length > 1 ? notes[0].id : null);
      }
    }
  };

  // Save changes to a note
  const saveNote = () => {
    if (!selectedNote) return;
    
    setNotes(notes.map(note => 
      note.id === selectedNote
        ? { ...note, title, content, lastEdited: new Date().toLocaleDateString() }
        : note
    ));
    setIsEditing(false);
  };

  return (
    <AppBase
      isOpen={isOpen}
      onClose={onClose}
      title="Notes"
      icon="📝"
      width={700}
      height={500}
      initialPosition={{ x: 300, y: 150 }}
    >
      <div className="flex h-full bg-[hsl(var(--terminal-bg))] text-[hsl(var(--terminal-text))]">
        {/* Sidebar */}
        <div className="w-1/3 border-r border-gray-700 flex flex-col">
          {/* Sidebar header with new note button */}
          <div className="p-3 border-b border-gray-700 flex justify-between items-center">
            <h2 className="font-semibold">My Notes</h2>
            <button 
              onClick={createNewNote}
              className="p-2 rounded-full hover:bg-blue-600 transition-colors"
            >
              <FiPlus />
            </button>
          </div>
          
          {/* Notes list */}
          <div className="flex-1 overflow-auto">
            {notes.map(note => (
              <div 
                key={note.id}
                className={`p-3 cursor-pointer border-b border-gray-700 hover:bg-gray-800 ${
                  selectedNote === note.id ? 'bg-gray-800' : ''
                }`}
                onClick={() => {
                  setSelectedNote(note.id);
                  setIsEditing(false);
                }}
              >
                <div className="font-medium truncate">{note.title}</div>
                <div className="text-xs text-gray-400 flex justify-between mt-1">
                  <span className="truncate flex-1">{note.content.substring(0, 50)}{note.content.length > 50 ? '...' : ''}</span>
                  <span>{note.lastEdited}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Note content area */}
        <div className="flex-1 flex flex-col">
          {selectedNote ? (
            <>
              {/* Note toolbar */}
              <div className="p-3 border-b border-gray-700 flex justify-between">
                {isEditing ? (
                  <>
                    <input 
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="bg-transparent border-0 outline-none font-semibold flex-1"
                      placeholder="Note title"
                    />
                    <button 
                      onClick={saveNote}
                      className="p-2 rounded-full hover:bg-green-600 transition-colors ml-2"
                    >
                      <FiSave />
                    </button>
                  </>
                ) : (
                  <>
                    <h2 className="font-semibold">{title}</h2>
                    <div className="flex">
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="p-2 rounded-full hover:bg-blue-600 transition-colors ml-2"
                      >
                        <FiEdit />
                      </button>
                      <button 
                        onClick={() => deleteNote(selectedNote)}
                        className="p-2 rounded-full hover:bg-red-600 transition-colors ml-2"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </>
                )}
              </div>
              
              {/* Note content */}
              <div className="flex-1 overflow-auto p-4">
                {isEditing ? (
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full h-full bg-transparent border-0 outline-none resize-none"
                    placeholder="Write your note here..."
                  />
                ) : (
                  <div className="whitespace-pre-line">{content}</div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <p>No note selected</p>
                <button 
                  onClick={createNewNote}
                  className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                >
                  Create a new note
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppBase>
  );
}