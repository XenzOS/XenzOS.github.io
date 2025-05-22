import { ReactNode } from 'react';
import DraggableWindow from '../DraggableWindow';

export interface AppProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon: string;
  initialPosition?: { x: number; y: number };
  width?: number;
  height?: number;
  children: ReactNode;
}

// Base component for all applications
export default function AppBase({ 
  isOpen, 
  onClose, 
  title, 
  icon, 
  initialPosition = { x: 100, y: 100 },
  width = 600,
  height = 500,
  children 
}: AppProps) {
  return (
    <DraggableWindow
      title={title}
      isOpen={isOpen}
      onClose={onClose}
      initialPosition={initialPosition}
      width={width}
      height={height}
    >
      <div className="h-full flex flex-col">
        {children}
      </div>
    </DraggableWindow>
  );
}