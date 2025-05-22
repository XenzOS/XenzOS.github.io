import { useState, useEffect } from 'react';
import { useTheme } from './ThemeProvider';

export interface Wallpaper {
  id: string;
  name: string;
  darkUrl: string;
  lightUrl: string;
}

interface WallpaperSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectWallpaper: (wallpaperId: string) => void;
  currentWallpaperId: string;
}

// Default wallpapers
export const defaultWallpapers: Wallpaper[] = [
  {
    id: 'default',
    name: 'Default Gradient',
    darkUrl: 'linear-gradient(to bottom, #1a1a2e, #16213e, #0f3460)',
    lightUrl: 'linear-gradient(to bottom, #f5f7fa, #c3cfe2)'
  },
  {
    id: 'mojave',
    name: 'Mojave',
    darkUrl: 'linear-gradient(to bottom, #0f2027, #203a43, #2c5364)',
    lightUrl: 'linear-gradient(to bottom, #2193b0, #6dd5ed)'
  },
  {
    id: 'catalina',
    name: 'Catalina',
    darkUrl: 'linear-gradient(to bottom, #0f0c29, #302b63, #24243e)',
    lightUrl: 'linear-gradient(to bottom, #8e2de2, #4a00e0)'
  },
  {
    id: 'bigsur',
    name: 'Big Sur',
    darkUrl: 'linear-gradient(to bottom, #000428, #004e92)',
    lightUrl: 'linear-gradient(to bottom, #56ccf2, #2f80ed)'
  },
  {
    id: 'monterey',
    name: 'Monterey',
    darkUrl: 'linear-gradient(to bottom, #000000, #434343)',
    lightUrl: 'linear-gradient(to bottom, #e0eafc, #cfdef3)'
  },
  {
    id: 'ventura',
    name: 'Ventura',
    darkUrl: 'linear-gradient(to bottom, #232526, #414345)',
    lightUrl: 'linear-gradient(to bottom, #de6262, #ffb88c)'
  }
];

export default function WallpaperSelector({ 
  isOpen, 
  onClose, 
  onSelectWallpaper,
  currentWallpaperId
}: WallpaperSelectorProps) {
  const { theme } = useTheme();
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[hsl(var(--terminal-bg))] bg-opacity-90 backdrop-blur-md rounded-lg border border-gray-700 shadow-xl w-[600px] max-w-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-medium">Choose Wallpaper</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
        
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {defaultWallpapers.map((wallpaper) => (
              <div 
                key={wallpaper.id}
                onClick={() => {
                  onSelectWallpaper(wallpaper.id);
                  onClose();
                }}
                className={`
                  cursor-pointer rounded-md overflow-hidden border-2 transition-all
                  ${currentWallpaperId === wallpaper.id 
                    ? 'border-blue-500 shadow-lg scale-105' 
                    : 'border-transparent hover:border-gray-500'
                  }
                `}
              >
                <div 
                  className="h-24 w-full" 
                  style={{ 
                    background: theme === 'dark' ? wallpaper.darkUrl : wallpaper.lightUrl 
                  }}
                ></div>
                <div className="p-2 text-center text-sm">{wallpaper.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}