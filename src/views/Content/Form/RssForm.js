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
          url: record.url,
          itemSelector: record.configuration.itemSelector,
          titleSelector: record.configuration.titleSelector,
          linkSelector: record.configuration.linkSelector,
          sapoSelector: record.configuration.sapoSelector,
          publicDateSelector: record.configuration.publicDateSelector,
        }}
      >
        <Form.Item name="url" label="URL">
          <Input />
        </Form.Item>
        <Form.Item name="itemSelector" label="Item">
          <Input />
        </Form.Item>
        <Form.Item name="titleSelector" label="Title">
          <Input />
        </Form.Item>
        <Form.Item name="linkSelector" label="Link">
          <Input />
        </Form.Item>
        <Form.Item name="sapoSelector" label="Sapo">
          <Input />
        </Form.Item>
        <Form.Item name="publicDateSelector" label="Public Date">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RssForm;
