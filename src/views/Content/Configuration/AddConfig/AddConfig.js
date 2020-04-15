import React, { useState } from 'react';
import 'antd/dist/antd.css';
import './index.css';
import { makeStyles } from '@material-ui/core/styles';
import {
  Steps, Button,
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import Axios from 'axios';
import General from './General';
import HtmlConfig from './HtmlConfig';
import RssConfig from './RssConfig';
import ArticleConfig from './ArticleConfig';
import openNotification from '../../../Notifications';
import allActions from '../../../../store/actions/allActions';
import { message } from '../../../../common';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    maxHeight: 440,
  },
}));

const { Step } = Steps;
const initGeneral = {
  category: {
    id: 0,
    name: '',
  },
  website: {
    id: 0,
    name: '',
  },
  status: '',
  crawlType: '',
  schedules: [
  ],
  queue: '',
  articleDemoLink: '',
};

const initRss = {
  version: 0,
  url: '',
  configuration: {
    itemSelector: 'item',
    titleSelector: 'title',
    linkSelector: 'link',
    sapoSelector: 'description',
    publishDateSelector: 'pubDate',
  },
};
const initHtml = {
  contentRedundancySelectors: [],
  url: '',
  blocksConfiguration: [],
};


export default function AddConfig(props) {
  const classes = useStyles();
  const [current, setCurrent] = useState(0);
  const [general, setGeneral] = useState(initGeneral);
  const [rss, setRss] = useState(initRss);
  const [html, setHtml] = useState(initHtml);
  const dispatch = useDispatch();

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const onGeneralCreate = (values) => {
    const generalVal = {
      category: {
        id: 0,
        name: values.category,
      },
      website: {
        id: 0,
        name: values.website,
      },
      status: values.status,
      crawlType: values.crawlType,
      schedules: values.schedules,
      queue: values.queue,
      articleDemoLink: values.articleDemoLink,
    };
    setGeneral(generalVal);
    next();
  };

  const onHtmlCreate = (values, newBlock) => {
    console.log(values);
    console.log('newBlock: ', newBlock);
    const htmlVal = {
      url: values.url,
      contentRedundancySelectors: values.contentRedundancySelectors,
      blocksConfiguration: newBlock,
    };
    setHtml(htmlVal);
    next();
  };

  const onRssCreate = (values) => {
    const rssVal = {
      url: values.url,
      configuration: {
        itemSelector: values.itemSelector,
        titleSelector: values.titleSelector,
        linkSelector: values.linkSelector,
        sapoSelector: values.sapoSelector,
        publishDateSelector: values.publishDateSelector,
      },
    };
    setRss(rssVal);
    next();
  };

  const onArticleCreate = async (values) => {
    const article = {
      sapoSelector: values.sapoSelector,
      sapoRedundancySelectors: values.sapoRedundancySelectors,
      titleSelector: values.titleSelector,
      titleRedundancySelectors: values.titleRedundancySelectors,
      thumbnailSelector: values.thumbnailSelector,
      thumbnailRedundancySelectors: values.thumbnailRedundancySelectors,
      tagsSelector: values.tagsSelector,
      tagsRedundancySelectors: values.tagsRedundancySelectors,
      contentSelector: values.contentSelector,
      contentRedundancySelectors: values.contentRedundancySelectors,
      textRedundancySelectors: values.textRedundancySelectors,
    };
    const data = general.crawlType === 'HTML' ? {
      general,
      config: html,
      article,
    } : {
      general,
      config: rss,
      article,
    };
    console.log(data);
    const addResult = await Axios.post('http://localhost:8000/add-config', data);
    if (addResult.data.status === 1) {
      dispatch(allActions.configAction.reload());
      openNotification('success', message.ADD_SUCCESS);
      props.history.push('/dashboard/configuration');
    } else {
      openNotification('error', message.ERROR);
    }
  };

  const steps = [
    {
      title: 'General',
      content: <General onCreate={onGeneralCreate} general={general} />,
    },
    {
      title: `${general.crawlType} Config`,
      content: general.crawlType === 'HTML' ? <HtmlConfig onCreate={onHtmlCreate} prev={() => prev()} htmlVal={html} /> : <RssConfig onCreate={onRssCreate} prev={() => prev()} rssVal={rss} />,
    },
    {
      title: 'Article',
      content: <ArticleConfig onCreate={onArticleCreate} prev={() => prev()} />,
    },
  ];


  return (
    <div className={classes.root}>
      <Button
        type="primary"
        onClick={() => props.history.push('/dashboard/configuration')}
        style={{
          marginBottom: 20, top: 0, left: 0,
        }}
        shape="circle"
        icon={<ArrowLeftOutlined />}
      />
      <Steps current={current}>
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div className="steps-content">{steps[current].content}</div>
    </div>
  );
}
