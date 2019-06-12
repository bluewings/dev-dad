import React, { useRef, useEffect } from 'react';
import useD3Chord from './useD3Chord';
import styles from './ChordDiagram.module.scss';

function ChordDiagram({ cases }) {
  const svg = useD3Chord(cases);

  const container = useRef();
  useEffect(() => {
    if (container.current && svg) {
      container.current.innerHTML = '';
      container.current.appendChild(svg.node());
    }
  }, [svg]);

  if (!cases || cases.length < 2) {
    return null;
  }

  return <div className={styles.root} style={{ marginBottom: '1.75rem' }} ref={container} />;
}

export default ChordDiagram;
