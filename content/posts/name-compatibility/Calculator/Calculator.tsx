/* eslint-disable jsx-a11y/anchor-is-valid, no-restricted-globals, react/no-array-index-key */
import React, { useMemo, useState, useEffect, useRef, SyntheticEvent } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { interpolateRdYlBu, hsl } from 'd3';
import { Styled } from 'theme-ui';
import Octicon from 'react-octicon';
import Clipboard from 'react-clipboard.js';
import { getScore, shuffle } from './util';
import CalcTable from './CalcTable';
import styles from './Calculator.module.scss';

const seed = [
  '봉준호',
  '박소담',
  '현승민',
  '최우식',
  '조여정',
  '장혜진',
  '송강호',
  '박찬욱',
  '마동석',
  '이정은',
  '김성규',
  '이유영',
  '이선균',
  '박명훈',
  '김규리',
  '원진아',
  '정은지',
  '김무열',
  '정다원',
];

const getAttrFromClosest = (source: any, attrName: any) => {
  const target = source.getAttribute(attrName) ? source : source.closest(`[${attrName}]`);
  if (target) {
    return target.getAttribute(attrName);
  }
  return null;
};

const compareScore = (a: any, b: any) => {
  if (a.score === b.score) {
    return 0;
  }
  return a.score < b.score ? 1 : -1;
};

const inputToURI = (userInput: string) => {
  try {
    return `${location.origin}${location.pathname}?user-input=${encodeURIComponent(userInput)}#result`;
  } catch (err) {
    /* ignore */
  }
  return '';
};

function useUpdateURI() {
  const timerId = useRef<any>();
  const updater = useMemo(
    () => (nextURI: string, delay: number = 0) => {
      if (timerId.current) {
        clearTimeout(timerId.current);
      }
      timerId.current = setTimeout(() => {
        try {
          const currURI = location.href.replace(location.origin, '');
          if (currURI !== nextURI) {
            history.replaceState(null, document.title, nextURI);
          }
        } catch (err) {
          /* ignore */
        }
      }, delay);
    },
    [],
  );
  useEffect(
    () => () => {
      if (timerId.current) {
        clearTimeout(timerId.current);
      }
    },
    [],
  );
  return updater;
}

function Calculator({ onCasesChange }: any) {
  const sample = useMemo(() => {
    try {
      const userInput = location.search && decodeURIComponent(location.search.split(/[?&]user-input=/)[1] || '');
      if (userInput && userInput.trim()) {
        return userInput.trim();
      }
    } catch (err) {
      /* ignore */
    }
    return shuffle(seed)
      .slice(0, 8)
      .join(' ');
  }, []);

  const [text, setText] = useState(sample);
  const [uri, setURI] = useState('');

  const updateURI = useUpdateURI();

  const handleChange = (event: SyntheticEvent) => {
    // @ts-ignore
    const userInput = event.target.value.trim();
    const tmpUri = inputToURI(userInput);
    setText(userInput);
    setURI(tmpUri);
    updateURI(tmpUri, 2000);
  };

  const handleBlur = (event: SyntheticEvent) => {
    // @ts-ignore
    const userInput = event.target.value.trim();
    const tmpUri = inputToURI(userInput);
    setURI(tmpUri);
    updateURI(tmpUri);
  };

  const cases = useMemo(() => {
    const all = text
      .split(/[\n\s,]/)
      .map((e: any) => e.replace(/\s+/g, ''))
      .filter((e: any) => e && e.length > 1 && e.length < 5 && e.search(/[^ㄱ-ㅎ가-힣]/) === -1);
    const items = [];
    for (let x = 0; x < all.length; x += 1) {
      for (let y = 0; y < x; y += 1) {
        const name1 = all[y];
        const name2 = all[x];
        const info1 = getScore(name1, name2);
        const info2 = getScore(name2, name1);
        items.push({
          id: Math.random()
            .toString(36)
            .substr(-7),
          names: [name1, name2],
          info1,
          info2,
          score1: info1.score,
          score2: info2.score,
          score: Math.round(Math.sqrt(info1.score * info2.score)),
        });
      }
    }
    items.sort(compareScore);
    return items;
  }, [text]);

  const [selected, setSelected] = useState<any>(null);

  const [query, setQuery] = useState('');

  const handleFilterChange = (event: SyntheticEvent) => {
    // @ts-ignore
    setQuery(event.target.value.trim());
  };

  useEffect(() => {
    if (cases && cases.length > 0) {
      setSelected(cases[0]);
    } else {
      setSelected(null);
    }
    setQuery('');
    if (typeof onCasesChange === 'function') {
      onCasesChange(cases);
    }
  }, [cases]);

  const filtered = useMemo(() => {
    if (query) {
      return cases.filter((e) => {
        return e.names.join(',').search(query) !== -1;
      });
    }
    return cases;
  }, [cases, query]);

  const handleCaseFocus = (event: SyntheticEvent) => {
    const caseIndex = parseInt(getAttrFromClosest(event.target, 'data-case-index'), 10);
    if (selected !== filtered[caseIndex]) {
      setSelected(filtered[caseIndex]);
    }
  };

  const getColors = (value: number) => {
    try {
      const background = interpolateRdYlBu(1 - value / 100);
      const hsl1 = hsl(background);
      return {
        borderLeft: `10px solid ${background}`,
        background,
        color: hsl1.l < 0.7 ? '#fff' : '#000',
      };
    } catch (err) {
      /* ignore */
    }
    return {};
  };

  const [tick, setTick] = useState('any');

  const handleNameClick = (event: SyntheticEvent) => {
    event.preventDefault();
    // @ts-ignore
    setQuery(event.target.innerText.replace(/\s/g, ''));
    setTick(
      Math.random()
        .toString(36)
        .substr(-7),
    );
  };
  const BASE = '가'.charCodeAt(0);

  Array(200)
    .fill(true)
    .map((e, i) => BASE + i)
    .map((i) => String.fromCharCode(i))
    .join('');

  return (
    <div className={styles.root}>
      <div className={styles.input}>
        <TextareaAutosize
          defaultValue={sample}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete="off"
          spellCheck={false}
        />
        {selected && (
          <>
            {uri && (
              <Clipboard data-clipboard-text={uri}>
                <Octicon name="clippy" />
                현재 결과 URI 복사
              </Clipboard>
            )}
            <Styled.hr />
          </>
        )}
      </div>
      <div className={styles.showcase} id="user-content-result">
        {cases.length > 1 && (
          <div className={styles.rank}>
            <div className={styles.search}>
              <input key={tick} type="text" defaultValue={query} onChange={handleFilterChange} />
              <div className={styles.icon}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z" />
                </svg>
              </div>
            </div>
            <Styled.ul>
              {filtered.map((e, i) => {
                return (
                  <Styled.li
                    key={i}
                    data-case-index={i}
                    onFocus={handleCaseFocus}
                    onMouseOver={handleCaseFocus}
                    className={selected && selected.id === e.id ? styles.selected : ''}
                    style={getColors(e.score)}
                  >
                    <div className={styles.num}>{e.score}</div>
                    <div className={styles.name}>
                      <a href="" onClick={handleNameClick}>
                        {e.names[0]}
                      </a>
                      &nbsp;,&nbsp;
                      <a href="" onClick={handleNameClick}>
                        {e.names[1]}
                      </a>
                    </div>
                  </Styled.li>
                );
              })}
            </Styled.ul>
          </div>
        )}
        <div className={styles.calc}>
          {/* {JSON.stringify(selected)} */}
          {selected && (
            <div>
              <div>
                <Styled.h1 className={styles.names}>
                  {selected.names[0]}
                  &nbsp;
                  <Octicon mega name="x" />
                  &nbsp;
                  {selected.names[1]}
                </Styled.h1>
              </div>
              <div>
                <div className={styles.formula}>
                  &radic; ( {selected.score1} * {selected.score2} ) = {selected.score}
                </div>
              </div>
              <div>
                <div>
                  <CalcTable {...selected.info1} />
                </div>
                <div>
                  <CalcTable {...selected.info2} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Calculator;
