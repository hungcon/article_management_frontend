/* eslint-disable radix */
/* eslint-disable no-restricted-syntax */
/* eslint-disable import/no-named-as-default */
/* eslint-disable import/no-named-as-default-member */
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Row, Col, Card, Breadcrumb, Progress,
} from 'antd';
import { CheckCircleOutlined, WarningOutlined } from '@ant-design/icons';
import Highcharts from 'highcharts/highstock';
import PieChart from 'highcharts-react-official';
import axios from 'axios';

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
      <div>
        {
          !listNumberArticle ? 'Loading info...' : (
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
                    Valid:
                    {' '}
                    {website.valid}
                    <br />
                    Invalid:
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
          )
        }

      </div>
      {
      !listDataArticle ? 'Loading chart...' : (
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
