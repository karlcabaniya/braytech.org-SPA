export default {
  push: function (payload) {
    return {
      type: 'PUSH_NOTIFICATION',
      payload,
    };
  },
};
