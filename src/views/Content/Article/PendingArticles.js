/* eslint-disable no-await-in-loop */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-named-as-default */
/* eslint-disable import/no-named-as-default-member */
/* eslint-disable no-shadow */
import React, { useState, useEffect } from 'react';
import {
  Table, Tag, Form, Select, Button, Typography, Breadcrumb, DatePicker, Row, Col,
} from 'antd';
import { FileSearchOutlined } from '@ant-design/icons';
import { makeStyles } from '@material-ui/core/styles';
import { css } from 'emotion';
import axios from 'axios';
import { API_ENDPOINT } from '../../../common/apis';


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

  useEffect(() => {
    let ignore = false;
    async function fetchData() {
      const user = (await axios.post(API_ENDPOINT.GET_USER_INFO, { userName: localStorage.getItem('userName') })).data;
      const {
        websites,
      } = user.currentUser;
      for (let i = 0; i < websites.length; i += 1) {
        websites[i].key = i + 1;
      }
      setWebsites(websites);
      const website = filters ? filters.website : websites;
      const category = filters ? filters.category : '';
      const date = {
        startDate: startDate || '',
        endDate: endDate || '',
      };
      const result = await axios.post(API_ENDPOINT.GET_PENDING_ARTICLES, {
        website, category, date,
      });
      const articleData = result.data;
      for (let i = 0; i < articleData.length; i += 1) {
        articleData[i].key = i;
      }
      if (!ignore) {
        setCounts(articleData.length);
        setData(articleData);
      }
    }
    fetchData();
    return () => { ignore = true; };
  }, [filters, startDate, endDate]);

  useEffect(() => {
    let ignore = false;
    async function fetchData() {
      const listCategories = (await axios.post(API_ENDPOINT.GET_CATEGORIES)).data;
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


  const columns = [
    {
      title: 'Đầu báo',
      dataIndex: 'website',
      key: 'website',
      width: '10%',
      render: (value) => value.name,
    },
    {
      title: 'Chuyên mục',
      dataIndex: 'category',
      width: '15%',
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
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      render: (value, record) => (
        <Typography
          onClick={() => window.open(record.link)}
        >
          {value}
        </Typography>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: '16%',
      render: () => 'Đang chờ phê duyệt',
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: '20%',
      align: 'center',
      render: (value, record) => (
        <div>
          <Button
            onClick={() => props.history.push(`/dashboard/list-valid-articles/${record._id}`)}
            style={{ marginRight: 10, width: 180 }}
            type="primary"
            icon={<FileSearchOutlined />}
          >
            Chi tiết
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
          <a href="/dashboard/configuration">Bảng điều khiển</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <a href="/dashboard/pending-articles">Bài báo đang chờ duyệt</a>
        </Breadcrumb.Item>
      </Breadcrumb>
      <Form
        form={form}
        name="basic"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Row gutter={10}>
          <Col span={5}>
            <Form.Item
              name="website"
              label="Đầu báo"
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
                  <Option key={website.key} value={website._id}>{website.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item
              name="category"
              label="Chuyên mục"
            >
              <Select
                showSearch
                filterOption={
            (input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
                allowClear
              >
                {categories.map((category) => (
                  <Option key={category.key} value={category._id}>{category.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="Thời gian"
            >
              <RangePicker
                showTime={{ format: 'HH:mm' }}
                format="YYYY-MM-DD HH:mm"
                onChange={onChange}
                onOk={onOk}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Lọc
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      {!data ? 'Đang tải dữ liệu...' : (
        <Table
          className={tableCSS}
          columns={columns}
          dataSource={data}
          bordered
          scroll={{ y: 400 }}
          summary={() => (
            <tr>
              <th>Tổng số bài báo</th>
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
