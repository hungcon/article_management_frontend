import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Table, Button, Breadcrumb, Modal, Form, Input,
} from 'antd';
import {
  EditOutlined, DeleteOutlined, PlusCircleOutlined, ExclamationCircleOutlined,
} from '@ant-design/icons';
import { css } from 'emotion';

const { confirm } = Modal;

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    maxHeight: 440,
    fontFamily: 'Montserrat',
  },
}));


const tableCSS = css({
  backgroundColor: 'white',
  '& table': {
    borderCollapse: 'collapse',
  },
  '& thead > tr > th': {
    backgroundColor: '#33b35a',
    color: '#FFF',
    fontWeight: 'bold',
  },
});

const dataSource = [
  {
    key: '1',
    _id: '1',
    name: 'Dân trí',
  },
  {
    key: '2',
    _id: '3',
    name: 'VnExpress',
  },
];


export default function ListWebsite() {
  const classes = useStyles();
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  const onCancel = () => {
    setVisible(false);
  };

  const showWebsiteModal = () => {
    setVisible(true);
  };

  const showDeleteConfirm = () => {
    confirm({
      title: 'Are you sure delete this website?',
      // eslint-disable-next-line react/jsx-filename-extension
      icon: <ExclamationCircleOutlined />,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      centered: true,
      async onOk() {
        console.log('ok');
      },
      onCancel() {
      },
    });
  };

  useEffect(() => () => {
    form.resetFields();
  });

  const columns = [
    {
      title: 'ID',
      width: '10%',
      dataIndex: '_id',
      key: '_id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      width: '70%',
      key: 'name',
    },
    {
      title: 'Action',
      witdh: '20%',
      render: (value, record) => (
        <div>
          <Button
            onClick={() => showWebsiteModal('update', { website: 'abc' })}
            style={{ marginRight: 10 }}
            icon={<EditOutlined />}
          >
            Update
          </Button>
          <Button
            danger
            onClick={() => showDeleteConfirm()}
            icon={<DeleteOutlined />}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];
  return (
    <div className={classes.root}>
      <Breadcrumb style={{ marginBottom: 10 }}>
        <Breadcrumb.Item>
          Dashboard
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <a href="/dashboard/list-website">List Website</a>
        </Breadcrumb.Item>
      </Breadcrumb>
      <Button
        onClick={() => showWebsiteModal('add', {})}
        style={{ marginBottom: 15 }}
        icon={<PlusCircleOutlined />}
      >
        Add website
      </Button>
      <Table className={tableCSS} dataSource={dataSource} columns={columns} />
      <Modal
        forceRender
        style={{ fontFamily: 'Montserrat' }}
        visible={visible}
        title="Website"
        okText="Update"
        cancelText="Cancel"
        onCancel={onCancel}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              form.resetFields();
              console.log(values);
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
            name="name"
            label="Website Name"
            rules={[
              {
                required: true,
                message: 'Please input website name',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
