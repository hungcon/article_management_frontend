/* eslint-disable react/prop-types */
/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import { makeStyles } from '@material-ui/core/styles';
import {
  Table, Button, Switch, Modal,
} from 'antd';
import {
  ExclamationCircleOutlined, DeleteOutlined, EditOutlined, PlusCircleOutlined,
} from '@ant-design/icons';
import { css } from 'emotion';
import Axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import SourceForm from './Form/SourceForm';
import allActions from '../../store/actions/allActions';
import MoreInfo from './MoreInfo';
import openNotification from '../Notifications';

const { confirm } = Modal;

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    maxHeight: 440,
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

const initSource = {
  category: {
    id: 0,
    name: '',
  },
  website: {
    id: 0,
    name: '',
  },
  createdAt: 0,
  updatedAt: 0,
  articleDemoLink: '',
  status: '00',
  schedules: [
  ],
  queue: 1,
};

export default function Configuration(props) {
  const classes = useStyles();
  const data = useSelector((state) => state.config.data);
  const reload = useSelector((state) => state.config.reload);
  const dispatch = useDispatch();

  const [sourceVisible, setSourceVisible] = useState(false);
  const [source, setSource] = useState(initSource);
  const [configId, setConfigId] = useState();

  const showSourceModal = (sourceVal, configIdVal) => {
    setConfigId(configIdVal);
    setSource(sourceVal);
    setSourceVisible(true);
  };


  const handleCancel = () => {
    setSourceVisible(false);
  };

  const onCreate = async (values) => {
    console.log('Received values of form: ', values);
    const updateResult = await Axios.post('http://localhost:8000/update-config', { configId, config: values });
    if (updateResult.data.status === 1) {
      dispatch(allActions.configAction.reload());
      openNotification('success');
    } else {
      openNotification('error');
    }
    handleCancel();
  };

  const showDeleteConfirm = (toDelete) => {
    confirm({
      title: 'Are you sure delete this config?',
      // eslint-disable-next-line react/jsx-filename-extension
      icon: <ExclamationCircleOutlined />,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      centered: true,
      async onOk() {
        const result = await Axios.post('http://localhost:8000/delete-config', { configId: toDelete._id });
        if (result.data.status === 1) {
          dispatch(allActions.configAction.reload());
          openNotification('success');
        } else {
          openNotification('error');
        }
      },
      onCancel() {
      },
    });
  };

  const columns = [
    {
      title: 'Website',
      dataIndex: 'website',
      key: 'website',
      width: '10%',
      render: (value) => value.name,
      filters: [{
        text: 'VnExpress',
        value: 'VnExpress',
      },
      {
        text: 'Dân trí',
        value: 'Dân trí',
      },
      {
        text: 'Người đưa tin',
        value: 'Người đưa tin',
      },
      {
        text: 'SOHA',
        value: 'SOHA',
      },
      ],
      onFilter: (value, record) => record.website.name.indexOf(value) === 0,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: '10%',
      render: (value) => value.name,
      filters: [{
        text: 'Thế giới',
        value: 'Thế giới',
      },
      {
        text: 'Giải trí',
        value: 'Giải trí',
      },
      ],
      onFilter: (value, record) => record.category.name.indexOf(value) === 0,
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      width: '8%',
      render: (value) => {
        const checked = value === '01';
        return <Switch checked={checked} />;
      },
    },
    {
      title: 'Crawl Type',
      key: 'crawlType',
      width: '10%',
      filters: [
        {
          text: 'HTML',
          value: 'HTML',
        },
        {
          text: 'RSS',
          value: 'RSS',
        },
      ],
      onFilter: (value, record) => record.crawlType.indexOf(value) === 0,
      dataIndex: 'crawlType',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '17%',
      align: 'center',
      render: (value, record) => (
        <div>
          <Button
            onClick={() => showSourceModal(record, record._id)}
            style={{ marginRight: 10 }}
            icon={<EditOutlined />}
          >
            Update
          </Button>
          <Button
            danger
            onClick={() => showDeleteConfirm(record)}
            icon={<DeleteOutlined />}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    let ignore = false;

    async function fetchData() {
      const result = await Axios.post('http://localhost:8000/get-configuration');
      const configData = result.data;
      for (let i = 0; i < configData.length; i += 1) {
        configData[i].key = i;
      }
      if (!ignore) {
        dispatch(allActions.configAction.fetchData(configData));
      }
    }
    fetchData();
    return () => { ignore = true; };
  }, [reload, dispatch]);

  return (
    <div className={classes.root}>
      <Button
        onClick={() => props.history.push('/dashboard/configuration/add-config')}
        style={{ marginRight: 10 }}
        icon={<PlusCircleOutlined />}
      >
        Add config
      </Button>
      <Table
        className={tableCSS}
        columns={columns}
        dataSource={data}
        expandable={{
          expandedRowRender: (record) => <MoreInfo record={record} />,
        }}
        bordered
        scroll={{ y: 490 }}
      />
      <SourceForm
        visible={sourceVisible}
        onCreate={onCreate}
        onCancel={handleCancel}
        record={source}
      />
    </div>
  );
}
