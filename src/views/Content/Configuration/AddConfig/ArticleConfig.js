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
        sapoSelector: 'meta[name="description"]',
        sapoRedundancySelectors: [],
        titleSelector: 'title',
        titleRedundancySelectors: [],
        thumbnailSelector: 'meta[property="og:image"]',
        thumbnailRedundancySelectors: [],
        tagsSelector: 'meta[name="keywords"]',
        tagsRedundancySelectors: [],
        contentSelector: '.post-content',
        contentRedundancySelectors: ['.kbwscwl-relatedbox', '.link-content-footer', '.link-inline-content', '.link-source'],
        textRedundancySelectors: ['.PhotoCMS_Caption', '.VideoCMS_Caption'],
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
        name="thumbnailSelector"
        label="Thumbnail"
        rules={[
          {
            required: true,
            message: 'Hãy nhập thumbnail selector',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item name="thumbnailRedundancySelectors" label="Thumbnail Redundancy">
        {renderSelectTag()}
      </Form.Item>
      <Form.Item
        name="tagsSelector"
        label="Tags"
        rules={[
          {
            required: true,
            message: 'Hãy nhập tags selector',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item name="tagsRedundancySelectors" label="Tags Redundancy">
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
