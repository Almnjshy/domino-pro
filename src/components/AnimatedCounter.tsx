import React, { useEffect, useState } from 'react';
import { Text, TextStyle } from 'react-native';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  delay?: number;
  style?: TextStyle;
  prefix?: string;
  suffix?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value, duration = 1500, delay = 0, style, prefix = '', suffix = '',
}) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const startTime = Date.now() + delay;
    let rafId: number;

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      if (elapsed < 0) { rafId = requestAnimationFrame(animate); return; }

      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));

      if (progress < 1) rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [value, duration, delay]);

  return <Text style={style}>{prefix}{display}{suffix}</Text>;
};