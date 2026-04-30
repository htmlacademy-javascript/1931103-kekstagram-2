import { isEsc } from './util.js';
import { sendData } from './api.js';
import { showSuccessMessage, showErrorMessage } from './message.js';

const MAX_HASHTAGS = 5;
const VALID_SYMBOLS = /^#[a-zа-яё0-9]{1,19}$/i;
const COMMENT_LENGTH = 140;

const SCALE_STEP = 25;
const MIN_SCALE = 25;
const MAX_SCALE = 100;
const DEFAULT_SCALE = 100;

const FILE_TYPES = ['jpg', 'jpeg', 'png'];

const EFFECTS = {
  none: {
    range: { min: 0, max: 100 },
    start: 100, step: 1, unit: '', filter: 'none'
  },
  chrome: {
    range: { min: 0, max: 1 },
    start: 1, step: 0.1, unit: '', filter: 'grayscale'
  },
  sepia: {
    range: { min: 0, max: 1 },
    start: 1, step: 0.1, unit: '', filter: 'sepia'
  },
  marvin: {
    range: { min: 0, max: 100 },
    start: 100, step: 1, unit: '%', filter: 'invert'
  },
  phobos: {
    range: { min: 0, max: 3 },
    start: 3, step: 0.1, unit: 'px', filter: 'blur'
  },
  heat: {
    range: { min: 1, max: 3 }, start: 3, step: 0.1, unit: '', filter: 'brightness'
  },
};

const submitButtonText = {
  IDLE: 'Опубликовать',
  SENDING: 'Опубликовываю...'
};

const uploadForm = document.querySelector('.img-upload__form');
const submitButton = uploadForm.querySelector('.img-upload__submit');
const fileInput = uploadForm.querySelector('.img-upload__input');
const overlay = uploadForm.querySelector('.img-upload__overlay');
const closeButton = uploadForm.querySelector('.img-upload__cancel');
const hashtagInput = uploadForm.querySelector('.text__hashtags');
const commentInput = uploadForm.querySelector('.text__description');

const scaleControlSmaller = document.querySelector('.scale__control--smaller');
const scaleControlBigger = document.querySelector('.scale__control--bigger');
const scaleControlValue = document.querySelector('.scale__control--value');
const imgPreview = document.querySelector('.img-upload__preview img');
const effectsPreviews = document.querySelectorAll('.effects__preview');

const sliderContainer = document.querySelector('.img-upload__effect-level');
const sliderElement = document.querySelector('.effect-level__slider');
const effectValueInput = document.querySelector('.effect-level__value');
const effectsList = document.querySelector('.effects__list');

let currentScale = DEFAULT_SCALE;
let currentFilter = 'none';
let currentUnit = '';

// Инициализация Pristine
const pristine = new Pristine(uploadForm, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextClass: 'img-upload__field-wrapper--error',
});

// Вспомогательная функция для получения массива хэштегов
const getHashtags = (value) => value.trim().toLowerCase().split(/\s+/).filter(Boolean);

// Валидаторы
const validateHashtagSymbols = (value) => getHashtags(value).every((tag) => VALID_SYMBOLS.test(tag));
const validateHashtagCount = (value) => getHashtags(value).length <= MAX_HASHTAGS;
const validateHashtagUnique = (value) => {
  const hashtags = getHashtags(value);
  return new Set(hashtags).size === hashtags.length;
};

pristine.addValidator(hashtagInput, validateHashtagSymbols, 'Начинается с #, буквы/цифры, до 20 симв.', 1, true);
pristine.addValidator(hashtagInput, validateHashtagUnique, 'Хэштеги не должны повторяться', 2, true);
pristine.addValidator(hashtagInput, validateHashtagCount, `Максимум ${MAX_HASHTAGS} хэштегов`, 3, true);
pristine.addValidator(commentInput, (val) => val.length <= COMMENT_LENGTH, `Максимум ${COMMENT_LENGTH} символов`);

const blockSubmitButton = () => {
  submitButton.disabled = true;
  submitButton.textContent = submitButtonText.SENDING;
};

const unblockSubmitButton = () => {
  submitButton.disabled = false;
  submitButton.textContent = submitButtonText.IDLE;
};

const resetVisuals = () => {
  currentScale = DEFAULT_SCALE;
  imgPreview.style.transform = `scale(${DEFAULT_SCALE / 100})`;
  scaleControlValue.value = `${DEFAULT_SCALE}%`;
  scaleControlValue.setAttribute('value', `${DEFAULT_SCALE}%`);
  updateEffect('none');
  uploadForm.querySelector('#effect-none').checked = true;
};

// Закрытие формы
const closeUploadModal = () => {
  overlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
  uploadForm.reset(); // Сбрасывает все поля
  pristine.reset(); // Очищает ошибки валидации
  resetVisuals(); // Сбрасывает масштаб и фильтры
  document.removeEventListener('keydown', onDocumentKeydown);
};

// Обработчик Esc
function onDocumentKeydown(evt) {
  const isErrorMessageOpen = !!document.querySelector('.error');
  if (isEsc(evt) && !isErrorMessageOpen && document.activeElement !== hashtagInput && document.activeElement !== commentInput) {
    evt.preventDefault();
    closeUploadModal();
  }
}

// Обработчик выбора файла
fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  const fileName = file.name.toLowerCase();
  const matches = FILE_TYPES.some((it) => fileName.endsWith(it));

  if (matches) {
    const url = URL.createObjectURL(file);
    imgPreview.src = url; // Подставляем фото в главное окно
    effectsPreviews.forEach((preview) => {
      preview.style.backgroundImage = `url(${url})`; // Подставляем в маленькие превью эффектов
    });

    overlay.classList.remove('hidden');
    document.body.classList.add('modal-open');
    document.addEventListener('keydown', onDocumentKeydown);
  }
});

// Обработчик клика по кнопке 'отмена' (крестик)
closeButton.addEventListener('click', closeUploadModal);

// Управление масштабом
scaleControlSmaller.addEventListener('click', () => {
  if (currentScale > MIN_SCALE) {
    currentScale -= SCALE_STEP;
    imgPreview.style.transform = `scale(${currentScale / 100})`;
    scaleControlValue.value = `${currentScale}%`;
    scaleControlValue.setAttribute('value', `${currentScale}%`);
  }
});

scaleControlBigger.addEventListener('click', () => {
  if (currentScale < MAX_SCALE) {
    currentScale += SCALE_STEP;
    imgPreview.style.transform = `scale(${currentScale / 100})`;
    scaleControlValue.value = `${currentScale}%`;
    scaleControlValue.setAttribute('value', `${currentScale}%`);
  }
});

// Инициализация слайдера
noUiSlider.create(sliderElement, {
  range: { min: 0, max: 100 },
  start: 100,
  step: 1,
  connect: 'lower',
  format: {
    to: (value) => Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1),
    from: (value) => parseFloat(value),
  },
});

sliderElement.noUiSlider.on('update', () => {
  const value = parseFloat(sliderElement.noUiSlider.get()); // РЕШАЕТ ПРОБЛЕМУ 0.5 vs 0.50
  effectValueInput.value = value;
  if (currentFilter !== 'none') {
    imgPreview.style.filter = `${currentFilter}(${value}${currentUnit})`;
  }
});

function updateEffect(effect) {
  const settings = EFFECTS[effect];
  currentFilter = settings.filter;
  currentUnit = settings.unit;

  if (effect === 'none') {
    sliderContainer.classList.add('hidden');
    imgPreview.style.filter = 'none';
    effectValueInput.value = '';
  } else {
    sliderContainer.classList.remove('hidden');
    sliderElement.noUiSlider.updateOptions({
      range: settings.range,
      start: settings.start,
      step: settings.step,
    });
  }
}

effectsList.addEventListener('change', (evt) => {
  updateEffect(evt.target.value);
});

const setUserFormSubmit = (onSuccess) => {
  uploadForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    if (pristine.validate()) {
      blockSubmitButton();
      sendData(new FormData(evt.target))
        .then(() => {
          onSuccess();
          showSuccessMessage();
        })
        .catch(() => {
          showErrorMessage();
        })
        .finally(unblockSubmitButton);
    }
  });
};

// Инициализация при загрузке
updateEffect('none');

export { setUserFormSubmit, closeUploadModal };
