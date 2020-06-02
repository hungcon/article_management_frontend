/* eslint-disable prefer-promise-reject-errors */
import React, { useState, useEffect } from 'react';
import {
  Modal, Form, Select, Checkbox,
} from 'antd';
import { isValidCron } from 'cron-validator';
import axios from 'axios';
import { init } from '../../../common/init';

const { Option } = Select;

const SourceForm = ({
  visible, onCreate, onCancel, record,
}) => {
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
    <Select mode="tags" style={{ width: '100%' }} tokenSeparators={[',']}>
      {children.map((tag) => {
        if (tag === '0 */1 * * * *') {
          return <Option key={tag} value={tag}>Mỗi 1 phút</Option>;
        }
        if (tag === '0 */5 * * * *') {
          return <Option key={tag} value={tag}>Mỗi 5 phút</Option>;
        }
        if (tag === '0 */10 * * * *') {
          return <Option key={tag} value={tag}>Mỗi 10 phút</Option>;
        }
        if (tag === '0 */15 * * * *') {
          return <Option key={tag} value={tag}>Mỗi 15 phút</Option>;
        }
        if (tag === '0 */30 * * * *') {
          return <Option key={tag} value={tag}>Mỗi 30 phút</Option>;
        }
        return <Option key={tag} value={tag}>Mỗi 1 tiếng</Option>;
      })}
      {init.INIT_SCHEDULES.scheduleDefault
        .map((tag) => children.map((childrenTag) => {
          if (childrenTag === tag.value) return false;
          return (
            <Option key={tag.key} value={tag.value}>{tag.key}</Option>
          );
        }))}
    </Select>
  );

  const scheduleValidator = (rule, values) => {
    const invalidInputs = values.filter((value) => !isValidCron(value, { seconds: true }));
    if (invalidInputs.length === 0) {
      return Promise.resolve();
    } if (invalidInputs.length === 1) {
      return Promise.reject(`${invalidInputs.join('')} is not a valid schedule`);
    }
    return Promise.reject(`${invalidInputs.slice(0, -1).join(', ')} and ${invalidInputs.slice(-1)} are not valid schedule`);
  };

  useEffect(() => () => {
    form.resetFields();
  });

  return (
    <Modal
      style={{ fontFamily: 'Montserrat' }}
      forceRender
      visible={visible}
      title="Cập nhật cấu hình"
      okText="Cập nhật"
      cancelText="Huỷ"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onCreate(values);
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Form
        layout="vertical"
        form={form}
        initialValues={{
          website: record.website.name,
          category: record.category.name,
          schedules: record.schedules,
          autoSynthetic: record.autoSynthetic === '01',
          turnOnSchedule: record.turnOnSchedule === '01',
        }}
      >
        <Form.Item
          name="website"
          label="Đầu báo"
          rules={[
            {
              required: true,
              message: 'Hãy chọn đầu báo',
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
          label="Chuyên mục"
          rules={[
            {
              required: true,
              message: 'Hãy chọn chuyên mục',
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
          name="schedules"
          label="Lịch"
          rules={[
            {
              required: true,
              message: 'Hãy chọn lịch chạy',
            },
            {
              validator: scheduleValidator,
            },
          ]}
        >
          {renderSelectTag(record.schedules)}
        </Form.Item>
        {/* <Form.Item name="turnOnSchedule" label="Bật lịch" valuePropName="checked">
          <Switch />
        </Form.Item> */}
        <Form.Item
          name="autoSynthetic"
          label="Tự động tổng hợp"
          valuePropName="checked"
        >
          <Checkbox />
        </Form.Item>
        <Form.Item
          name="turnOnSchedule"
          label="Bật lịch chạy"
          valuePropName="checked"
        >
          <Checkbox />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SourceForm;
