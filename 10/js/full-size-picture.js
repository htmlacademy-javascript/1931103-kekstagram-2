const COMMENTS_STEP = 5;

const fullSizePictureElement = document.querySelector('.big-picture');
const closeButton = fullSizePictureElement.querySelector('.big-picture__cancel');
const commentsContainer = fullSizePictureElement.querySelector('.social__comments');
const commentTemplate = document.querySelector('.social__comment');

const commentsLoader = fullSizePictureElement.querySelector('.comments-loader');
const commentCount = fullSizePictureElement.querySelector('.social__comment-count');
const commentShownCount = fullSizePictureElement.querySelector('.social__comment-shown-count');
const commentTotalCount = fullSizePictureElement.querySelector('.social__comment-total-count');

let commentsShown = 0;
let currentComments = []; //Хранилище для комментариев текущего фото

//Создание 1 комментария
const createComment = ({ avatar, name, message }) => {
  const comment = commentTemplate.cloneNode(true);
  const img = comment.querySelector('.social__picture');

  img.src = avatar;
  img.alt = name;
  comment.querySelector('.social__text').textContent = message;

  return comment;
};

//Функция отрисовки порции комментариев
const renderComments = () => {
  const fragment = document.createDocumentFragment();
  const newComments = currentComments.slice(commentsShown, commentsShown + COMMENTS_STEP);

  newComments.forEach((commentData) => {
    fragment.append(createComment(commentData));
  });

  commentsContainer.append(fragment);

  commentsShown += newComments.length;

  //Обновление счетчиков
  commentShownCount.textContent = commentsShown;
  commentTotalCount.textContent = currentComments.length;

  //Скрытие кнопки, если все загружено
  if (commentsShown >= currentComments.length) {
    commentsLoader.classList.add('hidden');
  } else {
    commentsLoader.classList.remove('hidden');
  }
};

const onCommentsLoaderClick = () => renderComments();

//Закрытие окна
const onCloseButtonClick = () => {
  fullSizePictureElement.classList.add('hidden');
  document.body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);

  //Удаление обработчика с кнопки при закрытии, чтобы не накапливались
  commentsLoader.removeEventListener('click', onCommentsLoaderClick);
};

function onDocumentKeydown(evt) {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    onCloseButtonClick();
  }
}

//Открытие и заполнение данными
const openFullSizePicture = (data) => {
  fullSizePictureElement.classList.remove('hidden');
  document.body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeydown);

  fullSizePictureElement.querySelector('.big-picture__img img').src = data.url;
  fullSizePictureElement.querySelector('.likes-count').textContent = data.likes;
  fullSizePictureElement.querySelector('.social__caption').textContent = data.description;

  //Работа с комментариями
  commentsContainer.innerHTML = ''; // Очистка списка
  currentComments = data.comments; //Сохранение массива
  commentsShown = 0; // Сброс счетчика

  //Показ блоков управления
  commentCount.classList.remove('hidden');
  commentsLoader.classList.remove('hidden');

  renderComments(); //Отрисовка первых 5 комментариев

  //Навешивание события на кнопку "Загрузить еще"
  commentsLoader.addEventListener('click', onCommentsLoaderClick);
};

closeButton.addEventListener('click', onCloseButtonClick);

export { openFullSizePicture };
