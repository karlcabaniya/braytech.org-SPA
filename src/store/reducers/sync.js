import ls from '../../utils/localStorage';

const defaults = {
  ...ls.get('settings.sync'),
  enabled: true
}

function save(payload) {
  ls.set('settings', payload);
}

export default function reducer(state = defaults, action) {
  if (action.type === 'SYNC_SET') {
    const sync = {
      ...state,
      ...action.payload
    };

    save(sync);

    return sync;
  } else {
    return state;
  }
}