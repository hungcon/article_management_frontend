/* eslint-disable no-underscore-dangle */
import React, { useState } from 'react';
import {
  Descriptions, Button, Modal, Typography,
} from 'antd';
import {
  DeleteOutlined, ExclamationCircleOutlined, PlusOutlined, EditOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import RssForm from './Form/RssForm';
import HtmlForm from './Form/HtmlForm';
import openNotification from '../Notifications';
import allActions from '../../store/actions/allActions';
import { message } from '../../common';
import { init } from '../../common/init';

const { confirm } = Modal;
const { Text } = Typography;

const MoreInfo = ({ record, props }) => {
  const [rssVisible, setRssVisible] = useState(false);
  const [rss, setRss] = useState(init.INIT_RSS);
  const [htmlVisible, setHtmlVisible] = useState(false);
  const [html, setHtml] = useState(init.INIT_HTML);
  const [htmlAction, setHtmlAction] = useState();
  const [rssAction, setRssAction] = useState();
  const dispatch = useDispatch();

  const onRssCreate = async (values, rssConfigId) => {
    switch (rssAction) {
      case 'update':
        axios.post('http://localhost:8000/update-rss-config', { rssConfig: values, rssConfigId, configId: record._id }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }).then((updateRssResult) => {
          if (updateRssResult.data.status === 1) {
            dispatch(allActions.configAction.reload());
            openNotification('success', message.UPDATE_SUCCESS);
          } else {
            openNotification('error', message.ERROR);
          }
        }).catch((err) => {
          console.log(err);
          openNotification('error', message.UNAUTHORIZED);
        });
        break;
      case 'add':
        axios.post('http://localhost:8000/add-rss-config', { rssConfig: values, configId: record._id }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }).then((addRssResult) => {
          if (addRssResult.data.status === 1) {
            dispatch(allActions.configAction.reload());
            openNotification('success', message.ADD_SUCCESS);
          } else {
            openNotification('error', message.ERROR);
          }
        }).catch((err) => {
          console.log(err);
          openNotification('error', message.UNAUTHORIZED);
        });
        break;
      default:
        break;
    }
    setRssVisible(false);
  };

  const onHtmlCreate = async (values, addBlock, htmlId) => {
    switch (htmlAction) {
      case 'update':
        if (addBlock.length === 0) {
          axios.post('http://localhost:8000/update-html-config', { html: values, htmlId, configId: record._id }, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }).then((updateResult) => {
            if (updateResult.data.status === 1) {
              dispatch(allActions.configAction.reload());
              openNotification('success', message.UPDATE_SUCCESS);
            } else {
              openNotification('error', message.ERROR);
            }
          }).catch((err) => {
            console.log(err);
            openNotification('error', message.UNAUTHORIZED);
          });
        } else {
          addBlock.map(async (block) => {
            axios.post('http://localhost:8000/add-block-config', {
              html: values, htmlId, block, configId: record._id,
            }, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            }).then((updateResult) => {
              if (updateResult.data.status === 1) {
                dispatch(allActions.configAction.reload());
                openNotification('success', message.ADD_SUCCESS);
              } else {
                openNotification('error', message.ERROR);
              }
            }).catch((err) => {
              console.log(err);
              openNotification('error', message.UNAUTHORIZED);
            });
          });
        }
        break;
      case 'add':
        axios.post('http://localhost:8000/add-html-config', { html: values, addBlock, configId: record._id }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }).then((addResult) => {
          if (addResult.data.status === 1) {
            dispatch(allActions.configAction.reload());
            openNotification('success', message.ADD_SUCCESS);
          } else {
            openNotification('error', message.ERROR);
          }
        }).catch((err) => {
          console.log(err);
          openNotification('error', message.UNAUTHORIZED);
        });
        break;
      default:
        break;
    }
    setHtmlVisible(false);
  };

  const showRSSModal = (rssVal, rssActionVal) => {
    setRssAction(rssActionVal);
    setRss(rssVal);
    setRssVisible(true);
  };

  const showHTMLModal = (htmlVal, htmlActionVal) => {
    setHtmlAction(htmlActionVal);
    setHtml(htmlVal);
    setHtmlVisible(true);
  };

  const showDeleteConfirm = (type, deleteId, configId) => {
    confirm({
      title: `Bạn có chắn chắn xoá ${type} này không?`,
      // eslint-disable-next-line react/jsx-filename-extension
      icon: <ExclamationCircleOutlined />,
      okText: 'Có',
      okType: 'danger',
      cancelText: 'Không',
      centered: true,
      async onOk() {
        if (type === 'rss') {
          console.log('rssId :', deleteId, 'configId: ', configId);
          axios.post('http://localhost:8000/delete-rss-config', { rssConfigId: deleteId, configId }, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }).then((deleteRssResult) => {
            if (deleteRssResult.data.status === 1) {
              dispatch(allActions.configAction.reload());
              openNotification('success', message.DELETE_SUCCESS);
            } else {
              openNotification('error', message.ERROR);
            }
          }).catch((err) => {
            console.log(err);
            openNotification('error', message.UNAUTHORIZED);
          });
        } else {
          console.log('html: ', deleteId, 'htmlId: ', configId);
          axios.post('http://localhost:8000/delete-html-config', { htmlConfigId: deleteId, configId }, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }).then((deleteHtmlResult) => {
            if (deleteHtmlResult.data.status === 1) {
              dispatch(allActions.configAction.reload());
              openNotification('success', message.DELETE_SUCCESS);
            } else {
              openNotification('error', message.ERROR);
            }
          }).catch((err) => {
            console.log(err);
            openNotification('error', message.UNAUTHORIZED);
          });
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const showHTMLConfig = (htmlConfig, configId) => (
    <Descriptions>
      {htmlConfig.length === 0 ? (
        <Descriptions.Item>Không có cấu hình HTML</Descriptions.Item>
      )
        : (
          <Descriptions.Item>
            {htmlConfig.map((eachHtml, index) => (
              <div key={index}>
                <Button
                  onClick={() => showHTMLModal(eachHtml, 'update')}
                  style={{ marginBottom: 10 }}
                  icon={<EditOutlined />}
                >
                  Cấu hình HTML
                  {' '}
                  {index + 1}
                </Button>
                <Button
                  danger
                  onClick={() => showDeleteConfirm('html', eachHtml._id, configId)}
                  icon={<DeleteOutlined />}
                />
              </div>
            ))}
          </Descriptions.Item>
        )}
      <Descriptions.Item>
        <Button
          type="primary"
          onClick={() => showHTMLModal(init.INIT_HTML, 'add')}
          icon={<PlusOutlined />}
        >
          Thêm cấu hình HTML
        </Button>
      </Descriptions.Item>
    </Descriptions>
  );

  const showRSSConfig = (rssConfig, configId) => (
    <Descriptions>
      {rssConfig.length === 0 ? (
        <Descriptions.Item>Không có cấu hình RSS</Descriptions.Item>
      ) : (
        <Descriptions.Item>
          { rssConfig.map((eachRss, index) => (
            <div key={index}>
              <Button
                onClick={() => showRSSModal(eachRss, 'update')}
                style={{ marginBottom: 10 }}
                icon={<EditOutlined />}
              >
                Cấu hình RSS
                {' '}
                {index + 1}
              </Button>
              <Button
                danger
                onClick={() => showDeleteConfirm('rss', eachRss._id, configId)}
                icon={<DeleteOutlined />}
              />
            </div>
          ))}
        </Descriptions.Item>
      )}
      <Descriptions.Item>
        <Button
          type="primary"
          onClick={() => showRSSModal(init.INIT_RSS, 'add')}
          icon={<PlusOutlined />}
        >
          Thêm cấu hình RSS
        </Button>
      </Descriptions.Item>
    </Descriptions>
  );
  return (
    <div>
      <Descriptions title="Thông tin cấu hình" bordered>
        <Descriptions.Item label="Thêm mới lúc">
          {new Intl.DateTimeFormat('en-GB', {
            year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit',
          }).format(new Date(record.createdAt).getTime())}
        </Descriptions.Item>
        <Descriptions.Item label="Cập nhật lúc">
          {new Intl.DateTimeFormat('en-GB', {
            year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit',
          }).format(new Date(record.updatedAt).getTime())}
        </Descriptions.Item>
        <Descriptions.Item label="Lịch chạy">
          {record.schedules.map((schedule) => {
            if (schedule === '0 */1 * * * *') {
              return (
                <Text mark key={schedule} value={schedule}>
                  Mỗi 1 phút
                  <br />
                </Text>
              );
            }
            if (schedule === '0 */5 * * * *') {
              return (
                <Text mark key={schedule} value={schedule}>
                  Mỗi 5 phút
                  <br />
                </Text>
              );
            }
            if (schedule === '0 */10 * * * *') {
              return (
                <Text mark key={schedule} value={schedule}>
                  Mỗi 10 phút
                  <br />
                </Text>
              );
            }
            if (schedule === '0 */15 * * * *') {
              return (
                <Text mark key={schedule} value={schedule}>
                  Mỗi 15 phút
                  <br />
                </Text>
              );
            }
            if (schedule === '0 */30 * * * *') {
              return (
                <Text mark key={schedule} value={schedule}>
                  Mỗi 30 phút
                  <br />
                </Text>
              );
            }
            return (
              <Text mark key={schedule} value={schedule}>
                Mỗi 1 giờ
                <br />
              </Text>
            );
          })}
        </Descriptions.Item>
        <Descriptions.Item label={record.crawlType === 'HTML' ? 'Cấu hình HTML' : 'Cấu hình RSS'} span={3}>
          {record.crawlType === 'HTML' ? showHTMLConfig(record.html, record._id) : showRSSConfig(record.rss, record._id)}
        </Descriptions.Item>
        <Descriptions.Item label="Cấu hình báo" span={3}>
          <Button
            onClick={() => props.history.push(`/dashboard/configuration/article-config/${record._id}`)}
            style={{ marginRight: 10, marginBottom: 10 }}
            icon={<EditOutlined />}
          >
            Cấu hình báo
          </Button>
        </Descriptions.Item>
      </Descriptions>
      <RssForm
        visible={rssVisible}
        onCreate={onRssCreate}
        onCancel={() => setRssVisible(false)}
        record={rss}
        configId={record._id}
      />
      <HtmlForm
        visible={htmlVisible}
        onCreate={onHtmlCreate}
        onCancel={() => setHtmlVisible(false)}
        record={html}
        configId={record._id}
      />
    </div>
  );
};


export default MoreInfo;
