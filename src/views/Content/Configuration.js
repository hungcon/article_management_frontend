import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import { makeStyles } from '@material-ui/core/styles';
import {
  Table, Button, Switch, Modal,
} from 'antd';
import { PlusCircleOutlined, ExclamationCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { css } from 'emotion';
import Axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import SourceForm from './Form/SourceForm';
import RssForm from './Form/RssForm';
import ArticleForm from './Form/ArticleForm';
import allActions from '../../store/actions/allActions';

const { confirm } = Modal;

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    maxHeight: 440,
  },
}));

const tableCSS = css({
  backgroundColor: 'white',
  '& table': {
    borderCollapse: 'collapse',
  },
  '& thead > tr > th': {
    backgroundColor: '#33b35a',
    color: '#FFF',
    fontWeight: 'bold',
  },
});

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

const initSource = {
  category: {
    id: 0,
    name: '',
  },
  website: {
    id: 0,
    name: '',
  },
  createdAt: 0,
  updatedAt: 0,
  articleDemoLink: '',
  status: 0,
  schedules: [
    '',
  ],
  queue: 1,
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


export default function Configuration() {
  const classes = useStyles();
  const data = useSelector((state) => state.config.data);
  const dispatch = useDispatch();

  // const [data, setData] = useState();
  const [sourceVisible, setSourceVisible] = useState(false);
  const [rssVisible, setRssVisible] = useState(false);
  const [articleVisible, setArticleVisible] = useState(false);
  const [source, setSource] = useState(initSource);
  const [rss, setRss] = useState(initRss);
  const [article, setArticle] = useState(initArticle);

  const showSourceModal = (sourceVal) => {
    setSource(sourceVal);
    setSourceVisible(true);
  };

  const showRSSModal = (rssVal) => {
    setRss(rssVal);
    setRssVisible(true);
  };

  const showArticleModal = (articleVal) => {
    setArticle(articleVal);
    setArticleVisible(true);
  };

  const handleCancel = () => {
    setRssVisible(false);
    setSourceVisible(false);
    setArticleVisible(false);
  };

  const onCreate = (values) => {
    console.log('Received values of form: ', values);
    handleCancel();
  };

  const onRssCreate = (values) => {
    console.log('Rss values of form: ', values);
    setRssVisible(false);
  };

  const showDeleteConfirm = (rssToDelete) => {
    confirm({
      title: 'Are you sure delete this rss?',
      // eslint-disable-next-line react/jsx-filename-extension
      icon: <ExclamationCircleOutlined />,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        console.log(rssToDelete);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const handleRemoveRecord = (record) => {
    console.log(record);
  };

  const columns = [
    {
      title: 'Website',
      dataIndex: 'website',
      key: 'website',
      render: (value) => value.name,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (value) => value.name,
    },
    {
      title: 'Create Time',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (value) => new Intl.DateTimeFormat('en-GB', {
        year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit',
      }).format(value),
    },
    {
      title: 'Update Time',
      key: 'updatedAt',
      dataIndex: 'updatedAt',
      render: (value) => new Intl.DateTimeFormat('en-GB', {
        year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit',
      }).format(value),
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      width: '8%',
      render: (value) => {
        const checked = value === 0;
        return <Switch checked={checked} />;
      },
    },
    {
      title: 'RSS',
      key: 'rss',
      dataIndex: 'rss',
      width: '12%',
      render: (value) => (
        <div>
          {value.map((eachRss, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <div key={index}>
              <Button
                onClick={() => showRSSModal(eachRss)}
                style={{ marginBottom: 10 }}
              >
                Rss
                {' '}
                {index + 1}
              </Button>
              <Button
                danger
                onClick={() => showDeleteConfirm(eachRss)}
                icon={<MinusCircleOutlined />}
              />
            </div>
          ))}
          <Button type="primary" icon={<PlusCircleOutlined />} onClick={() => showRSSModal(initRss)} />
        </div>
      ),
    },
    {
      title: 'Article',
      key: 'article',
      dataIndex: 'article',
      width: '15%',
      render: (value) => (
        <Button
          onClick={() => showArticleModal(value)}
          style={{ marginRight: 10, marginBottom: 10 }}
        >
          Article Config
        </Button>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '17%',
      render: (value, record) => (
        <div>
          <Button
            onClick={() => showSourceModal(record)}
            style={{ marginRight: 10 }}
          >
            Update
          </Button>
          <Button
            danger
            onClick={() => handleRemoveRecord(record)}
          >
            Remove
          </Button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    Axios.post('http://localhost:8000/get-configuration')
      .then((res) => {
        for (let i = 0; i < res.data.length; i += 1) {
          res.data[i].key = i;
        }
        dispatch(allActions.configAction.fetchData(res.data));
      })
      .catch((err) => {
        console.log(err);
      });
  }, [dispatch]);

  return (
    <div className={classes.root}>
      <Table
        className={tableCSS}
        columns={columns}
        dataSource={data}
        bordered
        scroll={{ y: 490 }}
      />
      <SourceForm
        visible={sourceVisible}
        onCreate={onCreate}
        onCancel={handleCancel}
        record={source}
      />
      <RssForm
        visible={rssVisible}
        onCreate={onRssCreate}
        onCancel={handleCancel}
        record={rss}
      />
      <ArticleForm
        visible={articleVisible}
        onCreate={onCreate}
        onCancel={handleCancel}
        record={article}
      />
    </div>
  );
}
