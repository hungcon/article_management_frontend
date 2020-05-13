import React, { useEffect } from 'react';
import {
  Form, Input, Button, Row, Col,
} from 'antd';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import allActions from '../../../store/actions/allActions';
import { message } from '../../../common';
import openNotification from '../../Notifications';

// const { Option } = Select;

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    maxHeight: 400,
    fontFamily: 'Montserrat',
  },
}));
export default function AccountForm(props) {
  const classes = useStyles();
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const isAccountExisted = async (userName) => {
    const accountExisted = (await axios.post('http://localhost:8000/is-account-existed', { userName })).data;
    if (accountExisted.account) {
      return true;
    }
    return false;
  };

  useEffect(() => () => {
    form.resetFields();
  });

  const onFinish = async (values) => {
    const account = values;
    axios.post('http://localhost:8000/add-account', { account }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }).then((addResult) => {
      if (addResult.data.status === 1) {
        openNotification('success', message.ADD_SUCCESS);
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

            }}
            onFinish={onFinish}
          >
            <Form.Item
              name="firstName"
              label="Họ"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="lastName"
              label="Tên"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="userName"
              label="Tên đăng nhập"
              rules={[
                {
                  required: true,
                },
                () => ({
                  async validator(rule, value) {
                    if (!(await isAccountExisted(value))) {
                      return Promise.resolve();
                    }
                    // eslint-disable-next-line prefer-promise-reject-errors
                    return Promise.reject('Username is existed');
                  },
                }),
              ]}
            >
              <Input />
            </Form.Item>
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
                    return Promise.reject('The confirm passwords that you entered do not match!');
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item>
              <Button style={{ marginRight: 15 }} onClick={() => props.history.push('/dashboard/list-accounts')}>
                Huỷ
              </Button>
              <Button type="primary" htmlType="submit">
                Thêm tài khoản
              </Button>
            </Form.Item>
          </Form>
        </Col>
        <Col span={6} />
      </Row>

    </div>
  );
}
