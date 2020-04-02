/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React, { useEffect } from 'react';
import {
  Modal, Form, Input, Switch,
} from 'antd';

const SourceForm = ({
  visible, onCreate, onCancel, record,
}) => {
  const [form] = Form.useForm();
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
        name="form_in_modal"
        initialValues={{
          website: record.website.name,
          category: record.category.name,
          schedules: record.schedules,
          demoLink: record.articleDemoLink,
          status: record.status === 0,
        }}
      >
        <Form.Item name="website" label="Website">
          <Input />
        </Form.Item>
        <Form.Item name="category" label="Category">
          <Input />
        </Form.Item>
        <Form.Item name="schedules" label="Schedule">
          <Input />
        </Form.Item>
        <Form.Item name="demoLink" label="Demo Link">
          <Input />
        </Form.Item>
        <Form.Item name="status" label="Status" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SourceForm;
