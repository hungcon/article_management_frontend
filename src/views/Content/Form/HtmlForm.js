/* eslint-disable no-undef */
/* eslint-disable no-return-assign */
/* eslint-disable no-console */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React, { useEffect, useState } from 'react';
import {
  Modal, Form, Input, Select, Button,
} from 'antd';
import {
  EditOutlined, DeleteOutlined, ExclamationCircleOutlined, PlusOutlined,
} from '@ant-design/icons';
import Axios from 'axios';
import { useDispatch } from 'react-redux';
import BlockForm from './BlockForm';
import openNotification from '../../Notifications';
import allActions from '../../../store/actions/allActions';

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
  const [listBlockServer, setListBlockServer] = useState(record.blocksConfiguration);
  const [newBlock, setNewBlock] = useState([]);
  const [blockVisible, setBlockVisible] = useState(false);
  const [type, setType] = useState({});
  const dispatch = useDispatch();

  const renderSelectTag = () => (
    <Select mode="tags" style={{ width: '100%' }} tokenSeparators={[',']} />
  );

  const showDeleteConfirm = (blockConfigId, htmlConfigId) => {
    confirm({
      title: 'Are you sure delete this block config?',
      // eslint-disable-next-line react/jsx-filename-extension
      icon: <ExclamationCircleOutlined />,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      centered: true,
      async onOk() {
        console.log('block: ', blockConfigId, htmlConfigId);
        const result = await Axios.post('http://localhost:8000/delete-block-config', { htmlConfigId, blockConfigId });
        if (result.data.status === 1) {
          dispatch(allActions.configAction.reload());
          openNotification('success');
        } else {
          openNotification('error');
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const handleCancel = () => {
    setBlock(initBlock);
    setNewBlock([]);
    onCancel();
  };

  const showBlockModal = (blockVal, typeVal, index) => {
    setType({ type: typeVal, index });
    setBlock(blockVal);
    setBlockVisible(true);
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
    setBlock(blockConfig);
    switch (type.type) {
      case 'serverUpdate':
        // eslint-disable-next-line no-case-declarations
        const newListBlockServer = listBlockServer;
        newListBlockServer[type.index] = blockConfig;
        setListBlockServer(newListBlockServer);
        break;
      case 'localAdd':
        setNewBlock([...newBlock, blockConfig]);
        break;
      case 'localUpdate':
        // eslint-disable-next-line no-case-declarations
        const newBlockState = newBlock;
        newBlockState[type.index] = blockConfig;
        setNewBlock(newBlockState);
      // eslint-disable-next-line no-fallthrough
      default:
        break;
    }
    setBlockVisible(false);
  };

  const removeNewBlock = (values) => {
    setNewBlock(newBlock.filter((e) => (e.blockSelector !== values.blockSelector)));
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
        onCancel={handleCancel}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              form.resetFields();
              onCreate(values, newBlock, listBlockServer);
            })
            .catch((info) => {
              console.log('Validate Failed:', info);
            });
        }}
      >
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
          <Form.Item label="Block Config">
            <Input.Group>
              {record.blocksConfiguration.map((config, index) => (
              // eslint-disable-next-line react/no-array-index-key
                <div key={index}>
                  <Button
                    onClick={() => showBlockModal(config, 'serverUpdate', index)}
                    style={{ marginBottom: 10 }}
                    icon={<EditOutlined />}
                  >
                    Block Config
                    {' '}
                    {index + 1}
                  </Button>
                  <Button
                    danger
                    // eslint-disable-next-line no-underscore-dangle
                    onClick={() => showDeleteConfirm(config._id, record._id)}
                    icon={<DeleteOutlined />}
                  />
                </div>
              ))}
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
            </Input.Group>
          </Form.Item>
        </Form>
      </Modal>
      <BlockForm
        visible={blockVisible}
        onCreate={onBlockCreate}
        onCancel={() => setBlockVisible(false)}
        record={block}
        type={type}
      />
    </div>
  );
};

export default HtmlForm;
