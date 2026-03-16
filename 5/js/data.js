import { getRandomInt } from 'js/util.js';

const PHOTO_QUANTITY = 25;

const Likes = {
  MIN: 15,
  MAX: 200
};

const Comments = {
  MIN: 0,
  MAX: 30
};

const Avatars = {
  MIN: 1,
  MAX: 6
};

const DESCRIPTIONS = [
  'Теплые лучи утреннего солнца.',
  'Момент абсолютного спокойствия.',
  'Когда работа в удовольствие.',
  'Маленькое путешествие выходного дня.',
  'Вдохновение в простых вещах.',
  'Мой лучший завтрак в этом году.',
  'Городские джунгли во всей красе.',
  'Тот самый вид, который не забыть.',
  'Эстетика повседневности.',
  'Спонтанные решения — самые лучшие.',
  'Посмотрите на эту игру света!',
  'Наедине с природой.',
  'Маленький повод для большой улыбки.',
  'Архитектура, которая завораживает.',
  'Уютный вечер в хорошей компании.',
  'Ловлю последние дни лета.',
  'Искусство вокруг нас, нужно только заметить.',
  'Лучшая инвестиция — это эмоции.',
  'Цвета, которые не нуждаются в фильтрах.',
  'Кофе и книга — идеальный дуэт.',
  'Мир глазами перфекциониста.',
  'Остановить мгновение — это бесценно.',
  'Зимняя сказка прямо за окном.',
  'Вечерние огни большого города.',
  'Место, где отдыхает душа.',
  'Магия в деталях.',
  'Горный воздух и бесконечный горизонт.',
  'Сегодняшнее настроение — ленивое.',
  'В ожидании новых приключений.',
  'Когда всё совпало: и свет, и настроение.'
];

const MESSAGES = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

const NAMES = [
  'Артем',
  'Мария',
  'Виктор',
  'Юлия',
  'Александр',
  'Анна',
  'Дмитрий',
  'Елена',
  'Евгения',
  'Николай'
];


let commentIdCounter = 1;

const addComments = () => {
  const commentsList = [];
  const count = getRandomInt(Comments.MIN, Comments.MAX);

  for (let i = 0; i < count; i++) {
    const sentenceCount = getRandomInt(1, 2);
    const messageArray = [];
    for (let j = 0; j < sentenceCount; j++) {
      messageArray.push(MESSAGES[getRandomInt(0, MESSAGES.length - 1)]);
    }

    commentsList.push({
      id: commentIdCounter++,
      avatar: `img/avatar-${getRandomInt(Avatars.MIN, Avatars.MAX)}.svg`,
      message: messageArray.join(' '),
      name: NAMES[getRandomInt(0, NAMES.length - 1)]
    });
  }
  return commentsList;
};

const addPhoto = (index) => ({
  id: index + 1,
  url: `photos/${index + 1}.jpg`,
  descripton: DESCRIPTIONS[getRandomInt(0, DESCRIPTIONS.length - 1)],
  likes: getRandomInt(Likes.MIN, Likes.MAX),
  comments: addComments()
});

const generatePhotos = () => {
  const photos = [];
  for (let i = 0; i < PHOTO_QUANTITY; i++) {
    photos.push(addPhoto(i));
  }
  return photos;
};

export { generatePhotos };
