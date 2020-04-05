import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import styles from './UserInput.module.scss';

const noop = () => null;

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

function UserInput({ onChange = noop }: any) {
  const [answer, setAnswer] = useState('');
  const update = useRef<Function>();
  update.current = (value: string) => {
    const _value = value.replace(/^[0]{1,}([0-9])/, '$1');
    if (answer !== _value) {
      setAnswer(_value);
    }
  };
  useEffect(() => {
    const handleKeyDown: any = (event: KeyboardEvent) => {
      if (event.key === 'Backspace') {
        if (answer.length > 0) {
          update.current!(answer.substr(0, answer.length - 1));
        }
        return;
      }
      const num = mappings[String.fromCharCode(event.keyCode)] || mappings[event.key];
      if (typeof num !== 'undefined') {
        update.current!(`${answer}${num}`);
      }
    };
    document.body.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.removeEventListener('keydown', handleKeyDown);
    };
  }, [answer]);

  useEffect(() => {
    if (typeof onChange === 'function') {
      onChange(answer);
    }
  }, [answer]);

  return (
    <div className={styles.root}>
      <h1>Answer: {answer}</h1>
    </div>
  );
}

export default UserInput;
