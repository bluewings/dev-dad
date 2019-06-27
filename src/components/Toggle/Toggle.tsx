import React, { useContext, useRef, useMemo } from 'react';
import { Context as ThemeContext } from '../../utils/theme-context';
import styles from './Toggle.module.scss';

function __toggleTheme() {
  try {
    // @ts-ignore
    return window.__toggleTheme();
  } catch (err) {
    /* ignore */
  }
  return '';
}

function useTheme() {
  const { theme, setTheme }: any = useContext(ThemeContext);

  const rotate = useRef(0);

  const toggleStyle = useMemo(() => {
    const remain = Math.abs(rotate.current % 360);
    if ((theme === 'light' && remain === 0) || (theme === 'dark' && remain === 180)) {
      rotate.current -= 180;
    }
    return { transform: `rotate(${rotate.current}deg)` };
  }, [theme]);

  const toggleTheme: any = () => {
    const newTheme = __toggleTheme();
    setTheme(newTheme);
  };

  return [toggleStyle, toggleTheme];
}

const Toggle = () => {
  const [toggleStyle, toggleTheme] = useTheme();

  return (
    <div>
      <button type="button" className={styles.root} onClick={toggleTheme}>
        <div className={styles.spinner} style={toggleStyle}>
          <svg className={styles.sun} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M277.3 32h-42.7v64h42.7V32zm129.1 43.7L368 114.1l29.9 29.9 38.4-38.4-29.9-29.9zm-300.8 0l-29.9 29.9 38.4 38.4 29.9-29.9-38.4-38.4zM256 128c-70.4 0-128 57.6-128 128s57.6 128 128 128 128-57.6 128-128-57.6-128-128-128zm224 106.7h-64v42.7h64v-42.7zm-384 0H32v42.7h64v-42.7zM397.9 368L368 397.9l38.4 38.4 29.9-29.9-38.4-38.4zm-283.8 0l-38.4 38.4 29.9 29.9 38.4-38.4-29.9-29.9zm163.2 48h-42.7v64h42.7v-64z" />
          </svg>
          <svg className={styles.moon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M195 125c0-26.3 5.3-51.3 14.9-74.1C118.7 73 51 155.1 51 253c0 114.8 93.2 208 208 208 97.9 0 180-67.7 202.1-158.9-22.8 9.6-47.9 14.9-74.1 14.9-106 0-192-86-192-192z" />
          </svg>
        </div>
      </button>
    </div>
  );
};

export default Toggle;
