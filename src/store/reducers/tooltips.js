export default function reducer(
  state = {
    bindTime: new Date().getTime(),
  },
  action
) {
  switch (action.type) {
    case 'TOOLTIPS_REBIND':
      return {
        ...state,
        bindTime: new Date().getTime(),
      };
    default:
      return state;
  }
}
