const userReducer = {};
const user = (state = userReducer, action) => {
  switch (action.type) {
    case 'SIGN_IN':
      return state;
    case 'SIGN_OUT':
      return state;
    default:
      return state;
  }
};

export default user;
