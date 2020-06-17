/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-param-reassign */
/* eslint-disable func-names */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-shadow */
import React, { useState, useEffect } from 'react';
import {
  Row, Col, Breadcrumb, Button, Select,
} from 'antd';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import {
  useParams,
} from 'react-router-dom';
// import Tokenizer from 'sentence-tokenizer';
import cheerio from 'cheerio';
import { listVoice } from '../../common/voice';
import { message } from '../../common';
import openNotification from '../Notifications';

const { Option } = Select;

const listTypeWord = [
  'loanword',
  'abbreviation',
  'date_dm',
  'date_my',
  'number_integer',
  'number_float',
  'read_as_sequence',
  'range',
];


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
  const { articleId } = useParams();
  const [article, setArticle] = useState(
    {
      sentences: [],
    },
  );
  const [audioLink, setAudioLink] = useState();
  const [voiceSelect, setVoiceSelect] = useState('vbee-tts-voice-hn_male_manhdung_news_48k-h');

  const handleChange = (value) => {
    setVoiceSelect(value);
  };

  const handleFinish = async () => {
    const { data } = await axios.post('http://localhost:8000/finish-normalize', { articleId });
    if (data.status === 1) {
      openNotification('success', message.FINISH_NORMALIZE);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function fetchData() {
      const { data } = await axios.post('http://localhost:8000/get-valid-article-by-id', { articleId });
      if (!ignore) {
        setArticle(data);
        setAudioLink(data.linkAudio);
      }
    }
    fetchData();
    return () => { ignore = true; };
  }, [articleId]);

  const showCleanText = (article) => {
    const { sentences } = article;
    return sentences.map((sentence) => {
      const { allophones } = sentence;
      const $ = cheerio.load(allophones, { xmlMode: true, decodeEntities: false });
      const $phrase = cheerio.load($.html($('phrase')));
      const words = [];
      const $mtu = cheerio.load($.html($('mtu')));
      const highlights = [];
      $mtu('body')
        .children()
      // eslint-disable-next-line func-names
        .each(function () {
          if (listTypeWord.includes($(this).attr('nsw'))) {
            highlights.push($(this).children().text().trim()
              .replace(/\s\s+/g, ' ')
              .replace(/\t/g, ' ')
              .replace(/\n/g, ' '));
          }
        });
      $phrase('body').children().each(function () {
        $(this).children().each(function () {
          if ($(this).get(0).name === 'mtu') {
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
        <div key={sentence.sentenceId} style={{ height: 100 }}>
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


  const showArticleText = (article) => {
    const { sentences } = article;
    return sentences.map((sentence) => {
      const { allophones } = sentence;
      const $ = cheerio.load(allophones, { xmlMode: true, decodeEntities: false });
      const $phrase = cheerio.load($.html($('phrase')));
      const words = [];
      const $mtu = cheerio.load($.html($('mtu')));
      const highlights = [];
      $mtu('body')
        .children()
      // eslint-disable-next-line func-names
        .each(function () {
          if (listTypeWord.includes($(this).attr('nsw'))) {
            highlights.push($(this).attr('orig'));
          }
        });
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
        <div key={sentence.sentenceId} style={{ height: 100 }}>
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
                  onClick={() => props.history.push(`/dashboard/list-valid-articles/${article._id}/${type}/${orig}`)}
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
    const { data } = await axios.post('http://localhost:8000/synthetic-article', { articleId, voiceSelect });
    if (data.status === 1) {
      openNotification('success', message.SYNTHETIC_SUCCESS);
    }
  };

  return (
    <div className={classes.root}>
      <Breadcrumb style={{ marginBottom: 10 }}>
        <Breadcrumb.Item>
          Bảng điều khiển
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <a href="/dashboard/list-valid-articles">Danh sách bài báo hợp lệ</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          Bài báo chuẩn hoá
        </Breadcrumb.Item>
      </Breadcrumb>
      <Row gutter={16}>
        <Col span={8}>
          {
          article.linkAudio && (
            <audio controls style={{ width: 400 }}>
              <source src={`${audioLink}`} />
            </audio>
          )
          }
        </Col>
        <Col span={8}>
          Chọn giọng
          {': '}
          <Select
            defaultValue="vbee-tts-voice-hn_male_manhdung_news_48k-h"
            style={{ width: 300, marginTop: 10 }}
            onChange={handleChange}
          >
            {listVoice.map((voice) => (
              <Option key={voice.key} value={voice.value}>{voice.name}</Option>
            ))}
          </Select>
        </Col>
        <Col span={8}>
          <Button
            style={{ marginRight: 10 }}
            onClick={() => props.history.push('/dashboard/list-valid-articles')}
          >
            Quay lại
          </Button>
          <Button danger style={{ marginRight: 10 }} type="primary" onClick={handleFinish}>
            Lưu & Hoàn thành
          </Button>
          <Button style={{ marginTop: 10, marginRight: 10 }} type="primary" onClick={synthetic}>
            Tổng hợp
          </Button>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          {showArticleText(article)}
        </Col>
        <Col span={12}>
          {showCleanText(article)}
        </Col>
      </Row>
    </div>
  );
}
