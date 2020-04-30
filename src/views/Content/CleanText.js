import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { css } from 'emotion';
import { Breadcrumb, Table } from 'antd';
import CleanOption from './CleanOption';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    maxHeight: 440,
    fontFamily: 'Montserrat',
  },
}));

const tableCSS = css({
  backgroundColor: 'white',
  '& table': {
    borderCollapse: 'collapse',
  },
  '& thead > tr > th': {
    backgroundColor: '#33b35a',
    color: '#FFF',
    fontWeight: 'bold',
  },
});

const dataSource = [
  {
    key: '1',
    name: 'Mike',
    age: 32,
    address: '10 Downing Street',
  },
  {
    key: '2',
    name: 'John',
    age: 42,
    address: '10 Downing Street 10 Downing Street 10 Downing Street10 Downing Street10 Downing Street10 Downing Street10 Downing Street10 Downing Street10 Downing Street10 Downing Street10 Downing Street10 Downing Street10 Downing Street10 Downing Street10 Downing Street10 Downing Street10 Downing Street10 Downing Street10 Downing Street10 Downing Street10 Downing Street10 Downing Street',
  },
];

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
];


export default function CleanText() {
  const classes = useStyles();


  return (
    <div className={classes.root}>
      <Breadcrumb style={{ marginBottom: 10 }}>
        <Breadcrumb.Item>
          Dashboard
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <a href="/dashboard/configuration">Clean Text</a>
        </Breadcrumb.Item>
      </Breadcrumb>
      <Table
        className={tableCSS}
        columns={columns}
        dataSource={dataSource}
        expandable={{
          expandedRowRender: (record) => <CleanOption record={record} />,
        }}
        bordered
        scroll={{ y: 490 }}
      />
    </div>
  );
}
