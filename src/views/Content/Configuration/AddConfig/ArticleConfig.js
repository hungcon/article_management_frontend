import React, { useEffect } from 'react';
import {
  Button, Form, Input, Select,
} from 'antd';

const ArticleConfig = ({
  onCreate, prev,
}) => {
  const [form] = Form.useForm();
  const renderSelectTag = () => {
    const children = [];
    return (
      <Select mode="tags" style={{ width: '100%' }} tokenSeparators={[',']}>
        {children}
      </Select>
    );
  };

  const onSubmit = (values) => {
    onCreate(values);
  };

  // eslint-disable-next-line arrow-body-style
  useEffect(() => {
    return () => {
      form.resetFields();
    };
  });
  return (
    <Form
      style={{ fontFamily: 'Montserrat' }}
      layout="vertical"
      form={form}
      id="article_form"
      initialValues={{
        // sapoSelector: '',
        // sapoRedundancySelectors: [],
        // titleSelector: 'title',
        // titleRedundancySelectors: [],
        // thumbnailSelector: '',
        // thumbnailRedundancySelectors: [],
        // tagsSelector: '',
        // tagsRedundancySelectors: [],
        // contentSelector: '',
        // contentRedundancySelectors: [],
        // textRedundancySelectors: [],
      }}
      onFinish={onSubmit}
    >
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
      <Form.Item name="sapoRedundancySelectors" label="Sapo Redundancy">
        {renderSelectTag()}
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
      <Form.Item name="titleRedundancySelectors" label="Title Redundancy">
        {renderSelectTag()}
      </Form.Item>
      <Form.Item
        name="contentSelector"
        label="Content"
        rules={[
          {
            required: true,
            message: 'Hãy nhập content selector',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item name="contentRedundancySelectors" label="Content Redundancy">
        {renderSelectTag()}
      </Form.Item>
      <Form.Item name="textRedundancySelectors" label="Text Redundancy">
        {renderSelectTag()}
      </Form.Item>
      <div
        style={{
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
        }}
      >
        <Button onClick={prev} style={{ marginRight: 10 }}>
          Quay lại
        </Button>
        <Button type="primary" htmlType="submit">
          Thêm cấu hình
        </Button>
      </div>
    </Form>
  );
};

export default ArticleConfig;
