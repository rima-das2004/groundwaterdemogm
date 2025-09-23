import React, { useEffect, useState } from 'react';

interface Droplet {
  id: number;
  left: number;
  animationDuration: number;
  size: number;
  opacity: number;
  delay: number;
}

interface WaterDropletBackgroundProps {
  className?: string;
  dropletCount?: number;
  intensity?: 'light' | 'medium' | 'heavy';
}

export const WaterDropletBackground: React.FC<WaterDropletBackgroundProps> = ({
  className = '',
  dropletCount = 30,
  intensity = 'medium'
}) => {
  const [droplets, setDroplets] = useState<Droplet[]>([]);

  useEffect(() => {
    const generateDroplets = () => {
      const count = intensity === 'light' ? dropletCount * 0.7 : 
                   intensity === 'heavy' ? dropletCount * 1.5 : dropletCount;
      
      const newDroplets: Droplet[] = [];
      
      for (let i = 0; i < count; i++) {
        newDroplets.push({
          id: i,
          left: Math.random() * 100,
          animationDuration: 4 + Math.random() * 3, // 4-7 seconds for smooth continuous fall
          size: 3 + Math.random() * 8, // 3-11px size range
          opacity: 0.3 + Math.random() * 0.5, // 0.3-0.8 opacity
          delay: Math.random() * 15 // 0-15 seconds delay for staggered continuous effect
        });
      }
      
      setDroplets(newDroplets);
    };

    generateDroplets();
  }, [dropletCount, intensity]);

  const getDropletStyle = (droplet: Droplet): React.CSSProperties => {
    return {
      position: 'absolute',
      left: `${droplet.left}%`,
      top: 0,
      width: `${droplet.size}px`,
      height: `${droplet.size * 2.2}px`, // Perfect teardrop proportion
      background: `
        radial-gradient(ellipse 50% 30% at 30% 20%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.3) 60%, transparent 100%),
        radial-gradient(ellipse 60% 40% at 35% 25%, rgba(255,255,255,0.4) 0%, transparent 70%),
        linear-gradient(180deg, rgba(14,165,233,0.8) 0%, rgba(14,165,233,0.9) 30%, rgba(14,165,233,0.7) 70%, rgba(14,165,233,0.5) 100%)
      `,
      borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%', // Perfect teardrop shape
      opacity: 0, // Start completely invisible
      animation: `dropFall ${droplet.animationDuration}s linear infinite`,
      animationDelay: `${droplet.delay}s`,
      animationFillMode: 'both',
      pointerEvents: 'none',
      boxShadow: `
        inset 1px 2px 3px rgba(255,255,255,0.6),
        0 1px 3px rgba(14,165,233,0.3)
      `,
      border: '0.5px solid rgba(255,255,255,0.2)',
      transform: 'translateZ(0) translateY(-150px)', // Start far above screen
      willChange: 'transform, opacity', // Optimize for animations
    };
  };

  return (
    <>
      <style>
        {`
          @keyframes dropFall {
            0% {
              transform: translateY(-150px);
              opacity: 0;
            }
            15% {
              opacity: 0;
            }
            20% {
              opacity: calc(var(--opacity) * 0.8);
            }
            25% {
              opacity: var(--opacity);
            }
            75% {
              opacity: var(--opacity);
            }
            80% {
              opacity: calc(var(--opacity) * 0.8);
            }
            85% {
              opacity: 0;
            }
            100% {
              transform: translateY(calc(100vh + 50px));
              opacity: 0;
            }
          }
          
          /* Mobile optimization */
          @media (max-width: 768px) {
            @keyframes dropFall {
              0% {
                transform: translateY(-120px);
                opacity: 0;
              }
              18% {
                opacity: 0;
              }
              22% {
                opacity: calc(var(--opacity) * 0.9);
              }
              78% {
                opacity: calc(var(--opacity) * 0.9);
              }
              82% {
                opacity: 0;
              }
              100% {
                transform: translateY(calc(100vh + 40px));
                opacity: 0;
              }
            }
          }
        `}
      </style>
      <div 
        className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`}
        style={{ zIndex: -1 }}
      >
        {/* Crystal clear droplets */}
        {droplets.map((droplet) => (
          <div
            key={droplet.id}
            style={{
              ...getDropletStyle(droplet),
              '--opacity': droplet.opacity
            } as React.CSSProperties}
          />
        ))}
      </div>
    </>
  );
};

export default WaterDropletBackground;