/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
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
  // eslint-disable-next-line arrow-body-style
  useEffect(() => {
    return () => {
      form.resetFields();
    };
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
        form={form}
        name="source_form"
        initialValues={{
          website: record.website.name,
          category: record.category.name,
          schedules: record.schedules,
          crawlType: record.crawlType,
          queue: record.queue,
          status: record.status === '01',
        }}
      >
        <Form.Item name="website" label="Website">
          <Input />
        </Form.Item>
        <Form.Item name="category" label="Category">
          <Input />
        </Form.Item>
        <Form.Item name="crawlType" label="Crawl Type">
          <Input />
        </Form.Item>
        <Form.Item name="queue" label="Queue">
          <Input />
        </Form.Item>
        <Form.Item name="schedules" label="Schedule">
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
