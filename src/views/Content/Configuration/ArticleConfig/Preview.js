/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from 'react';

import { Tabs } from 'antd';
// import renderHTML from 'react-render-article';
import Axios from 'axios';

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
        const data = await Axios.post('http://localhost:8000/crawl/article', content);
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
              <b>Tags:</b>
                {article.tags && article.tags.join(', ')}
              <br />
              <b>Thumbnail:</b>
              <br />
              <img src={article.thumbnail} />
              <br />
              <b>Images:</b>
              <br />
                {article.images.map((image) => (
                  <img key={image} src={image} />
                ))}
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
