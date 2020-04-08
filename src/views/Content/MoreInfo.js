/* eslint-disable no-underscore-dangle */
/* eslint-disable no-alert */
/* eslint-disable no-restricted-globals */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React, { useState } from 'react';
import { Descriptions, Button, Modal } from 'antd';
import {
  DeleteOutlined, ExclamationCircleOutlined, PlusOutlined, EditOutlined,
} from '@ant-design/icons';
import Axios from 'axios';
import { useDispatch } from 'react-redux';
import RssForm from './Form/RssForm';
import HtmlForm from './Form/HtmlForm';
import ArticleForm from './Form/ArticleForm';
import openNotification from '../Notifications';
import allActions from '../../store/actions/allActions';

const { confirm } = Modal;

const initRss = {
  version: 0,
  url: '',
  configuration: {
    itemSelector: '',
    titleSelector: '',
    linkSelector: '',
    sapoSelector: '',
    publicDateSelector: '',
  },
};
const initHtml = {
  contentRedundancySelectors: [],
  url: '',
  blocksConfiguration: [
    // {
    //   configuration: {
    //     redundancySelectors: [],
    //     itemSelector: '',
    //     titleSelector: '',
    //     linkSelector: '',
    //   },
    //   blockSelector: '',
    // },
  ],
};

const initArticle = {
  sapoSelector: '',
  sapoRedundancySelectors: [

  ],
  titleSelector: '',
  titleRedundancySelectors: [

  ],
  thumbnailSelector: '',
  thumbnailRedundancySelectors: [

  ],
  tagsSelector: '',
  tagsRedundancySelectors: [

  ],
  contentSelector: '',
  contentRedundancySelectors: [

  ],
  textRedundancySelectors: [
    '',
  ],
};


const MoreInfo = ({ record }) => {
  const [rssVisible, setRssVisible] = useState(false);
  const [rss, setRss] = useState(initRss);
  const [htmlVisible, setHtmlVisible] = useState(false);
  const [html, setHtml] = useState(initHtml);
  const [articleVisible, setArticleVisible] = useState(false);
  const [article, setArticle] = useState(initArticle);
  const dispatch = useDispatch();


  const onCreate = (values) => {
    console.log('Received values of form: ', values);
    setArticleVisible(false);
  };

  const onRssCreate = (values) => {
    console.log('Rss values of form: ', values);
    setRssVisible(false);
  };

  const onHtmlCreate = (values, addBlock, updateBlock) => {
    console.log('general: ', values);
    console.log('add: ', addBlock);
    // console.log('update: ', updateBlock);
    const listUpdate = [];
    for (let i = 0; i < updateBlock.length; i += 1) {
      const block = updateBlock[i];
      if (block !== undefined) {
        listUpdate.push({
          index: i,
          blocksConfiguration: block,
        });
      }
    }
    console.log(listUpdate);
    dispatch(allActions.configAction.reload());
    setHtmlVisible(false);
  };

  const showRSSModal = (rssVal) => {
    setRss(rssVal);
    setRssVisible(true);
  };

  const showHTMLModal = (htmlVal) => {
    setHtml(htmlVal);
    setHtmlVisible(true);
  };

  const showArticleModal = (articleVal) => {
    setArticle(articleVal);
    setArticleVisible(true);
  };

  const showDeleteConfirm = (type, deleteId, configId) => {
    confirm({
      title: `Are you sure delete this ${type}?`,
      // eslint-disable-next-line react/jsx-filename-extension
      icon: <ExclamationCircleOutlined />,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      centered: true,
      async onOk() {
        if (type === 'rss') {
          console.log('rss:', deleteId, ' ', configId);
          // call api xoá rss
        } else {
          console.log('html: ', deleteId, ' ', configId);
          const result = await Axios.post('http://localhost:8000/delete-html-config', { htmlConfigId: deleteId, configId });
          if (result.data.status === 1) {
            dispatch(allActions.configAction.reload());
            openNotification('success');
          } else {
            openNotification('error');
          }
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const showHTMLConfig = (htmlConfig, configId) => (
    <Descriptions>
      <Descriptions.Item>
        {htmlConfig.map((eachHtml, index) => (
          <div key={index}>
            <Button
              onClick={() => showHTMLModal(eachHtml)}
              style={{ marginBottom: 10 }}
              icon={<EditOutlined />}
            >
              HTML Config
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
      <Descriptions.Item>
        <Button
          type="primary"
          onClick={() => showHTMLModal(initHtml)}
          icon={<PlusOutlined />}
        >
          Add HTML
        </Button>
      </Descriptions.Item>
    </Descriptions>
  );

  const showRSSConfig = (rssConfig, configId) => (
    <Descriptions>
      <Descriptions.Item>
        {
      rssConfig.map((eachRss, index) => (
        <div key={index}>
          <Button
            onClick={() => showRSSModal(eachRss)}
            style={{ marginBottom: 10 }}
            icon={<EditOutlined />}
          >
            RSS Config
            {' '}
            {index + 1}
          </Button>
          <Button
            danger
            onClick={() => showDeleteConfirm('rss', eachRss._id, configId)}
            icon={<DeleteOutlined />}
          />
        </div>
      ))
    }
      </Descriptions.Item>
      <Descriptions.Item>
        <Button
          type="primary"
          onClick={() => showRSSModal(initRss)}
          icon={<PlusOutlined />}
        >
          Add RSS
        </Button>
      </Descriptions.Item>
    </Descriptions>
  );
  return (
    <div>
      <Descriptions title="More Info" bordered>
        <Descriptions.Item label="Created At">
          {new Intl.DateTimeFormat('en-GB', {
            year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit',
          }).format(record.createdAt)}
        </Descriptions.Item>
        <Descriptions.Item label="Updated At">
          {new Intl.DateTimeFormat('en-GB', {
            year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit',
          }).format(record.updatedAt)}
        </Descriptions.Item>
        <br />
        <Descriptions.Item label="Queue">
          {record.queue}
        </Descriptions.Item>
        <Descriptions.Item label="Schedule">
          {record.schedules}
        </Descriptions.Item>
        <br />
        <Descriptions.Item label={record.crawlType === 'HTML' ? 'HTML Config' : 'RSS Config'} span={3}>
          {record.crawlType === 'HTML' ? showHTMLConfig(record.html, record._id) : showRSSConfig(record.rss, record._id)}
        </Descriptions.Item>
        <Descriptions.Item label="Article Config" span={3}>
          <Button
            onClick={() => showArticleModal(record.article)}
            style={{ marginRight: 10, marginBottom: 10 }}
            icon={<EditOutlined />}
          >
            Article Config
          </Button>
        </Descriptions.Item>
      </Descriptions>
      <RssForm
        visible={rssVisible}
        onCreate={onRssCreate}
        onCancel={() => setRssVisible(false)}
        record={rss}
      />
      <HtmlForm
        visible={htmlVisible}
        onCreate={onHtmlCreate}
        onCancel={() => setHtmlVisible(false)}
        record={html}
      />
      <ArticleForm
        visible={articleVisible}
        onCreate={onCreate}
        onCancel={() => setArticleVisible(false)}
        record={article}
      />
    </div>
  );
};


export default MoreInfo;
