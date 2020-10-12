import React, { useMemo, useState } from 'react';
import { Menu, Dropdown, Input, Tooltip } from 'antd';
import { getRegExp } from 'korean-regexp';
import { useMeasure } from 'react-use';
import styles from './Demo.module.scss';
import Code from 'gatsby-plugin-bluewings/src/components/Code';
import GridRow from 'gatsby-plugin-bluewings/src/components/Grid/Row';
import GridColumn from 'gatsby-plugin-bluewings/src/components/Grid/Column';
import { Styled } from 'theme-ui';
import useTyped from './useTyped';
import movies from './movies.json';

const compareIndex = ({ index: a }: any, { index: b }: any) => (a === b ? 0 : a < b ? -1 : 1);

const NUM_OF_DISPLAYS = 5;

const keywords: string[] = [];
movies.forEach(([title]: any) => {
  title
    .replace(/[^a-zA-Z0-9ㄱ-ㅎ가-힣]/g, ' ')
    .split(/\s+/)
    .filter((title: string) => title.length > 2)
    .forEach((title: string) => keywords.push(title));
});

const columnProps = { args: [], layoutFixed: true };

function Demo() {
  const [rootRef, { width }]: [any, any] = useMeasure();
  const [randomKeywords, setRandomKeywords] = useState(() => shuffle(keywords));

  const [focused, setFocused] = useState(false);
  const [userInput, setUserInput] = useState('');

  const [typeSpeed, setTypeSpeed] = useState(750);
  const typed = useTyped(randomKeywords, {
    typeSpeed,
    backSpeed: typeSpeed / 3,
    pause: focused,
  });

  const value = focused ? userInput : typed;

  const inputOptions = {
    onFocus: (event: any) => {
      setFocused(true);
      setUserInput(event.target.value);
    },
    onBlur: () => {
      setFocused(false);
      setUserInput('');
      setRandomKeywords(shuffle(keywords));
    },
    onChange: (event: any) => {
      setUserInput(event.target.value);
    },
    value,
  };

  const [regexp, regexp_] = useMemo(
    () => [
      getRegExp(value, {
        ignoreSpace: true,
        initialSearch: true,
      }),
      getRegExp(value, {
        initialSearch: true,
      }),
    ],
    [value],
  );

  const [filtered1, menu1] = useFiltered(movies, value);
  const [filtered2, menu2] = useFiltered(movies, regexp);

  return (
    <div ref={rootRef} style={{ marginTop: 28 }}>
      <small style={{ marginBottom: '1rem', display: 'block' }}>자동완성 예시) 2005년 이후 영화 제목</small>
      <GridRow>
        <GridColumn {...columnProps} >
          <Styled.h3 style={{ marginTop: 0 }}>단순 문자열 비교 결과</Styled.h3>
          <div key={`w${width}`} className={styles.box}>

            <Input size="large" {...inputOptions} />
            {filtered1.length > 0 && (
              <Dropdown overlay={menu1} visible={filtered1.length > 0}>
                <div />
              </Dropdown>
            )}
          </div>
          <div style={{ padding: '0 21px' }}>
            <Code language="javascript" codeString={`t.indexOf('${value}') !== -1`} />
          </div>
        </GridColumn>
        <GridColumn {...columnProps} >
          <Styled.h3 style={{ marginTop: 0 }}>기대한 결과</Styled.h3>
          <div key={`w${width}`} className={styles.box}>  
            <Tooltip title="직접 입력해보세요." visible={true} placement="topRight">
              <Input size="large" {...inputOptions} />
            </Tooltip>
            {filtered2.length > 0 && (
              <Dropdown overlay={menu2} visible={filtered2.length > 0}>
                <div />
              </Dropdown>
            )}
          </div>
          <div style={{ padding: '0 21px' }}>
            <Code language="javascript" codeString={`t.search(/${regexp_.source}/) !== -1`} />
          </div>
        </GridColumn>
      </GridRow>
    </div>
  );
}

export default Demo;

function shuffle(arr: any[]) {
  let array = [...arr];
  let counter = array.length;
  while (counter > 0) {
    let index = Math.floor(Math.random() * counter);
    counter--;
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
}

function useFiltered(array: any[], pattern: RegExp | string) {
  return useMemo(() => {
    const filtered = array
      .map(([title, code]: any) => ({
        title,
        code,
        index: typeof pattern === 'string' ? title.indexOf(pattern) : title.search(pattern),
      }))
      .filter(({ index }: any) => index !== -1)
      .sort(compareIndex)
      .slice(0, NUM_OF_DISPLAYS);
    return [
      filtered,
      <Menu>
        {filtered.map(({ title, code }: any, i: number) => (
          <Menu.Item key={i}>
            <span
              dangerouslySetInnerHTML={{
                __html: title.replace(pattern, (whole: string) => `<strong style="color:#fe1a1a;">${whole}</strong>`),
              }}
            />
          </Menu.Item>
        ))}
      </Menu>,
    ];
  }, [array, pattern]) as [any[], any];
}
