
import './util.js';
import './data.js';
import './form.js';

import { renderThumbnails } from './thumbnails.js';
import { getData } from './api.js';
import { showAlert } from './util.js';
import { setUserFormSubmit, closeUploadModal } from './form.js';

getData()
  .then((photos) => {
    renderThumbnails(photos);
  })
  .catch(() => {
    showAlert();
  });

setUserFormSubmit(closeUploadModal);
