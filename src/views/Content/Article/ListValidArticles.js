/* eslint-disable no-unused-expressions */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-named-as-default */
/* eslint-disable import/no-named-as-default-member */
/* eslint-disable no-shadow */
import React, { useState, useEffect } from 'react';
import {
  Table, Tag, Form, Select, Button, Typography, Breadcrumb, DatePicker, Modal, Progress,
} from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { makeStyles } from '@material-ui/core/styles';
import { css } from 'emotion';
import axios from 'axios';
import openNotification from '../../Notifications';
import { message } from '../../../common';

const { confirm } = Modal;

const { Option } = Select;
const { Text } = Typography;
const { RangePicker } = DatePicker;

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    maxHeight: 400,
    fontFamily: 'Montserrat',
  },
}));

export default function ListValidArticles(props) {
  const classes = useStyles();
  const [form] = Form.useForm();
  const [data, setData] = useState();
  const [filters, setFilters] = useState();
  const [counts, setCounts] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [websites, setWebsites] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    let ignore = false;
    async function fetchData() {
      const listWebsite = (await axios.post('http://localhost:8000/get-websites')).data;
      for (let i = 0; i < listWebsite.length; i += 1) {
        listWebsite[i].key = i + 1;
      }
      if (!ignore) {
        setWebsites(listWebsite);
      }
    }
    fetchData();
    return () => { ignore = true; };
  }, []);

  useEffect(() => {
    let ignore = false;
    async function fetchData() {
      const listCategories = (await axios.post('http://localhost:8000/get-categories')).data;
      for (let i = 0; i < listCategories.length; i += 1) {
        listCategories[i].key = i + 1;
      }
      if (!ignore) {
        setCategories(listCategories);
      }
    }
    fetchData();
    return () => { ignore = true; };
  }, []);

  useEffect(() => {
    let ignore = false;

    async function fetchData() {
      const website = filters ? filters.website : '';
      const category = filters ? filters.category : '';
      const date = {
        startDate: startDate || '',
        endDate: endDate || '',
      };
      const result = await axios.post('http://localhost:8000/get-valid-articles', { website, category, date });
      const articleData = result.data;
      setCounts(articleData.length);
      for (let i = 0; i < articleData.length; i += 1) {
        articleData[i].key = i;
      }
      setData(articleData);
    }
    if (!ignore) {
      fetchData();
    }
    return () => { ignore = true; };
  }, [filters, startDate, endDate, reload]);


  const showDeleteConfirm = (article) => {
    confirm({
      title: 'Are you sure delete this article?',
      // eslint-disable-next-line react/jsx-filename-extension
      icon: <ExclamationCircleOutlined />,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      centered: true,
      async onOk() {
        const status = (await axios.post('http://localhost:8000/delete-valid-article', { id: article._id })).data;
        if (status.status === 1) {
          setReload(!reload);
          openNotification('success', message.DELETE_SUCCESS);
        } else {
          openNotification('error', message.ERROR);
        }
      },
      onCancel() {
      },
    });
  };
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
    {
      title: 'Text Cleaned',
      dataIndex: 'isCleaned',
      key: 'isCleaned',
      align: 'center',
      width: '11%',
      render: (value) => {
        if (value === 1) {
          return <Progress type="circle" percent={100} width={30} />;
        }
        return <Progress type="circle" percent={100} width={30} status="exception" />;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '25%',
      align: 'center',
      render: (value, record) => (
        <div>
          <Button
            // eslint-disable-next-line no-underscore-dangle
            onClick={() => props.history.push(`/dashboard/list-valid-articles/${record._id}`)}
            style={{ marginRight: 10 }}
            icon={<EditOutlined />}
          >
            Update
          </Button>
          <Button
            danger
            onClick={() => showDeleteConfirm(record)}
            icon={<DeleteOutlined />}
          >
            Delete
          </Button>
        </div>
      ),
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

  const onChange = (value, dateString) => {
    console.log('Formatted Selected Time: ', dateString);
    setStartDate(dateString[0]);
    setEndDate(dateString[1]);
  };

  const onOk = (value) => {
    console.log('onOk: ', value);
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
          style={{ width: '29%' }}
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
              <Option key={website.key} value={website.name}>{website.name}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          style={{ width: '29%' }}
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
              <Option key={category.key} value={category.name}>{category.name}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          style={{ width: '29%' }}
          label="Time"
        >
          <RangePicker
            showTime={{ format: 'HH:mm' }}
            format="YYYY-MM-DD HH:mm"
            onChange={onChange}
            onOk={onOk}
          />
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
          scroll={{ y: 400 }}
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
