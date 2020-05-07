import React, { useState, useEffect } from 'react';
import {
  Form, Input, Button, Select,
} from 'antd';
import { makeStyles } from '@material-ui/core/styles';
import { websites, categories } from '../../common';

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
          label="Website"
          rules={[
            {
              required: true,
              message: 'Please select website name',
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
              <Option key={website.id} value={website.name}>{website.name}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="category"
          label="Category"
          rules={[
            {
              required: true,
              message: 'Please input category name',
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
              <Option key={category}>{category}</Option>
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
