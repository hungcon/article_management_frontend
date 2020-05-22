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
      title="Chuẩn hoá từ"
      okText="Chuẩn hoá"
      cancelText="Huỷ"
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
          orig: word.orig,
          machineNormalize: word.machineNormalize,
          peopleNormalize: word.peopleNormalize,
        }}
      >
        <Form.Item
          name="position"
          label="Vị trí"
        >
          <Input disabled />
        </Form.Item>
        <Form.Item
          name="orig"
          label="Từ gốc"
        >
          <Input disabled />
        </Form.Item>
        <Form.Item
          name="machineNormalize"
          label="Máy chuẩn hoá"
        >
          <Input disabled />
        </Form.Item>
        <Form.Item
          name="peopleNormalize"
          label="Chuẩn hoá lại bằng"
          rules={[
            {
              required: true,
              message: 'Hãy nhập từ chuẩn hoá lại',
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
