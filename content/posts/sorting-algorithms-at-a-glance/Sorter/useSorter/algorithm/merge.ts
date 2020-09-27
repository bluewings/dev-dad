// function* mergeSort(arr: number[]) {
//   for (let i = 0; i < arr.length; i++) {
//     for (let j = 1; j < arr.length - i; j++) {
//       yield { type: 'compare', payload: [j, j - 1] };
//       if (arr[j] < arr[j - 1]) {
//         const temp = arr[j - 1];
//         arr[j - 1] = arr[j];
//         arr[j] = temp;
//         yield { type: 'swap', payload: [j - 1, j] };
//       }
//     }
//     yield { type: 'done', payload: arr.length - i - 1 };
//   }
//   yield arr;
// }

function* mergeSort_(arr: number[]): any {
  const ops = mergeSort(arr);

  // for ()
  yield* ops;
}

// let mergeSort = function(arr: number[]) {
function* mergeSort(arr: number[], startIndex: number = 0, depth: number = 0): any {
  // 원소가 하나일 때는 그대로 내보냅니다.
  if (arr.length < 2) {
    // console.log('send ret', arr);
    // options.result = arr;
    return arr;
  }

  // console.log(index);

  // console.log(arr);
  const pivot = Math.floor(arr.length / 2); // 대략 반으로 쪼개는 코드
  const left = arr.slice(0, pivot); // 쪼갠 왼쪽
  const right = arr.slice(pivot, arr.length); // 쪼갠 오른쪽

  yield { type: 'mergesort left' };

  // console.log('%c depth ' + depth + ' ', 'background:yellow;color:#000');

  // console.log('merge L', startIndex, left.length);
  console.log(left, right);

  const _left = yield* mergeSort(left, startIndex, depth + 1);

  yield { type: 'mergesort right' };
  // console.log('merge R', startIndex, right.length);
  const _right = yield* mergeSort(right, startIndex + pivot, depth + 1);

  // yield { type: 'mergesort left'};
  // console.log(_right);
  // _right = _right.result;
  // console.log('>>> right', _right);
  // _right = _right.result;

  // console.log('%c counquer ', 'background:yellow');

  // console.log(_left, _right);

  // const inst = {} as any;
  // const result = yield* merge(_left, _right, startIndex, depth + 1); // 재귀적으로 쪼개고 합칩니다.
  // console.log('get merge result', inst.result);
  // console.log('get merge result', result.next());

  // console.log('get merge result', result);
  // options.result = result;
  const result: any = [];
  return result;
}

function* merge(left: number[], right: number[], startIndex: number, depth: number): any {
  let result = [];
  while (left.length && right.length) {
    if (left[0] <= right[0]) {
      // 두 배열의 첫 원소를 비교하여
      result.push(left.shift()); // 더 작은 수를 결과에 넣어줍니다.
    } else {
      result.push(right.shift()); // 오른쪽도 마찬가지
    }
  }

  console.log('%c depth ' + (depth - 1) + ' ', 'background:orange;color:#000');
  while (left.length) result.push(left.shift()); // 어느 한 배열이 더 많이 남았다면 나머지를 다 넣어줍니다.
  while (right.length) result.push(right.shift()); // 오른쪽도 마찬가지
  console.log('send merge result', result);

  yield { type: 'merge' };
  // reg.result = result;
  return result;
}

export default mergeSort_;
