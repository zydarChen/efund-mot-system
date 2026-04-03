import { useState, useEffect, useRef } from 'react';

export function useCountUp(
  target: number,
  duration: number = 1000,
  startOnMount: boolean = true
): number {
  const [count, setCount] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!startOnMount) return;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
      
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      setCount(target * easeOut);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [target, duration, startOnMount]);

  return count;
}

export function useCountUpOnView(
  target: number,
  duration: number = 1000
): [number, React.RefObject<HTMLDivElement | null>] {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            
            let startTime: number | null = null;
            let animationId: number;

            const animate = (timestamp: number) => {
              if (!startTime) startTime = timestamp;
              const progress = Math.min((timestamp - startTime) / duration, 1);
              const easeOut = 1 - Math.pow(1 - progress, 3);
              setCount(target * easeOut);

              if (progress < 1) {
                animationId = requestAnimationFrame(animate);
              }
            };

            animationId = requestAnimationFrame(animate);

            return () => {
              if (animationId) {
                cancelAnimationFrame(animationId);
              }
            };
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [target, duration, hasAnimated]);

  return [count, ref];
}
