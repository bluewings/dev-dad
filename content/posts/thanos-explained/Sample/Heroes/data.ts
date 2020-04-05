import antMan from './assets/ant-man.png';
import blackPanther from './assets/black-panther.png';
import blackWidow from './assets/black-widow.png';
import captainAmerica from './assets/captain-america.png';
import falcon from './assets/falcon.png';
import hawkeye from './assets/hawkeye.png';
import hulk from './assets/hulk.png';
import hulkBuster from './assets/hulk-buster.png';
import ironMan from './assets/iron-man.png';
import loki from './assets/loki.png';
import nickFury from './assets/nick-fury.png';
import spiderMan from './assets/spider-man.png';
import starLord from './assets/star-lord.png';
import thor from './assets/thor.png';
import vision from './assets/vision.png';

const cards = [
  { name: 'ANT MAN', imgSrc: antMan },
  { name: 'BLACK PANTHER', imgSrc: blackPanther },
  { name: 'BLACK WIDOW', imgSrc: blackWidow },
  { name: 'CAPTAIN AMERICA', imgSrc: captainAmerica },
  { name: 'FALCON', imgSrc: falcon },
  { name: 'HAWKEYE', imgSrc: hawkeye },
  { name: 'HULK BUSTER', imgSrc: hulkBuster },
  { name: 'HULK', imgSrc: hulk },
  { name: 'IRON MAN', imgSrc: ironMan },
  { name: 'LOKI', imgSrc: loki },
  { name: 'NICK FURY', imgSrc: nickFury },
  { name: 'SPIDER MAN', imgSrc: spiderMan },
  { name: 'STAR LORD', imgSrc: starLord },
  { name: 'THOR', imgSrc: thor },
  { name: 'VISION', imgSrc: vision },
];

const data = [
  {
    name: 'IRON MAN / TONY STARK',
    link: 'https://www.marvel.com/characters/iron-man-tony-stark',
    desc:
      "Genius. Billionaire. Playboy. Philanthropist. Tony Stark's confidence is only matched by his high-flying abilities as the hero called Iron Man.",
  },
  {
    name: 'CAPTAIN AMERICA / STEVE ROGERS',
    link: 'https://www.marvel.com/characters/captain-america-steve-rogers',
    desc:
      'Recipient of the Super-Soldier serum, World War II hero Steve Rogers fights for American ideals as one of the world’s mightiest heroes and the leader of the Avengers.',
  },
  {
    name: 'THOR / THOR ODINSON',
    link: 'https://www.marvel.com/characters/thor-thor-odinson',
    desc:
      'The son of Odin uses his mighty abilities as the God of Thunder to protect his home Asgard and planet Earth alike.',
  },
  {
    name: 'HULK / BRUCE BANNER',
    link: 'https://www.marvel.com/characters/hulk-bruce-banner',
    desc:
      'Dr. Bruce Banner lives a life caught between the soft-spoken scientist he’s always been and the uncontrollable green monster powered by his rage.',
  },
  {
    name: 'BLACK WIDOW / NATASHA ROMANOFF',
    link: 'https://www.marvel.com/characters/black-widow-natasha-romanoff',
    desc:
      'Despite super spy Natasha Romanoff’s checkered past, she’s become one of S.H.I.E.L.D.’s most deadly assassins and a frequent member of the Avengers.',
  },
  {
    name: 'HAWKEYE / CLINT BARTON',
    link: 'https://www.marvel.com/characters/hawkeye-clint-barton',
    desc: 'A master marksman and longtime friend of Black Widow, Clint Barton serves as the Avengers’ amazing archer.',
  },
  {
    name: 'THANOS',
    link: 'https://www.marvel.com/characters/thanos',
    desc:
      'The Mad Titan Thanos quests across the universe in search of the Infinity Stones, intending to use their limitless power for shocking purposes.',
  },
];

export default data;

export { cards };
