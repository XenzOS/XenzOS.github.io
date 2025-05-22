import { useState, useEffect } from 'react';
import AppBase from './AppBase';
import { FiChevronLeft, FiChevronRight, FiPlus, FiTrash2 } from 'react-icons/fi';

interface CalendarAppProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Event {
  id: string;
  title: string;
  date: string;
  time?: string;
  description?: string;
}

export default function CalendarApp({ isOpen, onClose }: CalendarAppProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    title: '',
    date: '',
    time: '',
    description: ''
  });

  // Load events from localStorage
  useEffect(() => {
    const savedEvents = localStorage.getItem('xenzos_calendar_events');
    if (savedEvents) {
      try {
        setEvents(JSON.parse(savedEvents));
      } catch (e) {
        console.error('Error loading events:', e);
        setEvents([]);
      }
    } else {
      // Create some demo events
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);
      
      const demoEvents: Event[] = [
        {
          id: '1',
          title: 'Team Meeting',
          date: formatDate(today),
          time: '10:00 AM',
          description: 'Weekly sync-up with the team'
        },
        {
          id: '2',
          title: 'Project Deadline',
          date: formatDate(tomorrow),
          time: '5:00 PM',
          description: 'Submit final project files'
        }
      ];
      
      setEvents(demoEvents);
      localStorage.setItem('xenzos_calendar_events', JSON.stringify(demoEvents));
    }
  }, []);

  // Save events to localStorage when changed
  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem('xenzos_calendar_events', JSON.stringify(events));
    }
  }, [events]);

  // Navigate to previous month
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  // Navigate to next month
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Format date to YYYY-MM-DD for storage
  function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Parse date from YYYY-MM-DD format
  function parseDate(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  // Get days in month
  function getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
  }

  // Get day of week (0 = Sunday, 6 = Saturday)
  function getFirstDayOfMonth(year: number, month: number): number {
    return new Date(year, month, 1).getDay();
  }

  // Generate calendar grid data
  function generateCalendarGrid(): (number | null)[] {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    
    const calendarGrid: (number | null)[] = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      calendarGrid.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      calendarGrid.push(i);
    }
    
    return calendarGrid;
  }

  // Check if a date has events
  function hasEvents(day: number): boolean {
    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.some(event => event.date === dateString);
  }

  // Get events for a specific date
  function getEventsForDate(dateString: string): Event[] {
    return events.filter(event => event.date === dateString);
  }

  // Handle date selection
  function handleDateSelect(day: number) {
    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateString);
    setShowEventForm(false);
  }

  // Add a new event
  function handleAddEvent(e: React.FormEvent) {
    e.preventDefault();
    
    if (!newEvent.title || !selectedDate) return;
    
    const event: Event = {
      id: Date.now().toString(),
      title: newEvent.title,
      date: selectedDate,
      time: newEvent.time,
      description: newEvent.description
    };
    
    setEvents([...events, event]);
    setNewEvent({ title: '', time: '', description: '' });
    setShowEventForm(false);
  }

  // Delete an event
  function handleDeleteEvent(id: string) {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setEvents(events.filter(event => event.id !== id));
    }
  }

  // Get the name of the current month
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <AppBase
      isOpen={isOpen}
      onClose={onClose}
      title="Calendar"
      icon="📅"
      width={800}
      height={600}
      initialPosition={{ x: 250, y: 100 }}
    >
      <div className="flex h-full bg-[hsl(var(--terminal-bg))] text-[hsl(var(--terminal-text))]">
        {/* Calendar view */}
        <div className="w-2/3 border-r border-gray-700 flex flex-col">
          {/* Month navigation */}
          <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            <button 
              onClick={prevMonth}
              className="p-2 rounded-full hover:bg-gray-700"
            >
              <FiChevronLeft />
            </button>
            <h2 className="text-xl font-semibold">
              {monthNames[currentMonth]} {currentYear}
            </h2>
            <button 
              onClick={nextMonth}
              className="p-2 rounded-full hover:bg-gray-700"
            >
              <FiChevronRight />
            </button>
          </div>
          
          {/* Calendar grid */}
          <div className="flex-1 p-4">
            {/* Day headers */}
            <div className="grid grid-cols-7 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                <div key={index} className="text-center font-medium text-sm text-gray-500 py-1">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-1">
              {generateCalendarGrid().map((day, index) => (
                <div 
                  key={index}
                  className={`aspect-square flex flex-col items-center justify-center relative rounded
                    ${day === null ? 'text-gray-600' : 'cursor-pointer hover:bg-gray-800'}
                    ${day === new Date().getDate() && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear() 
                      ? 'border border-blue-500' 
                      : ''}
                    ${day !== null && selectedDate === `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` 
                      ? 'bg-blue-900 bg-opacity-50' 
                      : ''}
                  `}
                  onClick={() => day !== null && handleDateSelect(day)}
                >
                  {day !== null && (
                    <>
                      <span>{day}</span>
                      {hasEvents(day) && (
                        <div className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Event details */}
        <div className="w-1/3 flex flex-col">
          {selectedDate ? (
            <>
              {/* Selected date header */}
              <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                <h3 className="font-semibold">
                  {new Date(selectedDate).toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </h3>
                <button 
                  onClick={() => setShowEventForm(!showEventForm)}
                  className="p-2 rounded-full hover:bg-blue-600 transition-colors"
                >
                  <FiPlus />
                </button>
              </div>
              
              {/* Event form or event list */}
              <div className="flex-1 overflow-auto">
                {showEventForm ? (
                  <form onSubmit={handleAddEvent} className="p-4">
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">Event Title</label>
                      <input 
                        type="text"
                        value={newEvent.title}
                        onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                        className="w-full p-2 bg-gray-800 rounded border border-gray-700 focus:border-blue-500 outline-none"
                        placeholder="Add title"
                        required
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">Time (optional)</label>
                      <input 
                        type="text"
                        value={newEvent.time || ''}
                        onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                        className="w-full p-2 bg-gray-800 rounded border border-gray-700 focus:border-blue-500 outline-none"
                        placeholder="e.g. 3:00 PM"
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">Description (optional)</label>
                      <textarea 
                        value={newEvent.description || ''}
                        onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                        className="w-full p-2 bg-gray-800 rounded border border-gray-700 focus:border-blue-500 outline-none"
                        placeholder="Add description"
                        rows={3}
                      />
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <button 
                        type="button"
                        onClick={() => setShowEventForm(false)}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="p-4">
                    {getEventsForDate(selectedDate).length > 0 ? (
                      getEventsForDate(selectedDate).map(event => (
                        <div key={event.id} className="mb-4 p-3 bg-gray-800 rounded">
                          <div className="flex justify-between">
                            <h4 className="font-medium">{event.title}</h4>
                            <button 
                              onClick={() => handleDeleteEvent(event.id)}
                              className="text-gray-500 hover:text-red-500"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </div>
                          {event.time && (
                            <div className="text-sm text-gray-400 mt-1">{event.time}</div>
                          )}
                          {event.description && (
                            <div className="text-sm mt-2 text-gray-300">{event.description}</div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-gray-500 py-6">
                        <p>No events scheduled</p>
                        <button 
                          onClick={() => setShowEventForm(true)}
                          className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-white text-sm"
                        >
                          Add Event
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <p>Select a date to view or add events</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppBase>
  );
}