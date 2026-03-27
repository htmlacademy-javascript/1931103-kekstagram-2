const thumbnailsContainer = document.querySelector('.pictures');
const thumbnailTemplate = document.querySelector('#picture').content;

const thumbnailFragment = document.createDocumentFragment();

const renderThumbnail = (thumbnailData) => {
  const thumbnail = thumbnailTemplate.cloneNode(true);

  const image = thumbnail.querySelector('.picture__img');
  image.src = thumbnailData.url;
  image.alt = thumbnailData.description;

  thumbnail.querySelector('.picture__likes') = thumbnailData.likes;
  thumbnail.querySelector('.picture__comments').textContent = thumbnailData.comments.length;

  return thumbnail;

};

const renderThumbnails = (thumbnails) => {
  thumbnails?.forEach((thumbnail) => {
    thumbnailFragment.append(renderThumbnail(thumbnail));
  });

  thumbnailsContainer.append(thumbnailFragment);
};

export { renderThumbnails };
