function defaultState() {
  return {
    cache: [],
  }
}

export default function reducer(state = defaultState(), action) {
  if (action.type === 'REPORTS_STORE') {    
    return {
      loading: false,
      cache: [...state.cache, action.payload]
    };
  } else {
    return state;
  }
}
