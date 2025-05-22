import { useState, useEffect } from 'react';
import Taskbar, { AppInfo } from './Taskbar';
import TerminalApp from './apps/TerminalApp';
import YoutubeApp from './apps/YoutubeApp';
import YouTubeShortsApp from './apps/YouTubeShortsApp';
import SpotifyApp from './apps/SpotifyApp';
import BrowserApp from './apps/BrowserApp';
import SettingsApp from './apps/SettingsApp';
import FileManagerApp from './apps/FileManagerApp';
import NotesApp from './apps/NotesApp';
import CalendarApp from './apps/CalendarApp';
import WeatherApp from './apps/WeatherApp';
import CalculatorApp from './apps/CalculatorApp';
import GamesApp from './apps/GamesApp';
import VPNApp from './apps/VPNApp';
import DesktopFiles from './DesktopFiles';
import LoginScreen from './LoginScreen';
import { useTheme } from './ThemeProvider';
import { 
  TerminalIcon, 
  SettingsIcon, 
  BrowserIcon, 
  MusicIcon, 
  VideoIcon,
  FileManagerIcon,
  NotesIcon,
  CalendarIcon,
  WeatherIcon,
  CalculatorIcon,
  GamesIcon,
  VPNIcon
} from './apps/AppIcons';
import { defaultWallpapers } from './WallpaperSelector';
import XenzOSLogo from './XenzOSLogo';

export default function Desktop() {
  const { theme } = useTheme();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // State for all apps
  const [terminalOpen, setTerminalOpen] = useState(true);
  const [youtubeOpen, setYoutubeOpen] = useState(false);
  const [youtubeShortsOpen, setYoutubeShortsOpen] = useState(false);
  const [spotifyOpen, setSpotifyOpen] = useState(false);
  const [browserOpen, setBrowserOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [fileManagerOpen, setFileManagerOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [weatherOpen, setWeatherOpen] = useState(false);
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [gamesOpen, setGamesOpen] = useState(false);
  const [vpnOpen, setVPNOpen] = useState(false);
  
  // State for wallpaper
  const [currentWallpaperId, setCurrentWallpaperId] = useState('default');
  
  // Check if user is logged in - use localStorage instead of cookies
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('xenzos_loggedIn');
    if (isLoggedIn === 'true') {
      setIsLoggedIn(true);
    }
  }, []);
  
  // Listen for shutdown command from terminal
  useEffect(() => {
    const handleShutdown = () => {
      // Close all apps
      setTerminalOpen(false);
      setYoutubeOpen(false);
      setSpotifyOpen(false);
      setBrowserOpen(false);
      setSettingsOpen(false);
      setFileManagerOpen(false);
      setNotesOpen(false);
      setCalendarOpen(false);
      setWeatherOpen(false);
      setCalculatorOpen(false);
      setGamesOpen(false);
      setVPNOpen(false);
    };
    
    window.addEventListener('xenzos_shutdown', handleShutdown);
    
    return () => {
      window.removeEventListener('xenzos_shutdown', handleShutdown);
    };
  }, []);

  // Load app states and preferences from cookies on mount
  useEffect(() => {
    // Only load app states if user is logged in
    if (!isLoggedIn) return;
    
    const loadAppStatesFromCookies = () => {
      const cookies = document.cookie.split('; ');
      
      const getAppState = (appId: string): boolean => {
        const cookie = cookies.find(c => c.startsWith(`${appId}Open=`));
        return cookie ? cookie.split('=')[1] === 'true' : false;
      };
      
      // Load stored state, but ensure terminal defaults to open if no cookie exists
      const terminalState = getAppState('terminal');
      setTerminalOpen(terminalState || !cookies.some(c => c.startsWith('terminalOpen=')));
      
      setYoutubeOpen(getAppState('youtube'));
      setYoutubeShortsOpen(getAppState('youtubeShorts'));
      setSpotifyOpen(getAppState('spotify'));
      setBrowserOpen(getAppState('browser'));
      setSettingsOpen(getAppState('settings'));
      setFileManagerOpen(getAppState('fileManager'));
      setNotesOpen(getAppState('notes'));
      setCalendarOpen(getAppState('calendar'));
      setWeatherOpen(getAppState('weather'));
      setCalculatorOpen(getAppState('calculator'));
      setGamesOpen(getAppState('games'));
      setVPNOpen(getAppState('vpn'));
      
      // Load wallpaper preference
      const wallpaperCookie = cookies.find(c => c.startsWith('wallpaper='));
      if (wallpaperCookie) {
        setCurrentWallpaperId(wallpaperCookie.split('=')[1]);
      }
    };
    
    loadAppStatesFromCookies();
  }, [isLoggedIn]);
  
  // Handle wallpaper change
  const handleWallpaperChange = (wallpaperId: string) => {
    setCurrentWallpaperId(wallpaperId);
    document.cookie = `wallpaper=${wallpaperId}; max-age=31536000; path=/`;
  };
  
  // Get current wallpaper
  const getCurrentWallpaper = () => {
    const wallpaper = defaultWallpapers.find(w => w.id === currentWallpaperId) || defaultWallpapers[0];
    return theme === 'dark' ? wallpaper.darkUrl : wallpaper.lightUrl;
  };
  
  // Save app state to cookies when changed
  const saveAppState = (appId: string, isOpen: boolean) => {
    document.cookie = `${appId}Open=${isOpen}; max-age=31536000; path=/`;
    return isOpen;
  };
  
  // Organize app data for the taskbar
  const apps: AppInfo[] = [
    {
      id: 'terminal',
      name: 'Terminal',
      icon: <TerminalIcon />,
      isOpen: terminalOpen,
      toggleApp: () => setTerminalOpen(prev => saveAppState('terminal', !prev))
    },
    {
      id: 'fileManager',
      name: 'Files',
      icon: <FileManagerIcon />,
      isOpen: fileManagerOpen,
      toggleApp: () => setFileManagerOpen(prev => saveAppState('fileManager', !prev))
    },
    {
      id: 'notes',
      name: 'Notes',
      icon: <NotesIcon />,
      isOpen: notesOpen,
      toggleApp: () => setNotesOpen(prev => saveAppState('notes', !prev))
    },
    {
      id: 'calendar',
      name: 'Calendar',
      icon: <CalendarIcon />,
      isOpen: calendarOpen,
      toggleApp: () => setCalendarOpen(prev => saveAppState('calendar', !prev))
    },
    {
      id: 'browser',
      name: 'Browser',
      icon: <BrowserIcon />,
      isOpen: browserOpen,
      toggleApp: () => setBrowserOpen(prev => saveAppState('browser', !prev))
    },
    {
      id: 'weather',
      name: 'Weather',
      icon: <WeatherIcon />,
      isOpen: weatherOpen,
      toggleApp: () => setWeatherOpen(prev => saveAppState('weather', !prev))
    },
    {
      id: 'calculator',
      name: 'Calculator',
      icon: <CalculatorIcon />,
      isOpen: calculatorOpen,
      toggleApp: () => setCalculatorOpen(prev => saveAppState('calculator', !prev))
    },
    {
      id: 'games',
      name: 'Games',
      icon: <GamesIcon />,
      isOpen: gamesOpen,
      toggleApp: () => setGamesOpen(prev => saveAppState('games', !prev))
    },
    {
      id: 'vpn',
      name: 'VPN',
      icon: <VPNIcon />,
      isOpen: vpnOpen,
      toggleApp: () => setVPNOpen(prev => saveAppState('vpn', !prev))
    },
    {
      id: 'youtube',
      name: 'YouTube',
      icon: <VideoIcon />,
      isOpen: youtubeOpen,
      toggleApp: () => setYoutubeOpen(prev => saveAppState('youtube', !prev))
    },
    {
      id: 'youtubeShorts',
      name: 'YT Shorts',
      icon: <VideoIcon />,
      isOpen: youtubeShortsOpen,
      toggleApp: () => setYoutubeShortsOpen(prev => saveAppState('youtubeShorts', !prev))
    },
    {
      id: 'spotify',
      name: 'Spotify',
      icon: <MusicIcon />,
      isOpen: spotifyOpen,
      toggleApp: () => setSpotifyOpen(prev => saveAppState('spotify', !prev))
    },
    {
      id: 'settings',
      name: 'Settings',
      icon: <SettingsIcon />,
      isOpen: settingsOpen,
      toggleApp: () => setSettingsOpen(prev => saveAppState('settings', !prev))
    }
  ];

  // Handle login
  const handleLogin = () => {
    setIsLoggedIn(true);
  };
  
  // Render login screen or desktop
  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }
  
  // Render desktop when logged in
  return (
    <div className="min-h-screen bg-[hsl(var(--terminal-bg))] text-[hsl(var(--terminal-text))]">
      {/* Desktop area with wallpaper */}
      <div 
        className="w-full h-screen pb-16 overflow-hidden pt-7 relative" 
        style={{
          background: getCurrentWallpaper(),
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Desktop Files */}
        <DesktopFiles />
        
        {/* Apps */}
        <TerminalApp 
          isOpen={terminalOpen} 
          onClose={() => setTerminalOpen(false)} 
        />
        
        <YoutubeApp 
          isOpen={youtubeOpen} 
          onClose={() => setYoutubeOpen(false)} 
        />
        
        <YouTubeShortsApp
          isOpen={youtubeShortsOpen}
          onClose={() => setYoutubeShortsOpen(false)}
        />
        
        <SpotifyApp 
          isOpen={spotifyOpen} 
          onClose={() => setSpotifyOpen(false)} 
        />
        
        <BrowserApp 
          isOpen={browserOpen} 
          onClose={() => setBrowserOpen(false)} 
        />
        
        <SettingsApp 
          isOpen={settingsOpen} 
          onClose={() => setSettingsOpen(false)}
          onWallpaperChange={handleWallpaperChange}
          currentWallpaperId={currentWallpaperId}
        />
        
        <FileManagerApp 
          isOpen={fileManagerOpen} 
          onClose={() => setFileManagerOpen(false)} 
        />
        
        <NotesApp
          isOpen={notesOpen}
          onClose={() => setNotesOpen(false)}
        />
        
        <CalendarApp
          isOpen={calendarOpen}
          onClose={() => setCalendarOpen(false)}
        />
        
        <WeatherApp
          isOpen={weatherOpen}
          onClose={() => setWeatherOpen(false)}
        />
        
        <CalculatorApp
          isOpen={calculatorOpen}
          onClose={() => setCalculatorOpen(false)}
        />
        
        <GamesApp
          isOpen={gamesOpen}
          onClose={() => setGamesOpen(false)}
        />
        
        <VPNApp
          isOpen={vpnOpen}
          onClose={() => setVPNOpen(false)}
        />
      </div>
      
      {/* Taskbar */}
      <Taskbar apps={apps} />
    </div>
  );
}