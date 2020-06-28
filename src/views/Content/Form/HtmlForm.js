/* eslint-disable no-underscore-dangle */
/* eslint-disable no-case-declarations */
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
import axios from 'axios';
import { useDispatch } from 'react-redux';
import BlockForm from './BlockForm';
import openNotification from '../../Notifications';
import allActions from '../../../store/actions/allActions';
import { message } from '../../../common';
import { init } from '../../../common/init';
import { API_ENDPOINT } from '../../../common/apis';

const { confirm } = Modal;

const HtmlForm = ({
  visible, onCreate, onCancel, record, configId,
}) => {
  const [block, setBlock] = useState(init.INIT_BLOCK);
  const [newBlock, setNewBlock] = useState([]);
  const [blockVisible, setBlockVisible] = useState(false);
  const [type, setType] = useState({});
  const dispatch = useDispatch();

  const onHtmlCreate = (values, addBlock, htmlId) => {
    onCreate(values, addBlock, htmlId);
    setNewBlock([]);
  };

  const renderSelectTag = () => (
    <Select mode="tags" style={{ width: '100%' }} tokenSeparators={[',']} />
  );

  const showDeleteConfirm = (blockConfigId, htmlConfigId) => {
    confirm({
      title: 'Bạn có chắc muốn xoá cấu hình blog này không?',
      // eslint-disable-next-line react/jsx-filename-extension
      icon: <ExclamationCircleOutlined />,
      okText: 'Có',
      okType: 'danger',
      cancelText: 'Không',
      centered: true,
      async onOk() {
        console.log('block: ', blockConfigId, htmlConfigId);
        const result = await axios.post(
          API_ENDPOINT.DELETE_BLOCK_CONFIG, { htmlConfigId, blockConfigId, configId },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          },
        );
        if (result.data.status === 1) {
          dispatch(allActions.configAction.reload());
          onCancel();
          openNotification('success', message.DELETE_SUCCESS);
        } else {
          openNotification('error', message.ERROR);
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const handleCancel = () => {
    setBlock(init.INIT_BLOCK);
    setNewBlock([]);
    onCancel();
  };

  const showBlockModal = (blockVal, typeVal, blockId) => {
    setType({ type: typeVal, blockId });
    setBlock(blockVal);
    setBlockVisible(true);
  };

  const onBlockCreate = async (values) => {
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
        const result = await axios.post(
          API_ENDPOINT.UPDATE_BLOCK_CONFIG,
          { blockConfigId: type.blockId, block: blockConfig, configId }, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          },
        );
        if (result.data.status === 1) {
          dispatch(allActions.configAction.reload());
          handleCancel();
          openNotification('success', message.UPDATE_SUCCESS);
        } else {
          openNotification('error', message.ERROR);
        }
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

  useEffect(() => () => {
    form.resetFields();
  });
  return (
    <div>
      <Modal
        forceRender
        style={{ fontFamily: 'Montserrat' }}
        visible={visible}
        title={!record.url ? 'Thêm mới cấu hình HTML' : 'Cập nhật cấu hình HTML'}
        okText={!record.url ? 'Thêm mới' : 'Cập nhật'}
        cancelText="Huỷ"
        onCancel={handleCancel}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              form.resetFields();
              onHtmlCreate(values, newBlock, record._id);
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
          }}
        >
          <Form.Item
            name="url"
            label="URL"
            rules={[
              {
                required: true,
                message: 'Hãy nhập url',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="contentRedundancySelectors" label="Content Redundancy">
            {renderSelectTag()}
          </Form.Item>
          <Form.Item label="Cấu hình Block">
            <Input.Group>
              {record.blocksConfiguration.map((config, index) => (
              // eslint-disable-next-line react/no-array-index-key
                <div key={index}>
                  <Button
                    // eslint-disable-next-line no-underscore-dangle
                    onClick={() => showBlockModal(config, 'serverUpdate', config._id)}
                    style={{ marginBottom: 10 }}
                    icon={<EditOutlined />}
                  >
                    Cấu hình block
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
                    Cấu hình block mới
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
                onClick={() => showBlockModal(init.INIT_BLOCK, 'localAdd')}
                icon={<PlusOutlined />}
              >
                Thêm mới block
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
