/* eslint-disable no-underscore-dangle */
import React, { useEffect } from 'react';
import {
  Modal, Form, Input,
} from 'antd';

const ReplaceForm = ({
  visible, onCreate, onCancel, word,
}) => {
  // console.log(word);
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
          position: word.position,
          machineNormalize: word.machineNormalize,
          peopleNormalize: word.peopleNormalize,
        }}
      >
        <Form.Item
          name="position"
          label="Position"
        >
          <Input disabled />
        </Form.Item>
        <Form.Item
          name="machineNormalize"
          label="Machine normalize"
        >
          <Input disabled />
        </Form.Item>
        <Form.Item
          name="peopleNormalize"
          label="Replace with"
          rules={[
            {
              required: true,
              message: 'Please input normalize word',
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ReplaceForm;
