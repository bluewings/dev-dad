import React, { useMemo, useState } from 'react';
import Scrollama from '../../../components/Scrollama';
import Sample from '../Sample';
import Gimmick from '../Gimmick';
import styles from './Example2.module.scss';

function Example2({ children }) {
  const className = useMemo(
    () =>
      `ex-${Math.random()
        .toString(36)
        .substr(-8)}`,
    [],
  );

  return (
    <div className={`${styles.root} ${className}`}>
      <Scrollama step={`.${className}`} offset=".5" progress>
        {({ index, progress_ }) => {
          const [screenshot, setScreenshot] = useState();
          const handleScreenshotCapture = (canvas) => {
            if (canvas) {
              setScreenshot(canvas);
            }
          };
          return (
            <div className={styles.inner}>
              <div className={`${styles.sample} ${progress_ > 0 ? styles.invisible : ''}`}>
                <Sample capture onCapture={handleScreenshotCapture}>
                  <div className={styles.sampleWrap}>{children}</div>
                </Sample>
              </div>
              <div className={`${styles.gimmick} ${progress_ > 0 && progress_ !== 1 ? '' : styles.invisible}`}>
                <Gimmick
                  show
                  stage="rotate-and-fade-out"
                  progress={progress_}
                  frame={false}
                  numOfLayers={32}
                  screenshot={screenshot}
                />
              </div>
            </div>
          );
        }}
      </Scrollama>
    </div>
  );
}

export default Example2;
