import colors from './colors';

const pickOne = (arr: any[]) => arr[~~(Math.random() * arr.length)];

const getColorFunc = (numOfPlayers: number) => {
  let colorSet = pickOne(colors).rgb.slice();
  // colorSet.reverse();

  // console.log
  return (rank: any) => {
    if (rank === 'bg') {
      return colorSet[numOfPlayers];
    }
    return colorSet[numOfPlayers - rank || 0];
  };
  // Object.values(colors).length;
};

const getMyPlayerId = () => {
  const PLAYER_ID_KEY = 'brain-age-player-id';
  let playerId;
  try {
    playerId = localStorage.getItem(PLAYER_ID_KEY);
  } catch (err) {}
  if (!playerId || playerId.search(/[^0-9a-z]/) !== -1) {
    try {
      playerId = Math.random().toString(36).substr(-8);
      localStorage.setItem(PLAYER_ID_KEY, playerId);
    } catch (err) {}
  }
  return playerId;
};

const getMyPlayerName = () => {
  const PLAYER_ID_KEY = 'brain-age-player-name';
  let playerId;
  try {
    playerId = localStorage.getItem(PLAYER_ID_KEY);
  } catch (err) {}

  return playerId || 'unknown';
};

export { getColorFunc, getMyPlayerId, getMyPlayerName };
