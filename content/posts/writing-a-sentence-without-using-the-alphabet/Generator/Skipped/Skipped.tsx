import * as React from 'react';
import { useMemo } from 'react';
import styles from './Skipped.module.scss';

const chars = ['g', 'h', 'k', 'm', 'p', 'q', 'v', 'w', 'x', 'z'];

function Skipped(props: any) {
  const { skipped }: any = props;
  const ignores = useMemo(() => {
    const skipped_ = skipped || [];
    return chars.map((char) => {
      return {
        char,
        skipped: skipped_.indexOf(char) !== -1,
      };
    });
  }, [skipped]);
  return (
    <div className={styles.root}>
      {ignores.map((e) => (
        <>
          <code className={e.skipped ? styles.skipped : ''}>{e.char}</code>{' '}
        </>
      ))}
    </div>
  );
}

export default Skipped;
