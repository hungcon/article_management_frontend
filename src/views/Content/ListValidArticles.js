/* eslint-disable import/no-named-as-default */
/* eslint-disable import/no-named-as-default-member */
/* eslint-disable no-shadow */
import React, { useState, useEffect } from 'react';
import {
  Table, Tag, Form, Select, Button, Typography, Breadcrumb,
} from 'antd';
import { makeStyles } from '@material-ui/core/styles';
import { css } from 'emotion';
import axios from 'axios';
import { websites, categories } from '../../common';

const { Option } = Select;
const { Text } = Typography;

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    maxHeight: 400,
    fontFamily: 'Montserrat',
  },
}));

export default function ListValidArticles() {
  const classes = useStyles();
  const [form] = Form.useForm();
  const [data, setData] = useState();
  const [filters, setFilters] = useState();
  const [counts, setCounts] = useState();

  useEffect(() => {
    let ignore = false;

    async function fetchData() {
      const website = {
        id: 0,
        name: filters ? filters.website : '',
      };
      const category = {
        id: 0,
        name: filters ? filters.category : '',
      };
      const result = await axios.post('http://localhost:8000/get-valid-articles', { website, category });
      const articleData = result.data;
      setCounts(articleData.length);
      for (let i = 0; i < articleData.length; i += 1) {
        articleData[i].key = i;
      }
      if (!ignore) {
        setData(articleData);
      }
    }
    fetchData();
    return () => { ignore = true; };
  }, [filters]);

  const columns = [
    {
      title: 'Website',
      dataIndex: 'website',
      key: 'website',
      width: '20%',
      render: (value) => value.name,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      width: '25%',
      key: 'category',
      render: (tags) => (
        <span>
          {tags.map((tag) => (
            <Tag color="green" key={tag.name}>
              {tag.name.toUpperCase()}
            </Tag>
          ))}
        </span>
      ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
  ];
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
  const onFinish = (values) => {
    setFilters({
      website: values.website || '',
      category: values.category || '',
    });
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <div className={classes.root}>
      <Breadcrumb style={{ marginBottom: 10 }}>
        <Breadcrumb.Item>
          <a href="/dashboard/configuration">Dashboard</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <a href="/dashboard/list-valid-articles">Valid Articles</a>
        </Breadcrumb.Item>
      </Breadcrumb>
      <Form
        style={{ marginBottom: '15px' }}
        form={form}
        name="basic"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        layout="inline"
      >
        <Form.Item
          name="website"
          label="Website"
          style={{ width: '45%' }}
        >
          <Select
            showSearch
            optionFilterProp="children"
            filterOption={
            (input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
            allowClear
          >
            {websites.map((website) => (
              <Option key={website.id} value={website.name}>{website.name}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          style={{ width: '45%' }}
          name="category"
          label="Category"
        >
          <Select
            showSearch
            filterOption={
            (input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            allowClear
          >
            {categories.map((category) => (
              <Option key={category}>{category}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item style={{ width: '5%' }}>
          <Button type="primary" htmlType="submit">
            Filter
          </Button>
        </Form.Item>
      </Form>
      {!data ? 'Loading data...' : (
        <Table
          className={tableCSS}
          columns={columns}
          dataSource={data}
          bordered
          summary={() => (
            <tr>
              <th>Total documents</th>
              <td colSpan={2}>
                <Text type="danger">{counts}</Text>
              </td>
            </tr>
          )}
        />
      )}

    </div>
  );
}
