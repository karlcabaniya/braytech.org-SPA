export default {
  settings: {
    set: function (payload) {
      return {
        type: 'SET_SETTING',
        payload,
      };
    },
  },
  auth: {
    set: function (payload) {
      return {
        type: 'SET_AUTH',
        payload,
      };
    },
    reset: function () {
      return {
        type: 'RESET_AUTH',
      };
    },
  },
  member: {
    load: function (payload) {
      return {
        type: 'MEMBER_LOAD_MEMBERSHIP',
        payload,
      };
    },
  },
  theme: {
    scrollbars: function (payload) {
      return {
        type: 'SET_SCROLLBARS',
        payload,
      };
    },
  },
  notifications: {
    push: function (payload) {
      return {
        type: 'PUSH_NOTIFICATION',
        payload,
      };
    },
    pop: function (payload) {
      return {
        type: 'POP_NOTIFICATION',
        payload,
      };
    },
  },
  tooltips: {
    rebind: function () {
      return {
        type: 'REBIND_TOOLTIPS',
      };
    },
  },
  triumphs: {
    toggle: function (payload) {
      return {
        type: 'TRIUMPHS_TOGGLE_TRACK',
        payload,
      };
    },
  },
  lists: {
    toggle: function (payload) {
      return {
        type: 'LISTS_TOGGLE',
        payload,
      };
    },
  },
};
