import React, { useState } from 'react';
import Sample from '../Sample';
import Gimmick from '../Gimmick';
import Gauntlet from '../Gauntlet';
import styles from './Example.module.scss';

function Example(props) {
  const [screenshot, setScreenshot] = useState(null);
  const handleScreenshotCapture = (canvas) => {
    if (canvas) {
      setScreenshot(canvas);
    }
  };

  const [mode, setMode] = useState('idle');
  const [progress, setProgress] = useState(0);

  return (
    <div className={styles.root}>
      <div className={styles.inner}>
        <div className={`${styles.sample} ${progress > 0 ? styles.invisible : ''}`}>
          <div>
            <Sample capture flash={false} onCapture={handleScreenshotCapture} />
          </div>
        </div>
        <div className={`${styles.gimmick} ${progress > 0 && progress !== 1 ? '' : styles.invisible}`}>
          <Gimmick
            show
            stage="rotate-and-fade-out"
            progress={progress}
            frame={false}
            numOfLayers={32}
            screenshot={screenshot}
          />
        </div>
      </div>
      <div className={styles.gauntlet}>
        <Gauntlet onModeChange={setMode} onProgressChange={setProgress} duration={1500} />
      </div>
    </div>
  );
}

export default Example;
