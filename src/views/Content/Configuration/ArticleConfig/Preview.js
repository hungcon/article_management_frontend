/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from 'react';

import { Tabs } from 'antd';
// import renderHTML from 'react-render-article';
import axios from 'axios';
import { API_ENDPOINT } from '../../../../common/apis';

const { TabPane } = Tabs;
export default function Preview({ content }) {
  const [article, setArticle] = useState();
  function callback(key) {
    console.log(key);
  }

  useEffect(() => {
    let ignore = false;
    async function fetchData() {
      if (content) {
        const data = await axios.post(API_ENDPOINT.CRAWL_ARTICLE, content);
        if (!ignore) {
          setArticle(data.data);
        }
      }
    }
    fetchData();
    return () => { ignore = true; };
  }, [content]);

  // const renderPreview = () => {
  //   if (article) {
  //     return renderHTML(`${article}`);
  //   }
  //   return renderHTML('<b>Have no content</b>');
  // };
  return (
    <Tabs defaultActiveKey="1" onChange={callback}>
      <TabPane tab="Preview" key="1">
        {
          article && (
            <div>
              <b>Title:</b>
                {article.title && article.title}
              <br />
              <b>Description:</b>
                {article.sapo && article.sapo}
              <br />
            </div>
          )
        }
      </TabPane>
      <TabPane tab="Text" key="2">
        {article && `${article.sapo}\n\n${article.text}`}
      </TabPane>
    </Tabs>
  );
}
