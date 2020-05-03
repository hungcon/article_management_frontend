/* eslint-disable no-underscore-dangle */
/* eslint-disable no-shadow */
import React, { useState } from 'react';
import {
  Row, Col,
} from 'antd';
import { makeStyles } from '@material-ui/core/styles';
import Highlighter from './Highlighter';
import ReplaceForm from './Form/ReplaceForm';

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
  console.log(record);
  const classes = useStyles();
  const [replaceVisible, setReplaceVisible] = useState(false);
  const [word, setWord] = useState({ position: 0, machineClean: '', peopleClean: '' });

  const showReplaceOption = (text, position) => {
    const wordInfo = {
      position,
      machineClean: text,
      peopleClean: '',
    };
    setWord(wordInfo);
    setReplaceVisible(true);
  };

  const onReplaceCreate = (values) => {
    console.log(values);
    setReplaceVisible(false);
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
      <ReplaceForm
        visible={replaceVisible}
        onCreate={onReplaceCreate}
        word={word}
        onCancel={() => setReplaceVisible(false)}
      />
    </div>
  );
}
