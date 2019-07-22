import * as React from 'react';
import { useCallback, useEffect, useMemo, useState, SyntheticEvent } from 'react';
import { textToCode } from './util';
import styles from './Generator.module.scss';

function Generator({ onChange, placeholder, lang }: any) {
  const [text, setText] = useState('toy story 3');
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
          <input type="checkbox" disabled={!newLine} defaultChecked={removeSpace} onClick={handleRemoveSpace} />
          &nbsp;{lang === 'en' ? 'remove space' : '설명 표시'}
        </label>
      </div>
    </div>
  );
}

export default Generator;
