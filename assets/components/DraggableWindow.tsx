import { useState, useRef, ReactNode, useEffect } from 'react';

export interface DraggableWindowProps {
  children: ReactNode;
  title?: string;
  isOpen: boolean;
  onClose: () => void;
  initialPosition?: { x: number; y: number };
  width?: number;
  height?: number;
  minWidth?: number;
  minHeight?: number;
}

export default function DraggableWindow({
  children,
  title = 'Window',
  isOpen,
  onClose,
  initialPosition = { x: 50, y: 50 },
  width = 600,
  height = 500,
  minWidth = 300,
  minHeight = 200
}: DraggableWindowProps) {
  const [position, setPosition] = useState(initialPosition);
  const [windowSize, setWindowSize] = useState({ width, height });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [preFullscreenState, setPreFullscreenState] = useState({ 
    position: initialPosition, 
    size: { width, height } 
  });
  const [resizeDirection, setResizeDirection] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  // Handle drag start
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only drag from the title bar
    if ((e.target as HTMLElement).closest('.window-title-bar')) {
      setIsDragging(true);
      
      // Calculate the offset from the mouse position to the window corner
      const rect = windowRef.current?.getBoundingClientRect();
      if (rect) {
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    }
  };

  // Handle resize start
  const handleResizeStart = (e: React.MouseEvent<HTMLDivElement>, direction: string) => {
    e.stopPropagation();
    e.preventDefault();
    
    setIsResizing(true);
    setResizeDirection(direction);
    
    // Store initial mouse position and window dimensions
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: windowSize.width,
      height: windowSize.height
    });
  };

  // Handle drag and resize move
  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      // Calculate new position based on mouse position minus the offset
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    } else if (isResizing && resizeDirection) {
      e.preventDefault();
      
      // Calculate dimension changes based on direction
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      
      let newWidth = resizeStart.width;
      let newHeight = resizeStart.height;
      let newX = position.x;
      let newY = position.y;
      
      // Apply changes based on resize direction
      if (resizeDirection.includes('e')) {
        // East/right edge
        newWidth = Math.max(minWidth, resizeStart.width + deltaX);
      }
      if (resizeDirection.includes('s')) {
        // South/bottom edge
        newHeight = Math.max(minHeight, resizeStart.height + deltaY);
      }
      if (resizeDirection.includes('w')) {
        // West/left edge
        const widthChange = Math.min(resizeStart.width - minWidth, deltaX);
        newWidth = Math.max(minWidth, resizeStart.width - deltaX);
        newX = resizeStart.width - newWidth === 0 ? position.x : position.x + deltaX;
      }
      if (resizeDirection.includes('n')) {
        // North/top edge
        const heightChange = Math.min(resizeStart.height - minHeight, deltaY);
        newHeight = Math.max(minHeight, resizeStart.height - deltaY);
        newY = resizeStart.height - newHeight === 0 ? position.y : position.y + deltaY;
      }
      
      // Update window size and position
      setWindowSize({ width: newWidth, height: newHeight });
      setPosition({ x: newX, y: newY });
    }
  };

  // Handle drag end and resize end
  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeDirection(null);
  };

  // Add and remove event listeners
  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing]);

  // Keep window in viewport bounds
  useEffect(() => {
    const handleResize = () => {
      if (windowRef.current) {
        const rect = windowRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Adjust position if window is outside viewport
        let newX = position.x;
        let newY = position.y;

        // Check left and right bounds
        if (rect.right > viewportWidth) {
          newX = viewportWidth - rect.width;
        }
        if (rect.left < 0) {
          newX = 0;
        }

        // Check top and bottom bounds
        if (rect.bottom > viewportHeight) {
          newY = viewportHeight - rect.height;
        }
        if (rect.top < 0) {
          newY = 0;
        }

        // Update position if needed
        if (newX !== position.x || newY !== position.y) {
          setPosition({ x: newX, y: newY });
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [position]);

  if (!isOpen) return null;

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (isFullscreen) {
      // Restore to pre-fullscreen state
      setPosition(preFullscreenState.position);
      setWindowSize(preFullscreenState.size);
      setIsFullscreen(false);
    } else {
      // Save current state
      setPreFullscreenState({
        position,
        size: windowSize
      });
      
      // Go fullscreen
      setPosition({ x: 0, y: 0 });
      setWindowSize({ 
        width: window.innerWidth, 
        height: window.innerHeight - 50 // Leave space for dock
      });
      setIsFullscreen(true);
    }
  };
  
  // Resize cursor styles
  const getCursor = (direction: string) => {
    switch (direction) {
      case 'n': case 's': return 'ns-resize';
      case 'e': case 'w': return 'ew-resize';
      case 'ne': case 'sw': return 'nesw-resize';
      case 'nw': case 'se': return 'nwse-resize';
      default: return isDragging ? 'grabbing' : 'default';
    }
  };

  return (
    <div
      ref={windowRef}
      className="fixed shadow-2xl rounded-lg overflow-hidden bg-[hsl(var(--terminal-bg))] bg-opacity-90 backdrop-blur-md border border-gray-700 z-50"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${windowSize.width}px`,
        height: `${windowSize.height}px`,
        cursor: isDragging ? 'grabbing' : 'default',
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Window title bar - Apple-like style */}
      <div className="window-title-bar flex items-center justify-between p-2 bg-gray-900 bg-opacity-80 backdrop-blur-sm cursor-grab active:cursor-grabbing">
        <div className="flex items-center">
          <div className="h-3 w-3 rounded-full bg-red-500 mr-2 cursor-pointer hover:bg-red-600 transition-colors" onClick={onClose}></div>
          <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2 hover:bg-yellow-600 transition-colors" onClick={toggleFullscreen}></div>
          <div className="h-3 w-3 rounded-full bg-green-500 mr-2 hover:bg-green-600 transition-colors"></div>
          <span className="text-xs text-gray-400 ml-2">{title} {isFullscreen ? '(Fullscreen)' : ''}</span>
        </div>
        <div className="flex items-center">
          <button 
            onClick={toggleFullscreen}
            className="text-gray-400 hover:text-white focus:outline-none p-1 rounded"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M22 3h-6m0 0v6m0-6L16 3m6 18h-6m0 0v-6m0 6l-6-6M2 3h6m0 0v6m0-6L8 3M2 21h6m0 0v-6m0 6l-6-6" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Window content */}
      <div className="p-4 overflow-auto" style={{ height: 'calc(100% - 36px)' }}>
        {children}
      </div>
      
      {/* Resize handles */}
      {/* North (top) */}
      <div 
        className="absolute top-0 left-0 right-0 h-1 cursor-ns-resize" 
        style={{ cursor: getCursor('n') }}
        onMouseDown={(e) => handleResizeStart(e, 'n')}
      />
      
      {/* South (bottom) */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-1 cursor-ns-resize" 
        style={{ cursor: getCursor('s') }}
        onMouseDown={(e) => handleResizeStart(e, 's')}
      />
      
      {/* East (right) */}
      <div 
        className="absolute top-0 right-0 bottom-0 w-1 cursor-ew-resize" 
        style={{ cursor: getCursor('e') }}
        onMouseDown={(e) => handleResizeStart(e, 'e')}
      />
      
      {/* West (left) */}
      <div 
        className="absolute top-0 left-0 bottom-0 w-1 cursor-ew-resize" 
        style={{ cursor: getCursor('w') }}
        onMouseDown={(e) => handleResizeStart(e, 'w')}
      />
      
      {/* Northeast (top-right) */}
      <div 
        className="absolute top-0 right-0 w-4 h-4 cursor-nesw-resize" 
        style={{ cursor: getCursor('ne') }}
        onMouseDown={(e) => handleResizeStart(e, 'ne')}
      />
      
      {/* Northwest (top-left) */}
      <div 
        className="absolute top-0 left-0 w-4 h-4 cursor-nwse-resize" 
        style={{ cursor: getCursor('nw') }}
        onMouseDown={(e) => handleResizeStart(e, 'nw')}
      />
      
      {/* Southeast (bottom-right) */}
      <div 
        className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize" 
        style={{ cursor: getCursor('se') }}
        onMouseDown={(e) => handleResizeStart(e, 'se')}
      />
      
      {/* Southwest (bottom-left) */}
      <div 
        className="absolute bottom-0 left-0 w-4 h-4 cursor-nesw-resize" 
        style={{ cursor: getCursor('sw') }}
        onMouseDown={(e) => handleResizeStart(e, 'sw')}
      />
    </div>
  );
}