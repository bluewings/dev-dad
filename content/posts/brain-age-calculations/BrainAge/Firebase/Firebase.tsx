import * as React from 'react';
import { useState, useMemo, useRef, useEffect } from 'react';
import { getFirebase } from '../lib/firebase';
import styles from './Firebase.module.scss';

function Firebase({ children }: any) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      await getFirebase();
      // @ts-ignore
      setReady(true);
      // console.log(self.firebase)
    })();
    // setTimeout(() => {

    // }, 1000);
    // setReady(true);
  }, [setReady]);
  if (!ready) {
    return null;
  }
  return children();
}

export default Firebase;
