import React from 'react';

import { Tabs } from 'antd';
import renderHTML from 'react-render-html';

const { TabPane } = Tabs;
export default function Preview() {
  function callback(key) {
    console.log(key);
  }
  const renderPreview = () => renderHTML(`
    <div className="list_link" data-component-type="list_link" data-component-value="3911814,3582550" />
    <p className="Normal">
      Ng&#xE0;y 17/3, C&#xF4;ng an H&#xE0; N&#x1ED9;i cho bi&#x1EBF;t t&#x1EEB; n&#x103;m 2018 Mai Anh thu&#xEA;
      m&#x1ED9;t s&#x1ED1; ng&#x1B0;&#x1EDD;i l&#xE0;m gi&#x1EA3; c&#xE1;c k&#x1EBF;t lu&#x1EAD;n gi&#xE1;m
      &#x111;&#x1ECB;nh, bi&#xEA;n b&#x1EA3;n ph&#xE1;p y t&#xE2;m th&#x1EA7;n, c&#xE1;c c&#xF4;ng v&#x103;n, gi&#x1EA5;y
      t&#x1EDD; c&#x1EE7;a Vi&#x1EC7;n ph&#xE1;p y t&#xE2;m th&#x1EA7;n Trung &#x1B0;&#x1A1;ng, TAND t&#x1EC9;nh Thanh
      H&#xF3;a...&#xA0;
    </p>
    <p className="Normal">
      V&#x1EDB;i c&#xE1;c t&#xE0;i li&#x1EC7;u n&#xE0;y, Mai Anh l&#x1EAD;p h&#x1ED3; s&#x1A1; gi&#x1EA3; b&#x1EC7;nh
      &#xE1;n t&#xE2;m th&#x1EA7;n cho m&#x1ED9;t s&#x1ED1; ph&#x1EA1;m nh&#xE2;n; ng&#x1B0;&#x1EDD;i c&#xF3; ti&#x1EC1;n
      &#xE1;n, ti&#x1EC1;n s&#x1EF1;.
    </p>
    <p className="Normal">
      Khi s&#x1EF1; vi&#x1EC7;c b&#x1ECB; ph&#xE1;t gi&#xE1;c v&#xE0;o th&#xE1;ng 9/2019, Mai Anh b&#x1ECB; kh&#x1EDF;i
      t&#x1ED1; v&#x1EC1;
      t&#x1ED9;i
      <em> L&#xE0;m gi&#x1EA3; con d&#x1EA5;u, t&#xE0;i li&#x1EC7;u c&#x1EE7;a c&#x1A1; quan, t&#x1ED5; ch&#x1EE9;c; S&#x1EED; d&#x1EE5;ng con d&#x1EA5;u ho&#x1EB7;c t&#xE0;i li&#x1EC7;u gi&#x1EA3; c&#x1EE7;a c&#x1A1; quan, t&#x1ED5; ch&#x1EE9;c,&#xA0;</em>
      theo
      &#x111;i&#x1EC1;u 341 B&#x1ED9; lu&#x1EAD;t H&#xEC;nh s&#x1EF1; 2015.
    </p>
    <p className="Normal">
      Trong th&#x1EDD;i gian &#x111;&#x1B0;&#x1EE3;c t&#x1EA1;i ngo&#x1EA1;i, nghi ph&#x1EA1;m b&#x1ECF; tr&#x1ED1;n
      n&#xEA;n b&#x1ECB; C&#x1A1; quan c&#x1EA3;nh s&#xE1;t &#x111;i&#x1EC1;u tra C&#xF4;ng an H&#xE0; N&#x1ED9;i truy
      n&#xE3;.
    </p>
    <div
      className="list_link"
      contentEditable="false"
      data-component="true"
      data-component-type="list_link"
      data-component-value="3911814,3582550"
      style="cursor: pointer;"
    />`);
  return (
    <Tabs defaultActiveKey="1" onChange={callback}>
      <TabPane tab="Preview" key="1">
        {renderPreview()}
      </TabPane>
      <TabPane tab="Text" key="2">
        Text
      </TabPane>
      <TabPane tab="Tab 3" key="3">
        Content of tab 3
      </TabPane>
    </Tabs>
  );
}
