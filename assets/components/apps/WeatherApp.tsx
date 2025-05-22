import { useState, useEffect } from 'react';
import AppBase from './AppBase';
import { FiCloud, FiSun, FiCloudRain, FiCloudSnow, FiCloudLightning, FiWind } from 'react-icons/fi';

interface WeatherAppProps {
  isOpen: boolean;
  onClose: () => void;
}

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  high: number;
  low: number;
  icon: React.ReactNode;
}

export default function WeatherApp({ isOpen, onClose }: WeatherAppProps) {
  const [location, setLocation] = useState('San Francisco, CA');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  // Simulate loading weather data
  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      
      // Simulate API request with timeout
      const timer = setTimeout(() => {
        // Demo weather data (in real app, this would come from a weather API)
        const demoWeather: WeatherData = {
          location: location,
          temperature: 72,
          condition: 'Partly Cloudy',
          high: 75,
          low: 65,
          icon: <FiCloud className="text-6xl" />
        };
        
        setWeather(demoWeather);
        setLoading(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, location]);

  // Get icon based on weather condition
  const getWeatherIcon = (condition: string) => {
    const lowerCondition = condition.toLowerCase();
    
    if (lowerCondition.includes('sun') || lowerCondition.includes('clear')) {
      return <FiSun className="text-yellow-400 text-6xl" />;
    } else if (lowerCondition.includes('rain')) {
      return <FiCloudRain className="text-blue-400 text-6xl" />;
    } else if (lowerCondition.includes('snow')) {
      return <FiCloudSnow className="text-blue-200 text-6xl" />;
    } else if (lowerCondition.includes('thunder') || lowerCondition.includes('lightning')) {
      return <FiCloudLightning className="text-purple-400 text-6xl" />;
    } else if (lowerCondition.includes('wind')) {
      return <FiWind className="text-gray-400 text-6xl" />;
    } else {
      return <FiCloud className="text-gray-400 text-6xl" />;
    }
  };

  // Handle location search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // In a real app, this would trigger a new API request
    setTimeout(() => {
      setWeather({
        ...weather!,
        location: location
      });
      setLoading(false);
    }, 500);
  };

  // Simulate forecast data
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const forecast = daysOfWeek.map((day, index) => {
    // Generate random temperatures for the forecast
    const temp = Math.floor(65 + Math.random() * 15);
    const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy', 'Windy'];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    
    return { day, temp, condition };
  });

  return (
    <AppBase
      isOpen={isOpen}
      onClose={onClose}
      title="Weather"
      icon="🌤️"
      width={400}
      height={500}
      initialPosition={{ x: 400, y: 100 }}
    >
      <div className="bg-gradient-to-b from-blue-500 to-blue-700 h-full rounded-b-lg overflow-hidden text-white p-4">
        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex mb-4">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter location..."
            className="flex-1 py-2 px-4 rounded-l bg-blue-600 text-white placeholder-blue-300 border-none outline-none"
          />
          <button 
            type="submit"
            className="bg-blue-800 hover:bg-blue-900 py-2 px-4 rounded-r"
          >
            Search
          </button>
        </form>
        
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : weather ? (
          <>
            {/* Current weather */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">{weather.location}</h2>
              <div className="flex justify-center items-center mb-2">
                {getWeatherIcon(weather.condition)}
              </div>
              <div className="text-5xl font-bold mb-2">{weather.temperature}°</div>
              <div className="text-xl">{weather.condition}</div>
              <div className="flex justify-center gap-4 mt-2">
                <div>H: {weather.high}°</div>
                <div>L: {weather.low}°</div>
              </div>
            </div>
            
            {/* 5-day forecast */}
            <div className="bg-blue-600 bg-opacity-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">5-Day Forecast</h3>
              <div className="grid grid-cols-5 gap-2">
                {forecast.map((day, i) => (
                  <div key={i} className="text-center py-2">
                    <div className="font-medium">{day.day}</div>
                    <div className="my-1">{getWeatherIcon(day.condition)}</div>
                    <div>{day.temp}°</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center p-8">
            <p>Unable to load weather data. Please try again.</p>
          </div>
        )}
      </div>
    </AppBase>
  );
}