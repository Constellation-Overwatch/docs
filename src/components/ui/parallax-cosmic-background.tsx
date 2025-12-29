import React, { useEffect, useState } from 'react';

interface CosmicParallaxBgProps {
  /**
   * Main heading text (displayed large in the center)
   */
  head: string;

  /**
   * Whether the text animations should loop
   * @default true
   */
  loop?: boolean;

  /**
   * Custom class name for additional styling
   */
  className?: string;
}

/**
 * A cosmic parallax background component with animated stars and text
 */
const CosmicParallaxBg: React.FC<CosmicParallaxBgProps> = ({
  head,
  loop = true,
  className = '',
}) => {
  const [smallStars, setSmallStars] = useState<string>('');
  const [mediumStars, setMediumStars] = useState<string>('');
  const [bigStars, setBigStars] = useState<string>('');

  // Generate random star positions based on viewport size
  const generateStarBoxShadow = (count: number): string => {
    // Use larger of viewport or minimum size for star field coverage
    const width = Math.max(typeof window !== 'undefined' ? window.innerWidth : 2000, 2000);
    const height = Math.max(typeof window !== 'undefined' ? window.innerHeight : 2000, 2000);
    let shadows = [];

    for (let i = 0; i < count; i++) {
      const x = Math.floor(Math.random() * width);
      const y = Math.floor(Math.random() * height);
      shadows.push(`${x}px ${y}px #FFF`);
    }

    return shadows.join(', ');
  };

  useEffect(() => {
    // Generate star shadows when component mounts
    setSmallStars(generateStarBoxShadow(700));
    setMediumStars(generateStarBoxShadow(200));
    setBigStars(generateStarBoxShadow(100));

    // Set animation iteration based on loop prop
    document.documentElement.style.setProperty(
      '--animation-iteration',
      loop ? 'infinite' : '1'
    );
  }, [loop]);

  return (
    <div className={`cosmic-parallax-container ${className}`}>
      {/* Stars layers */}
      <div
        id="stars"
        style={{ boxShadow: smallStars }}
        className="cosmic-stars"
      ></div>
      <div
        id="stars2"
        style={{ boxShadow: mediumStars }}
        className="cosmic-stars-medium"
      ></div>
      <div
        id="stars3"
        style={{ boxShadow: bigStars }}
        className="cosmic-stars-large"
      ></div>

      {/* Horizon and Earth */}
      <div id="horizon">
        <div className="glow"></div>
      </div>
      <div id="earth"></div>

      {/* Title - split into two lines */}
      {head && head.trim() && (
        <div id="title">
          {head.split(' ').map((word, index, arr) => (
            <React.Fragment key={index}>
              {word.toUpperCase()}
              {index < arr.length - 1 && (index === 0 ? <br /> : ' ')}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export { CosmicParallaxBg };
