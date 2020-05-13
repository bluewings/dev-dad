import { useMemo, useEffect, useState } from 'react';
// import * as firebase from 'firebase';
// import { initializeApp } from 'firebase';
import { useListVals } from 'react-firebase-hooks/database';

// const HTML2CANVAS_URI = 'https://cdn.jsdelivr.net/npm/html2canvas-fixed@1.0.0/html2canvas-fixed.min.js';

const loadScript = (src: string) => {
  return new Promise((resolve, reject) => {
    const head = document.head || document.getElementsByTagName('head')[0];
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`failed to load: ${src.split('/').pop()}`));
    head.appendChild(script);
  });
};

async function getFirebase(): Promise<any> {
  try {
    // let firebase
    // @ts-ignore
    if (!self.firebase) {
      await loadScript('https://www.gstatic.com/firebasejs/5.10.1/firebase-app.js');
      await loadScript('https://www.gstatic.com/firebasejs/5.10.1/firebase-database.js');
    }

    // @ts-ignore
    self.firebase.initializeApp({
      apiKey: 'AIzaSyDf370umgxy9nqdYKRHv6HVU9F9LTBoiMk',
      authDomain: 'brain-training-66533.firebaseapp.com',
      databaseURL: 'https://brain-training-66533.firebaseio.com',
      projectId: 'brain-training-66533',
      storageBucket: 'brain-training-66533.appspot.com',
      messagingSenderId: '81974705610',
    });
  } catch (err) {}
  // @ts-ignore
  return self.firebase;
  // https://firebase.google.com/docs/web/setup?hl=ko#add-sdks_CDN
  //   let cache = null;
  //   return () => {

  //     // https://www.gstatic.com/firebasejs/5.10.1/firebase-app.js
  // // https://www.gstatic.com/firebasejs/5.10.1/firebase-database.js

  //   }
}

// try {
//   firebase = initializeApp({
//     apiKey: 'AIzaSyDf370umgxy9nqdYKRHv6HVU9F9LTBoiMk',
//     authDomain: 'brain-training-66533.firebaseapp.com',
//     databaseURL: 'https://brain-training-66533.firebaseio.com',
//     projectId: 'brain-training-66533',
//     storageBucket: 'brain-training-66533.appspot.com',
//     messagingSenderId: '81974705610',
//   });
// } catch (err) {}

const COLLECTION = 'records';
// firebase.initializeApp(config)

const submitPlayRecord = async ({ player, record, timeUsed, missed, quizzes }: any) => {
  // Get a key for a new Post.
  var newPostKey = (await getFirebase()).database().ref(COLLECTION).push().key;

  // Write the new post's data simultaneously in the posts list and the user's post list.
  (await getFirebase())
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
};

function usePlayRecords() {
  // const [reference, setReference] = useState();
  // useEffect(() => {
  //   (async () => {
  //     const fb = await getFirebase();
  //     console.log(fb);
  //     setReference(fb.database().ref(COLLECTION));
  //   })();
  // }, []);
  // const [snapshots, loading, error] = useList(reference);
  // console.log(firebase);
  // @ts-ignore
  const [values, loading, error] = useListVals(self.firebase.database().ref(COLLECTION));
  // const [values, loading, error] = useListVals(reference);

  // console.log({ values, loading, error });

  return useMemo(() => {
    let records;
    if (values) {
      const _values = [...values].map((e: any, _i) => ({ ...e, _i }));

      const players = Object.values(
        _values.reduce((accum: any, e: any) => {
          if (accum[e.player] && accum[e.player].record < e.record) {
            return accum;
          }
          return { ...accum, [e.player]: e };
        }, {}),
      );

      const topPlayers = [...players]
        .sort((a: any, b: any) => {
          if (a.record === b.record) {
            return 0;
          }
          return a.record < b.record ? -1 : 1;
        })
        .slice(0, 6)
        .map((e: any) => e._i);

      records = _values
        .filter((e: any, i: number, arr: any[]) => {
          return topPlayers.includes(i);
        })
        .map((e: any) => {
          return {
            ...e,
            id: Math.random().toString(36).substr(-8),
          };
        });
    }

    return [records, loading, error];
  }, [values, loading, error]);

  // return
  // console.log(values);
}

export { getFirebase, usePlayRecords, submitPlayRecord };
