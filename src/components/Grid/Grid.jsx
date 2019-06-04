import React, { useEffect, useRef, useState } from 'react';
import styles from './Grid.module.scss';

function Grid({ children, layoutFixed }) {
  const container = useRef();

  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (container.current) {
      const rect = container.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, []);

  if (!layoutFixed) {
    return children;
  }

  return (
    <div className={styles.fixedOuter} style={{ height }}>
      <div className={styles.fixedInner} ref={container}>
        {children}
      </div>
    </div>
  );
}

export default Grid;
