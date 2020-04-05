import * as React from 'react';
import { useMemo } from 'react';
import cx from 'classnames';
// import Octicon from 'react-octicon';
import ExamMark from './ExamMark';
import styles from './Item.module.scss';

// console.log(styles);

function Item({ x, y, operation, userInput, draftInput, correct, current }: any) {
  const chars = useMemo(() => {
    // ${userInput || ''}
    const aaa = `${x}${operation}${y}=`.split('').map((e, i) => {
      if (e === '*') {
        return (
          <span key={i} className={cx(styles.num, styles.times)}>
            +
          </span>
        );
      }
      return (
        <span key={i} className={styles.num}>
          {e}
        </span>
      );
    });
    if (draftInput || typeof userInput !== 'undefined') {
      return [
        ...aaa,
        <div key="answer" className={styles.answer}>
          {/* <Octicon name={correct ? 'check' : 'x'} /> */}
          <ExamMark correct={correct} key={draftInput ? 'd' : 'u'} show={!draftInput} />
          {`${draftInput || userInput}`.split('').map((e, i) => (
            <span key={i} className={styles.num}>
              {e}
            </span>
          ))}
        </div>,
      ];
    }
    return aaa;
    return [...aaa];
    // return `${x}${operation}${y}=${userInput || ''}`.split('').map((e) => {
    //   if (e === '*') {
    //     return <span className={cx(styles.num, styles.times)}>+</span>;
    //   }
    //   return <span className={styles.num}>{e}</span>;
    // });
  }, [x, y, operation, userInput, draftInput, correct]);
  return (
    <div className={cx(styles.root, current && styles.current, correct === false && styles.wrong)}>
      <div className={styles.inner}>{chars}</div>
    </div>
  );
}

export default Item;
