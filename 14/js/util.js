const ALERT_SHOW_TIME = 5000; // Время показа сообщения в мс

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const isEsc = (evt) => evt.key === 'Escape';

const showAlert = () => {
  const errorTemplate = document.querySelector('#data-error').content.querySelector('.data-error');
  const alertElement = errorTemplate.cloneNode(true);

  document.body.append(alertElement);

  setTimeout(() => {
    alertElement.remove();
  }, ALERT_SHOW_TIME);
};

export { getRandomInt, isEsc };

export { showAlert };
