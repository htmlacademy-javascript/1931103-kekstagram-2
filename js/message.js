import { isEsc } from './util.js';

const successTemplate = document.querySelector('#success').content.querySelector('.success');
const errorTemplate = document.querySelector('#error').content.querySelector('.error');

// Функция для удаления сообщения
function hideMessage() {
  const messageElement = document.querySelector('.success') || document.querySelector('.error');
  if (messageElement) {
    messageElement.remove();
  }
  document.removeEventListener('keydown', onDocumentKeydown);
  document.removeEventListener('click', onBodyClick);
}

function onDocumentKeydown(evt) {
  if (isEsc(evt)) {
    evt.preventDefault();
    evt.stopPropagation();
    hideMessage();
  }
}

function onBodyClick(evt) {
  if (evt.target.classList.contains('success') || evt.target.classList.contains('error')) {
    hideMessage();
  }
}

const showSuccessMessage = () => {
  const successElement = successTemplate.cloneNode(true);
  document.body.append(successElement);
  successElement.querySelector('.success__button').addEventListener('click', hideMessage);
  document.addEventListener('keydown', onDocumentKeydown);
  document.addEventListener('click', onBodyClick);
};

const showErrorMessage = () => {
  const errorElement = errorTemplate.cloneNode(true);
  document.body.append(errorElement);
  errorElement.querySelector('.error__button').addEventListener('click', hideMessage);
  document.addEventListener('keydown', onDocumentKeydown, true);
  document.addEventListener('click', onBodyClick);
};

export { showSuccessMessage, showErrorMessage };
