import * as React from 'react';
import styles from './ExamMark.module.scss';

function ExamMark({ correct, show }: any) {
  return (
    <div className={styles.root} style={{ opacity: show ? 1 : 0 }}>
      {/* <h1>ExamMark</h1> */}
      {correct ? (
        <svg viewBox="0 0 14 14" version="1.1" aria-hidden="true">
          <path
            className={styles.check}
            transform="translate(1 1)"
            d="M0 6L4 10L12 2"
            // d="M0 0L10 10"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 14 14" version="1.1" aria-hidden="true">
          <path
            className={styles.cross1}
            transform="translate(2 2)"
            // d="M0 6L4 10L12 2"
            d="M0 0L10 10"
          />
          <path
            className={styles.cross2}
            transform="translate(2 2)"
            // d="M0 6L4 10L12 2"
            d="M10 0L0 10"
          />
        </svg>
      )}
    </div>
  );
}

export default ExamMark;
