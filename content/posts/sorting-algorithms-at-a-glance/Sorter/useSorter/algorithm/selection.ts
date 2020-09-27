import {
  visual_blockStart,
  visual_blockEnd,
  visual_compare,
  visual_done,
  visual_indexMin,
  visual_swap,
} from '../Visualizer/Visualizer.reducer';

function* selectionSort(list: number[]) {
  for (let i = 0; i < list.length - 1; i++) {
    yield visual_blockStart();
    let indexMin = i;
    yield visual_indexMin(i);
    for (let j = i + 1; j < list.length; j++) {
      const _indexMin = indexMin;
      if (list[j] < list[indexMin]) {
        indexMin = j;
        yield visual_indexMin(j);
      }
      yield visual_compare(j, _indexMin);
    }
    const temp = list[indexMin];
    list[indexMin] = list[i];
    list[i] = temp;
    if (indexMin !== i) {
      yield visual_swap(indexMin, i);
    }
    yield visual_done(i);
    yield visual_blockEnd();
  }
  yield visual_done(list.length - 1);
  return list;
}

export default selectionSort;
