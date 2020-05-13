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
      title={!record.url ? 'Thêm cấu hình RSS' : 'Cập nhật cấu hình RSS'}
      okText={!record.url ? 'Thêm mới' : 'Cập nhật'}
      cancelText="Huỷ"
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
              message: 'Hãy nhập url',
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
              message: 'Hãy nhập item selector',
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
              message: 'Hãy nhập title selector',
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
              message: 'Hãy nhập link selector',
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
              message: 'Hãy nhập sapo selector',
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
              message: 'Hãy nhập publish date selector',
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
