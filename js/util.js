const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const isEsc = (evt) => evt.key === 'Escape';

export { getRandomInt, isEsc };
