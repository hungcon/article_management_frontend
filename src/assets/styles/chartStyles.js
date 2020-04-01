const chartStyles = (theme) => ({
  chart: {
    height: 'auto',
    width: '100%',
  },
  root: {
    flexGrow: 1,
  },
  container: {
    maxHeight: 440,
  },
  filter: {
    width: '25%',
    marginBottom: theme.spacing(3),
    backgroundColor: '#FFF',
    '& > div > select': {
      fontFamily: 'Source Sans Pro',
    },
  },

});

export default chartStyles;
