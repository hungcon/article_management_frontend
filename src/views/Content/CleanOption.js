/* eslint-disable no-restricted-syntax */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-shadow */
import React, { useState, useEffect } from 'react';
import {
  Row, Col, Button, Breadcrumb,
} from 'antd';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import {
  useParams,
} from 'react-router-dom';
import Highlighter from './Highlighter';
import ReplaceForm from './Form/ReplaceForm';
import ReplaceAllForm from './Form/ReplaceAllForm';
import { init } from '../../common/init';

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


export default function CleanOption() {
  // console.log(record);
  const { cleanArticleId } = useParams();
  const [cleanArticle, setCleanArticle] = useState(
    {
      loanwords: [],
      abbreviations: [],
      article: {
        text: '',
      },
      cleanText: '',
    },
  );

  useEffect(() => {
    let ignore = false;
    async function fetchData() {
      const cleanArticle = (await axios.post('http://localhost:8000/get-clean-article-by-id', { cleanArticleId })).data;

      if (!ignore) {
        setCleanArticle(cleanArticle);
      }
    }
    fetchData();
    return () => { ignore = true; };
  }, [cleanArticleId]);
  const classes = useStyles();
  const [replaceVisible, setReplaceVisible] = useState(false);
  const [replaceAllVisible, setReplaceAllVisible] = useState(false);
  const [word, setWord] = useState(init.INIT_WORD_INFO);
  const [selectWord, setSelectWord] = useState(init.INIT_WORD_SELECT);

  const showReplaceOption = (text, position) => {
    const wordInfo = {
      position,
      machineNormalize: text,
      peopleNormalize: '',
    };
    setWord(wordInfo);
    setReplaceVisible(true);
  };

  const showReplaceAllForm = (record) => {
    const { loanwords, abbreviations } = record;
    const loanwordsSelect = [];
    const abbreviationsSelect = [];
    for (const loanword of loanwords) {
      loanwordsSelect.push(loanword.words);
    }

    for (const abbreviation of abbreviations) {
      abbreviationsSelect.push(abbreviation.words);
    }
    const selectWordValue = {
      loanwordsSelect,
      abbreviationsSelect,
    };
    setSelectWord(selectWordValue);
    setReplaceAllVisible(true);
  };

  // const replaceBetween = (string, start, end, what) => string.substring(0, start)
  //  + what + string.substring(end);

  const onReplaceCreate = async (values) => {
    // console.log(values);
    // console.log(replaceBetween(
    //   record.cleanText,
    //   values.position,
    //   values.position + values.machineNormalize.length,
    //   values.peopleNormalize,
    // ));
    // const cleanArticle = (await axios.post('http://localhost:8000/get-clean-article-by-id', { cleanArticleId: record._id })).data;
    // eslint-disable-next-line no-unused-vars
    let normarlizeInfo;
    cleanArticle.loanwords.forEach((loanword) => {
      loanword.normalize.forEach((wordInfo) => {
        if (wordInfo.position === values.position) {
          normarlizeInfo = {
            type: 'Loanword',
            id: wordInfo._id,
          };
        }
      });
    });

    cleanArticle.abbreviations.forEach((abbreviation) => {
      abbreviation.normalize.forEach((wordInfo) => {
        if (wordInfo.position === values.position) {
          normarlizeInfo = {
            type: 'Abbreviation',
            id: wordInfo._id,
          };
        }
      });
    });
    console.log(normarlizeInfo);
    if (normarlizeInfo.type === 'Abbreviation') {
      console.log('a');
    } else {
      console.log('b');
    }
    setReplaceVisible(false);
  };

  const onReplaceAllCreate = (values, type, secondWord) => {
    console.log(values);
    console.log(type);
    console.log(secondWord);
    setSelectWord(init.INIT_WORD_SELECT);
    setReplaceAllVisible(false);
  };

  const showArticleText = (record) => {
    const { loanwords, abbreviations } = record;
    const highlights = [];
    for (const loanword of loanwords) {
      highlights.push(loanword.words);
    }
    for (const abbreviation of abbreviations) {
      highlights.push(abbreviation.words);
    }
    return (
      <Highlighter
        style={{ fontFamily: 'Montserrat' }}
        highlightStyle={{ backgroundColor: 'rgba(0, 128, 0, 0.42)' }}
        searchWords={highlights}
        autoEscape
        textToHighlight={record.article.text.trim().replace(/\./, '.\n\n')}
        onPressHighlightedText={(text, position) => console.log(`highlighted text that click: ${text}, ${position}`)}
      />
    );
  };

  const showCleanText = (record) => {
    const { loanwords, abbreviations } = record;
    const highlights = [];
    for (const loanword of loanwords) {
      highlights.push(loanword.normalize[0].peopleNormalize);
    }
    for (const abbreviation of abbreviations) {
      highlights.push(abbreviation.normalize[0].peopleNormalize);
    }
    return (
      <Highlighter
        style={{ fontFamily: 'Montserrat' }}
        highlightStyle={{ backgroundColor: 'rgba(255, 255, 0, 0.43)' }}
        searchWords={highlights}
        autoEscape
        textToHighlight={record.cleanText.replace(/\s\s+/g, ' ')
          .replace(/\t/g, ' ')
          .replace(/\./g, '.\n\n')}
        onPressHighlightedText={(text, position) => showReplaceOption(text, position)}
      />
    );
  };

  return (
    <div className={classes.root}>
      <Breadcrumb style={{ marginBottom: 10 }}>
        <Breadcrumb.Item>
          Dashboard
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <a href="/dashboard/clean-text">Clean Text</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          Clean Option
        </Breadcrumb.Item>
      </Breadcrumb>
      <Col span={24}>
        <Button
          onClick={() => showReplaceAllForm(cleanArticle)}
          style={{ marginBottom: '15px' }}
        >
          Replace All
        </Button>
      </Col>
      <Row gutter={16}>
        <Col span={12}>
          {showArticleText(cleanArticle)}
        </Col>
        <Col span={12}>
          {showCleanText(cleanArticle)}
        </Col>
      </Row>
      <ReplaceForm
        visible={replaceVisible}
        onCreate={onReplaceCreate}
        word={word}
        onCancel={() => setReplaceVisible(false)}
      />
      <ReplaceAllForm
        visible={replaceAllVisible}
        onCreate={onReplaceAllCreate}
        selectWord={selectWord}
        onCancel={() => setReplaceAllVisible(false)}
      />
    </div>
  );
}
