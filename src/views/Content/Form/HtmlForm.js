/* eslint-disable no-console */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React, { useEffect } from 'react';
import {
  Modal, Form, Input,
} from 'antd';

const HtmlForm = ({
  visible, onCreate, onCancel, record,
}) => {
  console.log(record);
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
      title="Html Config"
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
        name="html_form"
        initialValues={{
          url: record.url,
          contentRedundancySelectors: record.contentRedundancySelectors,
        }}
      >
        <Form.Item name="url" label="URL">
          <Input />
        </Form.Item>
        <Form.Item name="contentRedundancySelectors" label="Content Redundancy">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default HtmlForm;
