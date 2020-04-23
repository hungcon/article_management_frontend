/* eslint-disable no-restricted-syntax */
/* eslint-disable import/no-named-as-default */
/* eslint-disable import/no-named-as-default-member */
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Row, Col, Typography } from 'antd';
import Highcharts from 'highcharts/highstock';
import PieChart from 'highcharts-react-official';
import axios from 'axios';

const { Title } = Typography;


const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    maxHeight: 440,
    fontFamily: 'Montserrat',
  },
  chart: {
    marginBottom: '15px',
  },
}));
export default function Statistics() {
  const classes = useStyles();
  const [listDataArticle, setListDataArticle] = useState();

  useEffect(() => {
    let ignore = false;

    async function fetchData() {
      const listConfig = (await axios.post('http://localhost:8000/get-configuration')).data;
      if (!ignore) {
        const { statisticResult } = (await axios.post('http://localhost:8000/statistic', { listConfig })).data;
        const properties = [];
        const listArticlesInfo = [];
        for (const web of statisticResult) {
          const pro = web.website;
          if (!properties.some((prop) => prop.name === pro.name)) {
            const obj = { website: pro };
            const series = [];
            const listInfo = statisticResult.filter((x) => x.website.name === pro.name);
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
            },
            title: {
              text: articleInfo.website.name,
            },
            tooltip: {
              pointFormat: '{series.name}: <b>{point.y} docs</b>',
            },
            series: [
              {
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

  return (
    <div className={classes.root}>
      <Title level={4}>Statistic number article crawled by website and category</Title>
      {
      !listDataArticle ? 'Loading chart...' : (
        <Row gutter={16}>
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
