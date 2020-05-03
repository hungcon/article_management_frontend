import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { css } from 'emotion';
import {
  Breadcrumb, Table, Tag, Button, Drawer,
} from 'antd';
import axios from 'axios';

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

export default function CleanText() {
  const classes = useStyles();
  const [data, setData] = useState();
  const [visible, setVisible] = useState(false);
  const [cleanOption, setCleanOption] = useState();

  const showDrawer = (record) => {
    setCleanOption(record);
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const columns = [
    {
      title: 'Website',
      dataIndex: 'articleId',
      key: 'articleId',
      render: (value) => value.website.name,
    },
    {
      title: 'Category',
      dataIndex: 'articleId',
      key: 'articleId',
      render: (value) => (
        <span>
          {value.category.map((caegory) => (
            <Tag color="green" key={caegory.name}>
              {caegory.name.toUpperCase()}
            </Tag>
          ))}
        </span>
      ),
    },
    {
      title: 'Title',
      dataIndex: 'articleId',
      key: 'articleId',
      render: (value) => value.title,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '20%',
      align: 'center',
      render: (value, record) => (
        <div>
          <Button
            type="primary"
            onClick={() => showDrawer(record)}
          >
            Detail
          </Button>
        </div>
      ),
    },
  ];
  useEffect(() => {
    let ignore = false;

    async function fetchData() {
      const result = await axios.post('http://localhost:8000/get-clean-articles');
      const articleData = result.data;
      for (let i = 0; i < articleData.length; i += 1) {
        articleData[i].key = i;
      }
      setData(articleData);
    }
    if (!ignore) {
      fetchData();
    }
    return () => { ignore = true; };
  }, []);

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
        dataSource={data}
        bordered
        scroll={{ y: 490 }}
      />
      <Drawer
        title="Basic Drawer"
        placement="right"
        width={1250}
        closable={false}
        onClose={onClose}
        visible={visible}
      >
        <CleanOption record={cleanOption} />
      </Drawer>
    </div>
  );
}
