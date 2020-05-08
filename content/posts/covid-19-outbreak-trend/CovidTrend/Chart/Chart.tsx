import React, { useState, useEffect, useMemo, Fragment } from 'react';
import { useMeasure } from 'react-use';
import { useColorMode } from 'theme-ui';
import styles from './Chart.module.scss';
import XAxis from './XAxis';
import Bar from './Bar';
import Summary from './Summary';

interface IChartProps {
  /**
   * Prop Description
   */
  message?: string;
  label?: string;
  date: string;
  countries: any;
  interval?: number;
}

const INTERVAL = 1000;

// const height = 30;

const countryWidth = 120;
const height = 30;
const flagSize = height * 1.1;
const padding = 8;
const countMaxWidth = 65;

const BREAKPOINT = 600;

/**
 * Component Description
 */
function Chart({ date, label: _label, countries, interval = INTERVAL }: IChartProps) {
  const [ref, { x, y, width: viewBoxWidth, top, right, bottom, left }] = useMeasure();
  const [colorMode] = useColorMode();

  const label = useMemo(() => {
    return _label ? _label : viewBoxWidth < BREAKPOINT && 'flag';
  }, [_label, viewBoxWidth]);

  // const

  // cons

  // const { label, countries } = props;

  // const [index, setIndex] = useState(0);
  // const item = useMemo(() => {
  //   return steps[index % steps.length];
  // }, [index]);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setIndex(index + 1);
  //   }, INTERVAL * 1);
  //   return () => {
  //     clearTimeout(timer);
  //   };
  // }, [index, setIndex]);

  const [labelFlag, labelCountry] = useMemo(() => [label === 'flag' || !label, label === 'name' || !label], [label]);

  const barLeft = useMemo(
    () =>
      (labelCountry ? countryWidth : 0) +
      (labelFlag && labelCountry ? padding : 0) +
      (labelFlag ? flagSize : 0) +
      padding,
    [labelCountry, labelFlag],
  );

  const barMaxWidth = useMemo(
    () => Math.max(viewBoxWidth - barLeft - (viewBoxWidth < BREAKPOINT ? 1 : countMaxWidth + padding * 2), 0),
    [viewBoxWidth, barLeft, BREAKPOINT],
  );

  // const itemCount = 10;

  const [maxCount, totalCount] = useMemo(() => {
    const counts = countries.map(({ count }: any) => count);
    return [Math.max(...counts), counts.reduce((prev: number = 0, curr: number) => prev + curr)];
  }, [countries]);

  const [_countries, setCountries] = useState(countries);

  useEffect(() => {
    if (_countries !== countries) {
      const dict = _countries.reduce((accum: any, e: any, index: number) => {
        return {
          ...accum,
          [e.country]: { index },
        };
      }, {});

      let abc = [..._countries].slice(0, 40).map((e) => ({ ...e, rank: -1 }));

      countries.slice(0, 40).forEach((e: any, i: number) => {
        const found = dict[e.country];
        if (found) {
          abc[found.index] = e;
        } else {
          abc.push(e);
        }
      });
      abc = abc.filter((e) => e.rank !== -1);

      if (JSON.stringify(_countries) !== JSON.stringify(abc)) {
        setCountries(abc);
      }
    }
  }, [_countries, countries, setCountries]);

  const topTenHeight = height * 11;
  const viewBoxHeight = topTenHeight + height * 1.5;

  const showCountries = useMemo(() => {
    return _countries.filter((e) => e.rank < 20 && e.iso2 !== 'KR');
  }, [_countries]);

  const countryKR = useMemo(() => {
    return _countries.find((e) => e.iso2 === 'KR');
  }, [_countries]);

  return (
    <div className={styles.root} ref={ref}>
      <svg viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}>
        <XAxis
          colorMode={colorMode}
          barLeft={barLeft}
          barMaxWidth={barMaxWidth}
          maxCount={maxCount}
          interval={interval}
          height={height}
          viewBoxHeight={topTenHeight}
        />
        <clipPath id="clippath">
          <rect x={0} y={0} width={viewBoxWidth} height={topTenHeight} />
        </clipPath>
        <g clipPath="url(#clippath)">
          {showCountries.map(({ rank, country, count, iso2 }: any) => {
            return (
              <Bar
                colorMode={colorMode}
                key={country}
                labelFlag={labelFlag}
                labelCountry={labelCountry}
                barLeft={barLeft}
                barMaxWidth={barMaxWidth}
                maxCount={maxCount}
                rank={rank}
                country={country}
                count={count}
                iso2={iso2}
                // {...e}
                interval={interval}
                height={height}
                textAnchor={rank === 1 && viewBoxWidth < BREAKPOINT ? 'end' : 'start'}
              />
            );
          })}
        </g>
        {countryKR && (
          <Fragment key={countryKR.country}>
            {countryKR.rank > 11 && (
              <line
                x1="0"
                y1={topTenHeight + height / 4}
                x2={viewBoxWidth}
                y2={topTenHeight + height / 4}
                stroke="#000"
              />
            )}
            <Bar
              colorMode={colorMode}
              labelFlag={labelFlag}
              labelCountry={labelCountry}
              barLeft={barLeft}
              barMaxWidth={barMaxWidth}
              maxCount={maxCount}
              {...countryKR}
              rank={Math.min(countryKR.rank, 11.5)}
              // {...e}
              interval={interval}
              height={height}
              textAnchor={countryKR.rank === 1 && viewBoxWidth < BREAKPOINT ? 'end' : 'start'}
            />
          </Fragment>
        )}
        <Summary
          colorMode={colorMode}
          date={date}
          totalCount={totalCount}
          interval={interval}
          viewBoxWidth={viewBoxWidth}
          viewBoxHeight={topTenHeight}
        />
      </svg>
    </div>
  );
}

export default Chart;
