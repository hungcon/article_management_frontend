/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-param-reassign */
/* eslint-disable func-names */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-shadow */
import React, { useState, useEffect } from 'react';
import {
  Row, Col, Breadcrumb, Button,
} from 'antd';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import {
  useParams,
} from 'react-router-dom';
// import Tokenizer from 'sentence-tokenizer';
import cheerio from 'cheerio';


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
  const [audio, setAudio] = useState();
  useEffect(() => {
    let ignore = false;
    async function fetchData() {
      const cleanArticle = (await axios.post('http://localhost:8000/get-clean-article-by-id', { cleanArticleId })).data;
      if (!ignore) {
        setCleanArticle(cleanArticle);
        setAudio(cleanArticle.linkAudio);
      }
    }
    fetchData();
    return () => { ignore = true; };
  }, [cleanArticleId]);

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

  const synthetic = async () => {
    const { data } = await axios.post('http://localhost:8000/synthetic-article', { cleanArticleId });
    console.log(data);
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
        <Col span={24}>
          {cleanArticle.linkAudio && (
            <audio controls style={{ width: 650 }}>
              <source src={`${audio}`} />
            </audio>
          )}
        </Col>
      </Row>
      <Button type="primary" onClick={synthetic}>
        Tổng hợp
      </Button>
      <Row gutter={16}>
        <Col span={12}>
          {showArticleText(cleanArticle)}
        </Col>
        <Col span={12}>
          {showCleanText(cleanArticle)}
        </Col>
      </Row>
    </div>
  );
}
