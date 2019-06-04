import React, { useEffect, useRef, useState } from 'react';
import pretty from 'pretty';
import Heroes from './Heroes';
import { useHandle, useTheme } from '../../../../src/hooks';
import useHtml2canvas from './useHtml2canvas';
import styles from './Sample.module.scss';

const FONT = 'font';
const IMAGE = 'image';

const TIMEOUT = 5000;

function wait(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

async function elementReady(element) {
  const images = Array.from(element.querySelectorAll('img'));
  await Promise.all([
    ...images.map((img) => {
      return new Promise((resolve) => {
        if (img.complete) {
          resolve();
        }
        setTimeout(resolve, TIMEOUT);
        // eslint-disable-next-line no-param-reassign
        img.onLoad = resolve;
      });
    }),
  ]);
}

function useWidth(wrap) {
  const timerId = useRef();

  const [width, setWidth] = useState(null);

  useEffect(() => {
    if (timerId.current) {
      clearTimeout(timerId.current);
    }

    function checkWidth() {
      const rect = wrap.current.getBoundingClientRect();
      if (width !== rect.width) {
        setWidth(rect.width);
      }
    }

    checkWidth();

    timerId.current = setInterval(checkWidth, 500);

    return () => {
      if (timerId.current) {
        clearTimeout(timerId.current);
      }
    };
  }, [width, wrap.current]);

  return width;
}

function Sample({ children, type, capture, onCapture, onLoad, flash = true }) {
  const theme = useTheme();
  const [key, setKey] = useState('tmp');
  const [mode, setMode] = useState(FONT);
  const [snapshot, setSnapshot] = useState(null);
  const wrap = useRef();

  const width = useWidth(wrap);

  const handleCapture = useHandle(onCapture);
  const handleLoad = useHandle(onLoad);

  const handleShuffleClick = () => {
    setKey(Math.random().toString());
  };

  const handleModeClick = () => {
    setMode(mode === FONT ? IMAGE : FONT);
  };

  const [onscreen, setOnscreen] = useState(false);
  const requestId = useRef();

  useEffect(() => {
    if (onscreen) {
      return;
    }
    if (requestId.current) {
      cancelAnimationFrame(requestId.current);
    }
    const checkOnscreen = () => {
      if (wrap.current) {
        const rect = wrap.current.getBoundingClientRect();
        const nextOnscreen = rect.top > 0 && rect.bottom < document.documentElement.clientHeight;
        if (onscreen !== nextOnscreen) {
          setOnscreen(nextOnscreen);
        } else {
          requestId.current = requestAnimationFrame(checkOnscreen);
        }
      }
    };
    checkOnscreen();

    return () => {
      if (requestId.current) {
        cancelAnimationFrame(requestId.current);
      }
    };
  }, [onscreen]);

  const html2canvas = useHtml2canvas();

  useEffect(() => {
    // console.log(wrap.current, html2canvas, onscreen);
    if (wrap.current && typeof html2canvas === 'function' && onscreen) {
      (async () => {
        // await elementReady(wrap.current);
        // const parentWidth = `${wrap.current.getBoundingClientRect().width}px`;
        // const tmp = document.createElement('div');
        // const inner = document.createElement('div');
        // tmp.classList.add(styles.tmp);
        // tmp.style.top = `${window.pageYOffset}px`;
        // tmp.style.width = parentWidth;
        // tmp.appendChild(inner);
        // document.body.appendChild(tmp);
        // inner.innerHTML = wrap.current.innerHTML;
        // inner.style.maxWidth = parentWidth;
        // await wait(500);
        // wrap.current.classList.add('withoutTransform');
        const canvas = await html2canvas(wrap.current, {
          backgroundColor: null,
          scale: 1,
        });
        // wrap.current.classList.remove('withoutTransform');
        // inner.innerHTML = '';
        // tmp.removeChild(inner);
        // document.body.removeChild(tmp);
        // console.log('%c-=-=-=-=-=-=-', 'background:yellow')
        setSnapshot(canvas);
      })();
    }
  }, [theme, wrap.current, html2canvas, key, width, onscreen]);

  useEffect(() => {
    if (wrap.current && wrap.current.innerHTML) {
      handleLoad(pretty(wrap.current.innerHTML.replace(/></g, '>\n<')));
    }
  }, [wrap.current, key]);

  useEffect(() => {
    if (snapshot) {
      handleCapture(snapshot);
    }
  }, [snapshot]);

  if (children) {
    return (
      <div className={onscreen ? styles.onscreen : ''} ref={wrap} style={{ display: 'inline-block' }}>
        {children}
      </div>
    );
  }

  return (
    <div key={key} className={styles.root}>
      <div style={{ float: 'right' }}>
        {/* <button className={styles.btnShuffle} type="button" style={{ marginRight: 4 }} onClick={handleModeClick}>
          <i className={`fa fa-fw fa-${mode}`} />
        </button> */}
        <button className={styles.btnShuffle} type="button" onClick={handleShuffleClick}>
          <i className="fa fa-fw fa-random" />
        </button>
      </div>
      <div style={{ clear: 'both' }} />
      <div style={{ position: 'relative' }}>
        <div className={onscreen && styles.onscreen} ref={wrap}>
          <Heroes tick={key} type={type} />
        </div>
        {capture && flash && (
          <div key={`flash-${key}`} className={styles.flash}>
            <i className="fa fa-camera-retro" />
          </div>
        )}
      </div>
    </div>
  );
}

export default Sample;
