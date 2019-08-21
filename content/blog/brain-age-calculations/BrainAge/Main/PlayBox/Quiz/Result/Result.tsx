import * as React from 'react';
import { useCallback } from 'react';
import { submitPlayRecord } from '../../../../lib/firebase';
import { hydrate } from '../util';
import medalImg from '../../medal.png';
import styles from './Result.module.scss';

const disp = (time: number) => {
  // const min =
  const all = ~~(time / 1000);
  const sec = all % 60;
  const min = ~~(all / 60);

  return [min && `${min}분`, `${sec}초`].filter((e) => e).join(' ');
  // const sec = all % 60
};

function Result(props: any) {
  const { rank, me, timeUsed, missed, record, quizzes, onRestart } = props;

  const handleSubmitClick = useCallback(() => {
    let playerName = localStorage.getItem('brain-age-player-name');
    if (!playerName) {
      playerName = prompt('이름을 알려주세요.');
      if (playerName) {
        localStorage.setItem('brain-age-player-name', playerName);
      }
    }

    submitPlayRecord({
      player: playerName || 'unknown',
      timeUsed,
      missed,
      record,
      quizzes: quizzes.map(hydrate),
      // ㄱㄷ책ㅇtotal,
    });
    onRestart();
  }, [submitPlayRecord]);

  return (
    <div className={styles.root}>
      {rank === 1 && <img className={styles.medal} src={medalImg} />}
      {/* <h1>Result</h1> */}
      <h2>시간</h2>
      <h2> {disp(timeUsed)}</h2>
      <hr />
      <h2>벌점</h2>
      <h2> {`${missed} * 5 = ${missed * 5}초`}</h2>
      <hr />
      <h1>{disp(record)}</h1>
      {/* <pre>{JSON.stringify({
    timeUsed,
    missed,
    record,
  }, null, 2)}</pre> */}
      {me && (
        <>
          <hr />
          <button type="button" className={styles.btn} onClick={onRestart}>
            재시작
          </button>{' '}
          <button type="button" className={styles.btn} onClick={handleSubmitClick}>
            기록 남기기
          </button>
        </>
      )}
    </div>
  );
}

export default Result;
