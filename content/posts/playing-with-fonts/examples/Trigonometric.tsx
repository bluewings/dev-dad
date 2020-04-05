import React, { useState, useEffect, useMemo, useRef } from 'react';
import Warp from 'warpjs';
import styles from './Trigonometric.module.scss';

function Trigonometric({ radius = 45, padding = 5 }) {
  const svg = useRef<any>();
  const sv1 = useRef<any>();
  const pathRadius = useRef<any>();
  const joint1 = useRef<any>();
  const joint2 = useRef<any>();

  const container = useRef<any>();

  const [fullWidth, setFullWidth] = useState();

  const metric = useMemo(() => {
    if (!fullWidth) {
      return null;
    }
    return {
      width: fullWidth,
      height: (radius + padding) * 2,
    };
  }, [fullWidth, radius, padding]);

  useEffect(() => {
    if (container.current) {
      setFullWidth(container.current.getBoundingClientRect().width);
    }
  }, []);

  // const [offset, useSTs]
  const animationFrame = useRef<any>();

  useEffect(() => {
    if (svg.current) {
      const warp = new Warp(svg.current);

      warp.interpolate(4);
      warp.transform(([x, y]: any) => [x, y, x, y]);

      const start = new Date().valueOf();

      const animate = () => {
        const now = new Date().valueOf();

        // start = new Date().valueOf();

        const offset = (now - start) / 500;
        warp.transform(([x, y, ox, oy]: any) => [
          ox,
          oy + radius * Math.cos((ox - (radius * 2 + padding * 3)) / 20 + offset),
        ]);

        // // const rad = ;
        const x = radius + Math.sin(offset) * radius;
        const y = radius + Math.cos(offset) * radius;

        pathRadius.current.setAttribute(
          'd',
          `M ${radius * 2} ${radius} L ${radius} ${radius} L ${x} ${y} L ${radius * 2 +
            padding * 3} ${y} M ${radius} ${radius} Z`,
        );

        joint1.current.setAttribute('cx', x);
        joint1.current.setAttribute('cy', y);
        joint2.current.setAttribute('cy', y);
        // // `M 25 50 L ${x} ${y} L ${x} 50 L 25 50

        const min = 10;
        const x1 = radius + Math.sin(offset) * min;
        const y1 = radius + Math.cos(offset) * min;

        const aab = y1 > radius ? 1 : 0;

        sv1.current.setAttribute(
          'd',

          `M ${radius} ${radius} L ${x} ${y}

          M ${radius + min} ${radius}
          A ${min} ${min}, 0, ${aab}, 0, ${x1} ${y1}
          M ${radius + min} ${radius}

          Z
          `,
        );

        animationFrame.current = requestAnimationFrame(animate);
      };

      animate();

      return () => {
        if (animationFrame.current) {
          cancelAnimationFrame(animationFrame.current);
        }
      };
    }
  }, [metric]);
  return (
    <div ref={container} className={styles.root}>
      {metric && (
        <svg
          viewBox={`0 0 ${metric.width} ${metric.height}
      `}
          // style={{ border: '1px solid red' }}
        >
          <g transform={`translate(${padding},${padding})`}>
            <path
              d={`M ${radius * 2 + padding * 3} ${radius}
            L ${fullWidth - padding} ${radius} 
            M ${radius * 2 + padding * 3} 0
            L ${fullWidth - padding} 0
            M ${radius * 2 + padding * 3} ${radius * 2} 
            L ${fullWidth - padding} ${radius * 2} 
            M ${radius * 2 + padding * 3} 0 
            L ${radius * 2 + padding * 3} ${radius * 2}
            Z`}
            />
            <path className={styles.radius} ref={pathRadius} />

            <path ref={sv1} className={styles.guide} d="M 25 20 L 25 80 Z M 0 50 L 60 50 Z" />
            <circle cx={radius} cy={radius} r={radius} fill="none" />
            <circle className={styles.joint} ref={joint1} r="1" fill="none" />
            <circle className={styles.joint} ref={joint2} cx={radius * 2 + padding * 3} r="1" fill="none" />
            <g ref={svg}>
              <path
                className={styles.graph}
                d={`M ${radius * 2 + padding * 3} ${radius} L ${fullWidth - padding * 2} ${radius} Z`}
              />
            </g>
          </g>
        </svg>
      )}
    </div>
  );
}

export default Trigonometric;
