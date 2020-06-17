import React from 'react';
import {
  Form, Input, Button,
} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './index.css';
import axios from 'axios';
import image from '../../assets/images/login.jpg';
import openNotification from '../Notifications';


export default function SignIn(props) {
  const onFinish = async (values) => {
    const { userName, password } = values;
    const { accessToken } = (await axios.post('http://localhost:8000/sign-in', { userName, password })).data;
    if (accessToken) {
      if (!accessToken.success) {
        openNotification('error', accessToken.err);
      } else {
        localStorage.setItem('userName', userName);
        localStorage.setItem('token', accessToken.token);
        props.history.push('/dashboard');
      }
    } else {
      openNotification('error', 'Server đang có lỗi');
    }
  };

  return (
    <div className="limiter">
      <div className="container-login100" style={{ backgroundImage: `url(${image})` }}>
        <div className="wrap-login100 p-t-30 p-b-50">
          <span className="login100-form-title p-b-41">
            Đăng nhập
          </span>
          <Form
            style={{ marginTop: 25 }}
            name="normal_login"
            onFinish={onFinish}
            size="large"
          >
            <Form.Item
              name="userName"
              style={{ marginBottom: 30 }}
              rules={[{ required: true, message: 'Hãy nhập tên tài khoản' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Tên tài khoản" />
            </Form.Item>
            <Form.Item
              name="password"
              style={{ marginBottom: 30 }}
              rules={[{ required: true, message: 'Hãy nhập mật khẩu' }]}
            >
              <Input
                prefix={<LockOutlined />}
                type="password"
                placeholder="Mật khẩu"
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ width: '100%', fontSize: 18 }}>
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}
