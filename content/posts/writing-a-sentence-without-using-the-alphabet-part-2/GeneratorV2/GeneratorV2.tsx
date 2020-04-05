import * as React from 'react';
import { useCallback, useEffect, useMemo, useState, useRef, SyntheticEvent } from 'react';
import { textToCode } from './util';
import { Code } from 'gatsby-plugin-bluewings';
import styles from './GeneratorV2.module.scss';

const pickOne = (items: any) => items[~~(Math.random() * items.length)];

const samples = ['Hello 안녕 👋'].sort();

function Generator({ onChange, placeholder, lang }: any) {
  const inputRef = useRef<any>();
  const [text, setText] = useState(() => pickOne(samples));

  const handleTextChange = (event: SyntheticEvent) => {
    // @ts-ignore
    const userInput = event.target.value.trim();
    setText(userInput);
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
  const handleRemoveSpaceToggle = useCallback(() => {
    setRemoveSpace(!removeSpace);
  }, [removeSpace]);

  const [useOperators, setOperators] = useState(false);
  const handleUseOperatorsToggle = useCallback(() => {
    setOperators(!useOperators);
  }, [useOperators]);

  const { code } = useMemo(
    () =>
      textToCode(text, {
        newLine,
        summary,
        removeSpace,
        operators: useOperators,
      }),
    [text, newLine, summary, removeSpace, useOperators],
  );

  useEffect(() => {
    if (typeof onChange === 'function') {
      onChange({ text, code, newLine });
    }
  }, [text, code, newLine]);

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
        <label>
          <input type="checkbox" defaultChecked={newLine} onClick={handleNewLineToggle} />
          &nbsp;{lang === 'en' ? 'new line' : '줄바꿈'}
        </label>
        <label>
          <input type="checkbox" disabled={!newLine} defaultChecked={summary} onClick={handleSummaryToggle} />
          &nbsp;{lang === 'en' ? 'explanation' : '설명 표시'}
        </label>
        <label>
          <input type="checkbox" disabled={!newLine} defaultChecked={removeSpace} onClick={handleRemoveSpaceToggle} />
          &nbsp;{lang === 'en' ? 'remove space' : '공백 제거'}
        </label>
        <label>
          <input type="checkbox" defaultChecked={useOperators} onClick={handleUseOperatorsToggle} />
          &nbsp;{lang === 'en' ? 'operators' : '연산자 사용'} <code className={styles.code}>-</code>{' '}
          <code className={styles.code}>*</code> <code className={styles.code}>/</code>
        </label>
      </div>
      <Code codeString={code || ''} lineWrap={!newLine} clipboard={true} />
    </div>
  );
}

export default Generator;
