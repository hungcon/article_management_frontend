/* eslint-disable no-unused-expressions */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React, { useState } from 'react';
import 'antd/dist/antd.css';
import './index.css';
import { makeStyles } from '@material-ui/core/styles';
import {
  Steps, Button,
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import General from './General';
import HtmlConfig from './HtmlConfig';
import RssConfig from './RssConfg';
import ArticleConfig from './ArticleConfig';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    maxHeight: 440,
  },
}));

const { Step } = Steps;
const initGeneral = {
  category: '',
  website: '',
  status: '',
  crawlType: '',
  schedules: [
  ],
  queue: '',
};

export default function AddConfig(props) {
  const classes = useStyles();
  const [current, setCurrent] = useState(0);
  const [general, setGeneral] = useState(initGeneral);
  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const onGeneralCreate = (values) => {
    console.log(values);
    setGeneral(values);
    next();
  };

  const onHtmlCreate = (values, newBlock) => {
    console.log(values);
    console.log('newBlock: ', newBlock);
    next();
  };

  const onRssCreate = (values) => {
    console.log(values);
    next();
  };

  const onArticleCreate = (values) => {
    console.log(values);
    props.history.push('/dashboard/configuration');
    next();
  };

  const steps = [
    {
      title: 'General',
      content: <General onCreate={onGeneralCreate} general={general} />,
    },
    {
      title: `${general.crawlType} Config`,
      content: general.crawlType === 'HTML' ? <HtmlConfig onCreate={onHtmlCreate} prev={() => prev()} /> : <RssConfig onCreate={onRssCreate} prev={() => prev()} />,
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
