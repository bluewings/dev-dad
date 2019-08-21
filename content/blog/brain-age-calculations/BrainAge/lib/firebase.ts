import { useMemo } from 'react';
// import * as firebase from 'firebase';
import { initializeApp } from 'firebase';
import { useListVals } from 'react-firebase-hooks/database';

const firebase = initializeApp({
  apiKey: 'AIzaSyDf370umgxy9nqdYKRHv6HVU9F9LTBoiMk',
  authDomain: 'brain-training-66533.firebaseapp.com',
  databaseURL: 'https://brain-training-66533.firebaseio.com',
  projectId: 'brain-training-66533',
  storageBucket: 'brain-training-66533.appspot.com',
  messagingSenderId: '81974705610',
});

const COLLECTION = 'records';
// firebase.initializeApp(config);

// console.log(app);
// firebase.database().ref('posts').

const compareRecord = (a: any, b: any) => {
  if (a.record === b.record) {
    return 0;
  }
  return a.record < b.record ? -1 : 1;
};

function submitPlayRecord({ player, record, timeUsed, missed, quizzes }: any) {
  // Get a key for a new Post.
  var newPostKey = firebase
    .database()
    .ref(COLLECTION)
    .push().key;

  // Write the new post's data simultaneously in the posts list and the user's post list.
  firebase
    .database()
    .ref()
    .update({
      [`${COLLECTION}/${newPostKey}`]: {
        player: player || 'unknown',
        record,
        timeUsed,
        missed,
        quizCount: quizzes.length,
        quizzes,
        at: new Date(),
      },
    });

  // document.cookie = inputName.value.trim();
  // input.value = '';
}

function usePlayRecords() {
  // const [snapshots, loading, error] = useList(reference);
  const [values, loading, error] = useListVals(firebase.database().ref(COLLECTION));

  return useMemo(() => {
    // return (values || []).sort(compareRecord).slice(0, 5);
    // return (values || []);
    return [
      values &&
        values.slice(0, 6).map((e) => {
          return {
            ...e,
            id: Math.random()
              .toString(36)
              .substr(-8),
          };
        }),
      loading,
      error,
    ];
  }, [values, loading, error]);

  // return
  // console.log(values);
}

export { usePlayRecords, submitPlayRecord };
