/* eslint-disable max-len */
/* eslint-disable react/style-prop-object */
/* eslint-disable no-const-assign */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-children-prop */
/* eslint-disable react/jsx-filename-extension */
import React, { useEffect } from 'react';
import {
  Button, Form, Input, Select, Drawer, Row, Col, Tabs,
} from 'antd';
import renderHTML from 'react-render-html';

const { TabPane } = Tabs;

const ArticleForm = ({
  visible, onCreate, onCancel, record,
}) => {
  const [form] = Form.useForm();
  const renderSelectTag = () => {
    const children = [];
    return (
      <Select mode="tags" style={{ width: '100%' }} tokenSeparators={[',']}>
        {children}
      </Select>
    );
  };


  const callback = (key) => {
    console.log(key);
    if (key === '2' || key === '3') {
      form.validateFields()
        .then((values) => {
          console.log(values);
        })
        .catch((info) => {
          console.log('Validate Failed:', info);
        });
    }
  };

  const onFinish = (values) => {
    console.log('Success:', values);
    onCreate(values);
  };

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

  // eslint-disable-next-line arrow-body-style
  useEffect(() => {
    return () => {
      form.resetFields();
    };
  });
  // eslint-disable-next-line no-return-assign
  return (
    <Drawer
      forceRender
      title="Article Config"
      visible={visible}
      width={1000}
      onClose={onCancel}
    >
      <Tabs defaultActiveKey="1" onChange={callback}>
        <TabPane tab="Config" key="1" style={{ minHeight: '80vh' }} forceRender>
          <Form
            form={form}
            initialValues={{
              sapoSelector: record.sapoSelector,
              sapoRedundancySelectors: record.sapoRedundancySelectors,
              titleSelector: record.titleSelector,
              titleRedundancySelectors: record.titleRedundancySelectors,
              thumbnailSelector: record.thumbnailSelector,
              thumbnailRedundancySelectors: record.thumbnailRedundancySelectors,
              tagsSelector: record.tagsSelector,
              tagsRedundancySelectors: record.tagsRedundancySelectors,
              contentSelector: record.contentSelector,
              contentRedundancySelectors: record.contentRedundancySelectors,
              textRedundancySelectors: record.textRedundancySelectors,
            }}
            onFinish={onFinish}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="sapoSelector" label="Sapo" id={Date.now()}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="sapoRedundancySelectors" label="Sapo Redundancy" id={Date.now()}>
                  {renderSelectTag()}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="titleSelector" label="Title" id={Date.now()}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="titleRedundancySelectors" label="Title Redundancy" id={Date.now()}>
                  {renderSelectTag()}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="thumbnailSelector" label="Thumbnail" id={Date.now()}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="thumbnailRedundancySelectors" label="Thumbnail Redundancy" id={Date.now()}>
                  {renderSelectTag()}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="tagsSelector" label="Tags" id={Date.now()}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="tagsRedundancySelectors" label="Tags Redundancy" id={Date.now()}>
                  {renderSelectTag()}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="contentSelector" label="Content" id={Date.now()}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="contentRedundancySelectors" label="Content Redundancy" id={Date.now()}>
                  {renderSelectTag()}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="textRedundancySelectors" label="Text Redundancy" id={Date.now()}>
                  {renderSelectTag()}
                </Form.Item>
              </Col>
            </Row>
            <div
              style={{
                position: 'absolute',
                right: 0,
                bottom: 0,
                width: '100%',
                borderTop: '1px solid #e9e9e9',
                padding: '10px 16px',
                background: '#fff',
                textAlign: 'right',
              }}
            >
              <Button onClick={onCancel} style={{ marginRight: 8 }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Update
              </Button>
            </div>
          </Form>
        </TabPane>
        <TabPane tab="Preview" key="2">
          {
            renderPreview()
          }
        </TabPane>
        <TabPane tab="Text" key="3">
          Text
        </TabPane>
      </Tabs>
    </Drawer>
  );
};

export default ArticleForm;
