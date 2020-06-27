import React, { useState } from 'react';
import 'antd/dist/antd.css';
import './index.css';
import { makeStyles } from '@material-ui/core/styles';
import {
  Steps, Breadcrumb, Row, Col,
} from 'antd';
import { useDispatch } from 'react-redux';
import Axios from 'axios';
import General from './General';
import HtmlConfig from './HtmlConfig';
import RssConfig from './RssConfig';
import ArticleConfig from './ArticleConfig';
import openNotification from '../../../Notifications';
import allActions from '../../../../store/actions/allActions';
import { message } from '../../../../common';
import { init } from '../../../../common/init';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    maxHeight: 440,
    fontFamily: 'Montserrat',
  },
}));

const { Step } = Steps;
const initGeneral = {
  category: '',
  website: '',
  crawlType: '',
  schedules: [
  ],
  turnOnSchedule: false,
  autoSynthetic: false,
  articleDemoLink: '',
};


export default function AddConfig(props) {
  const classes = useStyles();
  const [current, setCurrent] = useState(0);
  const [general, setGeneral] = useState(initGeneral);
  const [rss, setRss] = useState(init.INIT_RSS);
  const [html, setHtml] = useState(init.INIT_HTML);
  const dispatch = useDispatch();

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const onGeneralCreate = (values) => {
    const generalVal = {
      category: values.category,
      website: values.website,
      crawlType: values.crawlType,
      schedules: values.schedules,
      turnOnSchedule: values.turnOnSchedule,
      autoSynthetic: values.autoSynthetic,
      articleDemoLink: values.articleDemoLink,
    };
    setGeneral(generalVal);
    next();
  };

  const onHtmlCreate = (values, newBlock) => {
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
        publicDateSelector: values.publicDateSelector,
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
      contentSelector: values.contentSelector,
      contentRedundancySelectors: values.contentRedundancySelectors,
      textRedundancySelectors: values.textRedundancySelectors,
    };
    const data = {
      general,
      config: general.crawlType === 'HTML' ? html : rss,
      article,
    };
    Axios.post('http://localhost:8000/add-config', data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }).then((addResult) => {
      if (addResult.data.status === 1) {
        dispatch(allActions.configAction.reload());
        openNotification('success', message.ADD_SUCCESS);
        // props.history.push('/dashboard/configuration');
      } else {
        openNotification('error', message.ERROR);
      }
    }).catch((err) => {
      console.log(err);
      openNotification('error', message.UNAUTHORIZED);
    });
  };

  const steps = [
    {
      title: 'Cấu hình chung',
      content: <General onCreate={onGeneralCreate} general={general} />,
    },
    {
      title: `Cấu hình ${general.crawlType}`,
      content: general.crawlType === 'HTML' ? <HtmlConfig onCreate={onHtmlCreate} prev={() => prev()} htmlVal={html} /> : <RssConfig onCreate={onRssCreate} prev={() => prev()} rssVal={rss} />,
    },
    {
      title: 'Cấu hình báo',
      content: <ArticleConfig onCreate={onArticleCreate} prev={() => prev()} />,
    },
  ];


  return (
    <div className={classes.root}>
      <Breadcrumb style={{ marginBottom: 10 }}>
        <Breadcrumb.Item>
          Bảng điều khiển
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <a href="/dashboard/configuration">Cấu hình</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <a href="/dashboard/configuration/add-config">Thêm cấu hình</a>
        </Breadcrumb.Item>
      </Breadcrumb>
      <Steps current={current}>
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <Row>
        <Col span={6} />
        <Col span={12}>
          {steps[current].content}
        </Col>
        <Col span={6} />
      </Row>
    </div>
  );
}
