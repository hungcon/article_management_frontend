import React, { useEffect } from 'react';
import {
  Form, Input, Select, Button,
} from 'antd';

import { isValidCron } from 'cron-validator';
import { websites, categories } from '../../../../common';

const { Option } = Select;


const General = ({ onCreate, general }) => {
  const [form] = Form.useForm();
  const renderSelectTag = (children) => (
    <Select mode="tags" style={{ width: '100%' }} tokenSeparators={[',']}>
      {children}
    </Select>
  );

  const scheduleValidator = (rule, values, callback) => {
    const invalidInputs = values.filter((value) => !isValidCron(value, { seconds: true }));
    if (invalidInputs.length === 0) {
      callback();
    } else if (invalidInputs.length === 1) {
      callback(`${invalidInputs.join('')} is not a valid schedule`);
    } else {
      callback(`${invalidInputs.slice(0, -1).join(', ')} and ${invalidInputs.slice(-1)} are not valid schedule`);
    }
  };
  const onSubmit = (values) => {
    console.log(values);
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
      layout="vertical"
      form={form}
      initialValues={{
        website: general.website.name,
        category: general.category.name,
        status: general.status,
        queue: general.queue,
        crawlType: general.crawlType,
        schedules: general.schedules,
        articleDemoLink: general.articleDemoLink,
      }}
      onFinish={onSubmit}
    >
      <Form.Item
        name="website"
        label="Website"
        rules={[
          {
            required: true,
            message: 'Please select website name',
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
            <Option key={website.id} value={website.name}>{website.name}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="category"
        label="Category"
        rules={[
          {
            required: true,
            message: 'Please input category name',
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
            <Option key={category}>{category}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="crawlType"
        label="Crawl Type"
        rules={[
          {
            required: true,
            message: 'Please select crawl type',
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
        label="Schedule"
        rules={[
          {
            required: true,
            message: 'Please input schedules',
          },
          {
            validator: scheduleValidator,
          },
        ]}
      >
        {renderSelectTag(general.schedules)}
      </Form.Item>
      <Form.Item
        name="status"
        label="Status"
        rules={[
          {
            required: true,
            message: 'Please input status',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="articleDemoLink"
        label="Article Demo Link"
        rules={[
          {
            required: true,
            message: 'Please input article demo link',
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
          Next
        </Button>
      </div>
    </Form>
  );
};

export default General;
