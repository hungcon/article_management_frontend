/* eslint-disable no-const-assign */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-children-prop */
/* eslint-disable no-console */
/* eslint-disable react/jsx-filename-extension */
import React, { useEffect } from 'react';
import {
  Modal, Form, Input, Select,
} from 'antd';

const ArticleForm = ({
  visible, onCreate, onCancel, record,
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
      title="Rss Config"
      okText="Update"
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
        form={form}
        name="form_in_modal"
        initialValues={{
          sapoSelector: record.sapoSelector,
          sapoRedundancySelectors: record.sapoRedundancySelectors,
          titleSelector: record.titleSelector,
          titleRedundancySelectors: record.titleRedundancySelectors,
          thumbnailSelector: record.thumbnailSelector,
          thumbnailRedundancySelectors: record.thumbnailRedundancySelectors,
          tagsSelector: record.tagsSelector,
          tagsRedundancySelectors: record.tagsRedundancySelectors,
          contentSelector: record.contentSelector,
          contentRedundancySelectors: record.contentRedundancySelectors,
          textRedundancySelectors: record.textRedundancySelectors,
        }}
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
      </Form>
    </Modal>
  );
};

export default ArticleForm;
