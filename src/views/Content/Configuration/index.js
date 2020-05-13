/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import { makeStyles } from '@material-ui/core/styles';
import {
  Table, Button, Switch, Modal, Breadcrumb,
} from 'antd';
import {
  ExclamationCircleOutlined, DeleteOutlined, EditOutlined, PlusCircleOutlined, PlayCircleOutlined,
} from '@ant-design/icons';
import { css } from 'emotion';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import SourceForm from '../Form/SourceForm';
import allActions from '../../../store/actions/allActions';
import MoreInfo from '../MoreInfo';
import openNotification from '../../Notifications';
import { message } from '../../../common';

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
    axios.post('http://localhost:8000/update-config', { configId, config: values }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }).then((updateResult) => {
      if (updateResult.data.status === 1) {
        dispatch(allActions.configAction.reload());
        openNotification('success', message.UPDATE_SUCCESS);
      } else {
        openNotification('error', message.ERROR);
      }
    }).catch((err) => {
      console.log(err);
      openNotification('error', message.UNAUTHORIZED);
    });
    handleCancel();
  };

  const showDeleteConfirm = (toDelete) => {
    confirm({
      title: 'Bạn có chắc chắn xoá cấu hình này không?',
      // eslint-disable-next-line react/jsx-filename-extension
      icon: <ExclamationCircleOutlined />,
      okText: 'Có',
      okType: 'danger',
      cancelText: 'Không',
      centered: true,
      async onOk() {
        axios.post('http://localhost:8000/delete-config', { configId: toDelete._id }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }).then((result) => {
          if (result.data.status === 1) {
            dispatch(allActions.configAction.reload());
            openNotification('success', message.DELETE_SUCCESS);
          } else {
            openNotification('error', message.ERROR);
          }
        }).catch((err) => {
          console.log(err);
          openNotification('error', message.UNAUTHORIZED);
        });
      },
      onCancel() {
      },
    });
  };

  const columns = [
    {
      title: 'Đầu báo',
      dataIndex: 'website',
      key: 'website',
      width: '10%',
      render: (value) => value.name,
    },
    {
      title: 'Chuyên mục',
      dataIndex: 'category',
      key: 'category',
      width: '10%',
      render: (value) => value.name,
    },
    {
      title: 'Bật lịch',
      key: 'status',
      dataIndex: 'status',
      width: '8%',
      render: (value) => {
        if (value === '01') return 'Có';
        return 'Không';
      },
    },
    {
      title: 'Loại cấu hình',
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
      title: 'Hành động',
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
            Cập nhật
          </Button>
          <Button
            danger
            onClick={() => showDeleteConfirm(record)}
            icon={<DeleteOutlined />}
          >
            Xoá
          </Button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    let ignore = false;
    async function fetchData() {
      const result = await axios.post('http://localhost:8000/get-configuration');
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

  // const runSchedule = async () => {
  //   axios.post('http://localhost:8000/crawl/run', null, {
  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem('token')}`,
  //     },
  //   }).then((result) => {
  //     if (result.data.status === 1) {
  //       openNotification('success', message.RUN_SUCCESS);
  //     } else {
  //       openNotification('error', message.ERROR);
  //     }
  //   }).catch((err) => {
  //     console.log(err);
  //     openNotification('error', message.UNAUTHORIZED);
  //   });
  // };

  // const stopSchedule = async () => {
  //   axios.post('http://localhost:8000/crawl/stop', null, {
  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem('token')}`,
  //     },
  //   }).then((result) => {
  //     if (result.data.status === 1) {
  //       openNotification('success', message.RUN_SUCCESS);
  //     } else {
  //       openNotification('error', message.ERROR);
  //     }
  //   }).catch((err) => {
  //     console.log(err);
  //     openNotification('error', message.UNAUTHORIZED);
  //   });
  // };

  return (
    <div className={classes.root}>
      <Breadcrumb style={{ marginBottom: 10 }}>
        <Breadcrumb.Item>
          Dashboard
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <a href="/dashboard/configuration">Configuration</a>
        </Breadcrumb.Item>
      </Breadcrumb>
      <Button
        onClick={() => props.history.push('/dashboard/configuration/add-config')}
        style={{ marginBottom: 15 }}
        icon={<PlusCircleOutlined />}
      >
        Thêm cấu hình
      </Button>
      {/* <Button
        type="primary"
        onClick={() => runSchedule()}
        style={{ marginLeft: 15 }}
        icon={<PlayCircleOutlined />}
      >
        Start crawl
      </Button>
      <Button
        type="danger"
        onClick={() => stopSchedule()}
        style={{ marginLeft: 15 }}
        icon={<PlayCircleOutlined />}
      >
        Stop crawl
      </Button> */}
      <Table
        className={tableCSS}
        columns={columns}
        dataSource={data}
        expandable={{
          expandedRowRender: (record) => <MoreInfo record={record} props={props} />,
        }}
        bordered
        scroll={{ y: 400 }}
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
