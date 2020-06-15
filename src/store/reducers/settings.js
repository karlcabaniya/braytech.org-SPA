import * as ls from '../../utils/localStorage';

const history = ls.get('settings') || {
  lists: false
};

export default function reducer(state = history, action) {
  switch (action.type) {
    case 'SET_SETTING':

      const adjusted = {
        ...state,
        ...action.payload
      };
      
      ls.set('settings', adjusted);

      return adjusted;
    default:
      return state;
  }
}
