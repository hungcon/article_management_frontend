/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Table, Button, Breadcrumb, Modal, Form, Input,
} from 'antd';
import {
  EditOutlined, DeleteOutlined, PlusCircleOutlined, ExclamationCircleOutlined,
} from '@ant-design/icons';
import { css } from 'emotion';
import axios from 'axios';
import { message } from '../../../common';
import openNotification from '../../Notifications';

const { confirm } = Modal;

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
    switch (action) {
      case 'add':
        axios.post('http://localhost:8000/add-website', { name: values.name }, {
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
        axios.post('http://localhost:8000/update-website', { name: values.name, websiteId: website._id }, {
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
      title: 'Are you sure delete this website?',
      // eslint-disable-next-line react/jsx-filename-extension
      icon: <ExclamationCircleOutlined />,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
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
      title: 'Index',
      width: '10%',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      width: '65%',
      key: 'name',
    },
    {
      title: 'Action',
      witdh: '25%',
      align: 'center',
      render: (value, record) => (
        <div>
          <Button
            onClick={() => showWebsiteModal('update', record)}
            style={{ marginRight: 10 }}
            icon={<EditOutlined />}
          >
            Update
          </Button>
          <Button
            danger
            onClick={() => showDeleteConfirm(record._id)}
            icon={<DeleteOutlined />}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];
  return (
    <div className={classes.root}>
      <Breadcrumb style={{ marginBottom: 10 }}>
        <Breadcrumb.Item>
          Dashboard
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <a href="/dashboard/list-website">List Website</a>
        </Breadcrumb.Item>
      </Breadcrumb>
      <Button
        onClick={() => showWebsiteModal('add', { name: '' })}
        style={{ marginBottom: 15 }}
        icon={<PlusCircleOutlined />}
      >
        Add website
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
        title="Website"
        okText={action === 'add' ? 'Add' : 'Update'}
        cancelText="Cancel"
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
          }}
        >
          <Form.Item
            name="name"
            label="Website Name"
            rules={[
              {
                required: true,
                message: 'Please input website name',
              },
              () => ({
                async validator(rule, value) {
                  if (!(await checkWebsiteExisted(value))) {
                    return Promise.resolve();
                  }
                  // eslint-disable-next-line prefer-promise-reject-errors
                  return Promise.reject('Website is existed');
                },
              }),
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
