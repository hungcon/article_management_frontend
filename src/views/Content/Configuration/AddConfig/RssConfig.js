import React, { useEffect } from 'react';
import {
  Button, Form, Input,
} from 'antd';

const RssConfig = ({
  onCreate, prev, rssVal,
}) => {
  const [form] = Form.useForm();
  const onSubmit = (values) => {
    console.log(values);
    onCreate(values);
  };

  useEffect(() => () => {
    form.resetFields();
  });
  return (
    <Form
      layout="vertical"
      form={form}
      id="rss_form"
      initialValues={{
        url: rssVal.url,
        itemSelector: rssVal.configuration.itemSelector,
        titleSelector: rssVal.configuration.titleSelector,
        linkSelector: rssVal.configuration.linkSelector,
        sapoSelector: rssVal.configuration.sapoSelector,
        publishDateSelector: rssVal.configuration.publishDateSelector,
      }}
      onFinish={onSubmit}
    >
      <Form.Item
        name="url"
        label="URL"
        rules={[
          {
            required: true,
            message: 'Please input url',
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
            message: 'Please input item selector',
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
            message: 'Please input title selector',
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
            message: 'Please input link selector',
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
            message: 'Please input sapo selector',
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
            message: 'Please input publish date selector',
          },
        ]}
      >
        <Input />
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
          Next
        </Button>
      </div>
    </Form>
  );
};

export default RssConfig;
