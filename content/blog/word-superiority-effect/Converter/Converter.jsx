import React, { useMemo, useState, useRef } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import styles from './Converter.module.scss';

const sample =
  '캠브릿지 대학의 연구결과에 따르면, 한 단어 안에서 글자가 어떤 순서로 배열되어 있는지는 중요하지 않고, 첫 번째와 마지막 글자가 올바른 위치에 있는 것이 중요하다고한다.\n\n나머지 글자들은 완전히 엉망진창의 순서로 되어 있을지라도 당신은 아무 문제 없이 이것을 읽을 수 있다.\n\n왜냐하면, 인간의 두뇌는 모든 글자를 하나하나 읽는 것이 아니라 단어 하나를 전체로 인식하기 때문이다.';

function jumble(word) {
  const letters = word.match(/[\s\S]/g);
  const [i1, i2] = letters
    .map((e, i) => i)
    .slice(1, -1)
    .map((e) => [Math.random(), e])
    .sort((a, b) => a[0] - b[0])
    .map((e) => e[1]);
  if (i1 && i2) {
    const tmp = letters[i1];
    letters[i1] = `<span class="${styles.i1}">${letters[i2]}</span>`;
    letters[i2] = `<span class="${styles.i2}">${tmp}</span>`;
  }
  return letters.join('');
}

function Converter() {
  const [text, setText] = useState(sample);

  const handleChange = (event) => {
    setText(event.target.value.trim());
  };

  const cache = useRef({});
  const converted = useMemo(
    () => ({
      __html: text
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/[가-힣]+/g, (word) => {
          if (!cache.current[word]) {
            cache.current[word] = jumble(word);
          }
          return cache.current[word];
        }),
    }),
    [text],
  );

  return (
    <div className={styles.root}>
      <div className={styles.input}>
        <TextareaAutosize defaultValue={sample} onChange={handleChange} />
      </div>
      <div className={styles.output} dangerouslySetInnerHTML={converted} />
    </div>
  );
}

export default Converter;
