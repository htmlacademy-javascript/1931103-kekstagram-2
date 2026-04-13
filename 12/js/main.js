import { generatePhotos } from './data.js';

import './util.js';
import './data.js';
import './form.js';

import { renderThumbnails } from './thumbnails.js';
renderThumbnails(generatePhotos());
