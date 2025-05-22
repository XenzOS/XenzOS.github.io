import { useState, useEffect } from 'react';
import AppBase from './AppBase';
import { useTheme } from '../ThemeProvider';
import WallpaperSelector, { defaultWallpapers } from '../WallpaperSelector';
import { FiMonitor } from 'react-icons/fi';

interface SettingsAppProps {
  isOpen: boolean;
  onClose: () => void;
  onWallpaperChange: (wallpaperId: string) => void;
  currentWallpaperId: string;
}

export default function SettingsApp({ 
  isOpen, 
  onClose, 
  onWallpaperChange,
  currentWallpaperId 
}: SettingsAppProps) {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'appearance' | 'desktop' | 'about'>('appearance');
  const [wallpaperSelectorOpen, setWallpaperSelectorOpen] = useState(false);

  // Sample accent colors
  const accentColors = [
    { name: 'Green', value: '120 60% 50%', class: 'bg-green-500' },
    { name: 'Blue', value: '210 100% 50%', class: 'bg-blue-500' },
    { name: 'Purple', value: '270 100% 50%', class: 'bg-purple-500' },
    { name: 'Pink', value: '330 100% 60%', class: 'bg-pink-500' },
    { name: 'Red', value: '0 100% 50%', class: 'bg-red-500' },
    { name: 'Orange', value: '30 100% 50%', class: 'bg-orange-500' },
  ];

  // Function to change accent color
  const changeAccentColor = (color: string) => {
    document.documentElement.style.setProperty('--terminal-accent', color);
    localStorage.setItem('accentColor', color);
  };
  
  // Load accent color from localStorage on mount
  useEffect(() => {
    const savedColor = localStorage.getItem('accentColor');
    if (savedColor) {
      document.documentElement.style.setProperty('--terminal-accent', savedColor);
    }
  }, []);

  // Get current wallpaper preview
  const getCurrentWallpaper = () => {
    const wallpaper = defaultWallpapers.find(w => w.id === currentWallpaperId) || defaultWallpapers[0];
    return theme === 'dark' ? wallpaper.darkUrl : wallpaper.lightUrl;
  };

  return (
    <>
      <AppBase
        isOpen={isOpen}
        onClose={onClose}
        title="Settings"
        icon="⚙️"
        width={700}
        height={500}
        initialPosition={{ x: 150, y: 150 }}
      >
        <div className="flex h-full bg-[hsl(var(--terminal-bg))] text-[hsl(var(--terminal-text))]">
          {/* Sidebar */}
          <div className="w-48 border-r border-gray-700">
            <div className="p-4 font-bold text-lg">Settings</div>
            <div className="border-t border-gray-700">
              <button 
                className={`w-full text-left px-4 py-2 ${activeTab === 'appearance' ? 'bg-[hsl(var(--primary))] bg-opacity-20' : 'hover:bg-gray-800'}`}
                onClick={() => setActiveTab('appearance')}
              >
                Appearance
              </button>
              <button 
                className={`w-full text-left px-4 py-2 ${activeTab === 'desktop' ? 'bg-[hsl(var(--primary))] bg-opacity-20' : 'hover:bg-gray-800'}`}
                onClick={() => setActiveTab('desktop')}
              >
                Desktop
              </button>
              <button 
                className={`w-full text-left px-4 py-2 ${activeTab === 'about' ? 'bg-[hsl(var(--primary))] bg-opacity-20' : 'hover:bg-gray-800'}`}
                onClick={() => setActiveTab('about')}
              >
                About
              </button>
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === 'appearance' && (
              <div>
                <h2 className="text-xl font-bold mb-6">Appearance</h2>
                
                {/* Theme setting */}
                <div className="mb-6">
                  <h3 className="text-md font-semibold mb-3">Theme</h3>
                  <div className="flex space-x-4">
                    <button
                      className={`px-4 py-2 rounded ${theme === 'light' ? 'bg-[hsl(var(--primary))] text-white' : 'bg-gray-800'}`}
                      onClick={() => setTheme('light')}
                    >
                      Light
                    </button>
                    <button
                      className={`px-4 py-2 rounded ${theme === 'dark' ? 'bg-[hsl(var(--primary))] text-white' : 'bg-gray-800'}`}
                      onClick={() => setTheme('dark')}
                    >
                      Dark
                    </button>
                  </div>
                </div>
                
                {/* Accent Color */}
                <div>
                  <h3 className="text-md font-semibold mb-3">Accent Color</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {accentColors.map((color) => (
                      <button
                        key={color.name}
                        className="flex items-center p-2 rounded hover:bg-gray-800"
                        onClick={() => changeAccentColor(color.value)}
                      >
                        <div className={`w-6 h-6 rounded-full mr-2 ${color.class}`}></div>
                        {color.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'desktop' && (
              <div>
                <h2 className="text-xl font-bold mb-6">Desktop</h2>
                
                {/* Wallpaper setting */}
                <div className="mb-6">
                  <h3 className="text-md font-semibold mb-3">Wallpaper</h3>
                  
                  <div className="flex space-x-4 mb-4">
                    <div 
                      className="w-48 h-36 rounded-md overflow-hidden cursor-pointer border border-gray-700"
                      onClick={() => setWallpaperSelectorOpen(true)}
                      style={{ 
                        background: getCurrentWallpaper(),
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    ></div>
                    
                    <div className="flex flex-col justify-center">
                      <p className="mb-3 text-sm text-gray-400">
                        Click on the preview to change wallpaper
                      </p>
                      <button
                        className="flex items-center px-4 py-2 bg-gray-800 rounded hover:bg-gray-700"
                        onClick={() => setWallpaperSelectorOpen(true)}
                      >
                        <FiMonitor className="mr-2" />
                        Choose Wallpaper
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'about' && (
              <div>
                <h2 className="text-xl font-bold mb-6">About</h2>
                <p className="mb-4">𝕏OS v1.0</p>
                <p className="mb-4">A web-based desktop environment with multiple applications.</p>
                <p className="mb-2">Features:</p>
                <ul className="list-disc ml-5 mb-4">
                  <li>Terminal with command system</li>
                  <li>Multiple applications (Terminal, YouTube, Spotify, Browser)</li>
                  <li>Draggable windows with macOS-style controls</li>
                  <li>Theme and wallpaper customization</li>
                  <li>macOS-inspired dock with app indicators</li>
                </ul>
                <p className="text-sm text-gray-400 mt-8">© 2025 𝕏OS</p>
              </div>
            )}
          </div>
        </div>
      </AppBase>
      
      {/* Wallpaper selector modal */}
      <WallpaperSelector 
        isOpen={wallpaperSelectorOpen}
        onClose={() => setWallpaperSelectorOpen(false)}
        onSelectWallpaper={onWallpaperChange}
        currentWallpaperId={currentWallpaperId}
      />
    </>
  );
}