/* eslint-disable no-undef */
/* eslint-disable no-return-assign */
/* eslint-disable no-console */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React, { useEffect, useState } from 'react';
import {
  Modal, Form, Input, Select, Button, Tabs,
} from 'antd';
import {
  EditOutlined, DeleteOutlined, ExclamationCircleOutlined, PlusOutlined,
} from '@ant-design/icons';
import BlockForm from './BlockForm';

const { TabPane } = Tabs;
const { confirm } = Modal;

const initBlock = {
  configuration: {
    redundancySelectors: [],
    itemSelector: '',
    titleSelector: '',
    linkSelector: '',
  },
  blockSelector: '',
};
const HtmlForm = ({
  visible, onCreate, onCancel, record,
}) => {
  const [block, setBlock] = useState(initBlock);
  const [blockVisible, setBlockVisible] = useState(false);

  const renderSelectTag = () => (
    <Select mode="tags" style={{ width: '100%' }} tokenSeparators={[',']} />
  );

  const callback = (key) => {
    console.log(key);
  };

  const showDeleteConfirm = (toDelete) => {
    confirm({
      title: 'Are you sure delete this block config?',
      // eslint-disable-next-line react/jsx-filename-extension
      icon: <ExclamationCircleOutlined />,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        console.log('config: ', toDelete);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const showBlockModal = (blockVal) => {
    setBlock(blockVal);
    setBlockVisible(true);
  };

  const onBlockCreate = (values) => {
    console.log('Block values of form: ', values);
    setBlockVisible(false);
  };

  const [form] = Form.useForm();
  // eslint-disable-next-line arrow-body-style
  useEffect(() => {
    return () => {
      form.resetFields();
    };
  });
  return (
    <div>
      <Modal
        forceRender
        visible={visible}
        title="Html Config"
        okText={!record.url ? 'Add' : 'Update'}
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
        <Tabs defaultActiveKey="1" onChange={callback}>
          <TabPane tab="General" key="1">
            <Form
              layout="vertical"
              form={form}
              id="html_form"
              initialValues={{
                url: record.url,
                contentRedundancySelectors: record.contentRedundancySelectors,
                blocksConfiguration: record.blocksConfiguration,
              }}
            >
              <Form.Item name="url" label="URL">
                <Input />
              </Form.Item>
              <Form.Item name="contentRedundancySelectors" label="Content Redundancy">
                {renderSelectTag()}
              </Form.Item>
            </Form>
          </TabPane>
          <TabPane tab="Block" key="2">
            <Form
              layout="vertical"
              form={form}
              id="block_form"
              initialValues={{
                blocksConfiguration: record.blocksConfiguration,
              }}
            >
              <Form.Item label="Block Config">
                <Input.Group>
                  {record.blocksConfiguration.map((config, index) => (
                  // eslint-disable-next-line react/no-array-index-key
                    <div key={index}>
                      <Button
                        onClick={() => showBlockModal(config)}
                        style={{ marginBottom: 10 }}
                        icon={<EditOutlined />}
                      >
                        Block Config
                        {' '}
                        {index + 1}
                      </Button>
                      <Button
                        danger
                        onClick={() => showDeleteConfirm(config)}
                        icon={<DeleteOutlined />}
                      />
                    </div>
                  ))}
                  <Button
                    type="primary"
                    onClick={() => showBlockModal(initBlock)}
                    icon={<PlusOutlined />}
                  >
                    Add Block
                  </Button>
                </Input.Group>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </Modal>
      <BlockForm
        visible={blockVisible}
        onCreate={onBlockCreate}
        onCancel={() => setBlockVisible(false)}
        record={block}
      />
    </div>
  );
};

export default HtmlForm;
