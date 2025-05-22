import { useState, useEffect } from 'react';
import AppBase from './AppBase';
import { FiFolder, FiFile, FiImage, FiVideo, FiMusic, FiFileText, FiArrowLeft, FiHome, FiUpload, FiTrash } from 'react-icons/fi';

interface FileManagerAppProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'image' | 'video' | 'audio' | 'document' | 'other';
  size?: number;
  lastModified?: string; // Store as string instead of Date to avoid serialization issues
  content?: string;
  preview?: string;
}

// Get icon based on file type
const getFileIcon = (type: string) => {
  switch (type) {
    case 'folder':
      return <FiFolder className="mr-2 text-blue-400" />;
    case 'image':
      return <FiImage className="mr-2 text-green-400" />;
    case 'video':
      return <FiVideo className="mr-2 text-red-400" />;
    case 'audio':
      return <FiMusic className="mr-2 text-purple-400" />;
    case 'document':
      return <FiFileText className="mr-2 text-yellow-400" />;
    default:
      return <FiFile className="mr-2 text-gray-400" />;
  }
};

export default function FileManagerApp({ isOpen, onClose }: FileManagerAppProps) {
  const [currentPath, setCurrentPath] = useState('/');
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchQuery, setSearchQuery] = useState('');

  // Initialize file system from localStorage or with defaults
  useEffect(() => {
    const savedFiles = localStorage.getItem('xenzos_files');
    if (savedFiles) {
      try {
        setFiles(JSON.parse(savedFiles));
      } catch (e) {
        console.error('Error loading files:', e);
        initializeDefaultFiles();
      }
    } else {
      initializeDefaultFiles();
    }
  }, []);

  // Save files to localStorage when changed
  useEffect(() => {
    if (files.length > 0) {
      localStorage.setItem('xenzos_files', JSON.stringify(files));
    }
  }, [files]);

  // Initialize with some default files and folders
  const initializeDefaultFiles = () => {
    const currentDate = new Date().toLocaleDateString();
    const defaultFiles: FileItem[] = [
      { id: '1', name: 'Documents', type: 'folder', lastModified: currentDate },
      { id: '2', name: 'Photos', type: 'folder', lastModified: currentDate },
      { id: '3', name: 'Videos', type: 'folder', lastModified: currentDate },
      { id: '4', name: 'Music', type: 'folder', lastModified: currentDate },
      { 
        id: '5', 
        name: 'XenzOS_Welcome.txt', 
        type: 'document', 
        lastModified: currentDate,
        content: 'Welcome to XenzOS!\n\nThis is your personal operating system in the browser. Use the File Manager to organize your files and folders.\n\nEnjoy using XenzOS!'
      },
      {
        id: '6',
        name: 'sample_image.jpg',
        type: 'image',
        lastModified: currentDate,
        preview: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)'
      }
    ];
    setFiles(defaultFiles);
    localStorage.setItem('xenzos_files', JSON.stringify(defaultFiles));
  };

  // Filter files based on current path and search query
  const getFilesForCurrentView = () => {
    // First filter by current path (will need to be enhanced for actual folder navigation)
    let filteredFiles = files;
    
    // Then filter by search query if there is one
    if (searchQuery) {
      filteredFiles = filteredFiles.filter(file => 
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filteredFiles;
  };

  // Handle file click
  const handleFileClick = (file: FileItem) => {
    if (file.type === 'folder') {
      // Navigate into folder
      setCurrentPath(prev => `${prev}${file.name}/`);
    } else {
      // View/preview the file
      setSelectedFile(file);
    }
  };

  // Handle back navigation
  const handleBack = () => {
    if (currentPath === '/') return;
    
    // Remove the last path segment
    const pathParts = currentPath.split('/').filter(Boolean);
    pathParts.pop();
    setCurrentPath(`/${pathParts.join('/')}/`);
  };

  // Handle going home
  const handleHome = () => {
    setCurrentPath('/');
  };

  // Handle file upload
  const handleFileUpload = () => {
    // In a real app, this would open a file picker
    const newFileName = prompt('Enter a file name:');
    if (!newFileName) return;
    
    const fileType = newFileName.endsWith('.jpg') || newFileName.endsWith('.png') ? 'image' : 
                    newFileName.endsWith('.mp4') ? 'video' :
                    newFileName.endsWith('.mp3') ? 'audio' :
                    newFileName.endsWith('.txt') || newFileName.endsWith('.doc') ? 'document' : 'other';
                    
    const newFile: FileItem = {
      id: Date.now().toString(),
      name: newFileName,
      type: fileType,
      lastModified: new Date().toLocaleDateString(),
      content: fileType === 'document' ? 'This is a sample document.' : undefined,
      preview: fileType === 'image' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : undefined
    };
    
    setFiles(prev => [...prev, newFile]);
  };

  // Handle creating a new folder
  const handleNewFolder = () => {
    const folderName = prompt('Enter folder name:');
    if (!folderName) return;
    
    const newFolder: FileItem = {
      id: Date.now().toString(),
      name: folderName,
      type: 'folder',
      lastModified: new Date().toLocaleDateString()
    };
    
    setFiles(prev => [...prev, newFolder]);
  };

  // Handle deleting a file
  const handleDeleteFile = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setFiles(prev => prev.filter(file => file.id !== id));
      if (selectedFile && selectedFile.id === id) {
        setSelectedFile(null);
      }
    }
  };

  // File preview component
  const FilePreview = ({ file }: { file: FileItem }) => {
    if (!file) return null;
    
    return (
      <div className="w-full h-full flex flex-col">
        <div className="flex items-center justify-between border-b border-gray-700 p-2">
          <div className="flex items-center">
            {getFileIcon(file.type)}
            <span>{file.name}</span>
          </div>
          <button 
            onClick={() => setSelectedFile(null)}
            className="text-gray-400 hover:text-white"
          >×</button>
        </div>
        <div className="flex-1 overflow-auto p-4">
          {file.type === 'image' && (
            <div 
              className="w-full h-64 rounded"
              style={{ background: file.preview, backgroundSize: 'cover' }}
            ></div>
          )}
          {file.type === 'document' && (
            <div className="whitespace-pre-line">
              {file.content}
            </div>
          )}
          {file.type === 'video' && (
            <div className="flex items-center justify-center h-64 bg-black">
              <div className="text-center">
                <FiVideo className="text-5xl mx-auto mb-2" />
                <p>Video Preview</p>
              </div>
            </div>
          )}
          {file.type === 'audio' && (
            <div className="flex items-center justify-center h-64 bg-gray-800">
              <div className="text-center">
                <FiMusic className="text-5xl mx-auto mb-2" />
                <p>Audio Player</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <AppBase
      isOpen={isOpen}
      onClose={onClose}
      title="File Manager"
      icon="📁"
      width={800}
      height={600}
      initialPosition={{ x: 100, y: 80 }}
    >
      <div className="flex h-full bg-[hsl(var(--terminal-bg))] text-[hsl(var(--terminal-text))]">
        {/* Sidebar */}
        <div className="w-48 border-r border-gray-700 p-4">
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Favorites</h3>
            <ul>
              <li className="flex items-center py-1 px-2 hover:bg-gray-800 rounded cursor-pointer" onClick={handleHome}>
                <FiHome className="mr-2" /> Home
              </li>
              <li className="flex items-center py-1 px-2 hover:bg-gray-800 rounded cursor-pointer">
                <FiFolder className="mr-2 text-blue-400" /> Documents
              </li>
              <li className="flex items-center py-1 px-2 hover:bg-gray-800 rounded cursor-pointer">
                <FiImage className="mr-2 text-green-400" /> Photos
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Storage</h3>
            <div className="bg-gray-800 rounded-full h-2 mb-1">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '30%' }}></div>
            </div>
            <p className="text-xs text-gray-400">35.4 MB free of 100 MB</p>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="border-b border-gray-700 p-2">
            <div className="flex items-center mb-2">
              <button 
                onClick={handleBack}
                className="p-1 rounded hover:bg-gray-800 mr-1"
                disabled={currentPath === '/'}
              >
                <FiArrowLeft />
              </button>
              <button 
                onClick={handleHome}
                className="p-1 rounded hover:bg-gray-800 mr-1"
              >
                <FiHome />
              </button>
              <div className="bg-gray-800 text-sm px-2 py-1 rounded flex-1 mx-2">
                {currentPath}
              </div>
              <input
                type="text"
                placeholder="Search files..."
                className="bg-gray-800 text-sm px-2 py-1 rounded w-40"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex">
              <button 
                onClick={handleFileUpload}
                className="text-xs flex items-center px-2 py-1 rounded hover:bg-gray-800 mr-2"
              >
                <FiUpload className="mr-1" /> Upload
              </button>
              <button 
                onClick={handleNewFolder}
                className="text-xs flex items-center px-2 py-1 rounded hover:bg-gray-800"
              >
                <FiFolder className="mr-1" /> New Folder
              </button>
            </div>
          </div>
          
          {/* File view */}
          <div className="flex flex-1 overflow-hidden">
            {/* File list */}
            <div className={`${selectedFile ? 'w-1/2' : 'w-full'} overflow-auto`}>
              {viewMode === 'list' ? (
                <table className="w-full text-sm">
                  <thead className="border-b border-gray-700">
                    <tr>
                      <th className="text-left p-2">Name</th>
                      <th className="text-left p-2">Type</th>
                      <th className="text-left p-2">Modified</th>
                      <th className="p-2 w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {getFilesForCurrentView().map(file => (
                      <tr 
                        key={file.id} 
                        className="hover:bg-gray-800 cursor-pointer"
                      >
                        <td className="p-2" onClick={() => handleFileClick(file)}>
                          <div className="flex items-center">
                            {getFileIcon(file.type)}
                            {file.name}
                          </div>
                        </td>
                        <td className="p-2" onClick={() => handleFileClick(file)}>
                          {file.type.charAt(0).toUpperCase() + file.type.slice(1)}
                        </td>
                        <td className="p-2" onClick={() => handleFileClick(file)}>
                          {file.lastModified}
                        </td>
                        <td className="p-2">
                          <button 
                            onClick={() => handleDeleteFile(file.id)}
                            className="p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-red-500"
                          >
                            <FiTrash size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="grid grid-cols-4 gap-4 p-4">
                  {getFilesForCurrentView().map(file => (
                    <div 
                      key={file.id}
                      className="flex flex-col items-center p-2 hover:bg-gray-800 rounded cursor-pointer"
                      onClick={() => handleFileClick(file)}
                    >
                      <div className="text-3xl mb-1">
                        {getFileIcon(file.type)}
                      </div>
                      <div className="text-xs text-center truncate w-full">
                        {file.name}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* File preview */}
            {selectedFile && (
              <div className="w-1/2 border-l border-gray-700">
                <FilePreview file={selectedFile} />
              </div>
            )}
          </div>
          
          {/* Status bar */}
          <div className="border-t border-gray-700 px-2 py-1 text-xs text-gray-400">
            {getFilesForCurrentView().length} items
          </div>
        </div>
      </div>
    </AppBase>
  );
}