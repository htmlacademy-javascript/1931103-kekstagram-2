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
let currentScale = DEFAULT_SCALE;

const sliderContainer = document.querySelector('.img-upload__effect-level');
const sliderElement = document.querySelector('.effect-level__slider');
const effectValueInput = document.querySelector('.effect-level__value');
const effectsList = document.querySelector('.effects__list');

// Инициализация Pristine
const pristine = new Pristine(uploadForm, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextClass: 'img-upload__field-wrapper--error',
});

const blockSubmitButton = () => {
  submitButton.disabled = true;
  submitButton.textContent = submitButtonText.SENDING;
};

const unblockSubmitButton = () => {
  submitButton.disabled = false;
  submitButton.textContent = submitButtonText.IDLE;
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

// Обработчик Esc (не закрывать, если фокус в полях ввода)
function onDocumentKeydown(evt) {
  if (isEsc(evt) && document.activeElement !== hashtagInput && document.activeElement !== commentInput) {
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

// Валидация хэштегов
const validateHashtags = (value) => {
  const hashtags = value.trim().toLowerCase().split(/\s+/).filter(Boolean);

  const hasValidCount = hashtags.length <= MAX_HASHTAGS;
  const hasUniqueHashtags = new Set(hashtags).size === hashtags.length;
  const hasValidSymbols = hashtags.every((tag) => VALID_SYMBOLS.test(tag));

  return hasValidCount && hasUniqueHashtags && hasValidSymbols;
};

pristine.addValidator(hashtagInput, validateHashtags, 'Некорректные хэштеги (макс 5, без повторов, начинаются с #)');

// Валидация комментария
pristine.addValidator(commentInput, (val) => val.length <= COMMENT_LENGTH, 'Максимум COMMENT_LENGTH символов');

// Отправка формы
const setUserFormSubmit = (onSuccess) => {
  uploadForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const isValid = pristine.validate();
    if (isValid) {
      blockSubmitButton();
      sendData(new FormData(evt.target))
        .then(() => {
          onSuccess(); // Закроет форму и сбросит всё (масштаб, фильтры, поля)
          showSuccessMessage(); // Покажет "Успех"
        })
        .catch(() => {
          showErrorMessage(); // Форма не закрывается, данные сохраняются
        })
        .finally(unblockSubmitButton);
    }
  });
};

// Управление масштабом
const setScale = (value) => {
  currentScale = value;
  scaleControlValue.value = `${value}%`;
  imgPreview.style.transform = `scale(${value / 100})`;
};

scaleControlSmaller.addEventListener('click', () => {
  if (currentScale > MIN_SCALE) {
    setScale(currentScale - SCALE_STEP);
  }
});

scaleControlBigger.addEventListener('click', () => {
  if (currentScale < MAX_SCALE) {
    setScale(currentScale + SCALE_STEP);
  }
});

// Инициализация слайдера
noUiSlider.create(sliderElement, {
  range: { min: 0, max: 100 },
  start: 100,
  step: 1,
  connect: 'lower',
});

const updateEffect = (effect) => {
  if (effect === 'none') {
    sliderContainer.classList.add('hidden');
    imgPreview.style.filter = 'none';
    effectValueInput.value = '';
    return;
  }

  sliderContainer.classList.remove('hidden');
  const { range, start, step, filter, unit } = EFFECTS[effect];

  sliderElement.noUiSlider.updateOptions({ range, start, step });

  sliderElement.noUiSlider.on('update', () => {
    const value = sliderElement.noUiSlider.get();
    effectValueInput.value = value;
    imgPreview.style.filter = `${filter}(${value}${unit})`;
  });
};

// Сброс при старте
updateEffect('none');

effectsList.addEventListener('change', (evt) => {
  updateEffect(evt.target.value);
});

// Сброс масштаба и фильтров при повторной загрузке изображения
function resetVisuals() {
  currentScale = DEFAULT_SCALE; // Сбрасываем переменную масштаба
  setScale(DEFAULT_SCALE); // Применяем масштаб 100% к картинке и инпуту
  updateEffect('none'); // Сбрасываем фильтры и скрываем слайдер
  uploadForm.querySelector('#effect-none').checked = true; //Выбираем радиокнопку 'оригинал' вручную
}

export { setUserFormSubmit, closeUploadModal };
