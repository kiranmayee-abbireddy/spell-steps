import React from 'react';

const RiverBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0">
      {/* Sky background */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-300 to-sky-500"></div>
      
      {/* Far mountains */}
      <div className="absolute bottom-[60%] w-full">
        <div className="h-32 bg-blue-900/20 rounded-t-[100%]"></div>
      </div>
      
      {/* Trees in background - left side */}
      <div className="absolute bottom-[30%] left-[10%]">
        <div className="w-16 h-20 bg-green-700 rounded-t-full"></div>
        <div className="w-16 h-4 bg-brown-600 -mt-2"></div>
      </div>
      
      {/* Trees in background - right side */}
      <div className="absolute bottom-[35%] right-[15%]">
        <div className="w-12 h-16 bg-green-800 rounded-t-full"></div>
        <div className="w-12 h-3 bg-brown-700 -mt-1"></div>
      </div>
      
      {/* River */}
      <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-blue-500 overflow-hidden">
        {/* River waves animation */}
        <div className="absolute inset-0">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="absolute h-1 bg-white/10 rounded-full animate-ripple"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 50 + 20}px`,
                opacity: Math.random() * 0.2 + 0.1,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 5 + 3}s`,
              }}
            ></div>
          ))}
        </div>
      </div>
      
      {/* Clouds */}
      <div className="absolute top-[10%] left-[20%] animate-float" style={{ animationDelay: '0s' }}>
        <div className="w-20 h-6 bg-white/80 rounded-full"></div>
      </div>
      <div className="absolute top-[15%] left-[50%] animate-float" style={{ animationDelay: '2s' }}>
        <div className="w-24 h-8 bg-white/70 rounded-full"></div>
      </div>
      <div className="absolute top-[8%] left-[70%] animate-float" style={{ animationDelay: '4s' }}>
        <div className="w-16 h-5 bg-white/90 rounded-full"></div>
      </div>
    </div>
  );
};

export default RiverBackground;