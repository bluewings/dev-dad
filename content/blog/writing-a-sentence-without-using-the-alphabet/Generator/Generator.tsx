import * as React from 'react';
import { useCallback, useEffect, useMemo, useState, useRef, SyntheticEvent } from 'react';
import { textToCode } from './util';
import { Code } from '../../../../src/components/Code';
import Skipped from './Skipped';
import styles from './Generator.module.scss';

const pickOne = (items: any) => items[~~(Math.random() * items.length)];

const samples = [
  'toy story 3',
  'to inifinity and beyond',
  'success',
  'fail',
  'bts',
  'seoul',
  'sydney',
  'california',
  'san francisco',
  'aladdin',
  'incredible',
  'yoda',
  'r2d2',
  'octocat',
  'nodejs',
  'babel',
  'starcourt',
].sort();

function Generator({ onChange, placeholder, lang }: any) {
  const inputRef = useRef<any>();
  const [text, setText] = useState(() => pickOne(samples));

  const handleTextChange = (event: SyntheticEvent) => {
    // @ts-ignore
    const userInput = event.target.value.trim();
    setText(userInput);
  };
  const handleSampleClick = (event: SyntheticEvent) => {
    event.preventDefault();
    // @ts-ignore
    const userInput = event.target.innerText.trim();
    setText(userInput);
    inputRef.current.value = userInput;
  };

  const [newLine, setNewLine] = useState(true);
  const handleNewLineToggle = useCallback(() => {
    setNewLine(!newLine);
  }, [newLine]);

  const [summary, setSummary] = useState(true);
  const handleSummaryToggle = useCallback(() => {
    setSummary(!summary);
  }, [summary]);

  const [removeSpace, setRemoveSpace] = useState(false);
  const handleRemoveSpace = useCallback(() => {
    setRemoveSpace(!removeSpace);
  }, [removeSpace]);

  const { code, skipped } = useMemo(
    () =>
      textToCode(text, {
        newLine,
        summary,
        removeSpace,
      }),
    [text, newLine, summary, removeSpace],
  );

  useEffect(() => {
    if (typeof onChange === 'function') {
      onChange({ text, code, skipped, newLine });
    }
  }, [text, code, skipped, newLine]);

  return (
    <div className={styles.root}>
      <div className={styles.input}>
        <input
          ref={inputRef}
          type="text"
          defaultValue={text}
          placeholder={placeholder || ''}
          onChange={handleTextChange}
          autoComplete="off"
          spellCheck={false}
        />
        <div className={styles.samples}>
          {samples.map((e, i, arr) => {
            return (
              <>
                <code>
                  {e === text ? (
                    e
                  ) : (
                    <a href="" onClick={handleSampleClick}>
                      {e}
                    </a>
                  )}
                </code>
                {i < arr.length - 1 && ' · '}
              </>
            );
          })}
        </div>
        <label>
          <input type="checkbox" defaultChecked={newLine} onClick={handleNewLineToggle} />
          &nbsp;{lang === 'en' ? 'new line' : '줄바꿈'}
        </label>
        <label>
          <input type="checkbox" disabled={!newLine} defaultChecked={summary} onClick={handleSummaryToggle} />
          &nbsp;{lang === 'en' ? 'explanation' : '설명 표시'}
        </label>
        <label>
          <input type="checkbox" disabled={!newLine} defaultChecked={removeSpace} onClick={handleRemoveSpace} />
          &nbsp;{lang === 'en' ? 'remove space' : '설명 표시'}
        </label>
      </div>
      <Code codeString={code || ''} language="javascript" lineWrap={!newLine} clipboard={true} />
      <p>
        {lang === 'en'
          ? 'Only numbers and alphabets are converted, but the following alphabets are not converted.'
          : '숫자 · 영문자 이외의 문자, 그리고 다음 알파벳은 변환되지 않습니다.'}
        <br />
        <Skipped skipped={skipped} />
      </p>
    </div>
  );
}

export default Generator;
