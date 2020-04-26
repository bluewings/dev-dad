import React, { useState, useEffect, useMemo } from 'react';
import { useMeasure } from 'react-use';
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

const steps = [
  {
    iso2: 'US',
    country: '사우디아라비아',
    rank: 1,
    count: 3412,
    maxCount: 5000,
  },
  {
    iso2: 'US',
    country: '사우디아라비아',
    rank: 2,
    count: 8000,
    maxCount: 15000,
  },
  {
    iso2: 'US',
    country: '사우디아라비아',
    rank: 3,
    count: 30432,
    maxCount: 50000,
  },
];

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
  const [
    ref,
    { x, y, width: viewBoxWidth, top, right, bottom, left },
  ] = useMeasure();


  const label = useMemo(() => {
    return _label ? _label : viewBoxWidth < BREAKPOINT && 'flag'
  }, [_label,viewBoxWidth ])

  // const

  // cons

  // const { label, countries } = props;

  const [index, setIndex] = useState(0);
  const item = useMemo(() => {
    return steps[index % steps.length];
  }, [index]);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setIndex(index + 1);
  //   }, INTERVAL * 1);
  //   return () => {
  //     clearTimeout(timer);
  //   };
  // }, [index, setIndex]);

  const [labelFlag, labelCountry] = useMemo(
    () => [label === 'flag' || !label, label === 'name' || !label],
    [label],
  );

  const barLeft = useMemo(
    () =>
      (labelCountry ? countryWidth : 0) +
      (labelFlag && labelCountry ? padding : 0) +
      (labelFlag ? flagSize : 0) +
      padding,
    [labelCountry, labelFlag],
  );

  const barMaxWidth = useMemo(
    () => viewBoxWidth - barLeft 
    -  ( viewBoxWidth < BREAKPOINT ? 1 : countMaxWidth + padding * 2) ,
    [viewBoxWidth, barLeft, BREAKPOINT],
  );

  // const itemCount = 10;

  const [maxCount, totalCount] = useMemo(() => {
    const counts = countries.map(({ count }: any) => count);
    return [
      Math.max(...counts),
      counts.reduce((prev: number = 0, curr: number) => prev + curr),
    ];
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

      let abc = [..._countries].slice(0, 30).map(e => ({...e,rank: -1}))

      countries.slice(0,30).forEach((e: any, i: number) => {
        const found = dict[e.country];
        if (found) {
          abc[found.index] = e;
        } else {
          abc.push(e);
        }
      });
      abc = abc.filter(e => e.rank !== -1)

      
      if (JSON.stringify(_countries) !== JSON.stringify(abc)) {
        setCountries(abc);
      }
    }
  }, [_countries, countries, setCountries]);

  const viewBoxHeight = 360;

  const showCountries = useMemo(() => {
    return _countries.filter(e => e.rank < 20);
  }, [_countries])

  return (
    <div className={styles.root} ref={ref}>
      <svg
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        // style={{ border: '1px solid blue' }}
      >
        <XAxis
          barLeft={barLeft}
          barMaxWidth={barMaxWidth}
          maxCount={maxCount}
          interval={interval}
          height={height}
          viewBoxHeight={viewBoxHeight}
        />
        {showCountries.map(({ rank, country, count, iso2 }: any) => {
          return (
            <Bar
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
              textAnchor={rank === 1 && viewBoxWidth < BREAKPOINT ? "end": "start"}
            />
          );
        })}

        <Summary
          date={date}
          totalCount={totalCount}
          interval={interval}
          viewBoxWidth={viewBoxWidth}
          viewBoxHeight={viewBoxHeight}
        />
      </svg>
    </div>
  );
}

export default Chart;
