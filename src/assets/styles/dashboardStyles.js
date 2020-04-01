const drawerWidth = 240;
const dashboardStyles = (theme) => ({
  root: {
    display: 'flex',
    background: '#d0ecf61f', /* fallback for old browsers */
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor: '#393836',
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
    backgroundColor: '#292929',
    '&:hover': {
      background: '#379392',
    },
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
    fontFamily: 'Source Sans Pro',
    fontWeight: 'bold',
    color: '#379392',
    textTransform: 'uppercase',
  },
  drawerPaper: {
    background: '#393836',
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),

  },
  drawerPaperClose: {
    background: '#393836',
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
    '& svg': {
      color: '##5b5b5b',
    },
    '& > ul > a > div:hover': {
      background: '#33b35a',
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
  link: {
    textDecoration: 'none',
    color: '#FFF',
    '& > div:hover': {
      textDecoration: 'none',
      backgroundColor: '#33b35a',
    },
    '&:hover': {
      textDecoration: 'none',
    },
  },
  active: {
    '& > div': {
      backgroundColor: '#33b35a',
    },
  },
  button: {
    color: '#FFF',
    backgroundColor: 'transparent',
    width: 'auto',
    margin: '10px 15px 0',
    padding: '10px 15px',
    position: 'relative',
    transition: 'all 300ms linear',
    fontWeight: '300',
    lineHeight: '1.5em',
    borderRadius: '5px',
    '&:hover': {
      backgroundColor: '#33b35a',
    },
  },
  text: {
    '& > span': {
      fontFamily: 'Source Sans Pro',
    },
  },
  icon: {
    color: '#FFFFFF',
  },
  menuIcon: {
    '& > span': {
      color: '#FFFFFF',
    },
    '&:hover': {
      backgroundColor: '#379392',
    },
    backgroundColor: '#292929',
    borderRadius: '50%',
    fontSize: '1.5rem',
  },
});

export default dashboardStyles;
