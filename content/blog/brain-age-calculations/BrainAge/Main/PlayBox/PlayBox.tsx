import * as React from 'react';
import { useCallback, useMemo } from 'react';
import { Scaled } from 'react-scaled-content';
import { interpolateRdYlBu, hsl } from 'd3';
import Quiz from './Quiz';
import Player from './Player';
import medalImg from './medal.png';
import { getMyPlayerName } from '../../lib/utils';
import styles from './PlayBox.module.scss';

const _colors = [
  // '#F0FFF4',
  // '#C6F6D5',
  // '#9AE6B4',
  // '#68D391',
  // '#48BB78',
  // '#38A169',
  // '#2F855A',
  // '#276749',
  // '#22543D',

  '#EBF8FF',
  '#BEE3F8',
  '#90CDF4',
  '#63B3ED',
  '#4299E1',
  '#3182CE',
  '#2B6CB0',
  '#2C5282',
  '#2A4365',
];

const getColors = (value: number) => {
  try {
    // const background = interpolateRdYlBu(value / 7);
    const background = _colors[value];
    const hsl1 = hsl(background);
    return {
      // borderLeft: `10px solid ${background}`,
      background,
      color: hsl1.l < 0.7 ? '#fff' : '#000',
    };
  } catch (err) {
    /* ignore */
  }
  return {};
};

function PlayBox({ getColor, playerNum = 0, rank = {}, countdown, me = false, playback, onSolve, onRestart }: any) {
  const id = useMemo(() => {
    return me
      ? 'me'
      : Math.random()
          .toString(36)
          .substr(-4);
  }, [me, playback]);

  const myName = useMemo(() => {
    if (me) {
      return getMyPlayerName();
    }
    return '';
  }, [me]);

  const getColors = useMemo(() => {
    return (value: number) => {
      try {
        // const background = interpolateRdYlBu(value / 7);
        // const background = _colors[value];
        const background = getColor(value);
        const hsl1 = hsl(background);
        return {
          // borderLeft: `10px solid ${background}`,
          background,
          color: hsl1.l < 0.7 ? '#fff' : '#000',
        };
      } catch (err) {
        /* ignore */
      }
      return {};
    };
  }, [getColor]);

  const colors = useMemo(() => {
    // if (rank[id]) {
    return getColors(rank[id]);
    // }
    return {};
  }, [rank[id], playerNum]);

  const handleSolve = useCallback(
    ({ quizIndex, missed, timeUsed, record, complete }) => {
      // console.log(id, quizIndex, missed);
      if (typeof onSolve === 'function') {
        onSolve({ id, quizIndex, missed, timeUsed, record, complete });
      }
    },
    [id, onSolve],
  );

  const badgeBgColor = getColor('bg');

  return (
    <div className={styles.root}>
      <h5
        className={styles.rankBadge}
        style={{
          backgroundColor: badgeBgColor,
        }}
      >
        {rank[id] || '-'}
      </h5>

      {(myName || (playback && playback.player)) && (
        <h5
          className={styles.playerName}
          style={{
            backgroundColor: badgeBgColor,
          }}
        >
          {myName || (playback && playback.player)}
        </h5>
      )}

      {/* <img src={medalImg}></img> */}
      {/* <h1>{id}</h1> */}
      <div className={styles.wrap} style={colors}>
        <Scaled fit="cover-width">
          {({ scale }: any) => (
            <div className={styles.playbox}>
              {/* <h1>PlayBox</h1> */}
              {countdown > 0 ? (
                <div className={styles.countdown}>
                  <h1>{countdown}</h1>
                </div>
              ) : (
                <Quiz
                  rank={rank[id]}
                  me={me}
                  playback={playback}
                  scale={scale}
                  onSolve={handleSolve}
                  onRestart={onRestart}
                />
              )}
            </div>
          )}
        </Scaled>
      </div>
      {/* <Player /> */}
    </div>
  );
}

export default PlayBox;
