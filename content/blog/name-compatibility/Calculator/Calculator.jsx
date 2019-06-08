/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useMemo, useState, useEffect } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { interpolateRdYlBu, hsl } from 'd3';
import Octicon from 'react-octicon';
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

const getAttrFromClosest = (source, attrName) => {
  const target = source.getAttribute(attrName) ? source : source.closest(`[${attrName}]`);
  if (target) {
    return target.getAttribute(attrName);
  }
  return null;
};

const compareScore = (a, b) => {
  if (a.score === b.score) {
    return 0;
  }
  return a.score < b.score ? 1 : -1;
};

function Calculator({ onCasesChange }) {
  const sample = useMemo(() => {
    return shuffle(seed)
      .slice(0, 8)
      .join(' ');
  }, []);

  const [text, setText] = useState(sample);

  const handleChange = (event) => {
    setText(event.target.value.trim());
  };

  const cases = useMemo(() => {
    const all = text
      .split(/[\n\s,]/)
      .map((e) => e.replace(/\s+/g, ''))
      .filter((e) => e && e.length > 1 && e.length < 5 && e.search(/[^ㄱ-ㅎ가-힣]/) === -1);
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

  const [selected, setSelected] = useState(null);

  const [query, setQuery] = useState('');

  const handleFilterChange = (event) => {
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

  const handleCaseFocus = (event) => {
    const caseIndex = parseInt(getAttrFromClosest(event.target, 'data-case-index'), 10);
    if (selected !== filtered[caseIndex]) {
      setSelected(filtered[caseIndex]);
    }
  };

  const getColors = (value) => {
    const background = interpolateRdYlBu(1 - value / 100);
    const hsl1 = hsl(background);
    return {
      borderLeft: `10px solid ${background}`,
      background,
      color: hsl1.l < 0.7 ? '#fff' : '#000',
    };
  };

  const [tick, setTick] = useState('any');

  const handleNameClick = (event) => {
    event.preventDefault();
    setQuery(event.target.innerText.replace(/\s/g, ''));
    setTick(
      Math.random()
        .toString(36)
        .substr(-7),
    );
  };
  const BASE = '가'.charCodeAt(0);

  Array(200)
    .fill()
    .map((e, i) => BASE + i)
    .map((i) => String.fromCharCode(i))
    .join('');

  return (
    <div className={styles.root}>
      <div className={styles.input}>
        <TextareaAutosize defaultValue={sample} onChange={handleChange} autocomplete="off" spellcheck="false" />
      </div>
      <div className={styles.showcase}>
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
            <ul>
              {filtered.map((e, i) => {
                return (
                  <li
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
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        <div className={styles.calc}>
          {/* {JSON.stringify(selected)} */}
          {selected && (
            <div>
              <div>
                <h1 className={styles.names}>
                  {selected.names[0]}
                  &nbsp;
                  <Octicon mega name="x" />
                  &nbsp;
                  {selected.names[1]}
                </h1>
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
