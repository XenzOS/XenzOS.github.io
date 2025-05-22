import { useState, useEffect, useRef } from 'react';
import { FiFile, FiFolder, FiImage, FiFileText, FiVideo, FiMusic } from 'react-icons/fi';
import { FileItem } from './apps/FileManagerApp';

interface DesktopFilePosition {
  id: string;
  x: number;
  y: number;
}

export default function DesktopFiles() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [desktopFiles, setDesktopFiles] = useState<FileItem[]>([]);
  const [positions, setPositions] = useState<DesktopFilePosition[]>([]);
  const [draggingFile, setDraggingFile] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const desktopRef = useRef<HTMLDivElement>(null);

  // Load files and positions from localStorage
  useEffect(() => {
    // Load all files
    const savedFiles = localStorage.getItem('xenzos_files');
    if (savedFiles) {
      try {
        setFiles(JSON.parse(savedFiles));
      } catch (e) {
        console.error('Error loading files:', e);
      }
    }

    // Load desktop files
    const savedDesktopFiles = localStorage.getItem('xenzos_desktop_files');
    if (savedDesktopFiles) {
      try {
        setDesktopFiles(JSON.parse(savedDesktopFiles));
      } catch (e) {
        console.error('Error loading desktop files:', e);
      }
    }

    // Load positions
    const savedPositions = localStorage.getItem('xenzos_desktop_positions');
    if (savedPositions) {
      try {
        setPositions(JSON.parse(savedPositions));
      } catch (e) {
        console.error('Error loading positions:', e);
      }
    }
  }, []);

  // Save desktop files and positions to localStorage when changed
  useEffect(() => {
    if (desktopFiles.length > 0) {
      localStorage.setItem('xenzos_desktop_files', JSON.stringify(desktopFiles));
    }
    if (positions.length > 0) {
      localStorage.setItem('xenzos_desktop_positions', JSON.stringify(positions));
    }
  }, [desktopFiles, positions]);

  // Add a file to the desktop
  const addFileToDesktop = (file: FileItem) => {
    // Check if file is already on desktop
    if (!desktopFiles.some(f => f.id === file.id)) {
      const newDesktopFiles = [...desktopFiles, file];
      setDesktopFiles(newDesktopFiles);
      
      // Position in grid near the left of the desktop
      const newPositions = [...positions];
      const row = Math.floor(newPositions.length / 5);
      const col = newPositions.length % 5;
      
      newPositions.push({
        id: file.id,
        x: 20 + col * 100,
        y: 40 + row * 100
      });
      
      setPositions(newPositions);
    }
  };

  // Get file icon based on type
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'folder':
        return <FiFolder className="text-yellow-500" size={24} />;
      case 'image':
        return <FiImage className="text-green-500" size={24} />;
      case 'video':
        return <FiVideo className="text-red-500" size={24} />;
      case 'audio':
        return <FiMusic className="text-purple-500" size={24} />;
      case 'document':
        return <FiFileText className="text-blue-500" size={24} />;
      default:
        return <FiFile className="text-gray-500" size={24} />;
    }
  };

  // Start dragging a file
  const handleMouseDown = (
    e: React.MouseEvent<HTMLDivElement>,
    fileId: string
  ) => {
    e.preventDefault();
    setDraggingFile(fileId);
    
    // Find the file's position
    const filePosition = positions.find(pos => pos.id === fileId);
    if (filePosition) {
      // Calculate offset from mouse to the top-left corner of the file
      setDragOffset({
        x: e.clientX - filePosition.x,
        y: e.clientY - filePosition.y
      });
    }

    // Add event listeners for dragging
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Handle dragging a file
  const handleMouseMove = (e: MouseEvent) => {
    if (draggingFile) {
      // Update the position
      setPositions(prevPositions => 
        prevPositions.map(pos => 
          pos.id === draggingFile 
            ? { ...pos, x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y }
            : pos
        )
      );
    }
  };

  // Stop dragging a file
  const handleMouseUp = () => {
    setDraggingFile(null);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  // Handle double-click on a file
  const handleDoubleClick = (file: FileItem) => {
    // Here you would open the appropriate app based on file type
    // For now, just alert the file name
    alert(`Opening ${file.name}`);
  };

  // Create some sample desktop files if none exist
  useEffect(() => {
    if (files.length > 0 && desktopFiles.length === 0) {
      // Add a welcome text file to the desktop
      const welcomeFile = files.find(f => f.name === 'XenzOS_Welcome.txt');
      if (welcomeFile) {
        addFileToDesktop(welcomeFile);
      }
      
      // Add a sample image
      const sampleImage = files.find(f => f.type === 'image');
      if (sampleImage) {
        addFileToDesktop(sampleImage);
      }
    }
  }, [files]);

  // Clean up event listeners
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div ref={desktopRef} className="absolute inset-0 pointer-events-none">
      {desktopFiles.map(file => {
        const position = positions.find(pos => pos.id === file.id);
        if (!position) return null;
        
        return (
          <div
            key={file.id}
            className={`absolute flex flex-col items-center pointer-events-auto cursor-pointer select-none
              ${draggingFile === file.id ? 'opacity-70' : 'opacity-100'}`}
            style={{
              left: `${position.x}px`,
              top: `${position.y}px`,
              width: '80px',
              transition: draggingFile === file.id ? 'none' : 'all 0.1s ease'
            }}
            onMouseDown={(e) => handleMouseDown(e, file.id)}
            onDoubleClick={() => handleDoubleClick(file)}
          >
            {getFileIcon(file.type)}
            <div className="mt-1 text-xs text-white text-center bg-black bg-opacity-40 p-1 rounded w-full backdrop-blur-sm">
              {file.name.length > 12 
                ? file.name.substring(0, 10) + '...' 
                : file.name}
            </div>
          </div>
        );
      })}
    </div>
  );
}