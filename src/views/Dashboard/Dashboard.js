/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { Avatar } from '@material-ui/core';
import axios from 'axios';
import styles from '../../assets/styles/dashboardStyles';
import ContentRoute from '../../router/Route/ContentRoute';
import ListItems from './ListItems';

const useStyles = makeStyles(styles);

export default function Dashboard(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({ firstName: '', lastName: '', role: '' });

  useEffect(() => {
    let ignore = false;
    async function fetchData() {
      const user = (await axios.post('http://localhost:8000/get-user-info', { userName: localStorage.getItem('userName') })).data;
      const {
        firstName,
        lastName,
        role,
      } = user;
      if (!ignore) {
        setCurrentUser({ firstName, lastName, role });
      }
    }
    fetchData();
    return () => { ignore = true; };
  }, []);

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const signOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    props.history.push('/');
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            Article Configuration
          </Typography>

          <IconButton color="inherit" onClick={signOut}>
            <ExitToAppIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <Avatar alt="Avatar" src="src" style={{ marginRight: '15px' }} />
          <Typography className={classes.text} style={{ marginRight: '15px', color: '#FFF', fontFamily: 'Source Sans Pro' }}>{`${currentUser.firstName} ${currentUser.lastName}`}</Typography>
          <IconButton onClick={handleDrawerClose} className={classes.menuIcon}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItems open={open} currentUser={currentUser} />
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <ContentRoute currentUser={currentUser} />
          </Grid>
        </Container>
      </main>
    </div>
  );
}
