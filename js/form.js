import { isEsc } from './util.js';

const MAX_HASHTAGS = 5;
const VALID_SYMBOLS = /^#[a-zа-яё0-9]{1,19}$/i;
const COMMENT_LENGTH = 140;

const uploadForm = document.querySelector('.img-upload__form');
const fileInput = uploadForm.querySelector('.img-upload__input');
const overlay = uploadForm.querySelector('.img-upload__overlay');
const closeButton = uploadForm.querySelector('.img-upload__cancel');
const hashtagInput = uploadForm.querySelector('.text__hashtags');
const commentInput = uploadForm.querySelector('.text__description');

// Инициализация Pristine
const pristine = new Pristine(uploadForm, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextClass: 'img-upload__field-wrapper--error',
});

// Закрытие формы
const closeUploadModal = () => {
  overlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
  uploadForm.reset(); // Сбрасывает все поля
  pristine.reset(); // Очищает ошибки валидации
  document.removeEventListener('keydown', onDocumentKeydown);
};

// Обработчик Esc (не закрывать, если фокус в полях ввода)
function onDocumentKeydown(evt) {
  if (isEsc(evt) && document.activeElement !== hashtagInput && document.activeElement !== commentInput) {
    evt.preventDefault();
    closeUploadModal();
  }
}

// Открытие формы при выборе файла
fileInput.addEventListener('change', () => {
  overlay.classList.remove('hidden');
  document.body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeydown);
});

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
pristine.addValidator(commentInput, (val) => val.length <= 140, 'Максимум 140 символов');

// Отправка формы
uploadForm.addEventListener('submit', (evt) => {
  const isValid = pristine.validate();
  if (!isValid) {
    evt.preventDefault();
  }
});
