/* eslint-disable func-names */
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
// import Tokenizer from 'sentence-tokenizer';
import cheerio from 'cheerio';
import Highlighter from './Highlighter';
import ReplaceForm from './Form/ReplaceForm';
import ReplaceAllForm from './Form/ReplaceAllForm';
import { init } from '../../common/init';

// const tokenizer = new Tokenizer('Chuck');
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
  highlight: {
    color: 'red',
    padding: '3px 10px',
    background: 'yellow',
    fontWeight: 600,
    margin: '0 5px',
  },
}));


export default function CleanOption() {
  // console.log(record);
  const classes = useStyles();
  const { cleanArticleId } = useParams();
  const [cleanArticle, setCleanArticle] = useState(
    {
      sentences: [],
      article: {
        text: '',
      },
    },
  );
  const [sentences, setSentences] = useState();
  const [replaceVisible, setReplaceVisible] = useState(false);
  const [replaceAllVisible, setReplaceAllVisible] = useState(false);
  const [word, setWord] = useState(init.INIT_WORD_INFO);
  const [selectWord, setSelectWord] = useState(init.INIT_WORD_SELECT);

  useEffect(() => {
    let ignore = false;
    async function fetchData() {
      const cleanArticle = (await axios.post('http://localhost:8000/get-clean-article-by-id', { cleanArticleId })).data;
      if (!ignore) {
        setCleanArticle(cleanArticle);
        const { data } = await axios.post('http://baonoi-tts.vbeecore.com/api/v1/tts', {
          function_call_invoke:
          'arn:aws:lambda:ap-southeast-1:279297658413:function:serverless-split-release-hello',
          text: cleanArticle.article.text,
          input_text: 'A',
        });
        const listSentencesStr = JSON.parse(data.message);
        const listSentencesObj = [];
        // set Id
        for (let i = 0; i < cleanArticle.sentences.length; i += 1) {
          const sentenceObj = {
            text: listSentencesStr[i],
            _id: cleanArticle.sentences[i]._id,
            allophones: cleanArticle.sentences[i].allophones,
          };
          listSentencesObj.push(sentenceObj);
        }
        setSentences(listSentencesObj);
      }
    }
    fetchData();
    return () => { ignore = true; };
  }, [cleanArticleId]);


  const showReplaceOption = (text, position, id, allophones, normalize, type) => {
    const wordInfo = {
      sentenceId: id,
      allophones,
      type,
      position,
      orig: text,
      machineNormalize: normalize,
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

  const onReplaceCreate = async (values) => {
    const {
      orig,
      type,
      machineNormalize,
      peopleNormalize, position, sentenceId,
    } = values;

    const { data } = await axios({
      method: 'POST',
      url: 'http://baonoi-tts.vbeecore.com/api/v1/tts',
      data: {
        function_call_invoke:
          'arn:aws:lambda:ap-southeast-1:279297658413:function:serverless-tts-vbee-2020-04-26-tts',
        input_text: peopleNormalize,
        rate: 1,
        voice: 'vbee-tts-voice-hn_male_manhdung_news_48k-h',
        bit_rate: '128000',
        user_id: '46030',
        app_id: '5b8776d92942cc5b459928b5',
        input_type: 'TEXT',
        request_id: 'dec0f360-959e-11ea-b171-9973230931a1',
        output_type: 'ALLOPHONES',
        call_back: `https://111586e0.ngrok.io/get-allophones-of-words?sentenceId=${sentenceId}&position=${position}&orig=${orig}&type=${type}`,
      },
    });
    console.log(data);
    setReplaceVisible(false);
  };

  const onReplaceAllCreate = (values, type, secondWord) => {
    console.log(values);
    console.log(type);
    console.log(secondWord);
    setSelectWord(init.INIT_WORD_SELECT);
    setReplaceAllVisible(false);
  };

  const getIndexOfWords = (text, words) => {
    // const listWords = text.split(' ');
    let i = 0;
    for (
      let index = text.indexOf(words);
      index >= 0;
      index = text.indexOf(words, index + 1)
    ) {
      i += 1;
    }
    // for (const word of listWords) {
    //   if (word === words) {
    //     i += 1;
    //   }
    // }
    return i;
  };


  const showArticleText = (cleanArticle) => {
    const sentences1 = cleanArticle.sentences;
    const highlights = [];
    const listLoanwords = [];
    const listAbbreviations = [];
    sentences1.forEach((sentence) => {
      const { allophones } = sentence;
      const $ = cheerio.load(allophones, { xmlMode: true, decodeEntities: false });
      const $mtu = cheerio.load($.html($('mtu')));
      $mtu('body')
        .children()
      // eslint-disable-next-line func-names
        .each(function () {
          if ($(this).attr('nsw') === 'abbreviation') {
            const abbreviation = {
              type: 'abbreviation',
              sentenceId: sentence._id,
              orig: $(this).attr('orig'),
              normalize: $(this).children().text().trim()
                .replace(/\s\s+/g, ' ')
                .replace(/\t/g, ' ')
                .replace(/\n/g, ' '),
            };
            listAbbreviations.push(abbreviation);
          }
          if ($(this).attr('nsw') === 'loanword') {
            const loanword = {
              type: 'loanword',
              sentenceId: sentence._id,
              orig: $(this).attr('orig'),
              normalize: $(this).children().text().trim()
                .replace(/\s\s+/g, ' ')
                .replace(/\t/g, ' ')
                .replace(/\n/g, ' '),
            };
            listLoanwords.push(loanword);
          }
        });
      for (const loanword of listLoanwords) {
        highlights.push(loanword.orig);
      }
      for (const abbreviation of listAbbreviations) {
        highlights.push(abbreviation.orig);
      }
    });
    const getNormalize = (text, sentenceId) => {
      let normalize = '';
      for (const loanword of listLoanwords) {
        if (loanword.orig === text.toLowerCase() && loanword.sentenceId === sentenceId) {
          normalize = loanword.normalize;
        }
      }
      for (const abbreviation of listAbbreviations) {
        if (abbreviation.orig.toLowerCase() === text.toLowerCase()
         && abbreviation.sentenceId === sentenceId) {
          normalize = abbreviation.normalize;
        }
      }
      return normalize;
    };

    const getType = (text) => {
      let type = '';
      for (const loanword of listLoanwords) {
        if (loanword.orig === text.toLowerCase()) {
          type = loanword.type;
        }
      }
      for (const abbreviation of listAbbreviations) {
        if (abbreviation.orig.toLowerCase() === text.toLowerCase()) {
          type = abbreviation.type;
        }
      }
      return type;
    };
    if (sentences) {
      return sentences.map((sentence, index) => (
        <div key={index} style={{ padding: 10 }}>
          <Highlighter
            style={{ fontFamily: 'Montserrat', fontSize: 13 }}
            highlightStyle={{ backgroundColor: 'rgba(0, 128, 0, 0.42)' }}
            searchWords={highlights}
            textToHighlight={sentence.text}
            onPressHighlightedText={
              (text, position) => showReplaceOption(text,
                getIndexOfWords(sentence.text.substring(0, position), text),
                sentence._id,
                sentence.allophones,
                getNormalize(text, sentence._id),
                getType(text))
            }
          />
        </div>
      ));
    }
    return '';
  };

  const showCleanText = (cleanArticle) => {
    const { sentences } = cleanArticle;
    return sentences.map((sentence) => {
      const { allophones } = sentence;
      const $ = cheerio.load(allophones, { xmlMode: true, decodeEntities: false });
      const $mtu = cheerio.load($.html($('mtu')));
      const listLoanwords = [];
      const listAbbreviations = [];
      $mtu('body')
        .children()
      // eslint-disable-next-line func-names
        .each(function () {
          if ($(this).attr('nsw') === 'abbreviation') {
            const abbreviation = {
              // type: 'abbreviation',
              // index,
              orig: $(this).attr('orig'),
              normalize: $(this).children().text().trim()
                .replace(/\s\s+/g, ' ')
                .replace(/\t/g, ' ')
                .replace(/\n/g, ' '),
            };
            listAbbreviations.push(abbreviation);
          }
          if ($(this).attr('nsw') === 'loanword') {
            const loanword = {
              // type: 'loanword',
              // index,
              orig: $(this).attr('orig'),
              normalize: $(this).children().text().trim()
                .replace(/\s\s+/g, ' ')
                .replace(/\t/g, ' ')
                .replace(/\n/g, ' '),
            };
            listLoanwords.push(loanword);
          }
        });
      const highlights = [];
      for (const loanword of listLoanwords) {
        highlights.push(loanword.normalize);
      }
      for (const abbreviation of listAbbreviations) {
        highlights.push(abbreviation.normalize);
      }
      // const getOrigin = (text) => {
      //   let orig = '';
      //   for (const loanword of listLoanwords) {
      //     if (loanword.orig === text) {
      //       orig = loanword.orig;
      //     }
      //   }
      //   for (const abbreviation of listAbbreviations) {
      //     if (abbreviation.orig === text) {
      //       orig = abbreviation.orig;
      //     }
      //   }
      //   return orig;
      // };
      // console.log(listLoanwords);
      // console.log(listAbbreviations);
      return (
        <div key={sentence.sentenceId} style={{ padding: 10 }}>
          <Highlighter
            style={{ fontFamily: 'Montserrat', fontSize: 13 }}
            highlightStyle={{
              color: 'red',
              padding: '3px 10px',
              background: 'yellow',
              fontWeight: 600,
              margin: '0 5px',
            }}
            searchWords={highlights}
            textToHighlight={sentence.text.trim()}
            onPressHighlightedText={
              (text) => console.log(text, sentence._id)
            }
          />
        </div>
      );
    });
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
