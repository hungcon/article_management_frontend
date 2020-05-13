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


export default function ListCategory() {
  const classes = useStyles();
  const [visible, setVisible] = useState(false);
  const [categories, setCategories] = useState();
  const [action, setAction] = useState();
  const [category, setCategory] = useState({ name: '' });
  const [reload, setReload] = useState(false);
  const [form] = Form.useForm();

  const checkCategoryExisted = async (name) => {
    const { data } = await axios.post('http://localhost:8000/is-category-existed', { name });
    if (data) {
      return true;
    }
    return false;
  };

  const onCategoryCreate = (values) => {
    switch (action) {
      case 'add':
        axios.post('http://localhost:8000/add-category', { name: values.name }, {
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
        axios.post('http://localhost:8000/update-category', { name: values.name, categoryId: category._id }, {
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

  const showCategoryModal = (actionVal, values) => {
    setAction(actionVal);
    setCategory(values);
    setVisible(true);
  };

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
  }, [reload]);

  const showDeleteConfirm = (categoryId) => {
    confirm({
      title: 'Bạn có chắc chắn xoá chuyên mục này không?',
      // eslint-disable-next-line react/jsx-filename-extension
      icon: <ExclamationCircleOutlined />,
      okText: 'Có',
      okType: 'danger',
      cancelText: 'Không',
      centered: true,
      async onOk() {
        axios.post('http://localhost:8000/delete-category', { categoryId }, {
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
      title: 'Chuyên mục',
      dataIndex: 'name',
      width: '65%',
      key: 'name',
    },
    {
      title: 'Hành động',
      witdh: '25%',
      align: 'center',
      render: (value, record) => (
        <div>
          <Button
            onClick={() => showCategoryModal('update', record)}
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
          Dashboard
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <a href="/dashboard/list-category">List Category</a>
        </Breadcrumb.Item>
      </Breadcrumb>
      <Button
        onClick={() => showCategoryModal('add', { name: '' })}
        style={{ marginBottom: 15 }}
        icon={<PlusCircleOutlined />}
      >
        Thêm chuyên mục
      </Button>
      <Table
        className={tableCSS}
        dataSource={categories}
        columns={columns}
        scroll={{ y: 400 }}
        bordered
      />
      <Modal
        forceRender
        style={{ fontFamily: 'Montserrat' }}
        visible={visible}
        title={action === 'add' ? 'Thêm mới chuyên mục' : 'Cập nhật chuyên mục'}
        okText={action === 'add' ? 'Thêm mới' : 'Cập nhật'}
        cancelText="Cancel"
        onCancel={onCancel}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              form.resetFields();
              onCategoryCreate(values);
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
            name: category.name,
          }}
        >
          <Form.Item
            name="name"
            label="Tên chuyên mục"
            rules={[
              {
                required: true,
                message: 'Hãy nhật tên chuyên mục',
              },
              () => ({
                async validator(rule, value) {
                  if (!(await checkCategoryExisted(value))) {
                    return Promise.resolve();
                  }
                  // eslint-disable-next-line prefer-promise-reject-errors
                  return Promise.reject('Category is existed');
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
