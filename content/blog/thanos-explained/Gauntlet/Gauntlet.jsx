import * as React from 'react';
import { scaleLinear } from 'd3-scale';
import { useMemo, useState, useEffect, useRef } from 'react';
import imgIdle from './thanos_idle.png';
import imgSnap from './thanos_snap.png';
import imgTime from './thanos_time.png';

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = document.createElement('img');
    img.onload = () => resolve({ img, width: img.width, height: img.height });
    img.onerror = (event) => reject(event);
    img.src = src;
  });

function useImages(mode) {
  const [images, setImages] = useState({});
  useEffect(() => {
    (async () => {
      const [idle, snap, time] = await Promise.all([loadImage(imgIdle), loadImage(imgSnap), loadImage(imgTime)]);
      setImages({ idle, snap, time });
    })();
  }, []);
  return useMemo(() => {
    return images[mode]
      ? {
          img: images[mode].img,
          width: images.idle.width,
          height: images.idle.height,
          fullWidth: images[mode].width,
        }
      : null;
  }, [images, mode]);
}

const animate = (canvas, filmstrip, fps = 25) => {
  return new Promise((resolve) => {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      let lastIndex = -1;
      const width = canvas.width;
      const height = canvas.height;
      const frameCount = filmstrip.fullWidth / width;
      const start = new Date().valueOf();
      const play = () => {
        const now = new Date().valueOf();
        const frameIndex = Math.min(Math.floor(((now - start) * fps) / 1000), frameCount - 1);
        if (lastIndex !== frameIndex) {
          ctx.clearRect(0, 0, width, height);
          ctx.drawImage(filmstrip.img, width * frameIndex, 0, width, height, 0, 0, width, height);
          lastIndex = frameIndex;
        }
        if (frameIndex < frameCount - 1) {
          requestAnimationFrame(play);
          return;
        }
        resolve();
      };
      play();
    } else {
      resolve();
    }
  });
};

function useAnimate(from, to, duration = 1500) {
  const [value, setValue] = useState(0);
  const requestId = useRef();

  const _value = useRef();
  _value.current = value;

  useEffect(() => {
    if (requestId.current) {
      cancelAnimationFrame(requestId.current);
    }
    if (from === to) {
      return;
    }
    const start = new Date().valueOf();
    const scaled = scaleLinear()
      .domain([start, start + duration])
      .range([from, to])
      .clamp(true);
    const play = () => {
      const now = new Date().valueOf();
      const nextVal = Math.round(scaled(now) * 100) / 100;
      if ((from < to && nextVal < to) || (from > to && nextVal > to)) {
        requestId.current = requestAnimationFrame(play);
      }
      if (_value.current !== nextVal) {
        setValue(nextVal);
      }
    };
    play();
    return () => {
      cancelAnimationFrame(requestId.current);
    };
  }, [from, to, duration]);
  return value;
}

function Gauntlet({ onModeChange, onProgressChange, duration }) {
  const [mode, setMode] = useState('idle');
  const [disabled, setDisabled] = useState(false);

  const image = useImages(mode);

  const canvasRef = useRef();

  const handleClick = () => !disabled && setMode(mode === 'snap' ? 'time' : 'snap');

  useEffect(() => {
    if (typeof onModeChange === 'function') {
      onModeChange(mode);
    }
  }, [mode]);

  const [[from, to], setRange] = useState([0, 0]);
  const value = useAnimate(from, to, duration);

  useEffect(() => {
    if (typeof onProgressChange === 'function') {
      onProgressChange(value);
    }
  }, [value]);

  useEffect(() => {
    if (canvasRef.current && image) {
      (async () => {
        setDisabled(true);
        await animate(canvasRef.current, image, 24);
        if (mode === 'snap') {
          setRange([0, 1]);
        } else if (mode === 'time') {
          setRange([1, 0]);
        }
        setDisabled(false);
      })();
    }
  }, [image, mode]);

  return image ? (
    <canvas
      ref={canvasRef}
      width={image.width}
      height={image.height}
      onClick={handleClick}
      style={{ cursor: disabled ? 'wait' : 'pointer' }}
    />
  ) : null;
}

export default Gauntlet;
