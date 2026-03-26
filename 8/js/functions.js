//Проверяет максимальную длину строки
const checkStringLength = (string, maxLength) => string.length <= maxLength;

//Проверяет, является ли строка палиндромом
function isPalindrome(string) {
  const normalizedString = string.replaceAll(' ', '').toUpperCase();

  let reversedString = '';

  for (let i = normalizedString.length - 1; i >= 0; i--) {
    reversedString += normalizedString.at(i);
  }

  return normalizedString === reversedString;
}

//Извлекает цифры и возвращает их в виде целого положительного числа.
function extractNumber(input) {
  const string = input.toString();
  let digits = '';

  for (let i = 0; i < string.length; i++) {
    const char = string[i];
    const parsedChar = parseInt(char, 10);

    if (!Number.isNaN(parsedChar)) {
      digits += char;
    }
  }

  if (digits === '') {
    return NaN;
  }

  return parseInt(digits, 10);
}

// Задание "Функции возвращаются"

const isMeetingWithinWorkday = (startWork, endWork, startMeeting, duration) => {
  // Функция для перевода строки "ЧЧ:ММ" в общее количество минут
  const toMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const startWorkMinutes = toMinutes(startWork);
  const endWorkMinutes = toMinutes(endWork);
  const startMeetingMinutes = toMinutes(startMeeting);
  const endMeetingMinutes = startMeetingMinutes + duration;

  // Проверяем, что начало встречи не раньше начала дня
  // и конец встречи не позже конца дня
  return startMeetingMinutes >= startWorkMinutes && endMeetingMinutes <= endWorkMinutes;
};


