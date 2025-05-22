import { useState } from 'react';
import AppBase from './AppBase';

interface YoutubeAppProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function YoutubeApp({ isOpen, onClose }: YoutubeAppProps) {
  const [url, setUrl] = useState('https://www.youtube.com/embed/dQw4w9WgXcQ');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Convert the search term to a YouTube search URL that works in embed mode
      setUrl(`https://www.youtube.com/embed/?listType=search&list=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <AppBase
      isOpen={isOpen}
      onClose={onClose}
      title="YouTube"
      icon="🎬"
      width={800}
      height={600}
      initialPosition={{ x: 150, y: 150 }}
    >
      <div className="flex flex-col h-full bg-[hsl(var(--terminal-bg))] text-[hsl(var(--terminal-text))]">
        <div className="p-2 border-b border-gray-700">
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              placeholder="Search YouTube..."
              className="flex-1 bg-gray-800 text-white p-2 rounded-l outline-none border border-gray-700"
            />
            <button 
              type="submit" 
              className="bg-red-600 text-white px-4 py-2 rounded-r"
            >
              Search
            </button>
          </form>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <iframe
            src={url}
            title="YouTube"
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </AppBase>
  );
}