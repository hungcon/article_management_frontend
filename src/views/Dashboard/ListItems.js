/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleIcon from '@material-ui/icons/People';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import BarChartIcon from '@material-ui/icons/BarChart';
import LayersIcon from '@material-ui/icons/Layers';
import { NavLink } from 'react-router-dom';
import styles from '../../assets/styles/dashboardStyles';

const useStyles = makeStyles(styles);

export default function ListItems(props) {
  const classes = useStyles();
  return (
    <div>
      <NavLink to="/dashboard/configuration" className={classes.link} activeClassName={classes.active}>
        <ListItem button className={clsx(props.open && classes.button)}>
          <ListItemIcon>
            <DashboardIcon className={classes.icon} />
          </ListItemIcon>
          <ListItemText primary="Configuration" className={classes.text} />
        </ListItem>
      </NavLink>
      <NavLink to="/dashboard/log-chart" className={classes.link} activeClassName={classes.active}>
        <ListItem button className={clsx(props.open && classes.button)}>
          <ListItemIcon>
            <BarChartIcon className={classes.icon} />
          </ListItemIcon>
          <ListItemText primary="Log Chart" className={classes.text} />
        </ListItem>
      </NavLink>
      <NavLink to="/dashboard/accounts" className={classes.link} activeClassName={classes.active}>
        <ListItem button className={clsx(props.open && classes.button)}>
          <ListItemIcon>
            <PeopleIcon className={classes.icon} />
          </ListItemIcon>
          <ListItemText primary="Accounts" className={classes.text} />
        </ListItem>
      </NavLink>
      <NavLink to="/dashboard/reports" className={classes.link} activeClassName={classes.active}>
        <ListItem button className={clsx(props.open && classes.button)}>
          <ListItemIcon>
            <LibraryBooksIcon className={classes.icon} />
          </ListItemIcon>
          <ListItemText primary="Reports" className={classes.text} />
        </ListItem>
      </NavLink>
      <NavLink to="/dashboard/statistics" className={classes.link} activeClassName={classes.active}>
        <ListItem button className={clsx(props.open && classes.button)}>
          <ListItemIcon>
            <LayersIcon className={classes.icon} />
          </ListItemIcon>
          <ListItemText primary="Statistics" className={classes.text} />
        </ListItem>
      </NavLink>
    </div>
  );
}
