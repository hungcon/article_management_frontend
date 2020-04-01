/* eslint-disable no-console */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable import/no-named-as-default */
/* eslint-disable import/no-named-as-default-member */
/* eslint-disable no-shadow */
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import CanvasJSReact from '../../lib/canvasjs.react';
import styles from '../../assets/styles/chartStyles';

const { CanvasJSChart } = CanvasJSReact;

const currencies = [
  {
    value: 'system_log',
    label: 'Service 1',
  },
  {
    value: 'system_log_2',
    label: 'Service 2',
  },
  {
    value: 'system_log_3',
    label: 'Service 3',
  },
  {
    value: 'system_log_4',
    label: 'Service 4',
  },
];

const data = {
  title: {
    text: 'Log Column Chart',
  },
  data: [
    {
    // Change type to "doughnut", "line", "splineArea", etc.
      type: 'column',
      dataPoints: [
        { label: 'Apple', y: 10 },
        { label: 'Orange', y: 15 },
        { label: 'Banana', y: 25 },
        { label: 'Mango', y: 30 },
        { label: 'Grape', y: 28 },
      ],
    },
  ],
};

const data1 = {
  exportEnabled: true,
  animationEnabled: true,
  title: {
    text: 'Log Pie Chart',
  },
  data: [{
    type: 'pie',
    startAngle: 75,
    toolTipContent: '<b>{label}</b>: {y}%',
    showInLegend: 'true',
    legendText: '{label}',
    indexLabelFontSize: 16,
    indexLabel: '{label} - {y}%',
    dataPoints: [
      { y: 18, label: 'Direct' },
      { y: 49, label: 'Organic Search' },
      { y: 9, label: 'Paid Search' },
      { y: 5, label: 'Referral' },
      { y: 19, label: 'Social' },
    ],
  }],
};

const useStyles = makeStyles(styles);

export default function LogChart() {
  const classes = useStyles();
  const [services, setServices] = useState('system_log');
  const [opt, setOpt] = useState();

  const handleServiceChange = (event) => {
    setServices(event.target.value);
  };

  useEffect(() => {
    const data = {
      service: services,
    };
    axios.post('http://localhost:4000/get_log', data)
      .then((res) => {
        const logTime = [];
        res.data.forEach((tempLog) => {
          logTime.push(tempLog[0]);
        });
        logTime.push(1585039037000);
        logTime.push(1585039037000);
        logTime.push(1585039037000);
        logTime.push(1585039037000);
        logTime.push(1585039037000);
        logTime.push(1585039037000);
        logTime.push(1600936637000);
        logTime.push(1600936637000);
        logTime.push(1600936637000);
        logTime.push(1600936637000);
        logTime.push(1600936637000);
        logTime.push(1600936637000);
        logTime.push(1600936637000);
        logTime.push(1600936637000);
        logTime.push(1600936637000);
        logTime.push(1600936637000);
        logTime.push(1600936637000);

        const count = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        logTime.forEach((time) => {
          const date = new Date(time);
          count[date.getMonth()] += 1;
        });
        const dataPoints = [];
        for (let j = 0; j < count.length; j += 1) {
          const tempData = {
            x: new Date(2020, j), y: count[j],
          };
          dataPoints.push(tempData);
        }
        setOpt({
          animationEnabled: true,
          title: {
            text: 'Log Chart',
          },
          axisX: {
            valueFormatString: 'MMM',
          },
          axisY: {
            title: 'Requested number',
            prefix: '',
            includeZero: true,
          },
          data: [{
            yValueFormatString: '$#,###',
            xValueFormatString: 'MMMM',
            type: 'spline',
            dataPoints,
          }],
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [services]);

  return (
    <Grid container className={classes.root}>
      <Grid item xs={12}>
        <TextField
          className={classes.filter}
                // label="List Services"
          variant="outlined"
          select
          onChange={handleServiceChange}
          value={services}
          SelectProps={{
            native: true,
          }}
        >
          {currencies.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={4}>
        <CanvasJSChart options={opt} />
      </Grid>
      <Grid item xs={4}>
        <CanvasJSChart options={data} />
      </Grid>
      <Grid item xs={4}>
        <CanvasJSChart options={data1} />
      </Grid>
      <Grid item xs={4}>
        <CanvasJSChart options={opt} />
      </Grid>
      <Grid item xs={4}>
        <CanvasJSChart options={data} />
      </Grid>
      <Grid item xs={4}>
        <CanvasJSChart options={data1} />
      </Grid>
    </Grid>
  );
}
