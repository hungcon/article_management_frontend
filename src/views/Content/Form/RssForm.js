/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React, { useEffect } from 'react';
import {
  Modal, Form, Input,
} from 'antd';

const RssForm = ({
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
      title="Rss Config"
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
        id="rss_form"
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
