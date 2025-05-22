import { useState } from 'react';
import AppBase from './AppBase';

interface SpotifyAppProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SpotifyItem {
  id: string;
  title: string;
  type: 'playlist' | 'album' | 'track' | 'artist';
}

export default function SpotifyApp({ isOpen, onClose }: SpotifyAppProps) {
  const [embedId, setEmbedId] = useState('37i9dQZEVXcJZyENOWUFo7');
  const [embedType, setEmbedType] = useState<'playlist' | 'album' | 'track' | 'artist'>('playlist');
  const [searchTerm, setSearchTerm] = useState('');

  // Spotify featured content
  const featuredItems: SpotifyItem[] = [
    { id: '37i9dQZEVXcJZyENOWUFo7', title: 'Today\'s Top Hits', type: 'playlist' },
    { id: '37i9dQZF1DXcBWIGoYBM5M', title: 'Hot Hits USA', type: 'playlist' },
    { id: '37i9dQZF1DX0XUsuxWHRQd', title: 'Rap Caviar', type: 'playlist' },
    { id: '37i9dQZF1DX4dyzvuaRJ0n', title: 'Lo-Fi Beats', type: 'playlist' },
    { id: '37i9dQZF1DWXRqgorJj26U', title: 'Rock Classics', type: 'playlist' },
    { id: '37i9dQZF1DX4o1oenSJRJd', title: 'All Out 90s', type: 'playlist' }
  ];

  const handleItemClick = (item: SpotifyItem) => {
    setEmbedId(item.id);
    setEmbedType(item.type);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would search the Spotify API
    // For now, we'll just show a message
    alert('Note: Spotify search requires API authentication. This is a demo with pre-selected playlists.');
  };

  return (
    <AppBase
      isOpen={isOpen}
      onClose={onClose}
      title="Spotify"
      icon="🎵"
      width={750}
      height={600}
      initialPosition={{ x: 200, y: 120 }}
    >
      <div className="flex flex-col h-full bg-[#121212] text-white">
        <div className="p-3 bg-[#1DB954] text-white flex justify-between items-center">
          <h2 className="text-lg font-bold">Spotify Web Player</h2>
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Spotify..."
              className="bg-white text-black px-2 py-1 rounded-l outline-none"
            />
            <button 
              type="submit" 
              className="bg-[#191414] text-white px-3 py-1 rounded-r"
            >
              Search
            </button>
          </form>
        </div>
        
        <div className="flex h-[calc(100%-52px)]">
          {/* Sidebar */}
          <div className="w-1/4 bg-[#191414] p-3 overflow-y-auto">
            <h3 className="text-sm uppercase font-bold mb-3 text-gray-300">Featured Playlists</h3>
            <ul>
              {featuredItems.map(item => (
                <li 
                  key={item.id}
                  className="py-2 px-3 hover:bg-[#282828] cursor-pointer rounded mb-1 text-sm"
                  onClick={() => handleItemClick(item)}
                >
                  {item.title}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Main content / Player */}
          <div className="flex-1 overflow-hidden">
            <iframe
              src={`https://open.spotify.com/embed/${embedType}/${embedId}?utm_source=generator`}
              width="100%"
              height="100%"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title="Spotify Player"
            ></iframe>
          </div>
        </div>
      </div>
    </AppBase>
  );
}