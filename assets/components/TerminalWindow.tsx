import TimeDisplay from "./TimeDisplay";
import MessageDisplay from "./MessageDisplay";
import CommandSystem from "./CommandSystem";
import { useState, useEffect } from "react";

export interface TerminalWindowProps {
  isDraggable?: boolean;
  onOpenDraggable?: () => void;
  onCloseDraggable?: () => void;
}

export default function TerminalWindow({ 
  isDraggable = false, 
  onOpenDraggable, 
  onCloseDraggable 
}: TerminalWindowProps) {
  // State for the terminal message
  const [message, setMessage] = useState("Welcome To XenzOS");
  const [history, setHistory] = useState<string[]>([]);
  
  // Define custom commands that users can extend
  const [customCommands, setCustomCommands] = useState<Command[]>([
    {
      name: "hello",
      description: "Say hello to the user",
      execute: () => "Hello there! Welcome to the terminal.",
    },
    {
      name: "about",
      description: "Show information about this application",
      execute: () => "This is XenzOS - A modern desktop operating system in your browser.",
    },
    {
      name: "help",
      description: "Display available commands",
      execute: (): string => {
        const allCommands: Command[] = [
          ...customCommands,
          { name: "clear", description: "Clear the terminal", execute: () => "" },
          { name: "echo", description: "Print text to the terminal", execute: () => "" },
          { name: "date", description: "Display the current date and time", execute: () => "" },
          { name: "history", description: "Show command history", execute: () => "" },
          { name: "whoami", description: "Display current user", execute: () => "" },
          { name: "logout", description: "Log out of the system", execute: () => "" },
          { name: "shutdown", description: "Shut down all applications", execute: () => "" }
        ];
        
        return "Available commands:\n" + allCommands
          .sort((a: Command, b: Command) => a.name.localeCompare(b.name))
          .map((cmd: Command) => `  ${cmd.name.padEnd(10)} - ${cmd.description}`)
          .join("\n");
      },
    },
    {
      name: "date",
      description: "Display the current date and time",
      execute: () => new Date().toLocaleString(),
    },
    {
      name: "history",
      description: "Show command history",
      execute: () => {
        if (history.length === 0) return "No command history";
        return history.map((cmd, i) => `${i + 1}: ${cmd}`).join("\n");
      },
    },
    {
      name: "whoami",
      description: "Display current user",
      execute: () => {
        const username = localStorage.getItem("xenzos_username");
        return username ? username : "Guest";
      },
    },
    {
      name: "logout",
      description: "Log out of the system",
      execute: () => {
        localStorage.removeItem("xenzos_username");
        localStorage.removeItem("xenzos_password");
        localStorage.removeItem("xenzos_loggedIn");
        window.location.reload();
        return "Logging out...";
      },
    },
    {
      name: "shutdown",
      description: "Shut down all applications",
      execute: () => {
        // This will be handled in the command system
        window.dispatchEvent(new CustomEvent('xenzos_shutdown'));
        return "Shutting down all applications...";
      },
    }
  ]);

  // Add the drag command when component mounts
  useEffect(() => {
    // Create the drag command
    const dragCommand = {
      name: "drag",
      description: "Toggle draggable window mode",
      execute: () => {
        if (isDraggable && onCloseDraggable) {
          onCloseDraggable();
          return "Exiting draggable mode";
        } else if (onOpenDraggable) {
          onOpenDraggable();
          return "Entering draggable mode. You can now drag this window around!";
        }
        return "Unable to toggle draggable mode";
      }
    };

    // Add the drag command to custom commands
    setCustomCommands(prev => {
      // Check if the command already exists
      if (!prev.some(cmd => cmd.name === "drag")) {
        return [...prev, dragCommand];
      }
      return prev;
    });
  }, [isDraggable, onOpenDraggable, onCloseDraggable]);

  // Record command history
  const recordHistory = (command: string) => {
    setHistory(prev => [...prev, command]);
  };

  // Handle message change from commands
  const handleMessageChange = (newMessage: string) => {
    setMessage(newMessage);
  };

  return (
    <div className={`w-full ${!isDraggable ? 'max-w-lg' : ''} bg-transparent border-0 shadow-none p-4 text-[hsl(var(--terminal-text))]`}>
      {!isDraggable && (
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
            <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
          </div>
          <div className="border-b border-gray-700 pb-4">
            <p className="text-xs text-gray-500">terminal</p>
          </div>
        </div>
      )}
      
      <TimeDisplay />
      <MessageDisplay message={message} />
      <CommandSystem 
        customCommands={customCommands} 
        onMessageChange={handleMessageChange} 
      />
    </div>
  );
}
