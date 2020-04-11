/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React, { useState, useEffect } from 'react';
import {
  Form, Input, Select, Button,
} from 'antd';
import {
  EditOutlined, DeleteOutlined, PlusOutlined,
} from '@ant-design/icons';
import BlockForm from '../../Form/BlockForm';

const initBlock = {
  configuration: {
    redundancySelectors: [],
    itemSelector: '',
    titleSelector: '',
    linkSelector: '',
  },
  blockSelector: '',
};

const HtmlConfig = ({ onCreate, prev, htmlVal }) => {
  const [form] = Form.useForm();
  const [block, setBlock] = useState(initBlock);
  const [newBlock, setNewBlock] = useState(htmlVal.blocksConfiguration);
  const [blockVisible, setBlockVisible] = useState(false);
  const [type, setType] = useState({});
  const renderSelectTag = (children) => (
    <Select mode="tags" style={{ width: '100%' }} tokenSeparators={[',']}>
      {children}
    </Select>
  );
  const onSubmit = (values) => {
    console.log(values);
    onCreate(values, newBlock);
  };

  const showBlockModal = (blockVal, typeVal, index) => {
    setType({ type: typeVal, index });
    setBlock(blockVal);
    setBlockVisible(true);
  };
  const removeNewBlock = (values) => {
    setNewBlock(newBlock.filter((e) => (e.blockSelector !== values.blockSelector)));
  };

  const onBlockCreate = (values) => {
    const blockConfig = {
      configuration: {
        redundancySelectors: values.redundancySelectors,
        itemSelector: values.itemSelector,
        titleSelector: values.titleSelector,
        linkSelector: values.linkSelector,
      },
      blockSelector: values.blockSelector,
    };
    switch (type.type) {
      case 'localUpdate':
        // eslint-disable-next-line no-case-declarations
        const newBlockState = newBlock;
        newBlockState[type.index] = blockConfig;
        setNewBlock(newBlockState);
        break;
      case 'localAdd':
        // eslint-disable-next-line no-case-declarations
        setNewBlock([...newBlock, blockConfig]);
        break;
      default:
        break;
    }

    setBlockVisible(false);
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
      initialValues={{
        url: htmlVal.url,
        contentRedundancySelectors: htmlVal.contentRedundancySelectors,
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
      <Form.Item name="contentRedundancySelectors" label="Content Redundancy">
        {renderSelectTag()}
      </Form.Item>
      <Form.Item>
        {newBlock.map((config, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={index}>
            <Button
              onClick={() => showBlockModal(config, 'localUpdate', index)}
              style={{ marginBottom: 10 }}
              icon={<EditOutlined />}
            >
              New Block Config
              {' '}
              {index + 1}
            </Button>
            <Button
              danger
              onClick={() => removeNewBlock(config)}
              icon={<DeleteOutlined />}
            />
          </div>
        ))}
        <Button
          type="primary"
          onClick={() => showBlockModal(initBlock, 'localAdd')}
          icon={<PlusOutlined />}
        >
          Add Block
        </Button>
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
      <BlockForm
        visible={blockVisible}
        onCreate={onBlockCreate}
        onCancel={() => setBlockVisible(false)}
        record={block}
        type={type}
      />
    </Form>
  );
};

export default HtmlConfig;
