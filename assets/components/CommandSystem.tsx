import { useState, useEffect, useRef } from "react";
import { useTheme } from "./ThemeProvider";

// Define a command type
type Command = {
  name: string;
  description: string;
  execute: (args?: string[]) => string;
};

// Props for the CommandSystem component
interface CommandSystemProps {
  customCommands?: Command[];
  onMessageChange?: (newMessage: string) => void;
}

export default function CommandSystem({ customCommands = [], onMessageChange }: CommandSystemProps) {
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [inputValue, setInputValue] = useState("");
  const [commandOutput, setCommandOutput] = useState<{ input: string; output: string }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();

  // Default system commands
  const defaultCommands: Command[] = [
    {
      name: "help",
      description: "Display available commands",
      execute: () => {
        const allCommands = [...defaultCommands, ...customCommands];
        return "Available commands:\n" + allCommands.map(cmd => 
          `${cmd.name}: ${cmd.description}`
        ).join("\n");
      }
    },
    {
      name: "clear",
      description: "Clear the terminal",
      execute: () => {
        setCommandOutput([]);
        return "";
      }
    },
    {
      name: "theme",
      description: "Switch theme (light/dark)",
      execute: (args) => {
        if (args && args.length > 0) {
          const requestedTheme = args[0].toLowerCase();
          if (requestedTheme === "dark" || requestedTheme === "light") {
            setTheme(requestedTheme as "dark" | "light");
            return `Theme switched to ${requestedTheme}`;
          } else {
            return `Invalid theme: ${requestedTheme}. Available options: dark, light`;
          }
        }
        return `Current theme: ${theme}. Usage: theme [dark|light]`;
      }
    },
    {
      name: "message",
      description: "Change the displayed message",
      execute: (args) => {
        if (!args || args.length === 0) {
          return "Usage: message [your new message]";
        }
        
        const newMessage = args.join(" ");
        if (onMessageChange) {
          onMessageChange(newMessage);
          return `Message updated to: "${newMessage}"`;
        }
        return "Unable to change message";
      }
    },
    {
      name: "echo",
      description: "Display a message",
      execute: (args) => {
        return args ? args.join(" ") : "";
      }
    },
    {
      name: "date",
      description: "Display the current date and time",
      execute: () => {
        return new Date().toString();
      }
    }
  ];

  // Combine default and custom commands
  const availableCommands = [...defaultCommands, ...customCommands];

  // Focus the input field when the component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Scroll to bottom when command output changes
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [commandOutput]);

  // Handle command execution
  const executeCommand = (commandText: string) => {
    // Add to history
    setCommandHistory(prev => [...prev, commandText]);
    
    // Parse the command
    const args = commandText.trim().split(" ");
    const commandName = args.shift()?.toLowerCase() || "";
    
    // Find the command
    const command = availableCommands.find(cmd => cmd.name === commandName);
    
    let output: string;
    if (command) {
      output = command.execute(args);
    } else if (commandName === "") {
      output = "";
    } else {
      output = `Command not found: ${commandName}. Type 'help' to see available commands.`;
    }

    // Add to output
    if (commandName !== "clear") {
      setCommandOutput(prev => [...prev, { input: commandText, output }]);
    }
    
    // Clear input
    setInputValue("");
  };

  // Navigate through command history
  const navigateHistory = (direction: 'up' | 'down') => {
    if (commandHistory.length === 0) return;
    
    if (direction === 'up') {
      // Navigate up (older commands)
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInputValue(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else {
      // Navigate down (newer commands)
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInputValue(newIndex === 0 ? '' : commandHistory[commandHistory.length - 1 - newIndex]);
      } else {
        setHistoryIndex(-1);
        setInputValue('');
      }
    }
  };

  // Handle key presses for history navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      navigateHistory('up');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      navigateHistory('down');
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      executeCommand(inputValue);
      setHistoryIndex(-1); // Reset history index after execution
    }
  };

  return (
    <div className="mt-4 border-t border-gray-700 pt-4">
      <div 
        ref={outputRef}
        className="mb-4 h-48 overflow-y-auto text-sm" 
        style={{ scrollBehavior: 'smooth' }}
      >
        {commandOutput.map((cmd, index) => (
          <div key={index} className="mb-2">
            <div className="flex">
              <span className="text-terminal-accent mr-2">$</span>
              <span>{cmd.input}</span>
            </div>
            <div className="pl-4 whitespace-pre-line">{cmd.output}</div>
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="flex items-center">
        <span className="text-terminal-accent mr-2">$</span>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-none outline-none focus:ring-0"
          placeholder="Type 'help' for available commands..."
          aria-label="Command input"
        />
      </form>
    </div>
  );
}