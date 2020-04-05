// @ts-ignore
import html2canvas from 'html2canvas';
import { css } from 'emotion';

const getStyles = (() => {
  const cached: any = {};
  return (duration: any) => {
    if (!cached[duration]) {
      cached[duration] = {
        canvasGroup: css({
          position: 'absolute',
          pointerEvents: 'none',
          canvas: {
            position: 'absolute',
            transition: `${duration}s ease-in-out`,
          },
        }),
        vanished: css({
          visibility: 'hidden',
          pointerEvents: 'none',
        }),
      };
    }
    return cached[duration];
  };
})();

const vanish = async (target: HTMLElement, options: any) => {
  const canvas = await html2canvas(target);
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const canvasGroup = document.createElement('div');
    const width = canvas.width;
    const height = canvas.height;
    const numOfLayers = (options && options.numOfLayers) || 32;
    const duration = (options && options.duration) || 1.35;
    const styles = getStyles(duration);
    target.parentNode && target.parentNode.insertBefore(canvasGroup, target);
    const compuled = window.getComputedStyle(target);
    if (compuled.position === 'absolute' || compuled.position === 'fixed') {
      canvasGroup.style.position = compuled.position;
      canvasGroup.style.left = compuled.left;
      canvasGroup.style.top = compuled.top;
      // @ts-ignore
      canvasGroup.style.zIndex = 10000;
    }

    canvasGroup.classList.add(styles.canvasGroup);
    const imageData = ctx.getImageData(0, 0, width, height);
    const layers = new Array(numOfLayers).fill(null).map((g) => ctx.createImageData(width, height));
    for (let x = 0; x < width; ++x) {
      for (let y = 0; y < height; ++y) {
        for (let m = 0; m < 1; ++m) {
          const i = Math.floor((numOfLayers * (Math.random() + (2 * x) / width)) / 3);
          const p = 4 * (y * width + x);
          for (let j = 0; j < 4; ++j) {
            layers[i].data[p + j] = imageData.data[p + j];
          }
        }
      }
    }
    const promises = layers.map(
      (layer, i) =>
        new Promise((resolve) => {
          // @ts-ignore
          const clone = canvas.cloneNode(!0);
          // @ts-ignore
          clone.getContext('2d').putImageData(layer, 0, 0);
          clone.addEventListener('transitionend', resolve);
          canvasGroup.appendChild(clone);
          setTimeout(() => {
            const rad = 2 * Math.PI * (Math.random() - 0.5);
            const transform = `rotate(${15 * (Math.random() - 0.5)}deg) translate(${60 * Math.cos(rad)}px, ${30 *
              Math.sin(rad)}px)`;
            clone.style.transitionDelay = `${(duration * i) / 32}s`;
            clone.style.transform = transform;
            clone.style.opacity = '0';
          });
        }),
    );
    target.classList.add(styles.vanished);
    await Promise.all(promises);
    canvasGroup.parentNode && canvasGroup.parentNode.removeChild(canvasGroup);
  }
  return true;
};

export default vanish;
