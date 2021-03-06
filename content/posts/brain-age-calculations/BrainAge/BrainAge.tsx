import * as React from 'react';
import { useMemo, useState } from 'react';
import { Styled } from 'theme-ui';
import Intro from './Intro';
import Main from './Main';
import Firebase from './Firebase';
import { getMyPlayerId } from './lib/utils';
import { usePlayRecords } from './lib/firebase';
import styles from './BrainAge.module.scss';

function BrainAge(props: any) {
  const myPlayerId = useMemo(() => getMyPlayerId(), []);

  const [playbacks, loading] = usePlayRecords();

  const [key, setKey] = useState('main');
  const [stage, setStage] = useState('intro');

  const handleRestart = () => {
    setKey(Math.random().toString(36).substr(-8));
  };

  const handleStart = (event: any) => {
    event.preventDefault();
    setStage('game');
  };
  return (
    <div className={styles.root}>
      {loading ? (
        <Styled.h2 style={{ textAlign: 'center', margin: 0, padding: 40 }}>로딩중...</Styled.h2>
      ) : stage === 'intro' ? (
        <Styled.h2 style={{ textAlign: 'center', margin: 0, padding: 40 }}>
          <a href="" onClick={handleStart}>
            계산 20회 시작하기
          </a>
        </Styled.h2>
      ) : (
        <>
          <Main key={key} playbacks={playbacks} onRestart={handleRestart} />
        </>
      )}
      {/* <h2>{myPlayerId}</h2> */}
      {/* <h1>BrainAge</h1> */}
    </div>
  );
}

function BrainAgeWrap() {
  return <Firebase>{() => <BrainAge />}</Firebase>;
}

export default BrainAgeWrap;
