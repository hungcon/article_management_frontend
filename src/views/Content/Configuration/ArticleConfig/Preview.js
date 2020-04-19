/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from 'react';

import { Tabs } from 'antd';
// import renderHTML from 'react-render-html';
import Axios from 'axios';

const { TabPane } = Tabs;
export default function Preview({ content }) {
  const [html, setHtml] = useState();
  function callback(key) {
    console.log(key);
  }

  useEffect(() => {
    let ignore = false;
    async function fetchData() {
      if (content) {
        const data = await Axios.post('http://localhost:8000/crawl/article', content);
        if (!ignore) {
          setHtml(data.data);
        }
      }
    }
    fetchData();
    return () => { ignore = true; };
  }, [content]);

  // const renderPreview = () => {
  //   if (html) {
  //     return renderHTML(`${html}`);
  //   }
  //   return renderHTML('<b>Have no content</b>');
  // };
  return (
    <Tabs defaultActiveKey="1" onChange={callback}>
      <TabPane tab="Preview" key="1">
        {
          html && (
            <div>
              <b>Title:</b>
                {html.title}
              <br />
              <b>Description:</b>
                {html.sapo}
              <br />
              <b>Tags:</b>
                {html.tags.join(', ')}
              <br />
              <b>Thumbnail:</b>
              <br />
              <img src={html.thumbnail} />
              <br />
              <b>Images:</b>
              <br />
                {html.images.map((image) => (
                  <img key={image} src={image} />
                ))}
              <br />
            </div>
          )
        }
      </TabPane>
      <TabPane tab="Text" key="2">
        {html && `${html.sapo}\n\n${html.text}`}
      </TabPane>
    </Tabs>
  );
}
