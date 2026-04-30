
import './util.js';
import './form.js';

import { renderThumbnails } from './thumbnails.js';
import { getData } from './api.js';
import { showAlert, debounce } from './util.js';
import { setUserFormSubmit, closeUploadModal } from './form.js';
import { initFilters } from './filter.js';

const RENDER_DELAY = 500;

const debouncedRenderThumbnails = debounce(renderThumbnails, RENDER_DELAY);

setUserFormSubmit(closeUploadModal);

getData()
  .then((photos) => {
    renderThumbnails(photos);
    initFilters(photos, (filteredPhotos) => {
      debouncedRenderThumbnails(filteredPhotos);
    });
  })
  .catch(() => {
    showAlert('Не удалось загрузить данные. Попробуйте обновить страницу.');
  });
