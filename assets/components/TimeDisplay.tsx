import { useState, useEffect } from "react";
import { useTheme } from "./ThemeProvider";

export default function TimeDisplay() {
  const [dateTime, setDateTime] = useState("");
  const { theme } = useTheme();

  useEffect(() => {
    // Update the time immediately
    updateDateTime();
    
    // Set up interval to update every second
    const interval = setInterval(updateDateTime, 1000);
    
    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);

  function updateDateTime() {
    const now = new Date();
    
    // Format the date and time similar to the Python version
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    setDateTime(formattedDateTime);
  }

  return (
    <div className="mb-6">
      <p className="text-gray-400 mb-1">Current Date and Time:</p>
      <p className="text-2xl md:text-3xl font-bold text-[hsl(var(--terminal-accent))] transition-all duration-500">
        {dateTime}
      </p>
    </div>
  );
}
