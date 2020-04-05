import React, { useMemo, useRef } from 'react';
import { Styled } from 'theme-ui';
import styles from './Heroes.module.scss';
import data from './data';
import { cards } from './data';

function shuffle(arr) {
  const array = arr.slice();
  let counter = array.length;
  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    const index = Math.floor(Math.random() * counter);
    // Decrease counter by 1
    counter -= 1;
    // And swap the last element with it
    const temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
}

function Heroes({ type, tick }) {
  const lastOne = useRef();

  const one = useMemo(() => {
    const items = data.filter((e) => e !== lastOne.current);
    return items[Math.floor(Math.random() * items.length)];
  }, [tick]);

  const lastCards = useRef([]);

  const cardsShuffled = useMemo(() => {
    const names = lastCards.current.map((e) => e.name);
    return shuffle(cards.slice().filter((e) => names.indexOf(e.name) === -1))
      .slice(0, 2)
      .map((e) => ({ ...e }));
  }, [tick]);

  lastOne.current = one;
  lastCards.current = cardsShuffled;

  if (type === 'text') {
    return (
      <div className={styles.root}>
        <a href={one.link} target="_blank" rel="noopener noreferrer">
          <h3>{one.name}</h3>
          <cite>{one.link}</cite>
        </a>
        <p>{one.desc}</p>
      </div>
    );
  }

  return (
    <div className={styles.cardWrap}>
      {cardsShuffled.map((one, i) => (
        <div className={styles.card} key={i}>
          <div className={styles.image}>
            <img src={one.imgSrc} alt="avengers" />
          </div>
          <div className={styles.text}>
            <Styled.h3>{one.name}</Styled.h3>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Heroes;
