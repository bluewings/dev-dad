import {
  visual_access,
  visual_blockStart,
  visual_blockEnd,
  visual_done,
  visual_set,
  visual_temp,
  visual_tempRestore,
  visual_wait,
} from '../Visualizer/Visualizer.reducer';

function* insertionSort(arr: number[]) {
  yield visual_done(0);
  yield visual_wait();
  for (let index = 1; index < arr.length; index++) {
    yield visual_blockStart();
    let temp = arr[index];
    yield visual_temp(index);
    let aux = index - 1;
    yield visual_access(aux);
    yield visual_done(index);
    while (aux >= 0 && arr[aux] > temp) {
      arr[aux + 1] = arr[aux];
      yield visual_set(aux, aux + 1);
      aux--;
      yield visual_access(aux);
    }
    arr[aux + 1] = temp;
    yield visual_tempRestore(aux + 1);
    yield visual_blockEnd();
  }
  return arr;
}

export default insertionSort;
