/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import {
  Modal, Form, Input, Select,
} from 'antd';

const { Option } = Select;


const ReplaceAllForm = ({
  visible, onCreate, onCancel, selectWord,
}) => {
  const typeData = ['Loanwords', 'Abbreviations'];
  const wordData = {
    Loanwords: selectWord.loanwordsSelect,
    Abbreviations: selectWord.abbreviationsSelect,
  };
  const [type, setType] = useState();
  const [words, setWords] = useState(wordData[typeData[0]]);
  const [secondWord, setSecondWord] = useState(wordData[typeData[0]][0]);

  const [form] = Form.useForm();
  useEffect(() => () => {
    form.resetFields();
  });

  const handleTypeChange = (value) => {
    setType(value);
    setWords(wordData[value]);
    setSecondWord(wordData[value][0]);
  };

  const onSecondWordChange = (value) => {
    setSecondWord(value);
  };
  return (
    <Modal
      forceRender
      style={{ fontFamily: 'Montserrat' }}
      visible={visible}
      title="Replace Option"
      okText="Replace"
      cancelText="Cancel"
      onCancel={() => {
        onCancel();
        setType();
        setWords([]);
        setSecondWord([]);
      }}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onCreate(values, type, secondWord);
            setType();
            setWords([]);
            setSecondWord([]);
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
        }}
      >

        <Form.Item
          label="Type"
        >
          <Select
            style={{ width: 235 }}
            value={type}
            onChange={handleTypeChange}
          >
            {typeData.map((typeVal) => (
              <Option key={typeVal}>{typeVal}</Option>
            ))}
          </Select>

          <Select
            style={{ width: 235 }}
            value={secondWord}
            onChange={onSecondWordChange}
          >
            {words.map((word) => (
              <Option key={word}>{word}</Option>
            ))}
          </Select>

        </Form.Item>
        <Form.Item
          name="peopleNormalize"
          label="Replace with"
          rules={[
            {
              required: true,
              message: 'Please input normalize word',
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ReplaceAllForm;
