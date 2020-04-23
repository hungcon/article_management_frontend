/* eslint-disable no-underscore-dangle */
import React, { useEffect } from 'react';
import {
  Modal, Form, Input,
} from 'antd';

const RssForm = ({
  visible, onCreate, onCancel, record,
}) => {
  const [form] = Form.useForm();
  useEffect(() => () => {
    form.resetFields();
  });
  return (
    <Modal
      forceRender
      style={{ fontFamily: 'Montserrat' }}
      visible={visible}
      title="RSS Config"
      okText={!record.url ? 'Add' : 'Update'}
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onCreate(values, record._id);
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Form
        layout="vertical"
        form={form}
        name={Date.now()}
        initialValues={{
          url: record.url,
          itemSelector: record.configuration.itemSelector,
          titleSelector: record.configuration.titleSelector,
          linkSelector: record.configuration.linkSelector,
          sapoSelector: record.configuration.sapoSelector,
          publishDateSelector: record.configuration.publishDateSelector,
        }}
      >
        <Form.Item
          name="url"
          label="URL"
          rules={[
            {
              required: true,
              message: 'Please input url',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="itemSelector"
          label="Item"
          rules={[
            {
              required: true,
              message: 'Please input item selector',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="titleSelector"
          label="Title"
          rules={[
            {
              required: true,
              message: 'Please input title selector',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="linkSelector"
          label="Link"
          rules={[
            {
              required: true,
              message: 'Please input link selector',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="sapoSelector"
          label="Sapo"
          rules={[
            {
              required: true,
              message: 'Please input sapo selector',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="publishDateSelector"
          label="Publish Date"
          rules={[
            {
              required: true,
              message: 'Please input publish date selector',
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RssForm;
