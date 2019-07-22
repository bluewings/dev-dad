import 'typeface-merriweather';
import { wrapRootElement as wrap } from './src/utils/wrap-root-element';

const wait = (delay = 100) => new Promise((resolve) => setTimeout(resolve, delay));

const findElement = async (selector) => {
  const times = Array(20).fill(true);
  // eslint-disable-next-line
  for (const i of times) {
    const found = document.querySelector(selector);
    if (found) {
      return found;
    }
    // eslint-disable-next-line
    await wait(100);
  }
  return null;
};

document.onreadystatechange = async () => {
  if (document.readyState === 'complete') {
    if (typeof window.location.hash === 'string' && window.location.hash) {
      const selector = decodeURIComponent(window.location.hash.replace(/^#/, '#user-content-'));
      try {
        const target = await findElement(selector);
        if (target) {
          window.scrollBy({ top: target.getBoundingClientRect().top });
        }
      } catch (err) {
        /* ignore */
      }
    }
  }
};

export const wrapRootElement = wrap;
