/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Table, Button, Breadcrumb, Modal, Form, Input, Select, InputNumber,
} from 'antd';
import {
  EditOutlined, DeleteOutlined, PlusCircleOutlined, ExclamationCircleOutlined,
} from '@ant-design/icons';
import { css } from 'emotion';
import axios from 'axios';
import { message } from '../../../common';
import openNotification from '../../Notifications';

const { confirm } = Modal;
const { Option } = Select;

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


export default function ListWebsite() {
  const classes = useStyles();
  const [visible, setVisible] = useState(false);
  const [websites, setWebsites] = useState();
  const [action, setAction] = useState();
  const [website, setWebsite] = useState({ name: '' });
  const [reload, setReload] = useState(false);
  const [form] = Form.useForm();

  const checkWebsiteExisted = async (name) => {
    const { data } = await axios.post('http://localhost:8000/is-website-existed', { name });
    if (data) {
      return true;
    }
    return false;
  };

  const onWebsiteCreate = (values) => {
    const websiteInfo = values;
    switch (action) {
      case 'add':
        axios.post('http://localhost:8000/add-website', { websiteInfo }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }).then((addResult) => {
          if (addResult.data.status === 1) {
            openNotification('success', message.ADD_SUCCESS);
            setReload(!reload);
          } else {
            openNotification('error', message.ERROR);
          }
        }).catch((err) => {
          console.log(err);
          openNotification('error', message.UNAUTHORIZED);
        });
        break;
      case 'update':
        axios.post('http://localhost:8000/update-website', { websiteInfo, websiteId: website._id }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }).then((updateResult) => {
          if (updateResult.data.status === 1) {
            openNotification('success', message.UPDATE_SUCCESS);
            setReload(!reload);
          } else {
            openNotification('error', message.ERROR);
          }
        }).catch((err) => {
          console.log(err);
          openNotification('error', message.UNAUTHORIZED);
        });
        break;
      default:
        break;
    }
    setVisible(false);
  };

  const onCancel = () => {
    setVisible(false);
  };

  const showWebsiteModal = (actionVal, values) => {
    setAction(actionVal);
    setWebsite(values);
    setVisible(true);
  };

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
  }, [reload]);

  const showDeleteConfirm = (websiteId) => {
    confirm({
      title: 'Bạn có chắc chắn xoá đầu báo này không?',
      // eslint-disable-next-line react/jsx-filename-extension
      icon: <ExclamationCircleOutlined />,
      okText: 'Có',
      okType: 'danger',
      cancelText: 'Không',
      centered: true,
      async onOk() {
        axios.post('http://localhost:8000/delete-website', { websiteId }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }).then((deleteResult) => {
          if (deleteResult.data.status === 1) {
            openNotification('success', message.DELETE_SUCCESS);
            setReload(!reload);
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

  useEffect(() => () => {
    form.resetFields();
  });

  const columns = [
    {
      title: 'STT',
      width: '10%',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Đầu báo',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'AppId',
      dataIndex: 'appId',
      key: 'appId',
    },
    {
      title: 'Hành động',
      witdh: '25%',
      align: 'center',
      render: (value, record) => (
        <div>
          <Button
            onClick={() => showWebsiteModal('update', record)}
            style={{ marginRight: 10 }}
            icon={<EditOutlined />}
          >
            Cập nhật
          </Button>
          <Button
            danger
            onClick={() => showDeleteConfirm(record._id)}
            icon={<DeleteOutlined />}
          >
            Xoá
          </Button>
        </div>
      ),
    },
  ];
  return (
    <div className={classes.root}>
      <Breadcrumb style={{ marginBottom: 10 }}>
        <Breadcrumb.Item>
          Bảng điều khiển
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <a href="/dashboard/list-website">Danh sách đầu báo</a>
        </Breadcrumb.Item>
      </Breadcrumb>
      <Button
        onClick={() => showWebsiteModal('add', { name: '' })}
        style={{ marginBottom: 15 }}
        icon={<PlusCircleOutlined />}
      >
        Thêm đầu báo
      </Button>
      <Table
        className={tableCSS}
        dataSource={websites}
        columns={columns}
        scroll={{ y: 400 }}
        bordered
      />
      <Modal
        forceRender
        style={{ fontFamily: 'Montserrat' }}
        visible={visible}
        title={action === 'add' ? 'Thêm mới đầu báo' : 'Cập nhật đầu báo'}
        okText={action === 'add' ? 'Thêm mới' : 'Cập nhật'}
        cancelText="Huỷ"
        onCancel={onCancel}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              form.resetFields();
              onWebsiteCreate(values);
            })
            .catch((info) => {
              console.log('Validate Failed:', info);
            });
        }}
      >
        <Form
          layout="vertical"
          form={form}
          initialValues={{
            name: website.name,
            appId: website.appId,
            bitRate: website.bitRate || 128000,
            sapoTime: website.sapoTime || 0.5,
            titleTime: website.titleTime || 0.5,
            paragraphTime: website.paragraphTime || 0.5,
          }}
        >
          <Form.Item
            name="name"
            label="Tên đầu báo"
            rules={[
              {
                required: true,
                message: 'Hãy nhập tên đầu báo',
              },
              () => ({
                async validator(rule, value) {
                  if (!(await checkWebsiteExisted(value))) {
                    return Promise.resolve();
                  }
                  if (action === 'update') {
                    return Promise.resolve();
                  }
                  // eslint-disable-next-line prefer-promise-reject-errors
                  return Promise.reject('Đầu báo đã tồn tại');
                },
              }),
            ]}
          >
            <Input disabled={action === 'update'} />
          </Form.Item>
          <Form.Item
            name="appId"
            label="AppId"
            rules={[
              {
                required: true,
                message: 'Hãy nhập AppId',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="bitRate"
            label="Chất lượng âm thanh"
            rules={[
              {
                required: true,
                message: 'Hãy chọn chất lượng âm thanh',
              },
            ]}
          >
            <Select>
              <Option key={1} value={64000}>64000</Option>
              <Option key={2} value={128000}>128000</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="titleTime"
            label="Thời gian nghỉ sau tiêu đề"
            rules={[
              {
                required: true,
                message: 'Hãy nhập thời gian nghỉ sau tiêu đề',
              },
            ]}
          >
            <InputNumber min={0.3} max={1} step={0.1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="sapoTime"
            label="Thời gian nghỉ sau sapo"
            rules={[
              {
                required: true,
                message: 'Hãy nhập thời gian nghỉ sau sapo',
              },
            ]}
          >
            <InputNumber min={0.3} max={1} step={0.1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="paragraphTime"
            label="Thời gian nghỉ giữa mỗi đoạn văn"
            rules={[
              {
                required: true,
                message: 'Hãy nhập thời gian nghỉ giữa mỗi đoạn văn',
              },
            ]}
          >
            <InputNumber min={0.3} max={1} step={0.1} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
