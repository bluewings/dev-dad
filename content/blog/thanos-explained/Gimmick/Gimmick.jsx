import React, { useEffect, useMemo, useRef } from 'react';
import { scaleLinear } from 'd3-scale';
import { useClientRect } from '../../../../src/hooks';
import useSplitSnapshot from './useSplitSnapshot';
import styles from './Gimmick.module.scss';

const ROTATE_Y = 45;
const ROTATE_X = 30;

const CAPTURE = 'capture';
const CREATE_IMAGE_DATA = 'create-image-data';
const MOVE_IMAGE_DATA = 'move-image-data';
const OVERLAP_CANVASES = 'overlap-canvases';
const ROTATE_AND_FADE_OUT = 'rotate-and-fade-out';

const degreesToRadians = (() => {
  const cache = {};
  return (degrees) => {
    if (cache[degrees] === undefined) {
      cache[degrees] = degrees * (Math.PI / 180);
    }
    return cache[degrees];
  };
})();

function Gimmick({ screenshot, stage, progress, numOfLayers, frame = true }) {
  const [{ width: containerWidth }, clientRef] = useClientRect(['width']);
  const { width, height, snapshots } = useSplitSnapshot(screenshot, numOfLayers);

  const layers = useMemo(() => {
    return snapshots.map((canvas, i, arr) => {
      const radian = 2 * Math.PI * (Math.random() - 0.5);
      const scaleRotate = scaleLinear()
        .domain([0, 1])
        .range([0, 15 * (Math.random() - 0.5)])
        .clamp(true);
      const scaleX = scaleLinear()
        .domain([0, 1])
        .range([0, 30 * Math.cos(radian)])
        .clamp(true);
      const scaleY = scaleLinear()
        .domain([0, 1])
        .range([0, 30 * Math.sin(radian)])
        .clamp(true);
      const transitionDelay = (1 - (1 - i / (arr.length - 1))) / 2;
      const to = Math.min(transitionDelay + 0.5);
      const scaleDelay = scaleLinear()
        .domain([transitionDelay, to])
        .range([0, 1])
        .clamp(true);
      return {
        canvas,
        transformFn: (value) => {
          const p = scaleDelay(value);
          let frameStyle = {
            transform: `rotate(${scaleRotate(p)}deg) translate(${scaleX(p)}px, ${scaleY(p)}px)`,
            borderStyle: 'dashed',
            borderColor: `rgba(128,128,128,${1 - p})`,
          };
          if (p === 1) {
            frameStyle = { ...frameStyle, borderStyle: 'none' };
          }
          return [frameStyle, { opacity: 1 - p }];
        },
      };
    });
  }, [snapshots]);

  const screenshotRef = useRef();
  useEffect(() => {
    if (screenshotRef.current && screenshot) {
      screenshotRef.current.innerHTML = '';
      screenshotRef.current.appendChild(screenshot);
    }
  }, [screenshotRef.current, screenshot]);

  const layersRef = useRef();
  useEffect(() => {
    if (layersRef.current && layers) {
      const divs = Array.from(layersRef.current.querySelectorAll(`.${styles.holder}`));
      if (divs.length === layers.length) {
        divs.forEach((div, i) => {
          // eslint-disable-next-line no-param-reassign
          div.innerHTML = '';
          div.appendChild(layers[i].canvas);
        });
      }
    }
  }, [layersRef.current, layers]);

  const [zSize, paddingTop, paddingBottom] = useMemo(() => {
    if (containerWidth && width) {
      const radianX = degreesToRadians(ROTATE_X);
      const radianY = degreesToRadians(ROTATE_Y);
      const len1 = Math.cos(radianY) * width;
      return [
        (containerWidth - len1) / Math.cos(radianY),
        (containerWidth - len1) * Math.tan(radianX) * Math.cos(radianX),
        len1 * Math.tan(radianX) * Math.cos(radianX),
      ];
    }
    return [0, 0, 0];
  }, [containerWidth, width]);

  const getStyles = useMemo(() => {
    if (layers) {
      switch (true) {
        case stage === CREATE_IMAGE_DATA: {
          return (index) => [{ transform: `translateZ(${(-zSize * index) / layers.length}px)` }, { opacity: 0 }];
        }
        case stage === MOVE_IMAGE_DATA: {
          return (index, progress_) => [
            { transform: `translateZ(${(-zSize * index) / layers.length}px)` },
            { width: width * progress_, overflow: 'hidden' },
          ];
        }
        case stage === OVERLAP_CANVASES: {
          return (index) => [{ transform: `translateZ(${(-zSize * index) / layers.length}px)` }];
        }
        case stage === ROTATE_AND_FADE_OUT: {
          return (index, progress_) => layers[index].transformFn(progress_);
        }
        default:
          break;
      }
    }
    return () => [{}];
  }, [stage, layers, width, height, zSize]);

  const getContainerStyles = useMemo(() => {
    if (stage === CREATE_IMAGE_DATA || stage === OVERLAP_CANVASES) {
      const scaled = scaleLinear()
        .domain([0.8, 0.2])
        .range([0, 1])
        .clamp(true);
      const cache = {};
      return (progress_) => {
        const p1 = scaled(stage === CREATE_IMAGE_DATA ? 1 - progress_ : progress_);
        if (!cache[p1]) {
          cache[p1] = {
            outer: { paddingTop: `${p1 * paddingTop}px`, paddingBottom: `${p1 * paddingBottom}px` },
            inner: {
              transformOrigin: '0 0',
              transformStyle: 'preserve-3d',
              transform: `rotateX(${-p1 * ROTATE_X}deg) rotateY(${-p1 * ROTATE_Y}deg)`,
            },
          };
        }
        return cache[p1];
      };
    }
    if (stage === MOVE_IMAGE_DATA) {
      return () => ({
        outer: { paddingTop: `${paddingTop}px`, paddingBottom: `${paddingBottom}px` },
        inner: {
          transformOrigin: '0 0',
          transformStyle: 'preserve-3d',
          transform: `rotateX(${-ROTATE_X}deg) rotateY(${-ROTATE_Y}deg)`,
        },
      });
    }
    if (stage === ROTATE_AND_FADE_OUT) {
      return () => ({ outer: {}, inner: { transformOrigin: '0 0', transformStyle: 'preserve-3d' } });
    }
    return () => ({});
  }, [stage, paddingTop, paddingBottom]);

  const containerStyle = getContainerStyles(progress);

  const clonedStyle = useMemo(() => {
    if (stage === OVERLAP_CANVASES) {
      return {
        opacity: 1 - progress,
        marginTop: (height + 57) * -1 * progress,
      };
    }
    if (stage === ROTATE_AND_FADE_OUT) {
      return {
        opacity: 0,
        marginTop: (height + 57) * -1,
      };
    }
    return {};
  }, [stage, progress, height]);

  const showScreenshot = !!stage;
  const showLayers = stage && stage !== CAPTURE;

  return (
    <div
      ref={clientRef}
      className={`${styles.container} ${!frame ? styles.noFrame : ''}`}
      style={{ display: showScreenshot ? 'block' : 'none' }}
    >
      <div className="cloned" style={clonedStyle}>
        <div className={styles.single}>
          <div>
            <div ref={screenshotRef} />
            {stage === MOVE_IMAGE_DATA && progress < 1 && (
              <div className={styles.shadow} style={{ left: width * progress }} />
            )}
          </div>
        </div>
        <hr />
      </div>
      {layers && (
        <div style={{ visibility: showLayers ? 'visible' : 'hidden ' }}>
          <div className={styles.layers} style={{ ...containerStyle.outer }}>
            <div ref={layersRef} style={{ ...containerStyle.inner, width, height }}>
              {layers.map((e, i) => {
                const [frameStyle, holderStyle] = getStyles(i, progress);
                return (
                  <div key={`layer-${i}`} className={styles.frame} style={frameStyle}>
                    <div className={styles.holder} style={holderStyle} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Gimmick;
