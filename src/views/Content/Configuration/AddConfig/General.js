/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React, { useEffect } from 'react';
import {
  Form, Input, Select, Button,
} from 'antd';

const { Option } = Select;

const General = ({ onCreate, general }) => {
  const [form] = Form.useForm();
  const renderSelectTag = (children) => (
    <Select mode="tags" style={{ width: '100%' }} tokenSeparators={[',']}>
      {children}
    </Select>
  );
  const onSubmit = (values) => {
    console.log(values);
    onCreate(values);
  };
  // eslint-disable-next-line arrow-body-style
  useEffect(() => {
    return () => {
      form.resetFields();
    };
  });
  return (
    <Form
      layout="vertical"
      form={form}
      initialValues={{
        website: general.website.name,
        category: general.category.name,
        status: general.status,
        queue: general.queue,
        crawlType: general.crawlType,
        schedules: general.schedules,
        articleDemoLink: general.articleDemoLink,
      }}
      onFinish={onSubmit}
    >
      <Form.Item
        name="website"
        label="Website"
        rules={[
          {
            required: true,
            message: 'Please input website name',
          },
        ]}
      >
        <Input />
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
        <Input />
      </Form.Item>
      <Form.Item
        name="crawlType"
        label="Crawl Type"
        rules={[
          {
            required: true,
            message: 'Please select crawl type',
          },
        ]}
      >
        <Select>
          <Option value="RSS">RSS</Option>
          <Option value="HTML">HTML</Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="queue"
        label="Queue"
        rules={[
          {
            required: true,
            message: 'Please input queue',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="schedules"
        label="Schedule"
        rules={[
          {
            required: true,
            message: 'Please input schedules',
          },
        ]}
      >
        {renderSelectTag(general.schedules)}
      </Form.Item>
      <Form.Item
        name="status"
        label="Status"
        rules={[
          {
            required: true,
            message: 'Please input status',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="articleDemoLink"
        label="Article Demo Link"
        rules={[
          {
            required: true,
            message: 'Please input article demo link',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <div
        style={{
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
        }}
      >
        <Button type="primary" htmlType="submit">
          Next
        </Button>
      </div>
    </Form>
  );
};

export default General;
