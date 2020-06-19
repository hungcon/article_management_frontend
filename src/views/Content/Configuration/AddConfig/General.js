/* eslint-disable prefer-promise-reject-errors */
import React, { useState, useEffect } from 'react';
import {
  Form, Input, Select, Button, Checkbox,
} from 'antd';

import { isValidCron } from 'cron-validator';
import axios from 'axios';
import { init } from '../../../../common/init';

const { Option } = Select;

const General = ({ onCreate, general }) => {
  const [form] = Form.useForm();
  const [websites, setWebsites] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let ignore = false;
    async function fetchData() {
      const listWebsite = (await axios.post('http://localhost:8000/get-websites')).data;
      for (let i = 0; i < listWebsite.length; i += 1) {
        listWebsite[i].key = i + 1;
      }
      if (!ignore) {
        setWebsites(listWebsite);
      }
    }
    fetchData();
    return () => { ignore = true; };
  }, []);

  useEffect(() => {
    let ignore = false;
    async function fetchData() {
      const listCategories = (await axios.post('http://localhost:8000/get-categories')).data;
      for (let i = 0; i < listCategories.length; i += 1) {
        listCategories[i].key = i + 1;
      }
      if (!ignore) {
        setCategories(listCategories);
      }
    }
    fetchData();
    return () => { ignore = true; };
  }, []);
  const renderSelectTag = (children) => (
    <Select mode="multiple" style={{ width: '100%' }} tokenSeparators={[',']}>
      {children}
      {init.INIT_SCHEDULES.scheduleDefault
        .map((tag) => <Option key={tag.key} value={tag.value}>{tag.key}</Option>) }
    </Select>
  );

  const scheduleValidator = (rule, values) => {
    const invalidInputs = values.filter((value) => !isValidCron(value, { seconds: true }));
    if (invalidInputs.length === 0) {
      return Promise.resolve();
    } if (invalidInputs.length === 1) {
      return Promise.reject(`${invalidInputs.join('')} không phải lịch hợp lệ`);
    }
    return Promise.reject(`${invalidInputs.slice(0, -1).join(', ')} và ${invalidInputs.slice(-1)} không phải lịch hợp lệ`);
  };

  const onSubmit = (values) => {
    onCreate(values);
  };
  // eslint-disable-next-line arrow-body-style
  useEffect(() => {
    return () => {
      form.resetFields();
    };
  });
  return (
    <Form
      style={{ fontFamily: 'Montserrat' }}
      layout="vertical"
      form={form}
      initialValues={{
        website: general.website,
        category: general.category,
        crawlType: general.crawlType,
        schedules: general.schedules,
        turnOnSchedule: general.turnOnSchedule,
        autoSynthetic: general.autoSynthetic,
        articleDemoLink: general.articleDemoLink,
      }}
      onFinish={onSubmit}
    >
      <Form.Item
        name="website"
        label="Tên đầu báo"
        rules={[
          {
            required: true,
            message: 'Hãy chọn tên đầu báo',
          },
        ]}
      >
        <Select
          showSearch
          optionFilterProp="children"
          filterOption={
            (input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {websites.map((website) => (
            <Option key={website.key} value={website.name}>{website.name}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="category"
        label="Tên chuyên mục"
        rules={[
          {
            required: true,
            message: 'Hãy chọn tên chuyên mục',
          },
        ]}
      >
        <Select
          showSearch
          filterOption={
            (input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {categories.map((category) => (
            <Option key={category.key} value={category.name}>{category.name}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="crawlType"
        label="Loại cấu hình"
        rules={[
          {
            required: true,
            message: 'Hãy chọn loại cấu hình',
          },
        ]}
      >
        <Select>
          <Option value="RSS">RSS</Option>
          <Option value="HTML">HTML</Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="schedules"
        label="Lịch chạy"
        rules={[
          {
            required: true,
            message: 'Hãy nhập lịch',
          },
          {
            validator: scheduleValidator,
          },
        ]}
      >
        {renderSelectTag(general.schedules)}
      </Form.Item>
      <Form.Item
        name="turnOnSchedule"
        label="Bật lịch chạy"
        valuePropName="checked"
      >
        <Checkbox checked={general.turnOnSchedule} />
      </Form.Item>
      <Form.Item
        name="autoSynthetic"
        label="Tự động tổng hợp"
        valuePropName="checked"
      >
        <Checkbox checked={general.autoSynthetic} />
      </Form.Item>
      <Form.Item
        name="articleDemoLink"
        label="Article Demo Link"
        rules={[
          {
            required: true,
            message: 'Hãy nhập link ví dụ bài báo',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <div
        style={{
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
        }}
      >
        <Button type="primary" htmlType="submit">
          Tiếp theo
        </Button>
      </div>
    </Form>
  );
};

export default General;
