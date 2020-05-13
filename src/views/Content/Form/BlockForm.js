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
      style={{ fontFamily: 'Montserrat' }}
      visible={visible}
      title={type.type === 'localAdd' ? 'Thêm mới cấu hình block' : 'Cập nhật cấu hình block'}
      okText={type.type === 'localAdd' ? 'Thêm mới' : 'Cập nhật'}
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
          blockSelector: record.blockSelector,
          itemSelector: record.configuration.itemSelector,
          titleSelector: record.configuration.titleSelector,
          linkSelector: record.configuration.linkSelector,
          redundancySelectors: record.configuration.redundancySelectors,
        }}
      >
        <Form.Item
          name="blockSelector"
          label="Block"
          rules={[
            {
              required: true,
              message: 'Hãy nhập block selector',
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
        <Form.Item name="redundancySelectors" label="Redundancy">
          {renderSelectTag()}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BlockForm;
