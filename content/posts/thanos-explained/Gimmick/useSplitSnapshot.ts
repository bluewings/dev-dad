import { useMemo } from 'react';

function useSplitSnapshot(canvas: any, numOfLayers = 16) {
  return useMemo(() => {
    if (!canvas) {
      return { width: 0, height: 0, snapshots: [] };
    }

    const ctx = canvas.getContext('2d');
    const snapshots = new Array(numOfLayers).fill(null).map(() => ctx.createImageData(canvas.width, canvas.height));

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    for (let x = 0; x < canvas.width; x += 1) {
      for (let y = 0; y < canvas.height; y += 1) {
        const i = Math.floor((numOfLayers * (Math.random() + (2 * x) / canvas.width)) / 3);
        const p = 4 * (y * canvas.width + x);
        for (let j = 0; j < 4; j += 1) {
          snapshots[i].data[p + j] = imageData.data[p + j];
        }
      }
    }

    return {
      width: canvas.width,
      height: canvas.height,
      snapshots: snapshots.map((layer) => {
        const clone = canvas.cloneNode(!0);
        clone.getContext('2d').putImageData(layer, 0, 0);
        // clone.getContext('2d').moveTo(0, 0);
        // clone.getContext('2d').lineTo(0, 10);
        // clone.getContext('2d').stroke();
        return clone;
      }),
    };
  }, [canvas, numOfLayers]);
}

export default useSplitSnapshot;
