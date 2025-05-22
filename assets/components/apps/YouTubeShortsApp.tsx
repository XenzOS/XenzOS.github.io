import { useState, useRef, useEffect } from 'react';
import AppBase from './AppBase';
import { FiChevronUp, FiChevronDown, FiHeart, FiMessageSquare, FiShare2 } from 'react-icons/fi';

interface YouTubeShortsAppProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Short {
  id: string;
  embedUrl: string;
  title: string;
  channel: string;
  likes: string;
  comments: string;
}

export default function YouTubeShortsApp({ isOpen, onClose }: YouTubeShortsAppProps) {
  const [currentShortIndex, setCurrentShortIndex] = useState(0);
  const [likedShorts, setLikedShorts] = useState<Set<string>>(new Set());
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Demo shorts list - in a real app, this would come from the YouTube API
  const shorts: Short[] = [
    {
      id: '1',
      embedUrl: 'https://www.youtube.com/embed/bOkq5SbOBUo?autoplay=1&controls=0&loop=1&rel=0&showinfo=0&mute=0',
      title: 'Amazing sunset at the beach',
      channel: 'Nature Clips',
      likes: '323K',
      comments: '1.2K',
    },
    {
      id: '2',
      embedUrl: 'https://www.youtube.com/embed/EngW7tLk6R8?autoplay=1&controls=0&loop=1&rel=0&showinfo=0&mute=0',
      title: 'Quick cooking hack you need to know',
      channel: 'Food Tips',
      likes: '142K',
      comments: '921',
    },
    {
      id: '3',
      embedUrl: 'https://www.youtube.com/embed/J7MYJ8Kxhwc?autoplay=1&controls=0&loop=1&rel=0&showinfo=0&mute=0',
      title: 'This dog has an amazing talent',
      channel: 'Cute Pets',
      likes: '2.1M',
      comments: '45K',
    },
    {
      id: '4',
      embedUrl: 'https://www.youtube.com/embed/Z3H1PkI9gTw?autoplay=1&controls=0&loop=1&rel=0&showinfo=0&mute=0',
      title: 'Mind-blowing science experiment',
      channel: 'Science Now',
      likes: '567K',
      comments: '3.4K',
    },
    {
      id: '5',
      embedUrl: 'https://www.youtube.com/embed/lJoNVUkq3Fs?autoplay=1&controls=0&loop=1&rel=0&showinfo=0&mute=0',
      title: 'Coolest dance move of 2023',
      channel: 'Dance Trends',
      likes: '875K',
      comments: '5.6K',
    },
  ];

  // Handle scrolling to next/previous short
  const navigateToShort = (direction: 'next' | 'prev') => {
    if (direction === 'next' && currentShortIndex < shorts.length - 1) {
      setCurrentShortIndex(currentShortIndex + 1);
    } else if (direction === 'prev' && currentShortIndex > 0) {
      setCurrentShortIndex(currentShortIndex - 1);
    }
  };

  // Handle wheel scrolling
  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY > 0) {
      navigateToShort('next');
    } else {
      navigateToShort('prev');
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === 'ArrowDown') {
        navigateToShort('next');
      } else if (e.key === 'ArrowUp') {
        navigateToShort('prev');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, currentShortIndex]);

  // Toggle like for current short
  const toggleLike = (shortId: string) => {
    setLikedShorts(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(shortId)) {
        newLiked.delete(shortId);
      } else {
        newLiked.add(shortId);
      }
      return newLiked;
    });
  };

  // Current short being displayed
  const currentShort = shorts[currentShortIndex];

  return (
    <AppBase
      isOpen={isOpen}
      onClose={onClose}
      title="YouTube Shorts"
      icon="📱"
      width={400}
      height={700}
      initialPosition={{ x: 300, y: 50 }}
    >
      <div 
        className="flex flex-col h-full bg-black text-white"
        ref={scrollContainerRef}
        onWheel={handleWheel}
      >
        {/* Navigation indicators */}
        <div className="absolute top-2 right-2 z-20 flex flex-col items-center bg-black bg-opacity-50 rounded-full px-2 py-1">
          <span className="text-xs font-medium">{currentShortIndex + 1}/{shorts.length}</span>
        </div>

        {/* Short video with overlay controls */}
        <div className="relative flex-1 overflow-hidden">
          {/* The iframe for the current short */}
          <iframe
            src={currentShort.embedUrl}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>

          {/* Overlay for navigation */}
          <div className="absolute inset-0 flex pointer-events-none">
            {/* Left half for previous */}
            <div 
              className="w-1/2 h-full flex items-center justify-start pl-4 cursor-pointer pointer-events-auto"
              onClick={() => navigateToShort('prev')}
            >
              {currentShortIndex > 0 && (
                <div className="bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition-all">
                  <FiChevronUp className="text-white text-2xl" />
                </div>
              )}
            </div>
            
            {/* Right half for next */}
            <div 
              className="w-1/2 h-full flex items-center justify-end pr-4 cursor-pointer pointer-events-auto"
              onClick={() => navigateToShort('next')}
            >
              {currentShortIndex < shorts.length - 1 && (
                <div className="bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition-all">
                  <FiChevronDown className="text-white text-2xl" />
                </div>
              )}
            </div>
          </div>

          {/* Interaction sidebar */}
          <div className="absolute right-2 bottom-20 flex flex-col space-y-6 items-center">
            <button 
              className="bg-black bg-opacity-50 rounded-full p-3 hover:bg-opacity-70 transition-all"
              onClick={() => toggleLike(currentShort.id)}
            >
              <FiHeart 
                className={`text-2xl ${likedShorts.has(currentShort.id) ? 'text-red-500 fill-current' : 'text-white'}`} 
              />
              <span className="text-xs block mt-1">{currentShort.likes}</span>
            </button>
            
            <button className="bg-black bg-opacity-50 rounded-full p-3 hover:bg-opacity-70 transition-all">
              <FiMessageSquare className="text-2xl text-white" />
              <span className="text-xs block mt-1">{currentShort.comments}</span>
            </button>
            
            <button className="bg-black bg-opacity-50 rounded-full p-3 hover:bg-opacity-70 transition-all">
              <FiShare2 className="text-2xl text-white" />
              <span className="text-xs block mt-1">Share</span>
            </button>
          </div>

          {/* Title and channel info */}
          <div className="absolute bottom-4 left-0 right-12 p-3 bg-gradient-to-t from-black to-transparent pointer-events-none">
            <h3 className="font-bold text-sm">{currentShort.title}</h3>
            <p className="text-xs text-gray-300">@{currentShort.channel}</p>
          </div>
        </div>

        {/* Simple navigation controls */}
        <div className="flex justify-between items-center p-3 bg-gray-900">
          <button 
            onClick={() => navigateToShort('prev')}
            disabled={currentShortIndex === 0}
            className={`px-4 py-1 rounded-full flex items-center ${
              currentShortIndex === 0 ? 'bg-gray-800 text-gray-500' : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            <FiChevronUp className="mr-1" /> Previous
          </button>
          
          <button 
            onClick={() => navigateToShort('next')}
            disabled={currentShortIndex === shorts.length - 1}
            className={`px-4 py-1 rounded-full flex items-center ${
              currentShortIndex === shorts.length - 1 ? 'bg-gray-800 text-gray-500' : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            Next <FiChevronDown className="ml-1" />
          </button>
        </div>
      </div>
    </AppBase>
  );
}