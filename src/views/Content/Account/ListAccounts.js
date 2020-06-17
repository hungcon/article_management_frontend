/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import {
  Table,
  Tag,
  Button,
  Modal,
  Input,
  Form,
  Breadcrumb,
} from 'antd';
import {
  ReloadOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  PlusCircleOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { makeStyles } from '@material-ui/core/styles';
import { css } from 'emotion';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import openNotification from '../../Notifications';
import { message } from '../../../common';
import allActions from '../../../store/actions/allActions';

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


export default function ListAccounts(props) {
  const classes = useStyles();
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [currenUserName, setCurrentUserName] = useState();
  const reload = useSelector((state) => state.config.reload);
  const dispatch = useDispatch();


  const showResetPasswordModal = (userName) => {
    setCurrentUserName(userName);
    setVisible(true);
  };

  const onNewPasswordCreate = (userName, password) => {
    axios.post('http://localhost:8000/update-password', { userName, password }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }).then((result) => {
      if (result.data.status === 1) {
        openNotification('success', message.UPDATE_SUCCESS);
      } else {
        openNotification('error', message.ERROR);
      }
    }).catch((err) => {
      console.log(err);
      openNotification('error', message.UNAUTHORIZED);
    });
    setVisible(false);
  };

  const showDeleteConfirm = (accountId) => {
    confirm({
      title: 'Bạn có chắc chắn xoá tài khoản này không?',
      // eslint-disable-next-line react/jsx-filename-extension
      icon: <ExclamationCircleOutlined />,
      okText: 'Có',
      okType: 'danger',
      cancelText: 'Không',
      centered: true,
      async onOk() {
        axios.post('http://localhost:8000/delete-account', { accountId }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }).then((result) => {
          if (result.data.status === 1) {
            dispatch(allActions.configAction.reload());
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
      const listAccounts = (await axios.post('http://localhost:8000/get-list-accounts')).data;
      for (let i = 0; i < listAccounts.length; i += 1) {
        listAccounts[i].key = i + 1;
      }
      if (!ignore) {
        setData(listAccounts);
      }
    }
    fetchData();
    return () => { ignore = true; };
  }, [reload]);

  const columns = [
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      width: '15%',
      render: (value) => {
        let color = 'green';
        if (value === 'admin') {
          color = 'red';
        } else if (value === 'editor') {
          color = 'orange';
          value = 'Biên tập viên';
        } else {
          value = 'Tổng biên tập';
        }
        return (
          <Tag color={color} key={value}>
            {value.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Tên đăng nhập',
      key: 'userName',
      width: '15%',
      dataIndex: 'userName',
    },
    {
      title: 'Đầu báo quản lý',
      key: 'websites',
      width: '25%',
      dataIndex: 'websites',
      render: (values) => (
        <span>
          {values.map((value) => (
            <Tag color="#3498DB" key={value.name}>
              {value.name.toUpperCase()}
            </Tag>
          ))}
        </span>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      align: 'center',
      render: (record) => (
        <div>
          <Button
            onClick={() => props.history.push(`/dashboard/list-accounts/edit-account/${record._id}`)}
            style={{ marginRight: 15 }}
            icon={<EditOutlined />}
          >
            Cập nhật
          </Button>
          <Button
            onClick={() => showResetPasswordModal(record.userName)}
            style={{ marginRight: 15 }}
            icon={<ReloadOutlined />}
          >
            Đặt lại mật khẩu
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
          Danh sách tài khoản
        </Breadcrumb.Item>
      </Breadcrumb>
      <Button
        onClick={() => props.history.push('/dashboard/list-accounts/add-account')}
        style={{ marginBottom: 15 }}
        icon={<PlusCircleOutlined />}
      >
        Thêm tài khoản
      </Button>
      <Table
        className={tableCSS}
        columns={columns}
        dataSource={data}
        bordered
      />
      <Modal
        forceRender
        style={{ fontFamily: 'Montserrat' }}
        visible={visible}
        title="Đặt lại mật khẩu"
        okText="Cập nhật"
        cancelText="Huỷ"
        onCancel={() => setVisible(false)}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              form.resetFields();
              onNewPasswordCreate(currenUserName, values.newPassword);
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
          }}
        >
          <Form.Item
            name="newPassword"
            label="Mật khẩu mới"
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Hãy nhập mật khẩu mới',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
