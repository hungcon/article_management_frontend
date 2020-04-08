/* eslint-disable no-console */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React, { useEffect } from 'react';
import {
  Modal, Form, Input, Select,
} from 'antd';

const BlockForm = ({
  visible, onCreate, onCancel, record, type,
}) => {
  const renderSelectTag = () => (
    <Select mode="tags" style={{ width: '100%' }} tokenSeparators={[',']} />
  );
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
      title="Block Config"
      okText={type === 'add' ? 'Add' : 'Update'}
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
          blockSelector: record.blockSelector,
          itemSelector: record.configuration.itemSelector,
          titleSelector: record.configuration.titleSelector,
          linkSelector: record.configuration.linkSelector,
          redundancySelectors: record.configuration.redundancySelectors,
        }}
      >
        <Form.Item name="blockSelector" label="Block">
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
        <Form.Item name="redundancySelectors" label="Redundancy">
          {renderSelectTag()}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BlockForm;
