/* eslint-disable no-const-assign */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-children-prop */
/* eslint-disable no-console */
/* eslint-disable react/jsx-filename-extension */
import React, { useEffect } from 'react';
import {
  Modal, Form, Input, Select,
} from 'antd';
import SelectTags from './SelectTags';

const Option = { Select };

const ArticleForm = ({
  visible, onCreate, onCancel, record,
}) => {
  const [form] = Form.useForm();
  // eslint-disable-next-line arrow-body-style
  useEffect(() => {
    return () => {
      form.resetFields();
    };
  });
  const children = [];
  for (let i = 10; i < 36; i += 1) {
    children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
  }

  const sapoDefaultValue = record.sapoRedundancySelectors;
  const titleDefaultValue = record.titleRedundancySelectors;
  const thumbnailDefaultValue = record.thumbnailRedundancySelectors;
  const tagsDefaultValue = record.tagsRedundancySelectors;
  const contentDefaultValue = record.contentRedundancySelectors;
  const textDefaultValue = record.textRedundancySelectors;
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
          <SelectTags
            children={children}
            defaultValue={sapoDefaultValue}
          />
        </Form.Item>
        <Form.Item name="titleSelector" label="Title">
          <Input />
        </Form.Item>
        <Form.Item name="titleRedundancySelectors" label="Title Redundancy">
          <SelectTags
            children={children}
            defaultValue={titleDefaultValue}
          />
        </Form.Item>
        <Form.Item name="thumbnailSelector" label="Thumbnail">
          <Input />
        </Form.Item>
        <Form.Item name="thumbnailRedundancySelectors" label="Thumbnail Redundancy">
          <SelectTags
            children={children}
            defaultValue={thumbnailDefaultValue}
          />
        </Form.Item>
        <Form.Item name="tagsSelector" label="Tags">
          <Input />
        </Form.Item>
        <Form.Item name="tagsRedundancySelectors" label="Tags Redundancy">
          <SelectTags
            children={children}
            defaultValue={tagsDefaultValue}
          />
        </Form.Item>
        <Form.Item name="contentSelector" label="Content">
          <Input />
        </Form.Item>
        <Form.Item name="contentRedundancySelectors" label="Content Redundancy">
          <SelectTags
            children={children}
            defaultValue={contentDefaultValue}
          />
        </Form.Item>
        <Form.Item name="textRedundancySelectors" label="Text Redundancy">
          <SelectTags
            children={children}
            defaultValue={textDefaultValue}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ArticleForm;
