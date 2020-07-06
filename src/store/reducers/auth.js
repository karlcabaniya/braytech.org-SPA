import ls from '../../utils/localStorage';

const defaultState = ls.get('setting.auth') || {};

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case 'SET_AUTH':
      state = action.payload;

      ls.set('setting.auth', state);
      return state;
    case 'RESET_AUTH':
      state = false;

      ls.del('setting.auth');
      
      return state;
    default:
      return state;
  }
}
