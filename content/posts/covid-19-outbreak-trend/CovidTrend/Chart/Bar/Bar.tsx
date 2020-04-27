import React, { useMemo, useEffect, useRef } from 'react';
import { scaleLinear } from 'd3-scale';
import styles from './Bar.module.scss';

interface IBarProps {
  barLeft: number;
  barMaxWidth: number;
  count: number;
  country: string;
  height: number;
  interval: number;
  iso2: string;
  labelCountry: boolean;
  labelFlag: boolean;
  maxCount: number;
  rank: number;
  textAnchor: string;
}

const BAR_HEIGHT = 24;
// const COLOR = '#007acc';
const KOR_COLOR = 'rgb(0,77,204)';
const KOR_FILL_COLOR = 'rgba(0,77,204,0.35)';
const COLOR = 'rgb(35,33,41)';
const FILL_COLOR = 'rgba(64,64,64,0.1)';
const COUNTRY_WIDTH = 120;
const FONT_SIZE = 16;
const PADDING = 8;

/**
 * Component Description
 */
function Bar({
  barLeft,
  barMaxWidth,
  count,
  country,
  height,
  interval,
  iso2,
  labelCountry,
  labelFlag,
  maxCount,
  rank,
  textAnchor,
}: IBarProps) {
  const flagSize = height * 1.1;
  const barTop = (height - BAR_HEIGHT) / 2;
  const baseline = height / 2 + 1;
  const barWidth = useMemo(() => (barMaxWidth * count) / maxCount, [
    barMaxWidth,
    count,
    maxCount,
  ]);

  const rootRef = useRef<any>();
  const textRef = useRef<any>();
  const countRef = useRef<number>(0);

  useEffect(() => {
    const from = new Date().valueOf();
    const to = from + interval;
    const scaled = scaleLinear()
      .domain([from, to])
      .range([countRef.current, count])
      .clamp(true);

    let raf: number;
    const updateCount = () => {
      const now = new Date().valueOf();
      countRef.current = ~~scaled(now);
      if (textRef.current) {
        textRef.current.textContent = Number(
          ~~countRef.current,
        ).toLocaleString();
      }
      if (now < to) {
        requestAnimationFrame(updateCount);
      }
    };
    updateCount();

    return () => {
      cancelAnimationFrame(raf);
    };
  }, [count, interval]);

  useEffect(() => {
    if (rootRef.current) {
      setTimeout(() => {
        rootRef.current.classList.add(styles.animate);
      });
    }
  }, []);

  // const strokeColor = iso2 ==='KR'? KOR_COLOR : COLOR;
  // const fillColor = iso2 ==='KR'? KOR_FILL_COLOR : FILL_COLOR;
  const strokeColor = COLOR;
  const fillColor = FILL_COLOR;

  return (
    <g
      ref={rootRef}
      className={styles.root}
      style={{ transform: `translateY(${rank * height}px)` }}
    >
      <g className={styles.bar} 
      style={{ transform: `translate(${barLeft}px, ${barTop}px)` }}
      >
        {/* <!-- bar --> */}
        <path
          d={`M0 0 l${barWidth} 0 l0 ${BAR_HEIGHT} l${barWidth * -1} 0 Z`}
          stroke={strokeColor}
          fill={fillColor}
        />
        {/* <!-- count --> */}
        <g style={{ transform: `translateX(${barWidth}px)` }}>
        <text
          ref={textRef}
          className={styles.count}
          
          x={textAnchor === 'end' ? -PADDING: PADDING}
          y={baseline - barTop}
          fontSize={FONT_SIZE}
          textAnchor={textAnchor}
          alignmentBaseline="middle"
          fill={strokeColor}
          
        />
        </g>
      </g>
      <g className={styles.label}>
        {/* <!-- country --> */}
        {labelCountry && (
          <text
            className={styles.country}
            x={COUNTRY_WIDTH}
            y={baseline + 1}
            fontSize={FONT_SIZE}
            textAnchor="end"
            alignmentBaseline="middle"
            fill={strokeColor}
          >
            {country}
          </text>
        )}
        {/* <!-- flag --> */}
        {labelFlag && (
          <image
            x={barLeft - flagSize - PADDING}
            y={(height - flagSize) / 2}
            href={`https://raw.githubusercontent.com/gosquared/flags/master/flags/flags-iso/shiny/48/${iso2}.png`}
            width={flagSize}
            height={flagSize}
          />
        )}
      </g>
    </g>
  );
}

export default Bar;
