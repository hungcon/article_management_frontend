/* eslint-disable no-underscore-dangle */
import React, { useEffect } from 'react';
import {
  Modal, Form, Input,
} from 'antd';

const ReplaceForm = ({
  visible, onCreate, onCancel,
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
      title="Replace Option"
      okText="Replace"
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

        }}
      >
        <Form.Item
          name="position"
          label="Position"
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="peopleClean"
          label="Replace with"
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ReplaceForm;
