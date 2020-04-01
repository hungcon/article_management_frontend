/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/prop-types */
/* eslint-disable no-console */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { Select } from 'antd';

const SelectTags = ({
  children, defaultValue,
}) => {
  console.log('a');
  return (
    <Select
      mode="multiple"
      style={{ width: '100%' }}
      placeholder="Select tag"
      defaultValue={defaultValue}
    >
      {children}
    </Select>
  );
};


export default SelectTags;
