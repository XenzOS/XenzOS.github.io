import { useState } from 'react';
import AppBase from './AppBase';
import TerminalWindow from '../TerminalWindow';

interface TerminalAppProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TerminalApp({ isOpen, onClose }: TerminalAppProps) {
  return (
    <AppBase
      isOpen={isOpen}
      onClose={onClose}
      title="Terminal"
      icon="💻"
      width={600}
      height={500}
      initialPosition={{ x: 100, y: 100 }}
    >
      <div className="flex-1 overflow-hidden bg-[hsl(var(--terminal-bg))] text-[hsl(var(--terminal-text))]">
        <TerminalWindow isDraggable={true} />
      </div>
    </AppBase>
  );
}