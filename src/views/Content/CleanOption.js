import React from 'react';
import { Descriptions, Input, Button } from 'antd';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    maxHeight: 440,
    fontFamily: 'Montserrat',
  },
  input: {
    width: 100,
    marginRight: 15,
    marginLeft: 15,
  },
  inputAll: {
    width: 200,
    marginTop: 15,
    marginRight: 15,
  },
  positions: {
    display: 'relative',
    float: 'left',
    width: '50%',
  },
  positon: {
    marginTop: 15,
  },
  replaceAll: {
    display: 'relative',
    float: 'left',
    width: '50%',
  },
}));

export default function CleanOption({ record }) {
  const classes = useStyles();
  console.log(record);
  const onChange = (event, position) => {
    console.log(event.target.value);
    console.log(position);
  };

  const replaceOne = (position) => {
    console.log(position);
    console.log('rp one');
  };

  const replaceAll = () => {
    console.log('rp all');
  };
  return (
    <div className={classes.root}>
      <Descriptions bordered title="Option">
        <Descriptions.Item label="sars">
          <div className={classes.positions}>
            <div className={classes.positon}>
              Positions: 1
              <br />
              Machine: sát x
              <br />
              <div>
                People:
                <Input
                  className={classes.input}
                // eslint-disable-next-line no-restricted-globals
                  onChange={() => onChange(event, 1)}
                />
                <Button type="primary" onClick={() => replaceOne(1)}>Replace</Button>
              </div>
            </div>
            <div className={classes.positon}>
              Positions: 2
              <br />
              Machine: sát x
              <br />
              <div>
                People:
                <Input
                  className={classes.input}
                // eslint-disable-next-line no-restricted-globals
                  onChange={() => onChange(event, 2)}
                />
                <Button type="primary" onClick={() => replaceOne(2)}>Replace</Button>
              </div>
            </div>
            <div className={classes.positon}>
              Positions: 3
              <br />
              Machine: sát x
              <br />
              <div>
                People:
                <Input
                  className={classes.input}
                // eslint-disable-next-line no-restricted-globals
                  onChange={() => onChange(event, 3)}
                />
                <Button type="primary" onClick={() => replaceOne(3)}>Replace</Button>
              </div>
            </div>
            <div className={classes.positon}>
              Positions: 4
              <br />
              Machine: sát x
              <br />
              <div>
                People:
                <Input
                  className={classes.input}
                  // eslint-disable-next-line no-restricted-globals
                  onChange={() => onChange(event, 4)}
                />
                <Button type="primary" onClick={() => replaceOne(4)}>Replace</Button>
              </div>
            </div>
          </div>
          <div className={classes.replaceAll}>
            <Input className={classes.inputAll} />
            <Button type="primary" onClick={replaceAll}>Replace All</Button>
          </div>
        </Descriptions.Item>

      </Descriptions>
    </div>
  );
}
