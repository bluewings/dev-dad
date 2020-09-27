import React from 'react';
import styles from './Bar.module.scss';

interface IBarProps {
  [key: string]: any;
}

function Bar(props: IBarProps) {
  const { width, height, value, tags, containerHeight } = props;

  const [className, isTemp] = React.useMemo(
    () => [[styles.root, ...tags.map((tag: string) => styles[tag])].filter(Boolean).join(' '), tags.includes('temp')],
    [tags],
  );

  return (
    <div
      className={className}
      style={{
        position: 'absolute',
        width: width - 4,
        height: height,
        left: width * props.pos,
        top: containerHeight - height + (isTemp ? height + 4 : 0),
      }}
    >
      {width > 24 ? height < 24 ? <div className={styles.top}>{value}</div> : value : null}
    </div>
  );
}

export default React.memo(Bar);
