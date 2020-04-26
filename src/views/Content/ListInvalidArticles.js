/* eslint-disable import/no-named-as-default */
/* eslint-disable import/no-named-as-default-member */
/* eslint-disable no-shadow */
import React, { useState, useEffect } from 'react';
import {
  Table, Tag, Form, Select, Button, Typography, Breadcrumb,
  DatePicker,
} from 'antd';
import { makeStyles } from '@material-ui/core/styles';
import { css } from 'emotion';
import axios from 'axios';
import { websites, categories, message } from '../../common';
import openNotification from '../Notifications';


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

export default function ListInValidArticles() {
  const classes = useStyles();
  const [form] = Form.useForm();
  const [data, setData] = useState();
  const [filters, setFilters] = useState();
  const [counts, setCounts] = useState();
  const [reload, setReload] = useState(false);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const crawlArticle = async (article) => {
    const { website, category } = article;
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
      category,
      website,
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
      const website = {
        id: 0,
        name: filters ? filters.website : '',
      };
      const category = {
        id: 0,
        name: filters ? filters.category : '',
      };
      const date = {
        startDate: startDate || '',
        endDate: endDate || '',
      };
      const result = await axios.post('http://localhost:8000/get-invalid-articles', { website, category, date });
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
  }, [filters, reload]);

  const columns = [
    {
      title: 'Website',
      dataIndex: 'website',
      key: 'website',
      width: '17%',
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
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '20%',
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
            Recrawl
          </Button>
          <Button
            type="primary"
            onClick={() => window.open(record.link)}
          >
            Open link
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
          <a href="/dashboard/list-invalid-articles">Invalid Articles</a>
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
              <Option key={website.id} value={website.name}>{website.name}</Option>
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
              <Option key={category}>{category}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          style={{ width: '29%' }}
          label="Time"
        >
          <RangePicker
            showTime={{ format: 'HH:mm' }}
            format="YYYY-MM-DD HH:MM"
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
