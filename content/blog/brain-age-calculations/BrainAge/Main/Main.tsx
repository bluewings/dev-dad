import * as React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useImmerReducer } from 'use-immer';
import PlayBox from './PlayBox';
import { getColorFunc } from '../lib/utils';
import styles from './Main.module.scss';
import './Main.scss';

const initialState = {
  // quizzes: [],
  // quizIndex: 0,
  // missed: 0,
  // timeUsed: null,
  // complete: false,
  players: {},
  rank: {},
};

const SET_RANK = 'set-rank';

const compareRank = (a: any, b: any) => {

  if (a.quizIndex == b.quizIndex) {

    // console.log(a, b);
    if (a.record == b.record) {
      return 0;
    }
    return a.record < b.record ? -1 : 1;
  }
  return a.quizIndex > b.quizIndex ? -1 : 1;
};

function reducer(draft: any, action: any) {
  const { type, payload } = action;
  switch (type) {
    case SET_RANK:
      // console.log(payload);
      const { id, quizIndex, missed, timeUsed, record, complete } = payload;

      draft.players[id] = { id, quizIndex, missed, timeUsed, record, complete, at: new Date().valueOf() };

      // console.log(Object.values(draft.players));

      Object.values(draft.players)
        .sort(compareRank)
        .forEach(({ id }: any, i: number) => {
          draft.rank[id] = i + 1;
        });

      return;

      // {id: "me", quizIndex: 1, missed: 1, timeUsed: null, complete: false}
      // draft.quizzes = payload;
      // draft.quizIndex = 0;
      break;
    default:
      break;
  }
}

function Main({ playbacks = [], onRestart }: any) {
  const [done, countdown] = useCountdown(3);

  const _playbacks = useMemo(() => {
    return (playbacks || []).slice();
  }, []);

  const [state, dispatch] = useImmerReducer(reducer, initialState);

  const { rank } = state;

  const setQuizzes = useCallback(
    (data: any) => {
      dispatch({ type: SET_RANK, payload: data });
    },
    [dispatch],
  );
  // console.log(playbacks);

  const handleSolve = useCallback(
    ({ id, quizIndex, missed, timeUsed, record, complete }) => {
      setQuizzes({ id, quizIndex, missed, timeUsed, record, complete });
      // console.log({ id, quizIndex, missed, timeUsed, complete });
    },
    [setQuizzes],
  );
  const playerNum = _playbacks.length + 1;
  const getColor = useMemo(() => {
    return getColorFunc(playerNum);
  }, [playerNum]);

  const backgroundColor = getColor('bg');

  const playBoxProps = {
    getColor,
    playerNum,
    rank,
    countdown,
    handleSolve,
    onRestart,
  };

  return (
    <div className={`${styles.root} brain_age_root`} style={{ backgroundColor }}>
      <div className="row">
        <div className="col-5">
          <PlayBox {...playBoxProps} playerNum={playerNum} rank={rank} countdown={countdown} me onSolve={handleSolve} />
        </div>
        <div className="col-7">
          <div className="row">
            <div className="col-4">
              <div style={{ marginBottom: 12 }}>
                <PlayBox
                  {...playBoxProps}
                  playerNum={playerNum}
                  rank={rank}
                  countdown={countdown}
                  playback={_playbacks[0]}
                  onSolve={handleSolve}
                />
              </div>
              <PlayBox
                {...playBoxProps}
                playerNum={playerNum}
                rank={rank}
                countdown={countdown}
                playback={_playbacks[1]}
                onSolve={handleSolve}
              />
            </div>
            <div className="col-4">
              <div style={{ marginBottom: 12 }}>
                <PlayBox
                  {...playBoxProps}
                  playerNum={playerNum}
                  rank={rank}
                  countdown={countdown}
                  playback={_playbacks[2]}
                  onSolve={handleSolve}
                />
              </div>
              <PlayBox
                {...playBoxProps}
                playerNum={playerNum}
                rank={rank}
                countdown={countdown}
                playback={_playbacks[3]}
                onSolve={handleSolve}
              />
            </div>
            <div className="col-4">
              <div style={{ marginBottom: 12 }}>
                <PlayBox
                  {...playBoxProps}
                  playerNum={playerNum}
                  rank={rank}
                  countdown={countdown}
                  playback={_playbacks[4]}
                  onSolve={handleSolve}
                />
              </div>
              <PlayBox
                {...playBoxProps}
                playerNum={playerNum}
                rank={rank}
                countdown={countdown}
                playback={_playbacks[5]}
                onSolve={handleSolve}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function useCountdown(initialCount = 3) {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    if (count > 0) {
      const timerId = setTimeout(() => setCount(count - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [count]);

  return useMemo(() => [count === 0, count], [count]);
}

export default Main;
