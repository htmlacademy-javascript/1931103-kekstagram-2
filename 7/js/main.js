import { generatePhotos } from './js/data.js';

import './util.js';
import './data.js';

import { renderThumbnails } from './thumbnails.js';
renderThumbnails(generatePhotos());
