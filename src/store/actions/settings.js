export default {
  set: function (payload) {
    return {
      type: 'SET_SETTING',
      payload,
    };
  },
};
