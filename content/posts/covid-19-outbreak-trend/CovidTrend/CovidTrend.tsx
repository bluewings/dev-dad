import * as React from 'react';
import { useState, useEffect } from 'react';
import styles from './CovidTrend.module.scss';
import Chart from './Chart';

import timeSeries from '../data/time-series.json';
// import View from '../View';
// import Timeline from '../Timeline';
// import TreeMap from '../TreeMap';
// import Selector from '../Selector';

// const dates = timeSeries.map((e) => e.isoDate);

interface ITimeSeriesProps {
  /**
   * Prop Description
   */
  message?: string;
}

// iso2: 'US',
// country: '사우디아라비아',
// rank: 1,
// count: 3412,
// maxCount: 5000,
// const countries3 = timeSeries[65].countries.map(([iso2, country, count], i) => {
//   return {
//     iso2,
//     country,
//     count,
//     rank: i + 1,
//   };
// });

// const countries2 = timeSeries[64].countries.map(([iso2, country, count], i) => {
//   return {
//     iso2,
//     country,
//     count,
//     rank: i + 1,
//   };
// });

// const countries = timeSeries[63].countries.map(([iso2, country, count], i) => {
//   return {
//     iso2,
//     country,
//     count,
//     rank: i + 1,
//   };
// });

const _t = timeSeries.map((e) => {
  return {
    ...e,
    countries: e.countries.map(([iso2, country, count], i) => {
      return {
        iso2,
        country,
        count,
        rank: i + 1,
      };
    }),
  };
});

// const items = [_t[52], _t[63], _t[64], _t[65], _t[75]];
const items = _t;

const INTERVAL = 1000;

/**
 * Component Description
 */
function TimeSeries(props: ITimeSeriesProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setIndex(index + 1);
    }, INTERVAL);
  }, [index, setIndex]);

  const item = items[index % items.length];

  return (
    <div className={styles.root}>
      {/* <div style={{ width: '50%' }}>
        <Chart label="flag" />
      </div>
      <div style={{ width: '75%' }}>
        <Chart label="name" />
      </div> */}
      <Chart date={item.isoDate} countries={item.countries} interval={INTERVAL} />
      {/* <pre>{JSON.stringify(items, null, 2)}</pre> */}
    </div>
  );
}

export default TimeSeries;
