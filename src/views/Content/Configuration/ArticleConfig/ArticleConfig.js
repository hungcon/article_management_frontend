import React, { useEffect, useState } from 'react';
import {
  Button, Form, Input, Select,
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
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
  const [content, setContent] = useState();
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
        const link = values.articleDemoLink;
        const configuration = {
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
        const contentVal = {
          link,
          configuration,
        };
        setContent(contentVal);
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
    Axios.post('http://localhost:8000/update-article-config', { articleVal, articleDemoLink, configId }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }).then((updateArticleResult) => {
      if (updateArticleResult.data.status === 1) {
        dispatch(allActions.configAction.reload());
        openNotification('success', message.UPDATE_SUCCESS);
        props.history.push('/dashboard/configuration');
      } else {
        openNotification('error', message.ERROR);
      }
    }).catch((err) => {
      console.log(err);
      openNotification('error', message.UNAUTHORIZED);
    });
  };

  useEffect(() => {
    let ignore = false;

    async function fetchData() {
      const articleConfig = await Axios.post('http://localhost:8000/get-article-config', { configId });
      if (!ignore) {
        const data = articleConfig.data.article;
        data.articleDemoLink = articleConfig.data.articleDemoLink;
        setArticle(data);
        setContent({
          link: articleConfig.data.articleDemoLink,
          configuration: {
            sapoSelector: data.sapoSelector,
            sapoRedundancySelectors: data.sapoRedundancySelectors,
            titleSelector: data.titleSelector,
            titleRedundancySelectors: data.titleRedundancySelectors,
            thumbnailSelector: data.thumbnailSelector,
            thumbnailRedundancySelectors: data.thumbnailRedundancySelectors,
            tagsSelector: data.tagsSelector,
            tagsRedundancySelectors: data.tagsRedundancySelectors,
            contentSelector: data.contentSelector,
            contentRedundancySelectors: data.contentRedundancySelectors,
            textRedundancySelectors: data.textRedundancySelectors,
          },
        });
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
        <Button
          type="primary"
          onClick={() => props.history.push('/dashboard/configuration')}
          shape="circle"
          icon={<ArrowLeftOutlined />}
        />
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
                message: 'Hãy nhập sapo selector',
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
                message: 'Hãy nhập title selector',
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
                message: 'Hãy nhập thumbnail selector',
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
                message: 'Hãy nhập tags selector',
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
                message: 'Hãy nhập content selector',
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
            <Button onClick={() => props.history.push('/dashboard/configuration')} className="button">
              Huỷ
            </Button>
            <Button type="dashed" className="button" onClick={() => crawl()}>
              Thử
            </Button>
            <Button type="primary" htmlType="submit">
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="right-content">
        <Preview content={content} />
      </div>

    </div>
  );
};

export default ArticleConfig;
