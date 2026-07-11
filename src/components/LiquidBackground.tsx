import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

export default function LiquidBackground() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDark = () => setIsDark(document.documentElement.classList.contains('dark'));
    checkDark();
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          checkDark();
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
      <svg className="hidden">
        <defs>
          <filter id="fluid-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="fluid-goo" />
            <feBlend in="SourceGraphic" in2="fluid-goo" />
          </filter>
        </defs>
      </svg>
      <div className="absolute inset-0" style={{ filter: "url(#fluid-goo)" }}>
        <motion.div
          animate={{
            scale: [1, 1.2, 0.9, 1.1, 1],
            opacity: isDark ? [0.1, 0.2, 0.1] : [0.3, 0.5, 0.3],
            x: [0, 50, -20, 0],
            y: [0, -30, 40, 0],
            rotate: [0, 90, 180, 270, 360],
            borderRadius: ["40% 60% 70% 30%", "60% 40% 30% 70%", "70% 30% 60% 40%", "30% 70% 40% 60%", "40% 60% 70% 30%"]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className={`absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] ${isDark ? 'bg-indigo-900' : 'bg-blue-300'} blur-[80px] mix-blend-multiply`}
        />
        
        <motion.div
          animate={{
            scale: [1, 1.3, 0.8, 1.2, 1],
            opacity: isDark ? [0.1, 0.2, 0.1] : [0.2, 0.4, 0.2],
            x: [0, -40, 30, 0],
            y: [0, 50, -20, 0],
            rotate: [0, -90, -180, -270, -360],
            borderRadius: ["60% 40% 30% 70%", "30% 70% 40% 60%", "40% 60% 70% 30%", "70% 30% 60% 40%", "60% 40% 30% 70%"]
          }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          className={`absolute bottom-[-10%] right-[-10%] w-[70vw] h-[70vw] max-w-[900px] max-h-[900px] ${isDark ? 'bg-purple-900' : 'bg-indigo-300'} blur-[90px] mix-blend-multiply`}
        />
        
        <motion.div
          animate={{
            scale: [1, 1.1, 1.4, 0.9, 1],
            opacity: isDark ? [0.1, 0.25, 0.1] : [0.2, 0.5, 0.2],
            x: [0, 80, -60, 0],
            y: [0, -60, 80, 0],
            rotate: [0, 120, 240, 360],
            borderRadius: ["50% 50% 50% 50%", "30% 70% 70% 30%", "70% 30% 50% 50%", "50% 50% 30% 70%", "50% 50% 50% 50%"]
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          className={`absolute top-[30%] left-[40%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] ${isDark ? 'bg-blue-800' : 'bg-cyan-200'} blur-[70px] mix-blend-multiply`}
        />
      </div>
    </div>
  );
}
