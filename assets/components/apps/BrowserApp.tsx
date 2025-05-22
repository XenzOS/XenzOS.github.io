import { useState, useEffect } from 'react';
import AppBase from './AppBase';

interface BrowserAppProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BookmarkItem {
  title: string;
  url: string;
  icon?: string;
}

export default function BrowserApp({ isOpen, onClose }: BrowserAppProps) {
  const [url, setUrl] = useState('https://example.com');
  const [inputUrl, setInputUrl] = useState('https://example.com');
  const [history, setHistory] = useState<string[]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Bookmarks
  const bookmarks: BookmarkItem[] = [
    { title: 'Google', url: 'https://www.google.com', icon: '🔍' },
    { title: 'Wikipedia', url: 'https://www.wikipedia.org', icon: '📚' },
    { title: 'GitHub', url: 'https://github.com', icon: '💻' },
    { title: 'News', url: 'https://news.ycombinator.com', icon: '📰' },
    { title: 'Weather', url: 'https://weather.com', icon: '🌤️' },
  ];

  // Handle navigation
  const navigateTo = (newUrl: string) => {
    setLoading(true);
    setError(null);
    
    // Make sure the URL has a protocol
    let processedUrl = newUrl;
    if (!/^https?:\/\//i.test(processedUrl)) {
      processedUrl = 'https://' + processedUrl;
    }
    
    // Add to history
    if (currentHistoryIndex !== history.length - 1) {
      // If we navigated back and then to a new URL, trim the future history
      const newHistory = history.slice(0, currentHistoryIndex + 1);
      setHistory([...newHistory, processedUrl]);
    } else {
      setHistory([...history, processedUrl]);
    }
    
    setCurrentHistoryIndex(prev => prev + 1);
    setUrl(processedUrl);
    setInputUrl(processedUrl);
    
    // Simulate loading delay
    setTimeout(() => setLoading(false), 500);
  };

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    navigateTo(inputUrl);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputUrl(e.target.value);
  };

  const goBack = () => {
    if (currentHistoryIndex > 0) {
      const newIndex = currentHistoryIndex - 1;
      setCurrentHistoryIndex(newIndex);
      setUrl(history[newIndex]);
      setInputUrl(history[newIndex]);
    }
  };

  const goForward = () => {
    if (currentHistoryIndex < history.length - 1) {
      const newIndex = currentHistoryIndex + 1;
      setCurrentHistoryIndex(newIndex);
      setUrl(history[newIndex]);
      setInputUrl(history[newIndex]);
    }
  };

  // Handle iframe load errors
  const handleIframeError = () => {
    setError('Unable to load this website. Some sites block being displayed in iframes for security reasons.');
    setLoading(false);
  };

  // Initialize with default page
  useEffect(() => {
    if (history.length === 0) {
      setHistory(['https://example.com']);
      setCurrentHistoryIndex(0);
    }
  }, [history.length]);

  return (
    <AppBase
      isOpen={isOpen}
      onClose={onClose}
      title="Web Browser"
      icon="🌐"
      width={900}
      height={700}
      initialPosition={{ x: 250, y: 80 }}
    >
      <div className="flex flex-col h-full bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
        {/* Browser toolbar */}
        <div className="p-2 border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col gap-2">
          {/* Navigation buttons and URL bar */}
          <div className="flex items-center gap-2">
            <button 
              onClick={goBack} 
              disabled={currentHistoryIndex <= 0}
              className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
              title="Go back"
            >
              ←
            </button>
            <button 
              onClick={goForward} 
              disabled={currentHistoryIndex >= history.length - 1}
              className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
              title="Go forward"
            >
              →
            </button>
            <button 
              onClick={() => navigateTo(url)} 
              className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded"
              title="Reload page"
            >
              ↻
            </button>
            
            <form onSubmit={handleNavigate} className="flex flex-1">
              <input
                type="text"
                value={inputUrl}
                onChange={handleInputChange}
                placeholder="Enter URL..."
                className="flex-1 bg-white dark:bg-gray-700 p-2 rounded-l outline-none border border-gray-300 dark:border-gray-600"
              />
              <button 
                type="submit" 
                className="bg-blue-600 text-white px-4 py-2 rounded-r"
              >
                Go
              </button>
            </form>
          </div>
          
          {/* Bookmark bar */}
          <div className="flex gap-2 overflow-x-auto py-1">
            {bookmarks.map((bookmark, index) => (
              <button 
                key={index}
                onClick={() => navigateTo(bookmark.url)}
                className="flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-sm whitespace-nowrap"
              >
                <span>{bookmark.icon}</span>
                <span>{bookmark.title}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Browser content */}
        <div className="flex-1 overflow-hidden bg-white dark:bg-gray-800 relative">
          {loading && (
            <div className="absolute inset-0 flex justify-center items-center bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-80 z-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
          
          {error ? (
            <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center">
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold mb-2">Page Cannot Be Displayed</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
              <button 
                onClick={() => navigateTo('https://example.com')}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Go to Homepage
              </button>
            </div>
          ) : (
            <iframe
              src={url}
              title="Browser"
              className="w-full h-full border-0"
              sandbox="allow-forms allow-scripts allow-same-origin"
              onError={handleIframeError}
            ></iframe>
          )}
        </div>
      </div>
    </AppBase>
  );
}