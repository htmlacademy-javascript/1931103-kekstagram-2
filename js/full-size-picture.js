const fullSizePictureElement = document.querySelector('.big-picture');
const closeButton = fullSizePictureElement.querySelector('.big-picture__cancel');
const commentsContainer = fullSizePictureElement.querySelector('.social__comments');
const commentTemplate = document.querySelector('.social__comment');

//Создание 1 комментария
const createComment = ({ avatar, name, message }) => {
  const comment = commentTemplate.cloneNode(true);
  const img = comment.querySelector('.social__picture');

  img.src = avatar;
  img.alt = name;
  comment.querySelector('.social__text').textContent = message;

  return comment;
};
//Закрытие окна
const closeFullSizePicture = () => {
  fullSizePictureElement.classList.add('hidden');
  document.body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);
};

function onDocumentKeydown(evt) {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    closeFullSizePicture();
  }
}

//Открытие и заполнение данными
const openFullSizePicture = (data) => {
  fullSizePictureElement.classList.remove('hidden');
  document.body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeydown);

  fullSizePictureElement.querySelector('.big-picture__img img').src = data.url;
  fullSizePictureElement.querySelector('.likes-count').textContent = data.likes;
  fullSizePictureElement.querySelector('.social__comment-shown-count').textContent = data.comments.length;
  fullSizePictureElement.querySelector('.social__comment-total-count').textContent = data.comments.length;
  fullSizePictureElement.querySelector('.social__caption').textContent = data.description;

  // Очистка и рендер комментариев
  commentsContainer.innerHTML = '';
  const fragment = document.createDocumentFragment();
  data.comments.forEach((commentData) => {
    fragment.append(createComment(commentData));
  });
  commentsContainer.append(fragment);

  // Скрытие счетчиков
  fullSizePictureElement.querySelector('.social__comment-count').classList.add('hidden');
  fullSizePictureElement.querySelector('.comments-loader').classList.add('hidden');
};

closeButton.addEventListener('click', closeFullSizePicture);

export { openFullSizePicture };
