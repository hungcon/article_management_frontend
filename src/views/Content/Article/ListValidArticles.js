/* eslint-disable no-unused-expressions */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-named-as-default */
/* eslint-disable import/no-named-as-default-member */
/* eslint-disable no-shadow */
import React, { useState, useEffect } from 'react';
import {
  Table, Tag, Form, Select, Button, Typography, Breadcrumb, DatePicker, Modal, Row, Col,
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

  const listStatus = [
    {
      key: 1,
      name: 'Đã thu thập',
      value: '1',
    },
    {
      key: 2,
      name: 'Chuẩn hoá máy lỗi',
      value: '2',
    },
    {
      key: 3,
      name: 'Đã chuẩn hoá máy',
      value: '3',
    },
    {
      key: 4,
      name: 'Đang chuẩn hoá tay',
      value: '4',
    },
    {
      key: 5,
      name: 'Đã chuẩn hoá tay',
      value: '5',
    },
    {
      key: 6,
      name: 'Đang chuyển audio',
      value: '6',
    },
    {
      key: 7,
      name: 'Chuyển audio lỗi',
      value: '7',
    },
    {
      key: 8,
      name: 'Đã chuyển audio',
      value: '8',
    },
  ];

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
      const status = filters ? filters.status : '';
      const date = {
        startDate: startDate || '',
        endDate: endDate || '',
      };
      const result = await axios.post('http://localhost:8000/get-valid-articles', {
        website, category, date, status,
      });
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

  const openLinkAudio = async (articleId) => {
    const { data } = await axios.post('http://localhost:8000/get-clean-article-by-article-id', { articleId });
    const { linkAudio } = data;
    window.open(`http://${linkAudio}`);
  };

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
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: '16%',
      render: (value) => {
        if (value === 1) {
          return 'Đã thu thập';
        }
        if (value === 2) {
          return 'Chuẩn hoá máy lỗi';
        }
        if (value === 3) {
          return 'Đã chuẩn hoá máy';
        }
        if (value === 4) {
          return 'Đang chuẩn hoá tay';
        }
        if (value === 5) {
          return 'Đã chuẩn hoá tay';
        }
        if (value === 6) {
          return 'Đang chuyển audio';
        }
        if (value === 7) {
          return 'Chuyển audio lỗi';
        }
        return 'Đã chuyển audio';
      },
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: '30%',
      align: 'center',
      render: (value, record) => {
        console.log(record);
        return (
          <div>
            {record.status === 1 && (
            <Button
            // eslint-disable-next-line no-underscore-dangle
              onClick={() => props.history.push(`/dashboard/list-valid-articles/${record._id}`)}
              style={{ marginRight: 10 }}
              icon={<EditOutlined />}
            >
              Cập nhật
            </Button>
            )}
            {record.status === 2 && (
            <Button
            // eslint-disable-next-line no-underscore-dangle
              onClick={() => props.history.push(`/dashboard/list-valid-articles/${record._id}`)}
              style={{ marginRight: 10 }}
              icon={<EditOutlined />}
            >
              Chuẩn hoá máy lại
            </Button>
            )}
            {record.status === 3 && (
            <Button
            // eslint-disable-next-line no-underscore-dangle
              onClick={() => props.history.push(`/dashboard/list-valid-articles/${record._id}`)}
              style={{ marginRight: 10 }}
              icon={<EditOutlined />}
            >
              Chuẩn hoá tay
            </Button>
            )}
            {record.status === 8 && (
            <Button
            // eslint-disable-next-line no-underscore-dangle
              onClick={() => openLinkAudio(record._id)}
              style={{ marginRight: 10 }}
              icon={<EditOutlined />}
            >
              Nghe thử
            </Button>
            )}
            <Button
              danger
              onClick={() => showDeleteConfirm(record)}
              icon={<DeleteOutlined />}
            >
              Xoá
            </Button>
          </div>
        );
      },
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
    console.log(values);
    setFilters({
      website: values.website || '',
      category: values.category || '',
      status: values.status || '',
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
                  <Option key={website.key} value={website.name}>{website.name}</Option>
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
                  <Option key={category.key} value={category.name}>{category.name}</Option>
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
