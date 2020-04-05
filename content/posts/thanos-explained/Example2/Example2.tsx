import React, { useMemo, useState } from 'react';
import { Scrollama } from 'gatsby-plugin-bluewings';
import Sample from '../Sample';
import Gimmick from '../Gimmick';
import styles from './Example2.module.scss';

const Test = ({ index, progress_, children }: any) => {
  const [screenshot, setScreenshot] = useState();
  const handleScreenshotCapture = (canvas: any) => {
    if (canvas) {
      setScreenshot(canvas);
    }
  };
  return (
    <div className={styles.inner}>
      <div className={`${styles.sample} ${progress_ > 0 && screenshot ? styles.invisible : ''}`}>
        <Sample capture onCapture={handleScreenshotCapture}>
          <div className={styles.sampleWrap}>{children}</div>
        </Sample>
      </div>
      <div className={`${styles.gimmick} ${progress_ > 0 && screenshot && progress_ !== 1 ? '' : styles.invisible}`}>
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
};

function Example2({ children }: any) {
  const className = useMemo(() => `ex-${Math.random().toString(36).substr(-8)}`, []);

  return (
    <div className={`${styles.root} ${className}`}>
      <Scrollama step={`.${className}`} offset=".5" progress>
        {({ index, progress_ }: any) => {
          return (
            <Test index={index} progress_={progress_}>
              {children}
            </Test>
          );
        }}
      </Scrollama>
    </div>
  );
}

export default Example2;
