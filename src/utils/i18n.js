import React from 'react';
import i18next from 'i18next';
import backend from 'i18next-xhr-backend';
import { initReactI18next } from 'react-i18next';

import * as ls from './localStorage';

let _defaultLanguage = 'en';
let _currentLanguage;

function getCurrentLanguage() {
  if (_currentLanguage) return _currentLanguage;
  _currentLanguage = ls.get('setting.language');
  return _currentLanguage || _defaultLanguage;
}

function setCurrentLanguage(lang) {
  _currentLanguage = lang;
  ls.set('setting.language', lang);
}

i18next
  .use(backend)
  .use(initReactI18next)
  .init({
    lng: getCurrentLanguage(),
    fallbackLng: _defaultLanguage,

    backend: {
      loadPath: '/static/locales/{{lng}}/{{ns}}.json'
    },

    // allow keys to be phrases having `:`, `.`
    nsSeparator: false,
    keySeparator: false,

    interpolation: {
      escapeValue: false,
      format: function(value, format, lng) {
        // if (format === 'bold') return <strong>{value}</strong>;
      }
    },
    react: {
      wait: true,
      useSuspense: false
    }
  });

  i18next.getCurrentLanguage = getCurrentLanguage;
  i18next.setCurrentLanguage = setCurrentLanguage;

export default i18next;

export const t = (key, options) =>
  i18next.t(key, options || { skipInterpolation: true });

export const duration = ({ days = 0, hours = 0, minutes = 0, seconds = 0 }, unit) => {
  const string = [];

  if (unit && unit === 'days') {
    string.push(days === 1 ? t('1 Day') : t('{{days}} Days', { days }));
  
    return string.join(' ');
  }

  if (days > 0) {
    string.push(days === 1 ? t('1 Day') : t('{{days}} Days', { days }));
    string.push(hours === 1 ? t('1 Hour') : t('{{hours}} Hours', { hours }));
  }

  if (days < 1 && hours > 0 && minutes > 0) {
    string.push(hours === 1 ? t('1 Hour') : t('{{hours}} Hours', { hours }));
    string.push(minutes === 1 ? t('1 Minute') : t('{{minutes}} Minutes', { minutes }));
  }

  if (days < 1 && hours < 1 && minutes > 0) {
    string.push(minutes === 1 ? t('1 Minute') : t('{{minutes}} Minutes', { minutes }));
    string.push(seconds === 1 ? t('1 Second') : t('{{seconds}} Seconds', { seconds }));
  }

  if (days < 1 && hours < 1 && minutes < 1) {
    string.push(seconds === 1 ? t('1 Second') : t('{{seconds}} Seconds', { seconds }));
  }
  
  return string.join(' ');
}

console.log(duration({days: 20, hours: 2, minutes: 20, seconds: 38}))