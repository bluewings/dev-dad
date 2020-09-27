import React, { useState, useEffect, useRef } from 'react';
import { PlayCircleFilled, PauseCircleFilled } from '@ant-design/icons';
import { Button } from 'antd';
import styles from './ControlPane.module.scss';

interface IControlPaneProps {
  onStateChange?: Function;
  states?: any;
}

function ControlPane({ onStateChange, states }: IControlPaneProps) {
  const [speed, setSpeed] = useState(4);

  const [pause, setPause] = useState(false);

  const handleToggleClick = () => {
    setPause(!pause);
  };

  const handleSpeedClick = () => {
    if (speed < 32) {
      setSpeed(speed * 2);
    } else {
      setSpeed(1);
    }
  };

  const [numbers, setNumbers] = useState(getNumbers());

  const handleStateChange = useRef<Function>();
  handleStateChange.current = onStateChange;
  useEffect(() => {
    if (typeof handleStateChange.current === 'function') {
      handleStateChange.current({ speed, pause, numbers });
    }
  }, [speed, pause, numbers]);

  useEffect(() => {
    if (states && Object.keys(states).length > 0 && !Object.values(states).find((e: string) => e !== 'done')) {
      const timer = setTimeout(() => {
        setNumbers(getNumbers());
      }, 1000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [states]);

  return (
    <div className={styles.root}>
      <Button shape="link" onClick={handleSpeedClick}>
        {speed}배속
      </Button>
      &nbsp;
      {pause ? <PlayCircleFilled onClick={handleToggleClick} /> : <PauseCircleFilled onClick={handleToggleClick} />}
    </div>
  );
}

export default ControlPane;

function shuffle(numbers: number[]) {
  const arr = numbers.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const x = arr[i];
    arr[i] = arr[j];
    arr[j] = x;
  }
  return arr;
}

const getNumbers = (n = 10) =>
  shuffle(
    Array(n)
      .fill(true)
      .map((e, i) => i + 1),
  );
