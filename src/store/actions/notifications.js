export const pushNotification = (payload) => {
  return {
    type: 'PUSH_NOTIFICATION',
    payload,
  };
};

export default pushNotification;
