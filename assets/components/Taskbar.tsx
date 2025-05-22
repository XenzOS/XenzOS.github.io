import { useState, useEffect } from 'react';
import XenzOSLogo from './XenzOSLogo';

export interface AppInfo {
  id: string;
  name: string;
  icon: React.ReactNode;
  isOpen: boolean;
  toggleApp: () => void;
}

interface TaskbarProps {
  apps: AppInfo[];
}

export default function Taskbar({ apps }: TaskbarProps) {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  
  // Update clock and date
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      
      // Format time
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const formattedHours = hours % 12 || 12;
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const timeString = `${formattedHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
      setCurrentTime(timeString);
      
      // Format date - like "Tue May 21"
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const dateString = `${days[now.getDay()]} ${months[now.getMonth()]} ${now.getDate()}`;
      setCurrentDate(dateString);
    };
    
    updateDateTime(); // Run immediately
    const interval = setInterval(updateDateTime, 60000); // Update every minute
    
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[999]">
      {/* macOS-like dock - always visible with scrolling */}
      <div className="flex justify-center mb-2">
        <div className="bg-[hsl(var(--terminal-bg))] bg-opacity-80 backdrop-blur-md rounded-2xl px-2 py-1 border border-gray-700 border-opacity-40 shadow-lg flex items-center z-[1000]">
          {/* Left scroll button */}
          <div className="px-1 py-4">
            <button 
              className="text-white bg-gray-800 bg-opacity-60 rounded-full p-1 hover:bg-opacity-90 transition-all"
              onClick={() => {
                const container = document.getElementById('app-dock-container');
                if (container) {
                  container.scrollBy({ left: -200, behavior: 'smooth' });
                }
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>
          
          {/* App icons in scrollable container */}
          <div 
            id="app-dock-container"
            className="flex items-center space-x-1 md:space-x-2 overflow-x-auto max-w-[500px] md:max-w-[700px] scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {apps.map((app) => (
              <div 
                key={app.id}
                onClick={app.toggleApp}
                className="group relative flex-shrink-0"
              >
                <div className={`
                  flex items-center justify-center w-12 h-12 rounded-xl cursor-pointer
                  transition-all duration-200 hover:scale-110
                  ${app.isOpen 
                    ? 'bg-white dark:bg-gray-800 bg-opacity-20' 
                    : 'hover:bg-white hover:bg-opacity-10'
                  }
                `}>
                  <div className="flex items-center justify-center text-xl">{app.icon}</div>
                </div>
                
                {/* App name tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-900 bg-opacity-90 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                  {app.name}
                </div>
                
                {/* Indicator dot for running apps */}
                {app.isOpen && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-white mb-0.5"></div>
                )}
              </div>
            ))}
          </div>
          
          {/* Right scroll button */}
          <div className="px-1 py-4">
            <button 
              className="text-white bg-gray-800 bg-opacity-60 rounded-full p-1 hover:bg-opacity-90 transition-all"
              onClick={() => {
                const container = document.getElementById('app-dock-container');
                if (container) {
                  container.scrollBy({ left: 200, behavior: 'smooth' });
                }
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* macOS-like top menu bar */}
      <div className="fixed top-0 left-0 right-0 bg-[hsl(var(--terminal-bg))] bg-opacity-60 backdrop-blur-md h-7 flex items-center justify-between px-4 z-50 border-b border-gray-700 border-opacity-20">
        <div className="flex items-center space-x-4">
          {/* XenzOS logo */}
          <div className="flex items-center">
            <div className="text-[hsl(var(--terminal-text))] font-semibold flex items-center gap-1">
              <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">X</div>
              <span>XenzOS</span>
            </div>
          </div>
          
          {/* Menu items */}
          <div className="text-xs text-[hsl(var(--terminal-text))] opacity-80">File</div>
          <div className="text-xs text-[hsl(var(--terminal-text))] opacity-80">Edit</div>
          <div className="text-xs text-[hsl(var(--terminal-text))] opacity-80">View</div>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Status icons */}
          <div className="text-xs text-[hsl(var(--terminal-text))] opacity-80">{currentDate}</div>
          <div className="text-xs text-[hsl(var(--terminal-text))] opacity-80">{currentTime}</div>
        </div>
      </div>
    </div>
  );
}