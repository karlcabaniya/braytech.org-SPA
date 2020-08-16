async function getCache() {
  try {
    return await caches.open('reports');
  } catch (e) {
    console.log(e);

    return [];
  }
}

function defaultState() {
  return {
    loading: false,
    cache: [],
  }
}

export default function reducer(state = defaultState(), action) {
  if (action.type === 'REPORTS_STATE') {
    return {
      ...state,
      loading: action.payload || false,
    };
  } else if (action.type === 'REPORTS_STORE') {    
    return {
      loading: false,
      cache: [...state.cache, action.payload]
    };
  } else {
    return state;
  }
}
