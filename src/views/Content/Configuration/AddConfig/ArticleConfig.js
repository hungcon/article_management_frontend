/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
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
    console.log(values);
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
      layout="vertical"
      form={form}
      id="rss_form"
      initialValues={{
      }}
      onFinish={onSubmit}
    >
      <Form.Item name="sapoSelector" label="Sapo">
        <Input />
      </Form.Item>
      <Form.Item name="sapoRedundancySelectors" label="Sapo Redundancy">
        {renderSelectTag()}
      </Form.Item>
      <Form.Item name="titleSelector" label="Title">
        <Input />
      </Form.Item>
      <Form.Item name="titleRedundancySelectors" label="Title Redundancy">
        {renderSelectTag()}
      </Form.Item>
      <Form.Item name="thumbnailSelector" label="Thumbnail">
        <Input />
      </Form.Item>
      <Form.Item name="thumbnailRedundancySelectors" label="Thumbnail Redundancy">
        {renderSelectTag()}
      </Form.Item>
      <Form.Item name="tagsSelector" label="Tags">
        <Input />
      </Form.Item>
      <Form.Item name="tagsRedundancySelectors" label="Tags Redundancy">
        {renderSelectTag()}
      </Form.Item>
      <Form.Item name="contentSelector" label="Content">
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
          Previous
        </Button>
        <Button type="primary" htmlType="submit">
          Finish
        </Button>
      </div>
    </Form>
  );
};

export default ArticleConfig;
