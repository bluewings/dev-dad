import * as React from 'react';
import { Fragment, useMemo, useCallback, useState, useEffect, useRef } from 'react';
import styles from './CovidTrend.module.scss';
import Chart from './Chart';
import { Tooltip } from 'antd';
import { format, isAfter, isBefore, addDays } from 'date-fns';
import { PlayCircleFilled, PauseCircleFilled } from '@ant-design/icons';
import 'antd/dist/antd.css';

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

const INTERVAL = 500;

const allEvents = Object.entries({
  '2020-02-18': '31번 확진자 발생',
  '2020-02-26': '재택근무 시작',
  '2020-03-09': '공적 마스크 제도 시작',
  '2020-04-09': '1차 온라인 개학',
  '2020-04-15': '제21대 국회의원선거',
  // '2020-04-16': '2차 온라인 개학',
  '2020-04-20': '3차 온라인 개학',
  '2020-04-29': '재택근무 종료',
}).map(([date, event]) => {
  return {
    event,
    date,
    _date: new Date(date),
  };
});

/**
 * Component Description
 */
function TimeSeries(props: ITimeSeriesProps) {
  const [index, setIndex] = useState(-1);
  const [play, setPlay] = useState(true);

  const indexRef = useRef(index);
  indexRef.current = index;

  useEffect(() => {
    if (play) {
      setIndex(indexRef.current + 1);
      const timer = setInterval(() => {
        setIndex(indexRef.current + 1);
      }, INTERVAL);
      return () => {
        clearInterval(timer);
      };
    }
  }, [play, setIndex]);

  const item = items[Math.max(index % items.length, 0)];

  const handleClick = useCallback(() => {
    setPlay(!play);
  }, [play, setPlay]);

  const [currDate, threeDays, todayStr] = useMemo(() => {
    return [new Date(item.isoDate), addDays(new Date(item.isoDate), 3), format(new Date(item.isoDate), 'yyyy-MM-dd')];
  }, [item.isoDate]);

  //   useEffect(() => {

  // const timer =     setTimeout(() => {
  //       setPlay(true);
  //     }, 2000);
  //     return () => {
  //       clearTimeout(timer)
  //     }
  //   }, [])

  return (
    <div className={styles.root}>
      {/* <div style={{ width: '50%' }}>
        <Chart label="flag" />
      </div>
      <div style={{ width: '75%' }}>
        <Chart label="name" />
      </div> */}
      <Chart date={item.isoDate} countries={item.countries} interval={INTERVAL} />
      {allEvents.map((e, i) => {
        return (
          <Tooltip
            key={i}
            placement="top"
            title={e.event}
            visible={todayStr === e.date || (isAfter(e._date, currDate) && isBefore(e._date, threeDays))}
          >
            <div className={styles.box} />
          </Tooltip>
        );
      })}

      <div className={styles.control}>
        {play ? <PauseCircleFilled onClick={handleClick} /> : <PlayCircleFilled onClick={handleClick} />}
      </div>
    </div>
  );
}

export default TimeSeries;
