/* eslint-disable no-bitwise */
const BASE = '가'.charCodeAt(0); // 0xac00

const INITIALS = [
  'ㄱ',
  'ㄲ',
  'ㄴ',
  'ㄷ',
  'ㄸ',
  'ㄹ',
  'ㅁ',
  'ㅂ',
  'ㅃ',
  'ㅅ',
  'ㅆ',
  'ㅇ',
  'ㅈ',
  'ㅉ',
  'ㅊ',
  'ㅋ',
  'ㅌ',
  'ㅍ',
  'ㅎ',
];
const MEDIALS = [
  'ㅏ',
  'ㅐ',
  'ㅑ',
  'ㅒ',
  'ㅓ',
  'ㅔ',
  'ㅕ',
  'ㅖ',
  'ㅗ',
  'ㅘ',
  'ㅙ',
  'ㅚ',
  'ㅛ',
  'ㅜ',
  'ㅝ',
  'ㅞ',
  'ㅟ',
  'ㅠ',
  'ㅡ',
  'ㅢ',
  'ㅣ',
];
const FINALES = [
  '',
  'ㄱ',
  'ㄲ',
  'ㄳ',
  'ㄴ',
  'ㄵ',
  'ㄶ',
  'ㄷ',
  'ㄹ',
  'ㄺ',
  'ㄻ',
  'ㄼ',
  'ㄽ',
  'ㄾ',
  'ㄿ',
  'ㅀ',
  'ㅁ',
  'ㅂ',
  'ㅄ',
  'ㅅ',
  'ㅆ',
  'ㅇ',
  'ㅈ',
  'ㅊ',
  'ㅋ',
  'ㅌ',
  'ㅍ',
  'ㅎ',
];

const STROKES = {
  '': 0,
  ㄱ: 2,
  ㄲ: 4,
  ㄴ: 2,
  ㄷ: 3,
  ㄸ: 6,
  ㄹ: 5,
  ㅁ: 4,
  ㅂ: 4,
  ㅃ: 8,
  ㅅ: 2,
  ㅆ: 4,
  ㅇ: 1,
  ㅈ: 3,
  ㅉ: 6,
  ㅊ: 4,
  ㅋ: 3,
  ㅌ: 4,
  ㅍ: 4,
  ㅎ: 3,
  ㄳ: 4,
  ㄵ: 5,
  ㄶ: 5,
  ㄺ: 7,
  ㄻ: 9,
  ㄼ: 9,
  ㄽ: 7,
  ㄾ: 9,
  ㄿ: 9,
  ㅀ: 8,
  ㅄ: 6,
  ㅏ: 2,
  ㅐ: 3,
  ㅑ: 3,
  ㅒ: 4,
  ㅓ: 2,
  ㅔ: 3,
  ㅕ: 3,
  ㅖ: 4,
  ㅗ: 2,
  ㅘ: 4,
  ㅙ: 5,
  ㅚ: 3,
  ㅛ: 3,
  ㅜ: 2,
  ㅝ: 4,
  ㅞ: 5,
  ㅟ: 3,
  ㅠ: 3,
  ㅡ: 1,
  ㅢ: 2,
  ㅣ: 1,
};

console.log(JSON.stringify(STROKES));

const getSymbol = (char) => {
  if (!char.match(/[ㄱ-ㅎ가-힣]/)) {
    return false;
  }
  let initial = '';
  let medial = '';
  let finale = '';
  if (char.match(/[ㄱ-ㅎ]/)) {
    initial = char;
  } else {
    const tmp = char.charCodeAt(0) - BASE;
    const finaleOffset = tmp % FINALES.length;
    const medialOffset = ((tmp - finaleOffset) / FINALES.length) % MEDIALS.length;
    const initialOffset = ((tmp - finaleOffset) / FINALES.length - medialOffset) / MEDIALS.length;
    initial = INITIALS[initialOffset];
    medial = MEDIALS[medialOffset];
    finale = FINALES[finaleOffset];
  }
  const initialStrokes = STROKES[initial];
  const medialStrokes = STROKES[medial];
  const finaleStrokes = STROKES[finale];
  return {
    initial,
    medial,
    finale,
    initialStrokes,
    medialStrokes,
    finaleStrokes,
    numOfStrokes: initialStrokes + medialStrokes + finaleStrokes,
  };
};

function getScore(name1, name2) {
  const symbols1 = name1.match(/[\s\S]/g).map((char) => [char, getSymbol(char).numOfStrokes]);
  const symbols2 = name2.match(/[\s\S]/g).map((char) => [char, getSymbol(char).numOfStrokes]);
  const maxLen = Math.max(symbols1.length, symbols2.length);

  const [chars, numbers] = Array(maxLen)
    .fill()
    .reduce(
      ([accum1, accum2], e, i) => {
        const [char1, num1] = symbols1[i] || ['', 0];
        const [char2, num2] = symbols2[i] || ['', 0];
        return [[...accum1, char1, char2], [...accum2, num1, num2]];
      },
      [[], []],
    );

  let nums = numbers.slice();
  const stages = [nums];
  while (nums.length > 2 && nums.join('') !== '100') {
    nums = nums.reduce((a, e, i, arr) => {
      if (i < arr.length - 1) {
        return [...a, (e + arr[i + 1]) % 10];
      }
      return a;
    }, []);
    stages.push(nums);
  }
console.log(JSON.stringify({ score: ~~stages.slice(-1)[0].join(''), chars, stages }))
  return { score: ~~stages.slice(-1)[0].join(''), chars, stages };
}

function shuffle(arr) {
  const array = arr.slice();
  let counter = array.length;
  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    const index = Math.floor(Math.random() * counter);
    // Decrease counter by 1
    counter -= 1;
    // And swap the last element with it
    const temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
}



export { getSymbol, getScore, shuffle };
