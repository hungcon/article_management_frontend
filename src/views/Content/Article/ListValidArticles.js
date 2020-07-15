/* eslint-disable no-underscore-dangle */
/* eslint-disable no-shadow */
import React, { useState, useEffect } from 'react';
import {
  Table, Tag, Form, Select, Button, Typography, Breadcrumb, DatePicker, Row, Col, Modal,
} from 'antd';
import {
  FileSearchOutlined, ReloadOutlined, DeleteOutlined, ExclamationCircleOutlined,
} from '@ant-design/icons';
import { makeStyles } from '@material-ui/core/styles';
import { css } from 'emotion';
import axios from 'axios';
import openNotification from '../../Notifications';
import { message } from '../../../common';
import { API_ENDPOINT } from '../../../common/apis';


const { Option } = Select;
const { Text } = Typography;
const { RangePicker } = DatePicker;
const { confirm } = Modal;

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
  const [reload, setReload] = useState();
  const [filters, setFilters] = useState();
  const [counts, setCounts] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [websites, setWebsites] = useState([]);
  const [categories, setCategories] = useState([]);

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

  const reNormalizeArticle = async (articleId) => {
    const { data } = await axios.post(API_ENDPOINT.NORMALIZE_ARTICLE, { articleId });
    if (data.status === 1) {
      openNotification('success', message.RENORMALIZE_SUCCESS);
    }
  };

  const reSyntheticArticle = async (articleId) => {
    const { data } = await axios.post(API_ENDPOINT.SYNTHETIC_ARTICLE,
      { articleId, voiceSelect: 'vbee-tts-voice-hn_male_manhdung_news_48k-h' });
    if (data.status === 1) {
      openNotification('success', message.RESYNTHETIC_SUCCESS);
    }
  };

  const showDeleteConfirm = (id) => {
    confirm({
      title: 'Bạn có chắc chắn xoá bài báo này không?',
      // eslint-disable-next-line react/jsx-filename-extension
      icon: <ExclamationCircleOutlined />,
      okText: 'Có',
      okType: 'danger',
      cancelText: 'Không',
      centered: true,
      async onOk() {
        axios.post(API_ENDPOINT.DELETE_VALID_ARTICLE, { id }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }).then((result) => {
          if (result.data.status === 1) {
            setReload(!reload);
            openNotification('success', message.DELETE_SUCCESS);
          } else {
            openNotification('error', message.ERROR);
          }
        }).catch((err) => {
          console.log(err);
          openNotification('error', message.UNAUTHORIZED);
        });
      },
      onCancel() {
      },
    });
  };

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
      const status = filters ? filters.status : '';
      const date = {
        startDate: startDate || '',
        endDate: endDate || '',
      };
      const result = await axios.post(API_ENDPOINT.GET_VALID_ARTICLES, {
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
  }, [filters, startDate, endDate, reload]);

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
          return 'Đang chờ phê duyệt';
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
      render: (value, record) => (
        <div>
          {record.status === 1 && (
          <Button
            onClick={() => reNormalizeArticle(record._id)}
            style={{ marginRight: 10, width: 180 }}
            type="primary"
            danger
            icon={<ReloadOutlined />}
          >
            Chuẩn hoá tự động
          </Button>
          )}
          {record.status === 2 && (
          <Button
            onClick={() => reNormalizeArticle(record._id)}
            style={{ marginRight: 10, width: 180 }}
            type="primary"
            danger
            icon={<ReloadOutlined />}
          >
            Chuẩn hoá lại
          </Button>
          )}
          {(
            record.status === 3
            || record.status === 4
            || record.status === 5
            || record.status === 6
            || record.status === 8)
          && (
          <Button
            onClick={() => props.history.push(`/dashboard/list-valid-articles/${record._id}`)}
            style={{ marginRight: 10, width: 180 }}
            type="primary"
            icon={<FileSearchOutlined />}
          >
            Chi tiết
          </Button>
          )}
          {record.status === 7 && (
          <Button
            onClick={() => reSyntheticArticle(record._id)}
            style={{ marginRight: 10, width: 180 }}
            type="primary"
            danger
            icon={<ReloadOutlined />}
          >
            Tổng hợp lại
          </Button>
          )}
          <Button
            onClick={() => showDeleteConfirm(record._id)}
            style={{ marginRight: 10 }}
            danger
            icon={<DeleteOutlined />}
          >
            Xoá
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
          <a href="/dashboard/configuration">Bảng điều khiển</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <a href="/dashboard/list-valid-articles">Bài báo hợp lệ</a>
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
