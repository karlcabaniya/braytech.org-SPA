import React from 'react';
import ReactMarkdown from 'react-markdown';
import i18next from 'i18next';
import backend from 'i18next-xhr-backend';
import { initReactI18next } from 'react-i18next';
import moment from 'moment';

import * as ls from './localStorage';
import { stringToIcons } from './destinyUtils';
import { linkHelper, wrapEnergy, noParagraphs } from './markdown';

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
      loadPath: '/static/locales/{{lng}}/{{ns}}.json',
    },
    // allow keys to be phrases having `:`, `.`
    nsSeparator: false,
    keySeparator: false,
    interpolation: {
      escapeValue: false,
    },
    react: {
      wait: true,
      useSuspense: true,
    },
  });

i18next.getCurrentLanguage = getCurrentLanguage;
i18next.setCurrentLanguage = setCurrentLanguage;

export default i18next;

export const t = (key, options) => i18next.t(key, options || { skipInterpolation: true });

export function getLanguageInfo(code) {
  switch (code) {
    case 'debug':
      return {
        name: 'Debug',
        code: code,
      };
    case 'de':
      return {
        name: 'Deutsch',
        code: code,
      };
    case 'en':
      return {
        name: 'English',
        code: code,
      };
    case 'en-au':
      return {
        name: 'English (Australia)',
        code: code,
      };
    case 'es':
      return {
        name: 'Español',
        code: code,
      };
    case 'es-mx':
      return {
        name: 'Español mexicano',
        code: code,
      };
    case 'fr':
      return {
        name: 'Français',
        code: code,
      };
    case 'it':
      return {
        name: 'Italiano',
        code: code,
      };
    case 'ja':
      return {
        name: '日本語',
        code: code,
      };
    case 'ko':
      return {
        name: '한국어',
        code: code,
      };
    case 'pl':
      return {
        name: 'Polski',
        code: code,
      };
    case 'pt-br':
      return {
        name: 'Português Brasileiro',
        code: code,
      };
    case 'ru':
      return {
        name: 'Русский',
        code: code,
      };
    case 'zh-cht':
      return {
        name: '繁體中文',
        code: code,
      };
    case 'zh-chs':
      return {
        name: '简体中文',
        code: code,
      };
    default:
      return { code: code };
  }
}

const durationKeys = {
  months: {
    single: t('1 Month'),
    plural: (months) => t('{{months}} Months', { months }),
  },
  days: {
    single: t('1 Day'),
    plural: (days) => t('{{days}} Days', { days }),
  },
  hours: {
    single: t('1 Hour'),
    plural: (hours) => t('{{hours}} Hours', { hours }),
  },
  minutes: {
    single: t('1 Minute'),
    plural: (minutes) => t('{{minutes}} Minutes', { minutes }),
  },
  seconds: {
    single: t('1 Second'),
    plural: (seconds) => t('{{seconds}} Seconds', { seconds }),
  },
};

const durationKeysAbr = {
  months: {
    single: t('1 Mth'),
    plural: (months) => t('{{months}} Mths', { months }),
  },
  days: {
    single: t('1 Day'),
    plural: (days) => t('{{days}} Days', { days }),
  },
  hours: {
    single: t('1 Hr'),
    plural: (hours) => t('{{hours}} Hrs', { hours }),
  },
  minutes: {
    single: t('1 Min'),
    plural: (minutes) => t('{{minutes}} Mins', { minutes }),
  },
  seconds: {
    single: t('1 Sec'),
    plural: (seconds) => t('{{seconds}} Secs', { seconds }),
  },
};

function finalString(value) {
  return value.toLocaleString();
}

export const duration = ({ months = 0, days = 0, hours = 0, minutes = 0, seconds = 0 }, { unit = undefined, relative = false, abbreviated = false } = {}) => {
  const string = [];

  const keys = abbreviated ? durationKeysAbr : durationKeys;

  if (relative) {
    if (months > 0) {
      string.push(months === 1 ? keys.months.single : keys.months.plural(finalString(months)));

      return string.join(' ');
    } else if (days > 0) {
      string.push(days === 1 ? keys.days.single : keys.days.plural(finalString(days)));

      return string.join(' ');
    } else if (days < 1 && hours > 0) {
      string.push(hours === 1 ? keys.hours.single : keys.hours.plural(finalString(hours)));

      return string.join(' ');
    } else if (days < 1 && hours < 1 && minutes > 0) {
      string.push(minutes === 1 ? keys.minutes.single : keys.minutes.plural(finalString(minutes)));

      return string.join(' ');
    } else {
      string.push(seconds === 1 ? keys.seconds.single : keys.seconds.plural(finalString(seconds)));

      return string.join(' ');
    }
  }

  if (unit === 'days') {
    string.push(days === 1 ? keys.days.single : keys.days.plural(finalString(days)));

    return string.join(' ');
  }

  if (unit === 'hours') {
    string.push(hours === 1 ? keys.hours.single : keys.hours.plural(finalString(hours)));

    return string.join(' ');
  }

  if (unit === 'minutes') {
    string.push(minutes === 1 ? keys.minutes.single : keys.minutes.plural(finalString(minutes)));

    return string.join(' ');
  }

  if (months > 0) {
    string.push(months === 1 ? keys.months.single : keys.months.plural(finalString(months)));
    if (days > 0) string.push(days === 1 ? keys.days.single : keys.days.plural(finalString(days)));
  }

  if (days > 0 && months < 1) {
    string.push(days === 1 ? keys.days.single : keys.days.plural(finalString(days)));
    if (hours > 0) string.push(hours === 1 ? keys.hours.single : keys.hours.plural(finalString(hours)));
  }

  if (days < 1 && hours > 0) {
    string.push(hours === 1 ? keys.hours.single : keys.hours.plural(finalString(hours)));
    if (minutes > 0) string.push(minutes === 1 ? keys.minutes.single : keys.minutes.plural(finalString(minutes)));
  }

  if (days < 1 && hours < 1 && minutes > 0) {
    string.push(minutes === 1 ? keys.minutes.single : keys.minutes.plural(finalString(minutes)));
    if (seconds > 0) string.push(seconds === 1 ? keys.seconds.single : keys.seconds.plural(finalString(seconds)));
  }

  if (days < 1 && hours < 1 && minutes < 1) {
    string.push(seconds === 1 ? keys.seconds.single : keys.seconds.plural(finalString(seconds)));
  }

  return string.join(' ');
};

export const timestampToDifference = (timestamp, unit = 'seconds', start = moment()) => {
  const end = moment(timestamp);
  const difference = end.diff(start, unit);

  return {
    [unit]: difference,
  };
};

export const timestampToDuration = (timestamp, start = moment()) => {
  const end = moment(timestamp);
  const duration = moment.duration(end.diff(start));

  return {
    years: duration.get('years'),
    months: duration.get('months'),
    days: duration.get('days'),
    hours: duration.get('hours'),
    minutes: duration.get('minutes'),
    seconds: duration.get('seconds'),
    milliseconds: duration.get('milliseconds'),
  };
};

// export const xurInTown = () => {
//   const momentBefore = moment();
//         momentBefore.day(10);
//         momentBefore.hour(2);
//         momentBefore.minute(59);
//         momentBefore.second(59);
//   const momentAfter = moment();
//         momentAfter.day(6);
//         momentAfter.hour(3);
//         momentAfter.minute(0);
//         momentAfter.second(0);

//   const isAfter = moment().tz('Australia/Brisbane').isAfter(momentAfter, 'second');
//   const isBefore = moment().tz('Australia/Brisbane').isBefore(momentBefore, 'second');

//   return isAfter && isBefore;
// };

export const unixTimestampToDuration = (seconds) => {
  const duration = moment.duration(seconds);

  return {
    years: duration.get('years'),
    months: duration.get('months'),
    days: duration.get('days'),
    hours: duration.get('hours'),
    minutes: duration.get('minutes'),
    seconds: duration.get('seconds'),
    milliseconds: duration.get('milliseconds'),
  };
};

export const formatTime = (date = moment(), format) => {
  if (format === 'ISO8601') {
    return moment(date).toISOString();
  } else {
    return moment(date).format(format);
  }
};

export const addTime = (date = moment(), value, unit = 'seconds') => {
  return moment(date).add(value, unit);
};

export const fromNow = (date, abbreviated, withoutSuffix) => {
  if (abbreviated) {
    return moment(date).locale('rel-abr').fromNow(withoutSuffix);
  } else {
    return moment(date)
      .locale(['zh-chs', 'zh-cht'].indexOf(i18next.language) > -1 ? 'zh-cn' : i18next.language)
      .fromNow(withoutSuffix);
  }
};

function escapeRegExp(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\\s]/g, '\\$&');
}

function escapeString(value, severe) {
  const full = ['#', '##', '###', '####', '#####', '######', '#', '**', '__', '*', '_', '***', '___', '__*', '**_', '>', '>>', '(', ')', '[', ']', '`', '``', '```', '---', '-', '+/', '/*', '*/'];
  const lite = ['#', '##', '###', '####', '#####', '######', '#', '**', '*', '__', '___', '__*', '**_', '`', '``', '```', '---'];

  const patterns = severe ? full : lite;

  patterns.forEach((text) => {
    const test = new RegExp(`${escapeRegExp(text)}`, 'g');

    value = value.replace(test, '\\$&');
  });

  return value;
}

export function BungieText(props) {
  const { className, value = '', textOnly, trim, single, energy, ...rest } = props;

  // get first sentence
  let source = single ? value.split('\n')[0] : value;

  // double line breaks
  source = source.replace(/\n/g, '\n\n');
  // replace • with actual list items
  source = source.replace(/•/g, '-');

  // chop any trailing colons off
  source =
    source.substr(source.length - 1) === ':'
      ? trim && source.slice(0, -1).length < +trim + 10 // if is less than trim length
        ? source.slice(0, -1) + '...' // append ellipsis
        : source.slice(0, -1)
      : source;

  // trim and append ellipsis
  source = trim && source.length > +trim + 10 ? source.slice(0, +trim + 10).trim() + '...' : source;

  // add icons
  source = stringToIcons(source, true);

  const disallowedTypes = textOnly && noParagraphs;

  const renderers = {};

  // wrap energy words
  if (energy) {
    renderers.text = wrapEnergy;
  }

  return <ReactMarkdown className={className} source={source} {...rest} renderers={renderers} disallowedTypes={disallowedTypes} unwrapDisallowed />;
}

export function BraytechText(props) {
  const { className, value = '', textOnly, escapeValue, ...rest } = props;

  const disallowedTypes = textOnly && noParagraphs;

  const source = escapeValue ? stringToIcons(escapeString(value), true) : stringToIcons(value, true);

  return <ReactMarkdown className={className} source={source} {...rest} renderers={{ link: linkHelper }} disallowedTypes={disallowedTypes} unwrapDisallowed />;
}

export function withinString(type, activityName) {
  if (type === 'lost-sector') {
    return t('Found within Lost Sector: {{activityName}}', { activityName });
  } else if (type === 'strike') {
    return t('Found within Strike: {{activityName}}', { activityName });
  } else if (type === 'story') {
    return t('Found within Story: {{activityName}}', { activityName });
  } else if (type === 'ascendant-challenge') {
    return t('Found within Ascendant Challenge: {{activityName}}', { activityName });
  } else if (activityName) {
    return t('Found within activity: {{activityName}}', { activityName });
  } else {
    return t('Found within activity');
  }
}

export function unavailableString(status) {
  if (status === 'removed') {
    return t('Unavailable: this node is no longer available in-game.');
  } else if (status === 'api') {
    return t('Unavailable: something is preventing this node from relaying its status reliably.');
  } else {
    return t('Unavailable');
  }
}

export const Energy = {
  Solar: ['solar', 'solare', 'solares', 'огня'],
  Arc: ['arc', 'arco', 'молнии'],
  Void: ['void', 'vacío', 'vuoto', 'vácuo', 'пустоты'],
};

export function basic(string) {
  return string.toLowerCase().replace(/[^\s0-9_A-Za-zÀ-ÖØ-öø-ÿ]+/g, '');
}

export function energyAffinity(string) {
  if (Energy.Solar.indexOf(string) > -1) {
    return 'solar';
  }

  if (Energy.Arc.indexOf(string) > -1) {
    return 'arc';
  }

  if (Energy.Void.indexOf(string) > -1) {
    return 'void';
  }

  return false;
}
