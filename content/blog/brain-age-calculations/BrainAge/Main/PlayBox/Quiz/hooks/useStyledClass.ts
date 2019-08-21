import { useEffect, useState, useMemo } from 'react';
import { css } from 'emotion';
import styles from '../Quiz.module.scss';

function useStyledClass() {
  const [width, setWidth] = useState<any>(null);
  useEffect(() => {
    const span = document.createElement('span');
    span.classList.add(styles.num);
    document.body.appendChild(span);
    const maxWidth = Math.max(
      ...[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, '+', '-', '*', '/', '='].map((e) => {
        span.innerText = e.toString();
        return span.getBoundingClientRect().width;
      }),
    );
    document.body.removeChild(span);
    setWidth(maxWidth * 1.2);
  }, []);

  return useMemo(
    () =>
      css`
        span {
          width: ${width}px;
        }
      `,
    [width],
  );
}

export default useStyledClass;
