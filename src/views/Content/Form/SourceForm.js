import React, { useEffect } from 'react';
import {
  Modal, Form, Input, Switch, Select,
} from 'antd';

const SourceForm = ({
  visible, onCreate, onCancel, record,
}) => {
  const [form] = Form.useForm();
  const renderSelectTag = (children) => (
    <Select mode="tags" style={{ width: '100%' }} tokenSeparators={[',']}>
      {children}
    </Select>
  );
  useEffect(() => () => {
    form.resetFields();
  });
  return (
    <Modal
      forceRender
      visible={visible}
      title="Configuration"
      okText="Update"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onCreate(values);
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
          website: record.website.name,
          category: record.category.name,
          schedules: record.schedules,
          queue: record.queue,
          status: record.status === '01',
        }}
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
          {renderSelectTag(record.schedules)}
        </Form.Item>
        <Form.Item name="status" label="Status" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SourceForm;
