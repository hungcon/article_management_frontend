const configReducer = {
  data: [],
};
const config = (state = configReducer, action) => {
  switch (action.type) {
    case 'FETCH_DATA':
      return { ...state, data: action.data };
    default:
      return state;
  }
};

export default config;
