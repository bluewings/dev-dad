import { useEffect, useState, useMemo } from 'react';

const HTML2CANVAS_URI = 'https://cdn.jsdelivr.net/npm/html2canvas-fixed@1.0.0/html2canvas-fixed.min.js';

const loadScript = (src: string) => {
  return new Promise((resolve, reject) => {
    const head = document.head || document.getElementsByTagName('head')[0];
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`failed to load: ${src.split('/').pop()}`));
    head.appendChild(script);
  });
};

let queue: any[] = [];

function useHtml2canvas() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      // @ts-ignore
      if (!window.html2canvas) {
        await loadScript(HTML2CANVAS_URI);
      }
      setReady(true);
    })();
  }, []);

  let html2canvas: any;
  try {
    // @ts-ignore
    html2canvas = window.html2canvas;
  } catch (err) {
    /* ignore */
  }

  return useMemo(() => {
    if (ready && html2canvas) {
      return async (target: HTMLElement, options: any) => {
        await Promise.all(queue);
        const promise = html2canvas(target, options);
        queue = [promise];
        const canvas = await promise;
        return canvas;
      };
    }
    return null;
  }, [ready, html2canvas]);
}

export default useHtml2canvas;
