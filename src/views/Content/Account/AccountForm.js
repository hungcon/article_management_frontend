/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import {
  Form, Input, Button, Row, Col, Select,
} from 'antd';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import allActions from '../../../store/actions/allActions';
import { message } from '../../../common';
import openNotification from '../../Notifications';
import { API_ENDPOINT } from '../../../common/apis';

const { Option } = Select;

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    maxHeight: 400,
    fontFamily: 'Montserrat',
  },
}));
export default function AccountForm(props) {
  const classes = useStyles();
  const { accountId } = useParams();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [websites, setWebsites] = useState([]);
  const [currentUser, setCurrentUser] = useState({
    userName: '', password: '', role: '', websites: [],
  });

  const isAccountExisted = async (userName) => {
    const accountExisted = (await axios.post(API_ENDPOINT.CHECK_ACCOUNT_EXIST, { userName })).data;
    if (accountExisted.account) {
      return true;
    }
    return false;
  };

  useEffect(() => () => {
    form.resetFields();
  });

  useEffect(() => {
    let ignore = false;
    async function fetchData() {
      const listWebsite = (await axios.post(API_ENDPOINT.GET_WEBSITES)).data;
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
      const user = (await axios.post(API_ENDPOINT.GET_ACCOUNT, { accountId })).data;
      for (let i = 0; i < user.currentUser.websites.length; i += 1) {
        user.currentUser.websites[i] = user.currentUser.websites[i]._id;
      }
      if (!ignore) {
        setCurrentUser(user.currentUser);
      }
    }
    if (accountId) {
      fetchData();
    }
    return () => { ignore = true; };
  }, [accountId]);

  const onFinish = async (values) => {
    const account = values;
    axios.post(!accountId ? API_ENDPOINT.ADD_ACCOUNT : API_ENDPOINT.UPDATE_ACCOUNT, { account }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }).then((addResult) => {
      if (addResult.data.status === 1) {
        openNotification('success', !accountId ? message.ADD_SUCCESS : message.UPDATE_SUCCESS);
        // localStorage.setItem('websites', JSON.stringify(values.websites));
        dispatch(allActions.configAction.reload());
        props.history.push('/dashboard/list-accounts');
      } else {
        openNotification('error', message.ERROR);
      }
    }).catch((err) => {
      console.log(err);
      openNotification('error', message.UNAUTHORIZED);
    });
  };

  return (
    <div className={classes.root}>
      <Row gutter={16}>
        <Col span={6} />
        <Col span={12}>
          <Form
            layout="vertical"
            form={form}
            initialValues={{
              userName: accountId && currentUser.userName,
              role: accountId && currentUser.role,
              websites: accountId && currentUser.websites,
            }}
            onFinish={onFinish}
          >
            <Form.Item
              name="userName"
              label="Tên đăng nhập"
              rules={[
                {
                  required: true,
                },
                () => ({
                  async validator(rule, value) {
                    if (accountId) {
                      return Promise.resolve();
                    }
                    if (!(await isAccountExisted(value))) {
                      return Promise.resolve();
                    }
                    // eslint-disable-next-line prefer-promise-reject-errors
                    return Promise.reject('Tài khoản đã tồn tại');
                  },
                }),
              ]}
            >
              <Input disabled={accountId} />
            </Form.Item>
            { !accountId && (
            <Form.Item
              name="password"
              label="Mật khẩu"
              hasFeedback
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
            )}
            { !accountId && (
            <Form.Item
              name="confirmPassword"
              label="Xác nhận mật khẩu"
              dependencies={['password']}
              hasFeedback
              rules={[
                {
                  required: true,
                },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    // eslint-disable-next-line prefer-promise-reject-errors
                    return Promise.reject('Xác nhận mật khẩu không khớp!');
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
            )}
            <Form.Item
              name="role"
              label="Loại tài khoản"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select>
                <Option value="admin">Admin</Option>
                <Option value="editor">Biên tập viên</Option>
                <Option value="manager">Tổng biên tập</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="websites"
              label="Tên đầu báo"
              rules={[
                {
                  required: true,
                  message: 'Hãy chọn tên đầu báo quản lý',
                },
              ]}
            >
              <Select
                mode="multiple"
                showSearch
                optionFilterProp="children"
                filterOption={
            (input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
              >
                {websites.map((website) => (
                  <Option key={website.key} value={website._id}>{website.name}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <Button style={{ marginRight: 15 }} onClick={() => props.history.push('/dashboard/list-accounts')}>
                Huỷ
              </Button>
              <Button type="primary" htmlType="submit">
                {!accountId ? 'Thêm tài khoản' : 'Cập nhật'}
              </Button>
            </Form.Item>
          </Form>
        </Col>
        <Col span={6} />
      </Row>

    </div>
  );
}
