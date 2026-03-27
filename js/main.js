import { generatePhotos } from './js/data.js';

import 'js/js/util.js';
import 'js/js/data.js';

import { renderThumbnails } from './thumbnails.js';
renderThumbnails(generatePhotos());
