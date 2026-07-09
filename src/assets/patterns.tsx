import React from 'react';
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  RadialGradient,
  Pattern,
  Path,
  Rect,
  Circle,
  Ellipse,
} from 'react-native-svg';

// ============================================
// Wood Grain Pattern
// ============================================
export const WoodGrainPattern = ({ id = 'wood' }: { id?: string }) => (
  <>
    <Defs>
      <LinearGradient id={`${id}-base`} x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0%" stopColor="#6b4423" />
        <Stop offset="50%" stopColor="#8b5a2b" />
        <Stop offset="100%" stopColor="#5c3a1e" />
      </LinearGradient>
      <Pattern
        id={`${id}-grain`}
        x="0"
        y="0"
        width="200"
        height="20"
        patternUnits="userSpaceOnUse"
      >
        <Path
          d="M0,10 Q50,5 100,10 T200,10"
          stroke="rgba(0,0,0,0.15)"
          strokeWidth="0.5"
          fill="none"
        />
        <Path
          d="M0,15 Q50,12 100,15 T200,15"
          stroke="rgba(0,0,0,0.1)"
          strokeWidth="0.3"
          fill="none"
        />
        <Path
          d="M0,5 Q50,2 100,5 T200,5"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="0.3"
          fill="none"
        />
      </Pattern>
    </Defs>
    <Rect width="100%" height="100%" fill={`url(#${id}-base)`} />
    <Rect width="100%" height="100%" fill={`url(#${id}-grain)`} opacity="0.6" />
  </>
);

// ============================================
// Felt Pattern
// ============================================
export const FeltPattern = ({
  id = 'felt',
  color = '#0a5c2e',
}: {
  id?: string;
  color?: string;
}) => {
  const dots = Array.from({ length: 80 }, (_, i) => ({
    x: (i * 37) % 100,
    y: (i * 53) % 100,
    r: 0.3 + ((i * 7) % 3) * 0.2,
    opacity: 0.1 + ((i * 11) % 5) * 0.04,
  }));

  return (
    <>
      <Defs>
        <RadialGradient id={`${id}-grad`} cx="50%" cy="50%" r="70%">
          <Stop offset="0%" stopColor={color} />
          <Stop offset="100%" stopColor="#000" stopOpacity="0.4" />
        </RadialGradient>
        <Pattern
          id={`${id}-texture`}
          x="0"
          y="0"
          width="100"
          height="100"
          patternUnits="userSpaceOnUse"
        >
          {dots.map((d, i) => (
            <Circle
              key={i}
              cx={`${d.x}%`}
              cy={`${d.y}%`}
              r={d.r}
              fill={i % 2 === 0 ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}
              opacity={d.opacity}
            />
          ))}
        </Pattern>
      </Defs>
      <Rect width="100%" height="100%" fill={`url(#${id}-grad)`} />
      <Rect width="100%" height="100%" fill={`url(#${id}-texture)`} />
    </>
  );
};

// ============================================
// Marble Pattern
// ============================================
export const MarblePattern = ({ id = 'marble' }: { id?: string }) => (
  <>
    <Defs>
      <LinearGradient id={`${id}-base`} x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0%" stopColor="#f5f5f0" />
        <Stop offset="50%" stopColor="#e8e8e0" />
        <Stop offset="100%" stopColor="#d4d4c8" />
      </LinearGradient>
    </Defs>
    <Rect width="100%" height="100%" fill={`url(#${id}-base)`} />
    <Path
      d="M0,30 Q100,20 200,35 T400,30"
      stroke="rgba(100,100,100,0.2)"
      strokeWidth="0.5"
      fill="none"
    />
    <Path
      d="M0,80 Q150,70 300,85 T600,80"
      stroke="rgba(80,80,80,0.15)"
      strokeWidth="0.8"
      fill="none"
    />
    <Path
      d="M0,150 Q120,140 240,155 T480,150"
      stroke="rgba(60,60,60,0.2)"
      strokeWidth="0.6"
      fill="none"
    />
  </>
);

// ============================================
// Leather Pattern
// ============================================
export const LeatherPattern = ({ id = 'leather' }: { id?: string }) => {
  const cells = Array.from({ length: 40 }, (_, i) => ({
    x: (i * 29) % 100,
    y: (i * 47) % 100,
    rx: 8 + ((i * 3) % 5),
    ry: 6 + ((i * 5) % 4),
  }));

  return (
    <>
      <Defs>
        <RadialGradient id={`${id}-grad`} cx="50%" cy="40%" r="80%">
          <Stop offset="0%" stopColor="#2a2a2a" />
          <Stop offset="100%" stopColor="#0a0a0a" />
        </RadialGradient>
        <Pattern
          id={`${id}-cells`}
          x="0"
          y="0"
          width="100"
          height="100"
          patternUnits="userSpaceOnUse"
        >
          {cells.map((c, i) => (
            <Ellipse
              key={i}
              cx={`${c.x}%`}
              cy={`${c.y}%`}
              rx={c.rx}
              ry={c.ry}
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="0.5"
            />
          ))}
        </Pattern>
      </Defs>
      <Rect width="100%" height="100%" fill={`url(#${id}-grad)`} />
      <Rect width="100%" height="100%" fill={`url(#${id}-cells)`} />
    </>
  );
};