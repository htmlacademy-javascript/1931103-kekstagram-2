import { openFullSizePicture } from './full-size-picture.js';

const thumbnailsContainer = document.querySelector('.pictures');
const thumbnailTemplate = document.querySelector('#picture').content.querySelector('.picture');

// Функция для удаления старых фотографий
const clearThumbnails = () => {
  const pictures = thumbnailsContainer.querySelectorAll('.picture');
  pictures.forEach((picture) => picture.remove());
};

const renderThumbnail = (thumbnailData) => {
  const thumbnail = thumbnailTemplate.cloneNode(true);
  const image = thumbnail.querySelector('.picture__img');

  image.src = thumbnailData.url;
  image.alt = thumbnailData.description;
  thumbnail.querySelector('.picture__likes').textContent = thumbnailData.likes;
  thumbnail.querySelector('.picture__comments').textContent = thumbnailData.comments.length;

  thumbnail.addEventListener('click', (evt) => {
    evt.preventDefault();
    openFullSizePicture(thumbnailData);
  });

  return thumbnail;
};

const renderThumbnails = (photos) => {
  clearThumbnails();
  const thumbnailFragment = document.createDocumentFragment();

  photos.forEach((photo) => {
    const thumbnail = renderThumbnail(photo);
    thumbnailFragment.append(thumbnail);
  });

  thumbnailsContainer.append(thumbnailFragment);
};

export { renderThumbnails };
