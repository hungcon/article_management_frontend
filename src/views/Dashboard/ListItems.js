/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import BuildIcon from '@material-ui/icons/Build';
import CategoryIcon from '@material-ui/icons/Category';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import LanguageIcon from '@material-ui/icons/Language';
import PieChartIcon from '@material-ui/icons/PieChart';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import DescriptionIcon from '@material-ui/icons/Description';
import { NavLink } from 'react-router-dom';
import styles from '../../assets/styles/dashboardStyles';

const useStyles = makeStyles(styles);

export default function ListItems(props) {
  const classes = useStyles();
  return (
    <div>
      {props.currentUser.role === 'admin'
        ? (
          <div>
            <NavLink to="/dashboard/list-accounts" className={classes.link} activeClassName={classes.active}>
              <ListItem button className={clsx(props.open && classes.button)}>
                <ListItemIcon>
                  <AccountCircleIcon className={classes.icon} />
                </ListItemIcon>
                <ListItemText primary="Người dùng" className={classes.text} />
              </ListItem>
            </NavLink>
            <NavLink to="/dashboard/list-website" className={classes.link} activeClassName={classes.active}>
              <ListItem button className={clsx(props.open && classes.button)}>
                <ListItemIcon>
                  <LanguageIcon className={classes.icon} />
                </ListItemIcon>
                <ListItemText primary="Đầu báo" className={classes.text} />
              </ListItem>
            </NavLink>
            <NavLink to="/dashboard/list-category" className={classes.link} activeClassName={classes.active}>
              <ListItem button className={clsx(props.open && classes.button)}>
                <ListItemIcon>
                  <CategoryIcon className={classes.icon} />
                </ListItemIcon>
                <ListItemText primary="Chuyên mục" className={classes.text} />
              </ListItem>
            </NavLink>
            <NavLink to="/dashboard/configuration" className={classes.link} activeClassName={classes.active}>
              <ListItem button className={clsx(props.open && classes.button)}>
                <ListItemIcon>
                  <BuildIcon className={classes.icon} />
                </ListItemIcon>
                <ListItemText primary="Cấu hình" className={classes.text} />
              </ListItem>
            </NavLink>
          </div>
        )
        : (<div />)}
      <div>
        <NavLink to="/dashboard/list-valid-articles" className={classes.link} activeClassName={classes.active}>
          <ListItem button className={clsx(props.open && classes.button)}>
            <ListItemIcon>
              <DescriptionIcon className={classes.icon} />
            </ListItemIcon>
            <ListItemText primary="Báo hợp lệ" className={classes.text} />
          </ListItem>
        </NavLink>
        <NavLink to="/dashboard/list-invalid-articles" className={classes.link} activeClassName={classes.active}>
          <ListItem button className={clsx(props.open && classes.button)}>
            <ListItemIcon>
              <ErrorOutlineIcon className={classes.icon} />
            </ListItemIcon>
            <ListItemText primary="Báo không hợp lệ" className={classes.text} />
          </ListItem>
        </NavLink>
        <NavLink to="/dashboard/statistics" className={classes.link} activeClassName={classes.active}>
          <ListItem button className={clsx(props.open && classes.button)}>
            <ListItemIcon>
              <PieChartIcon className={classes.icon} />
            </ListItemIcon>
            <ListItemText primary="Thống kê" className={classes.text} />
          </ListItem>
        </NavLink>
      </div>
    </div>
  );
}
