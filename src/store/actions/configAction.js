const fetchData = (data) => ({
  type: 'FETCH_DATA',
  data,
});


const reload = () => ({
  type: 'RELOAD',
});

export default {
  fetchData,
  reload,
};
