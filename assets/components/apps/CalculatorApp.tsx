import { useState } from 'react';
import AppBase from './AppBase';

interface CalculatorAppProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CalculatorApp({ isOpen, onClose }: CalculatorAppProps) {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const clearAll = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const performOperation = (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operator) {
      const currentValue = previousValue || 0;
      let newValue = 0;

      switch (operator) {
        case '+':
          newValue = currentValue + inputValue;
          break;
        case '-':
          newValue = currentValue - inputValue;
          break;
        case '×':
          newValue = currentValue * inputValue;
          break;
        case '÷':
          newValue = currentValue / inputValue;
          break;
        default:
          break;
      }

      setPreviousValue(newValue);
      setDisplay(String(newValue));
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  const handleEquals = () => {
    if (!operator || previousValue === null) return;
    performOperation('=');
    setOperator(null);
  };

  return (
    <AppBase
      isOpen={isOpen}
      onClose={onClose}
      title="Calculator"
      icon="🧮"
      width={300}
      height={400}
      initialPosition={{ x: 600, y: 200 }}
    >
      <div className="flex flex-col h-full bg-gray-800 rounded-b-lg">
        {/* Display */}
        <div className="bg-gray-900 p-4 text-right text-2xl font-mono rounded-t-lg">
          {display}
        </div>

        {/* Keypad */}
        <div className="flex-1 grid grid-cols-4 gap-1 p-2 text-xl font-semibold">
          {/* Row 1 */}
          <button 
            className="bg-gray-700 hover:bg-gray-600 rounded p-2"
            onClick={clearAll}
          >
            AC
          </button>
          <button 
            className="bg-gray-700 hover:bg-gray-600 rounded p-2"
            onClick={() => setDisplay(display.charAt(0) === '-' ? display.substring(1) : '-' + display)}
          >
            +/-
          </button>
          <button 
            className="bg-gray-700 hover:bg-gray-600 rounded p-2"
            onClick={() => setDisplay(String(parseFloat(display) / 100))}
          >
            %
          </button>
          <button 
            className="bg-amber-500 hover:bg-amber-400 text-white rounded p-2"
            onClick={() => performOperation('÷')}
          >
            ÷
          </button>

          {/* Row 2 */}
          <button 
            className="bg-gray-600 hover:bg-gray-500 rounded p-2"
            onClick={() => inputDigit('7')}
          >
            7
          </button>
          <button 
            className="bg-gray-600 hover:bg-gray-500 rounded p-2"
            onClick={() => inputDigit('8')}
          >
            8
          </button>
          <button 
            className="bg-gray-600 hover:bg-gray-500 rounded p-2"
            onClick={() => inputDigit('9')}
          >
            9
          </button>
          <button 
            className="bg-amber-500 hover:bg-amber-400 text-white rounded p-2"
            onClick={() => performOperation('×')}
          >
            ×
          </button>

          {/* Row 3 */}
          <button 
            className="bg-gray-600 hover:bg-gray-500 rounded p-2"
            onClick={() => inputDigit('4')}
          >
            4
          </button>
          <button 
            className="bg-gray-600 hover:bg-gray-500 rounded p-2"
            onClick={() => inputDigit('5')}
          >
            5
          </button>
          <button 
            className="bg-gray-600 hover:bg-gray-500 rounded p-2"
            onClick={() => inputDigit('6')}
          >
            6
          </button>
          <button 
            className="bg-amber-500 hover:bg-amber-400 text-white rounded p-2"
            onClick={() => performOperation('-')}
          >
            -
          </button>

          {/* Row 4 */}
          <button 
            className="bg-gray-600 hover:bg-gray-500 rounded p-2"
            onClick={() => inputDigit('1')}
          >
            1
          </button>
          <button 
            className="bg-gray-600 hover:bg-gray-500 rounded p-2"
            onClick={() => inputDigit('2')}
          >
            2
          </button>
          <button 
            className="bg-gray-600 hover:bg-gray-500 rounded p-2"
            onClick={() => inputDigit('3')}
          >
            3
          </button>
          <button 
            className="bg-amber-500 hover:bg-amber-400 text-white rounded p-2"
            onClick={() => performOperation('+')}
          >
            +
          </button>

          {/* Row 5 */}
          <button 
            className="bg-gray-600 hover:bg-gray-500 col-span-2 rounded p-2"
            onClick={() => inputDigit('0')}
          >
            0
          </button>
          <button 
            className="bg-gray-600 hover:bg-gray-500 rounded p-2"
            onClick={inputDecimal}
          >
            .
          </button>
          <button 
            className="bg-amber-500 hover:bg-amber-400 text-white rounded p-2"
            onClick={handleEquals}
          >
            =
          </button>
        </div>
      </div>
    </AppBase>
  );
}