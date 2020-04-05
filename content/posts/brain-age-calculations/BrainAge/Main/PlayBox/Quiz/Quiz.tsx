import * as React from 'react';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import cx from 'classnames';
import { useImmerReducer } from 'use-immer';
import { makeQuizzes, dehydrate } from './util';
import { useTimer, useStyledClass, useUserInput } from './hooks';
import Item from './Item';
import Result from './Result';
import styles from './Quiz.module.scss';

const noop = () => null;

const initialState = {
  quizzes: [],
  quizIndex: 0,
  missed: 0,
  timeUsed: null,
  record: null,
  complete: false,
};

const SET_QUIZZES = 'set-quizzes';
const SUBMIT_ANSWER = 'submit-answer';

function reducer(draft: any, action: any) {
  const { type, payload } = action;
  switch (type) {
    case SET_QUIZZES:
      draft.quizzes = payload;
      draft.quizIndex = 0;
      draft.missed = 0;
      draft.timeUsed = null;
      draft.record = null;
      draft.complete = false;
      return;
    case SUBMIT_ANSWER:
      const { quizIndex, value, time } = payload;
      if (draft.quizIndex === quizIndex) {
        const received = ~~value;
        const correct = draft.quizzes[quizIndex].answer === received;
        draft.quizzes[quizIndex].userInput = received;
        draft.quizzes[quizIndex].time = time;
        draft.quizzes[quizIndex].correct = correct;
        if (!correct) {
          draft.missed++;
        }
        draft.timeUsed = time;
        draft.record = draft.timeUsed + draft.missed * 5000;
        if (draft.quizzes.length <= quizIndex + 1) {
          draft.timeUsed = time;
          draft.complete = true;
        } else {
          draft.quizIndex++;
        }
      }
      return;
  }
}

function usePlayback(playback: any) {
  return useMemo(() => {
    if (playback && playback.quizzes) {
      const quizzes = playback.quizzes.map(dehydrate);
      const plays = playback.quizzes.map(([x, y, operation, time, userInput]: any, quizIndex: number) => ({
        quizIndex,
        time,
        userInput,
      }));
      // console.log({ quizzes, plays });
      return [quizzes, plays];
      // console.log(quizzes);
    }
    return [];
  }, [JSON.stringify(playback)]);
}

function Quiz({ rank, me = false, playback, scale, onSolve, onRestart }: any) {
  const getTime = useTimer();

  const [state, dispatch] = useImmerReducer(reducer, initialState);

  const setQuizzes = useCallback(
    (quizzes: any[]) => {
      dispatch({ type: SET_QUIZZES, payload: quizzes });
    },
    [dispatch],
  );

  const submitAnswer = useCallback(
    (quizIndex: number, value: string) => {
      dispatch({
        type: SUBMIT_ANSWER,
        payload: {
          quizIndex,
          value,
          time: getTime(),
        },
      });
    },
    [dispatch],
  );

  const [_quizzes, _plays] = usePlayback(playback);

  const notAvailable = useMemo(() => !me && !_quizzes, [me, _quizzes]);

  // useEffect(() => {
  //   setQuizzes(_quizzes || makeQuizzes(20));
  // }, [_quizzes]);

  useEffect(() => {
    if (notAvailable) {
      return;
    }

    // if (_quizzes) {
    //   console.log('>>> has record');
    //   console.log(_quizzes);
    setQuizzes(_quizzes || makeQuizzes(20));
    // } else {
    //   console.log('>>> has no record');
    // }
  }, [notAvailable, _quizzes]);

  // useEffect(() => {
  //   setQuizzes(_quizzes || makeQuizzes(20));
  // }, [_quizzes]);
  const { quizzes, quizIndex, missed, timeUsed, record, complete } = state;

  useEffect(() => {
    if (!notAvailable && typeof onSolve === 'function' && quizIndex > 0) {
      onSolve({
        quizIndex,
        missed,
        timeUsed,
        record,
        complete,
      });
    }
  }, [notAvailable, quizIndex, missed, timeUsed, complete, onSolve]);

  const wrap = useRef<any>();
  const scrollWrap = useRef<any>();
  const currentQuiz = useRef<any>();
  useEffect(() => {
    // console.log(currentQuiz.current);
    if (currentQuiz.current) {
      // console.log(currentQuiz.current);
      // console.log(currentQuiz.current.getBoundingClientRect());
      // console.log(currentQuiz.current.getBoundingClientRect());
      // console.log(scrollWrap.current.getBoundingClientRect());
      const cRect = currentQuiz.current.getBoundingClientRect();
      const height = (wrap.current.getBoundingClientRect().height - cRect.height) / 2;
      // console.log({
      //   a: wrap.current.getBoundingClientRect().height,
      //   b: cRect.height,
      // });

      const top = cRect.top - scrollWrap.current.getBoundingClientRect().top;
      // console.log(scale, height, -top + height);
      scrollWrap.current.style.transform = `translate(0, ${(-top + height) / scale}px)`;
      scrollWrap.current.style.opacity = 1;
      if (quizIndex > 0) {
        scrollWrap.current.style.transition = 'transform 0.1s linear';
      }
      // setTimeout(() => {

      // }, 1)

      // scrollWrap.current.style.opacity = 1;
    }
  }, [quizzes, quizIndex]);

  useEffect(() => {
    if (_plays) {
      const unsubs = _plays.map(({ quizIndex, time, userInput }: any) =>
        setTimeout(() => submitAnswer(quizIndex, userInput), time),
      );
      return () => {
        unsubs.forEach((timerId: number) => clearTimeout(timerId));
      };
    }
  }, [_plays]);
  const styledClass = useStyledClass();

  const userInput = useUserInput(quizIndex, me);

  const timerId = useRef<any>();
  useEffect(() => {
    clearTimeout(timerId.current);
    if (!complete && userInput && quizzes && quizzes[quizIndex]) {
      // console.log(userInput);

      // clearTimeout(timerId.current);

      const answer = { answer: '', ...(quizzes[quizIndex] || {}) }.answer.toString();

      if (answer.length <= userInput.length && userInput.length > 0) {
        // console.log('> handleAnswerChange', userInput, answer);

        if (answer === userInput) {
          submitAnswer(quizIndex, userInput);
        } else {
          timerId.current = setTimeout(() => {
            submitAnswer(quizIndex, userInput);
          }, 1000);
        }
      }
    }
  }, [quizzes, quizIndex, userInput, complete]);

  // const handleAnswerChange = useCallback(
  //   (value: string) => {
  //     // console.log(quizzes[quizIndex])
  //     // if ()

  //     clearTimeout(timerId.current);

  //     const answer = { answer: '', ...quizzes[quizIndex] }.answer.toString();

  //     if (answer.length <= value.length && value.length > 0) {
  //       console.log('> handleAnswerChange', value, answer);

  //       if (answer === value) {
  //         submitAnswer(quizIndex, value);
  //       } else {
  //         timerId.current = setTimeout(() => {
  //           submitAnswer(quizIndex, value);
  //         }, 1000);
  //       }
  //     }
  //   },
  //   [quizzes, quizIndex],
  // );

  return (
    <div className={styles.root}>
      {notAvailable ? (
        <h1>N / A</h1>
      ) : complete ? (
        <Result rank={rank} {...state} me={me} onRestart={onRestart} />
      ) : (
        <div>
          <div className={cx(styles.quizzes, styledClass)} ref={wrap}>
            <div className={styles.scroll} ref={scrollWrap}>
              {quizzes.map((quiz: any, i: number) =>
                quizIndex === i ? (
                  <div key={i} ref={currentQuiz}>
                    <Item {...quiz} current draftInput={userInput} />
                  </div>
                ) : (
                  <Item key={i} {...quiz} />
                ),
              )}
            </div>
          </div>

          {/* <pre>{JSON.stringify(state, null, 2)}</pre>
          <pre>{JSON.stringify(playback, null, 2)}</pre> */}
        </div>
      )}
    </div>
  );
}

export default Quiz;
