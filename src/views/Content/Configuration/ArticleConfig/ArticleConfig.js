import React, { useEffect, useState } from 'react';
import {
  Button, Form, Input, Select,
} from 'antd';
import {
  useParams,
} from 'react-router-dom';
import Axios from 'axios';
import { useDispatch } from 'react-redux';
import Preview from './Preview';
import openNotification from '../../../Notifications';
import allActions from '../../../../store/actions/allActions';
import './index.css';
import { init } from '../../../../common/init';
import { message } from '../../../../common';


const ArticleConfig = (props) => {
  const [article, setArticle] = useState(init.INIT_ARTICLE);
  const dispatch = useDispatch();

  const [form] = Form.useForm();
  const { configId } = useParams();

  const renderSelectTag = () => {
    const children = [];
    return (
      <Select mode="tags" style={{ width: '100%' }} tokenSeparators={[',']}>
        {children}
      </Select>
    );
  };

  const crawl = () => {
    form
      .validateFields()
      .then((values) => {
        console.log(values);
        form.resetFields();
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const onFinish = async (values) => {
    const articleVal = {
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
    const { articleDemoLink } = values;
    const updateArticleResult = await Axios.post('http://localhost:8000/update-article-config', { articleVal, articleDemoLink, configId });
    if (updateArticleResult.data.status === 1) {
      dispatch(allActions.configAction.reload());
      openNotification('success', message.UPDATE_SUCCESS);
      props.history.push('/dashboard/configuration');
    } else {
      openNotification('error', message.ERROR);
    }
  };

  useEffect(() => {
    let ignore = false;

    async function fetchData() {
      const articleConfig = await Axios.post('http://localhost:8000/get-article-config', { configId });
      if (!ignore) {
        const data = articleConfig.data.article;
        data.articleDemoLink = articleConfig.data.articleDemoLink;
        setArticle(data);
      }
    }
    fetchData();
    return () => { ignore = true; };
  }, [configId]);


  // eslint-disable-next-line arrow-body-style
  useEffect(() => {
    return () => {
      form.resetFields();
    };
  });
  // eslint-disable-next-line no-return-assign
  return (
    <div className="root">
      <div className="article-config">
        <Form
          layout="vertical"
          size="middle"
          form={form}
          initialValues={{
            sapoSelector: article.sapoSelector,
            sapoRedundancySelectors: article.sapoRedundancySelectors,
            titleSelector: article.titleSelector,
            titleRedundancySelectors: article.titleRedundancySelectors,
            thumbnailSelector: article.thumbnailSelector,
            thumbnailRedundancySelectors: article.thumbnailRedundancySelectors,
            tagsSelector: article.tagsSelector,
            tagsRedundancySelectors: article.tagsRedundancySelectors,
            contentSelector: article.contentSelector,
            contentRedundancySelectors: article.contentRedundancySelectors,
            textRedundancySelectors: article.textRedundancySelectors,
            articleDemoLink: article.articleDemoLink,
          }}
          onFinish={onFinish}
        >
          <Form.Item name="articleDemoLink" label="Demo Link">
            <Input />
          </Form.Item>

          <Form.Item
            name="sapoSelector"
            label="Sapo"
            rules={[
              {
                required: true,
                message: 'Please input sapo selector',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="sapoRedundancySelectors" label="Sapo Redundancy">
            {renderSelectTag()}
          </Form.Item>

          <Form.Item
            name="titleSelector"
            label="Title"
            rules={[
              {
                required: true,
                message: 'Please input title selector',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="titleRedundancySelectors" label="Title Redundancy">
            {renderSelectTag()}
          </Form.Item>

          <Form.Item
            name="thumbnailSelector"
            label="Thumbnail"
            rules={[
              {
                required: true,
                message: 'Please input thumbnail selector',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="thumbnailRedundancySelectors" label="Thumbnail Redundancy">
            {renderSelectTag()}
          </Form.Item>

          <Form.Item
            name="tagsSelector"
            label="Tags"
            rules={[
              {
                required: true,
                message: 'Please input tags selector',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="tagsRedundancySelectors" label="Tags Redundancy">
            {renderSelectTag()}
          </Form.Item>

          <Form.Item
            name="contentSelector"
            label="Content"
            rules={[
              {
                required: true,
                message: 'Please input content selector',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="contentRedundancySelectors" label="Content Redundancy">
            {renderSelectTag()}
          </Form.Item>

          <Form.Item name="textRedundancySelectors" label="Text Redundancy">
            {renderSelectTag()}
          </Form.Item>

          <Form.Item className="button-group">
            <Button onClick={() => props.history.push('./dashboard/configuration')} className="button">
              Cancel
            </Button>
            <Button type="dashed" className="button" onClick={crawl}>
              Crawl
            </Button>
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="right-content">
        <Preview />
      </div>

    </div>
  );
};

export default ArticleConfig;
