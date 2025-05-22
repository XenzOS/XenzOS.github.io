import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export default function XenzOSLogo({ size = 40, className = '', showText = false }: LogoProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <div 
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        {/* Modern hexagonal shape with 3D effect */}
        <div 
          className="absolute inset-0"
          style={{
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed, #8b5cf6)',
            boxShadow: '0 10px 20px rgba(79, 70, 229, 0.4)'
          }}
        ></div>
        
        {/* Inner hexagon */}
        <div 
          className="absolute"
          style={{
            top: size * 0.15,
            left: size * 0.15,
            right: size * 0.15,
            bottom: size * 0.15,
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            background: 'linear-gradient(135deg, #312e81, #4338ca)',
            boxShadow: 'inset 0 2px 6px rgba(0, 0, 0, 0.3)'
          }}
        ></div>
        
        {/* X letter with modern style */}
        <div 
          className="relative text-white font-bold flex items-center justify-center"
          style={{
            fontSize: size * 0.5,
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
            fontFamily: 'Arial, sans-serif',
            fontWeight: 900
          }}
        >
          X
        </div>
        
        {/* Accent dots */}
        <div 
          className="absolute rounded-full bg-white"
          style={{
            width: size * 0.08,
            height: size * 0.08,
            top: size * 0.15,
            right: size * 0.26,
            opacity: 0.8,
            boxShadow: '0 0 5px rgba(255, 255, 255, 0.8)'
          }}
        ></div>
        
        <div 
          className="absolute rounded-full bg-white"
          style={{
            width: size * 0.05,
            height: size * 0.05,
            top: size * 0.24,
            right: size * 0.18,
            opacity: 0.6,
            boxShadow: '0 0 3px rgba(255, 255, 255, 0.6)'
          }}
        ></div>
        
        {/* Glow effect */}
        <div 
          className="absolute blur-sm"
          style={{
            inset: -5,
            background: 'radial-gradient(circle at 50% 50%, rgba(79, 70, 229, 0.3) 0%, transparent 70%)',
            borderRadius: '50%'
          }}
        ></div>
      </div>
      
      {showText && (
        <div 
          className="ml-2 font-bold text-transparent bg-clip-text"
          style={{ 
            fontSize: size * 0.5,
            backgroundImage: 'linear-gradient(to right, #4f46e5, #8b5cf6)',
            fontFamily: 'Arial, sans-serif'
          }}
        >
          XenzOS
        </div>
      )}
    </div>
  );
}