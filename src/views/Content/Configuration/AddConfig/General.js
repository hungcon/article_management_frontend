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
        website: general.website,
        category: general.category,
        status: general.status,
        queue: general.queue,
        crawlType: general.crawlType,
        schedules: general.schedules,
      }}
      onFinish={onSubmit}
    >
      <Form.Item name="website" label="Website">
        <Input />
      </Form.Item>
      <Form.Item name="category" label="Category">
        <Input />
      </Form.Item>
      <Form.Item name="crawlType" label="Crawl Type">
        <Select>
          <Option value="RSS">RSS</Option>
          <Option value="HTML">HTML</Option>
        </Select>
      </Form.Item>
      <Form.Item name="queue" label="Queue">
        <Input />
      </Form.Item>
      <Form.Item name="schedules" label="Schedule">
        {renderSelectTag(general.schedules)}
      </Form.Item>
      <Form.Item name="status" label="Status">
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
