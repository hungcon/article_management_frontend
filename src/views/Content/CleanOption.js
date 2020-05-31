/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-param-reassign */
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
// import Highlighter from './Highlighter';
// import ReplaceForm from './Form/ReplaceForm';
// import ReplaceAllForm from './Form/ReplaceAllForm';
// import { init } from '../../common/init';
import { message } from '../../common';
import openNotification from '../Notifications';

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


export default function CleanOption(props) {
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
  const [reload, setReload] = useState(false);
  // const [sentences, setSentences] = useState();
  // const [replaceVisible, setReplaceVisible] = useState(false);
  // const [replaceAllVisible, setReplaceAllVisible] = useState(false);
  // const [word, setWord] = useState(init.INIT_WORD_INFO);
  // const [selectWord, setSelectWord] = useState(init.INIT_WORD_SELECT);

  useEffect(() => {
    let ignore = false;
    async function fetchData() {
      const cleanArticle = (await axios.post('http://localhost:8000/get-clean-article-by-id', { cleanArticleId })).data;
      if (!ignore) {
        setCleanArticle(cleanArticle);
        // const { data } = await axios.post('http://baonoi-tts.vbeecore.com/api/v1/tts', {
        //   function_call_invoke:
        //   'arn:aws:lambda:ap-southeast-1:279297658413:function:serverless-split-release-hello',
        //   text: cleanArticle.article.text,
        //   input_text: 'A',
        // });
        // const listSentencesStr = JSON.parse(data.message);
        // const listSentencesObj = [];
        // // set Id
        // for (let i = 0; i < cleanArticle.sentences.length; i += 1) {
        //   const sentenceObj = {
        //     text: listSentencesStr[i],
        //     _id: cleanArticle.sentences[i]._id,
        //     allophones: cleanArticle.sentences[i].allophones,
        //   };
        //   listSentencesObj.push(sentenceObj);
        // }
        // setSentences(listSentencesObj);
      }
    }
    fetchData();
    return () => { ignore = true; };
  }, [cleanArticleId, reload]);


  const showReplaceOption = (word) => {
    // const wordInfo = {
    //   sentenceId: id,
    //   allophones,
    //   type,
    //   position,
    //   orig: text,
    //   machineNormalize: normalize,
    //   peopleNormalize: '',
    // };
    // setWord(wordInfo);
    console.log(word);
    // setReplaceVisible(true);
  };

  const onReplaceCreate = async (values) => {
    const {
      orig,
      type,
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
        call_back: `https://ef4739fcbeeb.ngrok.io/get-allophones-of-words?sentenceId=${sentenceId}&position=${position}&orig=${orig}&type=${type}`,
      },
    });
    console.log(data);
    setTimeout(() => {
      setReload(!reload);
      openNotification('success', message.NORMALIZE_SUCCESS);
    }, 3000);

    // setReplaceVisible(false);
  };

  // const onReplaceAllCreate = (values, type, secondWord) => {
  //   console.log(values);
  //   console.log(type);
  //   console.log(secondWord);
  //   setSelectWord(init.INIT_WORD_SELECT);
  //   setReplaceAllVisible(false);
  // };

  const showCleanText = (cleanArticle) => {
    const { sentences } = cleanArticle;
    return sentences.map((sentence) => {
      const { allophones } = sentence;
      const $ = cheerio.load(allophones, { xmlMode: true, decodeEntities: false });
      const $phrase = cheerio.load($.html($('phrase')));
      const words = [];
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
      $phrase('body').children().each(function () {
        $(this).children().each(function () {
          if ($(this).get(0).name === 'mtu') {
            // console.log($(this).attr('orig'));
            // words.push($(this).text().trim().replace(/\s+/g, ' '));
            if ($(this).find('mtu').length !== 0) {
              $(this).children().each(function () {
                if ($(this).get(0).name === 'mtu') {
                  words.push($(this).text().trim().replace(/\s+/g, ' '));
                } else {
                  words.push($(this).text().trim().replace(/\s+/g, ' '));
                }
              });
            } else {
              words.push($(this).text().trim().replace(/\s+/g, ' '));
            }
          } else {
            words.push($(this).text().trim().replace(/\s+/g, ' '));
          }
        });
      });
      return (
        <div key={sentence.sentenceId} style={{ padding: 10 }}>
          {words.map((word, index) => {
            if (highlights.includes(word)) {
              return (
                // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                <span
                  key={index}
                  style={{
                    color: 'white',
                    background: '#208ef0',
                    paddingLeft: '4px',
                    margin: '4px',
                    fontWeight: 400,
                  }}
                >
                  {word}
                  {' '}
                </span>
              );
            }
            return (
              <span key={index}>
                {word}
                {' '}
              </span>
            );
          })}
        </div>
      );
    });
  };


  const showArticleText = (cleanArticle) => {
    const { sentences } = cleanArticle;
    return sentences.map((sentence) => {
      const { allophones } = sentence;
      const $ = cheerio.load(allophones, { xmlMode: true, decodeEntities: false });
      const $phrase = cheerio.load($.html($('phrase')));
      const words = [];
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
        highlights.push(loanword.orig);
      }
      for (const abbreviation of listAbbreviations) {
        highlights.push(abbreviation.orig);
      }
      $phrase('body').children().each(function () {
        $(this).children().each(function () {
          if ($(this).get(0).name === 'mtu') {
            if ($(this).find('mtu').length !== 0) {
              $(this).children().each(function () {
                if ($(this).get(0).name === 'mtu') {
                  const word = {
                    type: $(this).attr('nsw'),
                    word: $(this).attr('orig'),
                  };
                  words.push(word);
                } else {
                  const word = {
                    type: 'normal',
                    word: $(this).text().trim().replace(/\s+/g, ' '),
                  };
                  words.push(word);
                  // words.push($(this).text().trim().replace(/\s+/g, ' '));
                }
              });
            } else {
              const word = {
                type: $(this).attr('nsw'),
                word: $(this).attr('orig'),
              };
              words.push(word);
            }
          } else {
            const word = {
              type: 'normal',
              word: $(this).text().trim().replace(/\s+/g, ' '),
            };
            words.push(word);
          }
        });
      });
      return (
        <div key={sentence.sentenceId} style={{ padding: 10 }}>
          {words.map((word, index) => {
            const orig = word.word;
            const { type } = word;
            if (highlights.includes(word.word)) {
              return (
                // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                <span
                  key={index}
                  style={{
                    color: 'white',
                    background: '#ee4035',
                    margin: '4px',
                    paddingLeft: '4px',
                    fontWeight: 400,
                  }}
                  onClick={() => props.history.push(`/dashboard/clean-text/${cleanArticle._id}/${type}/${orig}`)}
                >
                  {word.word}
                  {' '}
                </span>
              );
            }
            return (
              <span key={index}>
                {word.word}
                {' '}
              </span>
            );
          })}
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
      <Row gutter={16}>
        <Col span={12}>
          {showArticleText(cleanArticle)}
        </Col>
        <Col span={12}>
          {showCleanText(cleanArticle)}
        </Col>
      </Row>
      {/* <ReplaceForm
        visible={replaceVisible}
        onCreate={onReplaceCreate}
        // word={word}
        onCancel={() => setReplaceVisible(false)}
      />
      <ReplaceAllForm
        visible={replaceAllVisible}
        onCreate={onReplaceAllCreate}
        selectWord={selectWord}
        onCancel={() => setReplaceAllVisible(false)}
      /> */}
    </div>
  );
}
