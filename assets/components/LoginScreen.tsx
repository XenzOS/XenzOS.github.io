import { useState, useEffect } from 'react';
import XenzOSLogo from './XenzOSLogo';

interface LoginScreenProps {
  onLogin: () => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  
  // Check if user has already registered - using localStorage
  useEffect(() => {
    const savedUsername = localStorage.getItem('xenzos_username');
    if (!savedUsername) {
      setIsNewUser(true);
    } else {
      setUsername(savedUsername);
    }
  }, []);
  
  // Update time and date
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      
      // Format time - like "9:41 AM"
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const formattedHours = hours % 12 || 12;
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const timeString = `${formattedHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
      setCurrentTime(timeString);
      
      // Format date - like "Tuesday, May 21"
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const dateString = `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}`;
      setCurrentDate(dateString);
    };
    
    updateDateTime(); // Run immediately
    const interval = setInterval(updateDateTime, 60000); // Update every minute
    
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);
  
  // Handle login form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    if (isNewUser) {
      // New user registration
      if (password.length < 4) {
        setError('Password must be at least 4 characters');
        setLoading(false);
        return;
      }
      
      // Save credentials in localStorage
      localStorage.setItem('xenzos_username', username);
      // In a real app, you would hash the password, but for this demo we'll store it in clear text
      localStorage.setItem('xenzos_password', password);
      localStorage.setItem('xenzos_loggedIn', 'true');
      
      setTimeout(() => {
        setLoading(false);
        onLogin();
      }, 1000);
    } else {
      // Existing user login
      const savedUsername = localStorage.getItem('xenzos_username');
      const savedPassword = localStorage.getItem('xenzos_password');
      
      if (username === savedUsername && password === savedPassword) {
        // Set logged in flag
        localStorage.setItem('xenzos_loggedIn', 'true');
        
        setTimeout(() => {
          setLoading(false);
          onLogin();
        }, 1000);
      } else {
        setError('Invalid username or password');
        setLoading(false);
      }
    }
  };
  
  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Mac-like blurred background with wallpaper */}
      <div 
        className="absolute inset-0 bg-cover bg-center blur-sm brightness-50" 
        style={{ 
          backgroundImage: 'url(https://wallpaperaccess.com/full/869923.jpg)',
          transform: 'scale(1.1)' // Slightly enlarge to avoid blur edge artifacts
        }}
      ></div>
      
      {/* Top status bar */}
      <div className="relative z-10 flex justify-between items-center px-6 py-2 text-white text-sm font-light">
        <div>
          <XenzOSLogo size={20} showText={true} />
        </div>
        <div className="flex items-center space-x-4">
          <span>{currentDate}</span>
          <span>{currentTime}</span>
        </div>
      </div>
      
      {/* Mac-like login screen */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        {/* User profile image */}
        <div className="mb-4 relative">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 p-1">
            <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-20 h-20 text-gray-600">
                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          {!isNewUser && (
            <div className="mt-2 text-center">
              <h2 className="text-xl font-medium text-white">{username}</h2>
            </div>
          )}
        </div>
        
        {/* Login form */}
        <form onSubmit={handleSubmit} className="w-80">
          {/* Username field only shown for new users or when switching users */}
          {(isNewUser || error) && (
            <div className="mb-4">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-white bg-opacity-20 backdrop-blur-md border border-white border-opacity-10 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-40 transition-all"
                placeholder="Username"
                required
              />
            </div>
          )}
          
          {/* Password field */}
          <div className="mb-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white bg-opacity-20 backdrop-blur-md border border-white border-opacity-10 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-40 transition-all"
              placeholder="Password"
              required
            />
          </div>
          
          {/* Error message */}
          {error && (
            <div className="mb-4 text-red-400 text-sm text-center font-medium">
              {error}
            </div>
          )}
          
          {/* Login button */}
          <div className="mb-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full px-4 py-2 rounded-lg text-white font-medium transition-all ${
                loading 
                  ? 'bg-gray-500 cursor-not-allowed' 
                  : 'bg-white bg-opacity-20 hover:bg-opacity-30 active:bg-opacity-40'
              }`}
            >
              {isNewUser ? 'Create Account' : 'Sign In'}
              {loading && <span className="ml-2 animate-pulse">...</span>}
            </button>
          </div>
          
          {/* Switch mode link */}
          <div className="text-center">
            <button
              type="button"
              className="text-sm text-blue-300 hover:text-blue-200 focus:outline-none"
              onClick={() => {
                setIsNewUser(!isNewUser);
                setError('');
              }}
            >
              {isNewUser 
                ? 'Already have an account? Sign In' 
                : 'Need an account? Create one'}
            </button>
          </div>
        </form>
      </div>
      
      {/* Power/cancel options at bottom */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center z-10">
        <div className="flex space-x-4">
          <button className="text-white bg-white bg-opacity-20 backdrop-blur-md px-4 py-2 rounded-lg hover:bg-opacity-30 transition-colors">
            Restart
          </button>
          <button className="text-white bg-white bg-opacity-20 backdrop-blur-md px-4 py-2 rounded-lg hover:bg-opacity-30 transition-colors">
            Shut Down
          </button>
        </div>
      </div>
    </div>
  );
}