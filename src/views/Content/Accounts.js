/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import MUIDataTable from 'mui-datatables';
import { makeStyles, createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import Button from '@material-ui/core/Button';
import { Tabs, Tab } from '@material-ui/core';


const columns = [
  {
    name: 'Name',
  },
  {
    name: 'Account',
  },
  {
    name: 'Password',
  },
  {
    name: 'Gender',
  },
  {
    name: 'Role',
    options: {
      customBodyRender: (value) => {
        if (value === 'User') {
          return (
            <Chip
              icon={<VerifiedUserIcon />}
              label={value}
              color="primary"
              style={{ marginRight: 10 }}
            />
          );
        }
        return (
          <Chip
            icon={<PersonOutlineIcon />}
            label={value}
            color="secondary"
          />
        );
      },
    },
  },
  {
    name: 'Permission',
    options: {
      customBodyRender: (value) => {
        const actions = [];
        value.forEach((action, key) => {
          actions.push(
            <Button variant="outlined" color="primary" key={key} style={{ marginBottom: 5 }}>
              {action}
            </Button>,
          );
        });
        return actions;
      },
    },
  },
];

const data = [
  ['Joe James', 'hungcon1911', 'Yonkers', 'Male', 'Admin', ['Service 1', 'Service 2', 'Service 3', 'Service 4', 'Service 5', 'Service 6']],
  ['John Walsh', 'account', 'Hartford', 'Male', 'User', ['Service 1']],
  ['Bob Herm', 'admin', 'Tampa', 'Male', 'User', ['Service 1', 'Service 2']],
  ['James Houston', 'chungbien', 'Dallas', 'Female', 'User', ['Service 2']],
  ['Joe James', 'joejames', 'Yonkers', 'Male', 'User', []],
  ['John Walsh', 'johnwalsh', 'Hartford', 'Male', 'User', ['Service 1', 'Service 2']],
  ['Bob Herm', 'bobby', 'Tampa', 'Male', 'User', ['Service 1', 'Service 2']],
  ['James Houston', 'james', 'Dallas', 'Female', 'User', ['Service 1', 'Service 2']],
];

const options = {
  selectableRows: 'none',
};

const muiDatatableTheme = createMuiTheme({
  overrides: {
    MUIDataTable: {
      responsiveStacked: {
        maxHeight: '430px',
      },
    },
    MUIDataTableHeadCell: {
      data: {
        fontWeight: 'bold',
        fontSize: '15px',
        whiteSpace: 'pre',
      },
    },
    MUIDataTableBodyCell: {
      root: {
        maxWidth: 100,
      },
    },
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  table: {
    marginTop: theme.spacing(0),
  },
  tab: {
    backgroundColor: '#379392',
    maxWidth: 400,

  },
  text: {
    color: '#FFF',
    fontFamily: 'Source Sans Pro',
    fontSize: 17,
    borderRight: '1px solid',
  },

}));

export default function Accounts() {
  const classes = useStyles();
  const [option, setOption] = React.useState(0);

  const handleChangeOption = (event, newValue) => {
    setOption(newValue);
  };

  return (
    <div className={classes.root}>
      <div className={classes.tab}>
        <Tabs
          value={option}
          textColor="inherit"
          onChange={handleChangeOption}
          variant="fullWidth"
          centered
          TabIndicatorProps={{
            style: {
              backgroundColor: '#D97D54',
            },
          }}
        >
          <Tab label="Service Manager" className={classes.text} />
          <Tab label="User" className={classes.text} />
        </Tabs>
      </div>
      <div className={classes.table}>
        <MuiThemeProvider theme={muiDatatableTheme}>
          <MUIDataTable
            className={classes.table}
            title="Account List"
            data={data}
            columns={columns}
            options={options}
          />
        </MuiThemeProvider>
      </div>
    </div>
  );
}
