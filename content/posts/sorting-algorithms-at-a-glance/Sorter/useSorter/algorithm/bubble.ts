import {
  visual_blockStart,
  visual_blockEnd,
  visual_compare,
  visual_done,
  visual_swap,
} from '../Visualizer/Visualizer.reducer';

function* bubbleSort(arr: number[]) {
  for (let i = 0; i < arr.length; i++) {
    yield visual_blockStart();
    for (let j = 1; j < arr.length - i; j++) {
      yield visual_compare(j, j - 1);
      if (arr[j] < arr[j - 1]) {
        const temp = arr[j - 1];
        arr[j - 1] = arr[j];
        arr[j] = temp;
        yield visual_swap(j - 1, j);
      }
    }
    yield visual_done(arr.length - i - 1);
    yield visual_blockEnd();
  }
  return arr;
}

export default bubbleSort;
