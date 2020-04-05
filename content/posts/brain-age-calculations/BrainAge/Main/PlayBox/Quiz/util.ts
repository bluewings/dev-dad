const random = (min: number, max: number) => ~~(Math.random() * (max - min + 1) + min);

const types = [
  ['+', [1, 9], ([x, y]: number[]) => [x, y, x + y]],
  ['-', [1, 9], ([x, y]: number[]) => [x + y, x, y]],
  ['*', [0, 9], ([x, y]: number[]) => [x, y, x * y]],
  // ['/', [2, 9], ([x, y]: number[]) => [x * y, x, y]],

  // ['+', [0, 0], ([x, y]: number[]) => [x, y, x + y]],
  // ['-', [0, 0], ([x, y]: number[]) => [x + y, x, y]],
  // ['*', [0, 0], ([x, y]: number[]) => [x, y, x * y]],
];

const pickOne = (arr: any[]) => arr[~~(Math.random() * arr.length)];

const quiz = () => {
  const [operation, [min, max], mapFn] = pickOne(types);
  const [x, y, answer] = mapFn([random(min, max), random(min, max)]);
  return { x, y, answer, operation };
  // return [x, y, operation, ];
};

const makeQuizzes = (num: number) => Array(num).fill(true).map(quiz);

const hydrate = ({ x, y, operation, time, userInput }: any) => {
  return [x, y, operation, time, userInput];
};

const dehydrate = ([x, y, operation]: any) => {
  // console.log({ operation, x, y });
  let answer = null;
  if (operation === '+') {
    answer = x + y;
  } else if (operation === '-') {
    answer = x - y;
  } else if (operation === '*') {
    answer = x * y;
  }
  return { x, y, answer, operation };
};

export { makeQuizzes, hydrate, dehydrate };
