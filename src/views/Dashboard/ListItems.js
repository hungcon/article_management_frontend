/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import BuildIcon from '@material-ui/icons/Build';
import PieChartIcon from '@material-ui/icons/PieChart';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import DescriptionIcon from '@material-ui/icons/Description';
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
            <BuildIcon className={classes.icon} />
          </ListItemIcon>
          <ListItemText primary="Configuration" className={classes.text} />
        </ListItem>
      </NavLink>
      <NavLink to="/dashboard/list-valid-articles" className={classes.link} activeClassName={classes.active}>
        <ListItem button className={clsx(props.open && classes.button)}>
          <ListItemIcon>
            <DescriptionIcon className={classes.icon} />
          </ListItemIcon>
          <ListItemText primary="List Valid Articles" className={classes.text} />
        </ListItem>
      </NavLink>
      <NavLink to="/dashboard/list-invalid-articles" className={classes.link} activeClassName={classes.active}>
        <ListItem button className={clsx(props.open && classes.button)}>
          <ListItemIcon>
            <ErrorOutlineIcon className={classes.icon} />
          </ListItemIcon>
          <ListItemText primary="List Invalid Articles" className={classes.text} />
        </ListItem>
      </NavLink>
      <NavLink to="/dashboard/statistics" className={classes.link} activeClassName={classes.active}>
        <ListItem button className={clsx(props.open && classes.button)}>
          <ListItemIcon>
            <PieChartIcon className={classes.icon} />
          </ListItemIcon>
          <ListItemText primary="Statistics" className={classes.text} />
        </ListItem>
      </NavLink>
      <NavLink to="/dashboard/clean-text" className={classes.link} activeClassName={classes.active}>
        <ListItem button className={clsx(props.open && classes.button)}>
          <ListItemIcon>
            <LayersIcon className={classes.icon} />
          </ListItemIcon>
          <ListItemText primary="Clean Text" className={classes.text} />
        </ListItem>
      </NavLink>
    </div>
  );
}
