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
      const listAccount = (await axios.post('http://localhost:8000/get-list-accounts')).data;
      for (let i = 0; i < listAccount.length; i += 1) {
        listAccount[i].key = i + 1;
      }
      if (!ignore) {
        setData(listAccount);
      }
    }
    fetchData();
    return () => { ignore = true; };
  }, [reload]);

  const columns = [
    {
      title: 'Họ',
      dataIndex: 'firstName',
      key: 'firstName',
    },
    {
      title: 'Tên',
      dataIndex: 'lastName',
      key: 'lastName',
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (value) => {
        let color = 'green';
        if (value === 'admin') {
          color = 'red';
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
      dataIndex: 'userName',
    },
    {
      title: 'Hành động',
      key: 'action',
      width: '30%',
      align: 'center',
      render: (record) => (
        <div>
          <Button
            onClick={() => showResetPasswordModal(record.userName)}
            style={{ marginRight: 15 }}
            icon={<ReloadOutlined />}
          >
            Đặt lại mật khẩu
          </Button>
          <Button
            danger
            disabled={record.role === 'admin'}
            style={{ width: 155 }}
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
          List Accounts
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
