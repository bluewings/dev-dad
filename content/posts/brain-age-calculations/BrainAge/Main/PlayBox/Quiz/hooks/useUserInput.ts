import { useEffect, useRef, useState } from 'react';

const mappings = Object.entries({
  0: [0, 'M', '¼', '¾', ',', '.', '<', '>'],
  1: [1, 'J'],
  2: [2, 'K'],
  3: [3, 'L'],
  4: [4, 'U'],
  5: [5, 'I'],
  6: [6, 'O'],
  7: [7],
  8: [8],
  9: [9],
}).reduce((accum1: any, [k, v]: any) => v.reduce((accum2: any, z: any) => ({ ...accum2, [z]: k }), accum1), {});

function useUserInput(quizIndex: number, enabled = false) {
  const [userInput, setUserInput] = useState<any>({});

  const update = useRef<Function>();
  update.current = (value: string) => {
    const _value = value.replace(/^[0]{1,}([0-9])/, '$1');
    if (userInput[quizIndex] !== _value) {
      setUserInput({ ...userInput, [quizIndex]: _value });
    }
  };
  useEffect(() => {
    if (!enabled) {
      return;
    }
    const handleKeyDown: any = (event: KeyboardEvent) => {
      if (event.key === 'Backspace') {
        if (typeof userInput[quizIndex] === 'string' && userInput[quizIndex].length > 0) {
          update.current!(userInput[quizIndex].substr(0, userInput[quizIndex].length - 1));
        }
        return;
      }
      const num = mappings[String.fromCharCode(event.keyCode)] || mappings[event.key];
      if (typeof num !== 'undefined') {
        update.current!(`${userInput[quizIndex] || ''}${num}`);
      }
    };
    document.body.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, userInput, quizIndex]);

  return userInput[quizIndex] || '';
}

export default useUserInput;
