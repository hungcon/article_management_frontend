/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-filename-extension */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Snackbar,
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Paper,
  Grid,
  Typography,
} from '@material-ui/core';
import { useForm } from 'react-hook-form';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import image from '../../assets/images/login.jpg';
import allActions from '../../store/actions/allActions';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: `url(${image})`,
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'dark' ? theme.palette.grey[900] : theme.palette.grey[50],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  link: {
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'none',
      color: 'black',
    },
  },
}));


export default function SignIn(props) {
  const count = useSelector((state) => state.config);
  const dispatch = useDispatch();
  const classes = useStyles();
  const { handleSubmit, register, errors } = useForm();
  const [snackbar, setSnackbar] = useState({});

  const onSubmit = async (values) => {
    const { userName, password } = values;
    const { accessToken } = (await axios.post('http://localhost:8000/sign-in', { userName, password })).data;
    if (accessToken) {
      if (!accessToken.success) {
        setSnackbar({
          message: accessToken.err,
          open: true,
        });
      } else {
        localStorage.setItem('userName', userName);
        localStorage.setItem('token', accessToken.token);
        props.history.push('/dashboard');
      }
    } else {
      setSnackbar({
        message: 'Internal server error',
        open: true,
      });
    }
  };

  const closeSnackbar = () => {
    setSnackbar({
      message: '',
      open: false,
    });
  };

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Đăng nhập
          </Typography>
          <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
            <TextField
              name="userName"
              variant="outlined"
              margin="normal"
              fullWidth
              error={!!(errors && errors.userName)}
              helperText={(errors && errors.userName) ? errors.userName.message : ''}
              id="userName"
              label="Tên đăng nhập"
              autoFocus
              inputRef={register({
                required: 'Required',

              })}
            />

            <TextField
              name="password"
              variant="outlined"
              error={!!(errors && errors.password)}
              helperText={(errors && errors.password) ? errors.password.message : ''}
              margin="normal"
              fullWidth
              label="Mật khẩu"
              type="password"
              id="password"
              inputRef={register({
                required: 'Required',
                maxLength: {
                  value: 15,
                  message: 'Mật khẩu phải nhỏ hơn 15 ký tự',
                },
                minLength: {
                  value: 6,
                  message: 'Mật khẩu phải lớn hơn 6 ký tự',
                },
              })}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Đăng nhập
            </Button>
          </form>
        </div>
      </Grid>
      <Snackbar
        autoHideDuration={2000}
        message={snackbar.message}
        open={snackbar.open}
        onClose={closeSnackbar}
      />
    </Grid>
  );
}
