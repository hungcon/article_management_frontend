/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Form, Input, Button,
} from 'antd';
import { makeStyles } from '@material-ui/core/styles';
import openNotification from '../Notifications';
import { message } from '../../common';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    maxHeight: 400,
    fontFamily: 'Montserrat',
  },
}));

export default function ArticleForm(props) {
  const { articleId } = useParams();
  const classes = useStyles();
  const [form] = Form.useForm();
  const [article, setArticle] = useState({
    link: '',
    title: '',
  });


  useEffect(() => {
    let ignore = false;
    async function fetchData() {
      const articleVal = (await axios.post('http://localhost:8000/get-valid-article-by-id', { articleId })).data;
      if (!ignore) {
        setArticle(articleVal);
      }
    }
    fetchData();
    return () => { ignore = true; };
  }, [articleId]);

  const onFinish = async (values) => {
    const { title, link, text } = values;
    const updateResult = (await axios.post('http://localhost:8000/update-valid-article', {
      title, link, text, id: article._id,
    })).data;
    if (updateResult.status === 1) {
      openNotification('success', message.UPDATE_SUCCESS);
    } else {
      openNotification('error', message.ERROR);
    }
  };

  useEffect(() => () => {
    form.resetFields();
  });

  return (
    <div className={classes.root}>
      <Form
        layout="vertical"
        form={form}
        initialValues={{
          link: article.link,
          title: article.title,
          text: article.text,
        }}
        onFinish={onFinish}
      >
        <Form.Item
          name="title"
          label="Title"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="link"
          label="Link"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="text"
          label="Text"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input.TextArea
            autoSize={{ minRows: 10, maxRows: 30 }}
          />
        </Form.Item>
        <Form.Item>
          <Button style={{ marginRight: 15 }} onClick={() => props.history.push('/dashboard/list-valid-articles')}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit">
            Update
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
