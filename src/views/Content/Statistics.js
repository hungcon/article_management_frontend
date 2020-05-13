/* eslint-disable radix */
/* eslint-disable no-restricted-syntax */
/* eslint-disable import/no-named-as-default */
/* eslint-disable import/no-named-as-default-member */
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Row, Col, Card, Breadcrumb, Progress, Statistic, Button,
} from 'antd';
import { CheckCircleOutlined, WarningOutlined, PlayCircleOutlined } from '@ant-design/icons';
import Highcharts from 'highcharts/highstock';
import PieChart from 'highcharts-react-official';
import axios from 'axios';
import openNotification from '../Notifications';
import { message } from '../../common/index';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    fontFamily: 'Montserrat',
    backgroundColor: '#F1F4F9',
    padding: '10px 10px 0 10px',

  },
  card: {
    marginBottom: '15px',
  },
  chart: {
    marginBottom: '15px',
  },
}));
export default function Statistics() {
  const classes = useStyles();
  const [listDataArticle, setListDataArticle] = useState();
  const [listNumberArticle, setListNumberArticle] = useState();
  const [queueLength, setQueueLength] = useState(0);
  const [error, setError] = useState(false);

  const reRunSchedule = () => {
    axios.post('http://localhost:8000/crawl/re-run', null, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }).then((result) => {
      console.log(result);
      if (result.data.status === 1) {
        openNotification('success', message.RERUN_SUCCESS);
      } else {
        openNotification('error', message.ERROR);
      }
    }).catch((err) => {
      console.log(err);
      openNotification('error', message.UNAUTHORIZED);
    });
  };

  useEffect(() => {
    let ignore = false;

    async function fetchData() {
      if (!ignore) {
        const { statisticResult } = (await axios.post('http://localhost:8000/statistic')).data;
        const properties = [];
        const listArticlesInfo = [];
        // Number of articles by website and category => filter by website
        for (const web of statisticResult) {
          const pro = web.website;
          // If same website
          if (!properties.some((prop) => prop.name === pro.name)) {
            const obj = { website: pro };
            const series = [];
            const listInfo = statisticResult.filter((x) => x.website.name === pro.name);
            // Combine category
            for (const info of listInfo) {
              series.push({
                category: info.category,
                num: info.num,
              });
            }
            obj.series = series;
            properties.push(pro);
            listArticlesInfo.push(obj);
          }
        }
        const listDataChart = [];
        listArticlesInfo.forEach((articleInfo) => {
          const dateSeries = [];
          articleInfo.series.forEach((category) => {
            const data = {
              y: category.num,
              name: category.category.name,
            };
            dateSeries.push(data);
          });
          const dataChart = {
            chart: {
              type: 'pie',
              backgroundColor: 'rgba(121, 174, 217, 0.18)',
            },
            title: {
              text: articleInfo.website.name,
            },
            tooltip: {
              pointFormat: '{series.name}: <b>{point.y} docs</b>',
            },
            series: [
              {
                name: 'Number of articles',
                colorByPoint: true,
                data: dateSeries,
              },
            ],
          };
          listDataChart.push(dataChart);
        });
        setListDataArticle(listDataChart);
      }
    }
    fetchData();
    return () => { ignore = true; };
  }, []);

  useEffect(() => {
    let ignore = false;

    async function fetchData() {
      if (!ignore) {
        const { statisticResult } = (await axios.post('http://localhost:8000/statistic-by-type')).data;
        const listData = [];
        for (const website of statisticResult) {
          const data = {
            name: website.website.name,
            valid: website.valid,
            invalid: website.invalid,
          };
          listData.push(data);
        }
        setListNumberArticle(listData);
      }
    }
    fetchData();
    return () => { ignore = true; };
  }, []);

  useEffect(() => {
    let ignore = false;

    async function fetchData() {
      let queueLengthReturn;
      if (!ignore) {
        const { data } = (await axios.post('http://localhost:8000/get-queue-length'));
        const queueLengthNum = data.queueLength;
        setQueueLength(queueLengthNum);
        queueLengthReturn = queueLengthNum;
      }
      return queueLengthReturn;
    }
    fetchData();
    setInterval(async () => {
      const newQueueLength = await fetchData();
      if (queueLength && queueLength !== 0 && newQueueLength && newQueueLength === queueLength) {
        setError(true);
        setQueueLength(newQueueLength);
      }
    }, 5 * 60 * 1000);
    return () => { ignore = true; };
  }, [queueLength]);


  return (
    <div className={classes.root}>
      <Breadcrumb style={{ marginBottom: 10 }}>
        <Breadcrumb.Item>
          <a href="/dashboard/configuration">Dashboard</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <a href="/dashboard/statistics">Statistic</a>
        </Breadcrumb.Item>
      </Breadcrumb>
      <div style={{ marginBottom: 15 }}>
        <Row gutter={16}>
          <Col span={4}>
            <Card>
              <Statistic
                title={!error ? 'Đang chạy' : 'Lỗi'}
                value={queueLength}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Button
              onClick={() => reRunSchedule()}
              style={{ marginRight: 10 }}
              icon={<PlayCircleOutlined />}
              type="primary"
            >
              Chạy lại lịch
            </Button>
          </Col>
        </Row>
      </div>
      { !listNumberArticle ? 'Đang tải thông tin...' : (
        <Row gutter={15}>
          {listNumberArticle.map((website) => (
            <Col
              span={4}
              key={website.name}
              className={classes.card}
            >
              <Card
                hoverable
                style={{ backgroundColor: '#a3dace2e', color: '#000' }}
              >
                <div>
                  <b style={{ fontSize: 14 }}>{website.name}</b>

                  {
                    Number.parseInt((website.valid / (website.invalid + website.valid)) * 100)
                    >= 90
                      ? <CheckCircleOutlined style={{ float: 'right', color: '#52c41a', fontSize: 14 }} />
                      : <WarningOutlined style={{ float: 'right', color: '#faad14', fontSize: 14 }} />
                    }
                </div>
                <br />
                Hợp lệ:
                {' '}
                {website.valid}
                <br />
                Không hợp lệ:
                {' '}
                {website.invalid}
                <br />
                <Progress
                  strokeColor={{
                    from: '#108ee9',
                    to: '#87d068',
                  }}
                  percent={
                      Number.parseInt((website.valid / (website.invalid + website.valid)) * 100)
                    }
                  status="active"
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}
      {
      !listDataArticle ? 'Đang tải biểu đồ...' : (
        <Row gutter={15}>
          {
          listDataArticle.map((dataChart) => (
            <Col span={8} key={dataChart.title.text} className={classes.chart}>
              <PieChart
                highcharts={Highcharts}
                options={dataChart}
              />
            </Col>
          ))
        }
        </Row>
      )
      }
    </div>
  );
}
