const configReducer = {
  data: [],
  reload: false,
};
const config = (state = configReducer, action) => {
  switch (action.type) {
    case 'FETCH_DATA':
      return { ...state, data: action.data };
    case 'RELOAD':
      return { ...state, reload: !state.reload };
    default:
      return state;
  }
};

export default config;
