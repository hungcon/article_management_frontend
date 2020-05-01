/* eslint-disable no-underscore-dangle */
/* eslint-disable no-shadow */
import React, { useState } from 'react';
import {
  Descriptions, Input, Button, Typography, Row, Col,
} from 'antd';
import { makeStyles } from '@material-ui/core/styles';
import Highlighter from './Highlighter';
import ReplaceForm from './Form/ReplaceForm';

const { Text } = Typography;
const { Search } = Input;

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    fontFamily: 'Montserrat',
  },
  input: {
    width: 250,
  },
  inputAll: {
    width: 150,
    margin: '0 auto',
  },
  words: {
    float: 'left',
    width: '10%',
  },
  positions: {
    float: 'left',
    width: '60%',
  },
  replaceAll: {
    float: 'left',
    width: '30%',
  },
  table: {
    display: 'table',
    width: '100%',
  },
  row: {
    display: 'table-row',
  },
  cell: {
    display: 'table-cell',
  },
  cellPosition: {
    display: 'table-cell',
    width: 100,
  },
}));

export default function CleanOption({ record }) {
  const classes = useStyles();
  const [replaceVisible, setReplaceVisible] = useState(false);

  const showReplaceOption = (text, position) => {
    setReplaceVisible(true);
    console.log(position);
    console.log(text);
  };
  const replaceOne = (value, position) => {
    console.log(position);
    console.log(value);
  };

  const replaceAll = () => {
    console.log('rp all');
  };

  const onReplaceCreate = (values) => {
    console.log(values);
  };

  const showArticleText = (record) => {
    const { loanwords, abbreviations } = record;
    const highlights = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const loanword of loanwords) {
      highlights.push(loanword.words);
    }
    // eslint-disable-next-line no-restricted-syntax
    for (const abbreviation of abbreviations) {
      highlights.push(abbreviation.words);
    }
    return (
      <Highlighter
        style={{ fontFamily: 'Montserrat' }}
        highlightStyle={{ backgroundColor: 'rgba(0, 128, 0, 0.42)' }}
        searchWords={highlights}
        autoEscape
        textToHighlight={record.articleId.text.toLowerCase()
          .replace(/\n/g, ' ')
          .replace(/\s\s+/g, ' ')
          .trim()}
          // onPressNormalText={() => console.log('normal text is clickeddd!')}
        onPressHighlightedText={(text, position) => console.log(`highlighted text that click: ${text}, ${position}`)}
      />
    );
  };

  const showCleanText = (record) => {
    const { loanwords, abbreviations } = record;
    const highlights = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const loanword of loanwords) {
      highlights.push(loanword.peopleClean);
    }
    // eslint-disable-next-line no-restricted-syntax
    for (const abbreviation of abbreviations) {
      highlights.push(abbreviation.peopleClean);
    }
    return (
      <Highlighter
        style={{ fontFamily: 'Montserrat' }}
        highlightStyle={{ backgroundColor: 'rgba(255, 255, 0, 0.43)' }}
        searchWords={highlights}
        autoEscape
        textToHighlight={record.cleanText}
          // onPressNormalText={() => console.log('normal text is clickeddd!')}
        onPressHighlightedText={(text, position) => showReplaceOption(text, position)}
      />
    );
  };

  return (
    <div className={classes.root}>
      <Row gutter={16}>
        <Col span={12}>
          {showArticleText(record)}
        </Col>
        <Col span={12}>
          {showCleanText(record)}
        </Col>
      </Row>
      <Descriptions bordered title="Option">
        <Descriptions.Item label="Loanwords" span={3}>
          {record.loanwords.map((loanword) => (
            <Row gutter={16} key={loanword._id}>
              <Col className={classes.words} span={2}>
                {loanword.words}
              </Col>
              <Col className={classes.positions} span={14}>
                {loanword.positions.map((position) => (
                  <div className={classes.table} key={position}>
                    <div className={classes.row}>
                      <div className={classes.cellPosition}>Position:</div>
                      <div className={classes.cell}>Machine normalize:</div>
                      <div className={classes.cell}>People normalize:</div>
                    </div>
                    <div className={classes.row}>
                      <div className={classes.cellPosition}>{position}</div>
                      <div className={classes.cell}>
                        <Text mark>{loanword.machineClean}</Text>
                      </div>
                      <div className={classes.cell}>
                        <Search
                          className={classes.input}
                          enterButton="Replace"
                          defaultValue={loanword.peopleClean}
                          onSearch={(value) => replaceOne(value, position)}
                        />
                      </div>
                    </div>
                  </div>

                ))}
              </Col>
              <Col className={classes.replaceAll} span={8}>
                <Input className={classes.inputAll} />
                <Button type="primary" onClick={replaceAll}>Replace All</Button>
              </Col>
            </Row>
          ))}
        </Descriptions.Item>
        <Descriptions.Item label="Abbreviations" span={3}>
          {record.abbreviations.map((abbreviation) => (
            <Row gutter={16} key={abbreviation._id}>
              <Col className={classes.words} span={2}>
                {abbreviation.words}
              </Col>
              <Col className={classes.positions} span={14}>
                {abbreviation.positions.map((position) => (
                  <div className={classes.table} key={position}>
                    <div className={classes.row}>
                      <div className={classes.cellPosition}>Position:</div>
                      <div className={classes.cell}>Machine normalize:</div>
                      <div className={classes.cell}>People normalize:</div>
                    </div>
                    <div className={classes.row}>
                      <div className={classes.cellPosition}>{position}</div>
                      <div className={classes.cell}>
                        <Text mark>{abbreviation.machineClean}</Text>
                      </div>
                      <div className={classes.cell}>
                        <Search
                          className={classes.input}
                          enterButton="Replace"
                          defaultValue={abbreviation.peopleClean}
                          onSearch={(value) => replaceOne(value, position)}
                        />
                      </div>
                    </div>
                  </div>

                ))}
              </Col>
              <Col className={classes.replaceAll} span={8}>
                <Input className={classes.inputAll} />
                <Button type="primary" onClick={replaceAll}>Replace All</Button>
              </Col>
            </Row>
          ))}
        </Descriptions.Item>
      </Descriptions>
      <ReplaceForm
        visible={replaceVisible}
        onCreate={onReplaceCreate}
        onCancel={() => setReplaceVisible(false)}
      />
    </div>
  );
}
