/* eslint-disable no-restricted-syntax */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-named-as-default */
/* eslint-disable import/no-named-as-default-member */
/* eslint-disable no-shadow */
import React, { useState, useEffect } from 'react';
import {
  Table, Tag, Form, Select, Button, Typography, Breadcrumb, Col, Row,
  DatePicker,
} from 'antd';
import { makeStyles } from '@material-ui/core/styles';
import { css } from 'emotion';
import axios from 'axios';
import { message } from '../../../common';
import openNotification from '../../Notifications';


const { RangePicker } = DatePicker;


const { Option } = Select;
const { Text } = Typography;

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    maxHeight: 400,
    fontFamily: 'Montserrat',
  },
}));

const listStatus = [
  {
    key: 1,
    name: 'Đã chuẩn hoá máy',
    value: '3',
  },
  {
    key: 2,
    name: 'Chuẩn hoá máy lỗi',
    value: 2,
  },
];


export default function ListInValidArticles() {
  const classes = useStyles();
  const [form] = Form.useForm();
  const [data, setData] = useState();
  const [filters, setFilters] = useState();
  const [counts, setCounts] = useState();
  const [reload, setReload] = useState(false);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [websites, setWebsites] = useState([]);
  const [categories, setCategories] = useState([]);

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


  const crawlArticle = async (article) => {
    const { website, category } = article;
    const listCategory = [];
    for (const temp of category) {
      listCategory.push(temp._id);
    }
    const articleConfig = (await axios.post('http://localhost:8000/get-config-by-website', { website, category: category[0] })).data;
    const reCrawlArticle = (await axios.post('http://localhost:8000/crawl/article', {
      link: article.link,
      configuration: articleConfig.article,
    })).data;
    const newValidArticle = {
      link: article.link,
      title: article.title,
      sapo: article.sapo,
      publicDate: new Date(article.createdAt),
      thumbnail: article.thumbnail,
      category: listCategory,
      website: website._id,
      sourceCode: article.sourceCode,
      text: `${article.title}\n\n${article.text}`,
      tags: article.tags || [],
      numberOfWords: !article.text ? 0 : article.text.split(' ').length,
      images: article.images,
    };
    if (reCrawlArticle) {
      const addResult = await axios.post('http://localhost:8000/add-valid-articles', { article: newValidArticle });
      if (addResult.data.status === 1) {
        setReload(!reload);
        openNotification('success', message.RECRAWL_SUCCESS);
      } else {
        openNotification('error', message.ERROR);
      }
    }
  };

  useEffect(() => {
    let ignore = false;
    async function fetchData() {
      const user = (await axios.post('http://localhost:8000/get-user-info', { userName: localStorage.getItem('userName') })).data;
      const {
        websites,
      } = user.currentUser;
      for (let i = 0; i < websites.length; i += 1) {
        websites[i].key = i + 1;
      }
      setWebsites(websites);
      const website = filters ? filters.website : websites;
      const category = filters ? filters.category : '';
      const status = filters ? filters.status : '';
      const date = {
        startDate: startDate || '',
        endDate: endDate || '',
      };
      const result = await axios.post('http://localhost:8000/get-invalid-articles', {
        website, category, date, status,
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

  const columns = [
    {
      title: 'Đầu báo',
      dataIndex: 'website',
      key: 'website',
      width: '17%',
      render: (value) => value.name,
    },
    {
      title: 'Chuyên mục',
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
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Loại',
      dataIndex: 'reason',
      key: 'reason',
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: '25%',
      align: 'center',
      render: (value, record) => (
        <div>
          <Button
            disabled={record.reason === 'Number of words less than 100.'}
            onClick={() => crawlArticle(record)}
            danger
            type="primary"
            style={{ marginRight: 10 }}
          >
            Thu thập lại
          </Button>
          <Button
            type="primary"
            onClick={() => window.open(record.link)}
          >
            Kiểm tra
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
          <a href="/dashboard/list-invalid-articles">Bài báo không hợp lệ</a>
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
          <Col span={6}>
            <Form.Item
              name="status"
              label="Trạng thái"
            >
              <Select
                showSearch
                filterOption={
            (input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
                allowClear
              >
                {listStatus.map((status) => (
                  <Option key={status.key} value={status.value}>{status.name}</Option>
                ))}
              </Select>
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
