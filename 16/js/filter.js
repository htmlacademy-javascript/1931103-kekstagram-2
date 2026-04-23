const RANDOM_PHOTOS_COUNT = 10;

const Filter = {
  DEFAULT: 'filter-default',
  RANDOM: 'filter-random',
  DISCUSSED: 'filter-discussed',
};

const filterElement = document.querySelector('.img-filters');
const filterForm = filterElement.querySelector('.img-filters__form');

// Вспомогательные функции для сортировки
const sortRandomly = () => Math.random() - 0.5;
const sortByComments = (photoA, photoB) => photoB.comments.length - photoA.comments.length;

// Главная функция фильтрации
const getFilteredPhotos = (photos, filterId) => {
  switch (filterId) {
    case Filter.RANDOM:
      return [...photos].sort(sortRandomly).slice(0, RANDOM_PHOTOS_COUNT);
    case Filter.DISCUSSED:
      return [...photos].sort(sortByComments);
    default:
      return [...photos];
  }
};

// Функция инициализации модуля
const initFilters = (photos, callback) => {
  filterElement.classList.remove('img-filters--inactive');

  filterForm.addEventListener('click', (evt) => {
    if (!evt.target.classList.contains('img-filters__button') ||
      evt.target.classList.contains('img-filters__button--active')) {
      return;
    }

    filterForm.querySelector('.img-filters__button--active').classList.remove('img-filters__button--active');
    evt.target.classList.add('img-filters__button--active');

    const filteredPhotos = getFilteredPhotos(photos, evt.target.id);
    callback(filteredPhotos); // Вызываем колбэк (отрисовку) с задержкой
  });
};

export { initFilters };

