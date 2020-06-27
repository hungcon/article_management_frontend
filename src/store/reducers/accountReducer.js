const accountReducer = {
  reload: false,
};
const account = (state = accountReducer, action) => {
  switch (action.type) {
    case 'RELOAD':
      return { ...state, reload: !state.reload };
    default:
      return state;
  }
};

export default account;
