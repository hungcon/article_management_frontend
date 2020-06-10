import React, { useState, useEffect } from 'react';
import {
  Form, Input, Button, Select,
} from 'antd';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';

const { Option } = Select;

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    maxHeight: 400,
    fontFamily: 'Montserrat',
  },
}));
export default function AddArticle(props) {
  const classes = useStyles();
  const [form] = Form.useForm();
  const [websites, setWebsites] = useState([]);
  const [categories, setCategories] = useState([]);

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

  useEffect(() => () => {
    form.resetFields();
  });
  const onFinish = (values) => {
    console.log(values);
  };

  return (
    <div className={classes.root}>
      <Form
        layout="vertical"
        form={form}
        initialValues={{

        }}
        onFinish={onFinish}
      >
        <Form.Item
          name="website"
          label="Đầu báo"
          rules={[
            {
              required: true,
              message: 'Hãy chọn đầu báo',
            },
          ]}
        >
          <Select
            showSearch
            optionFilterProp="children"
            filterOption={
            (input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          >
            {websites.map((website) => (
              <Option key={website.key} value={website.name}>{website.name}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="category"
          label="Category"
          rules={[
            {
              required: true,
              message: 'Hãy chọn chuyên mục',
            },
          ]}
        >
          <Select
            showSearch
            filterOption={
            (input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          >
            {categories.map((category) => (
              <Option key={category.key} value={category.name}>{category.name}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="title"
          label="Title"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="link"
          label="Link"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="text"
          label="Text"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input.TextArea
            autoSize={{ minRows: 10, maxRows: 30 }}
          />
        </Form.Item>
        <Form.Item>
          <Button style={{ marginRight: 15 }} onClick={() => props.history.push('/dashboard/clean-text')}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit">
            Add
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
