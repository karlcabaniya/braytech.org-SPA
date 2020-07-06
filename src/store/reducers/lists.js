import ls from '../../utils/localStorage';

const history = ls.get('history.list') || {
  nodes: [],
  collectibles: [],
  records: []
};

export default function reducer(state = history, action) {
  switch (action.type) {
    case 'ADD_TO_LIST':

      const adjusted = {
        ...state,
        [action.payload.type]: state[action.payload.type].includes(action.payload.value) ? state[action.payload.type].filter(hash => hash !== action.payload.value) : [...state[action.payload.type], action.payload.value]
      };
      
      ls.set('history.list', adjusted);

      return adjusted;
    default:
      return state;
  }
}
