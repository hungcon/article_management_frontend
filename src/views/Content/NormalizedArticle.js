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
import cheerio from 'cheerio';
import { listVoice } from '../../common/voice';
import { API_ENDPOINT } from '../../common/apis';
import { message } from '../../common';
import { listTypeWord } from '../../common/listTypeWord';
import openNotification from '../Notifications';

const { Option } = Select;


const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    fontFamily: 'Montserrat',
  },
}));


export default function CleanOption(props) {
  // console.log(record);
  const classes = useStyles();
  const { articleId } = useParams();
  const [article, setArticle] = useState(
    {
      paragraphs: [],
    },
  );
  const [audioLink, setAudioLink] = useState();
  const [role, setRole] = useState();
  const [voiceSelect, setVoiceSelect] = useState('vbee-tts-voice-hn_male_manhdung_news_48k-h');

  useEffect(() => {
    const position = localStorage.getItem('position');
    window.scroll(0, position);
  });

  const handleWordClick = (e, type, orig) => {
    localStorage.setItem('position', e.currentTarget.offsetTop);
    props.history.push(`/dashboard/list-valid-articles/${article._id}/${type}/${orig}`);
  };


  const handleChange = (value) => {
    setVoiceSelect(value);
  };

  const handleFinish = async () => {
    const { data } = await axios.post(API_ENDPOINT.FINISH_NORMALIZE, { articleId });
    if (data.status === 1) {
      openNotification('success', message.FINISH_NORMALIZE);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function fetchData() {
      const user = (await axios.post(API_ENDPOINT.GET_USER_INFO, { userName: localStorage.getItem('userName') })).data;
      const roleVal = user.currentUser.role;
      if (!ignore) {
        setRole(roleVal);
      }
    }
    fetchData();
    return () => { ignore = true; };
  }, []);

  useEffect(() => {
    let ignore = false;
    async function fetchData() {
      const { data } = await axios.post(API_ENDPOINT.GET_VALID_ARTICLE_BY_ID, { articleId });
      if (!ignore) {
        setArticle(data);
        setAudioLink(data.linkAudio);
      }
    }
    fetchData();
    return () => { ignore = true; };
  }, [articleId]);

  const showCleanText = (article) => {
    const { paragraphs } = article;
    return paragraphs.map((paragraph) => {
      const { sentences } = paragraph;
      return (
        <div key={paragraph._id} style={{ borderBottom: '1px solid #a1a1a1' }}>
          {
            sentences.map((sentence) => {
              const { allophones } = sentence;
              const $ = cheerio.load(allophones, { xmlMode: true, decodeEntities: false });
              const $phrase = cheerio.load($.html($('phrase')));
              const words1 = [];
              const words2 = [];
              const $mtu = cheerio.load($.html($('mtu')));
              const highlights1 = [];
              const highlights2 = [];
              $mtu('body')
                .children()
              // eslint-disable-next-line func-names
                .each(function () {
                  if (listTypeWord.some((type) => type.type === ($(this).attr('nsw')))) {
                    highlights1.push($(this).attr('orig'));
                    highlights2.push($(this).children().text().trim()
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
                          const word = {
                            type: $(this).attr('nsw'),
                            word: $(this).attr('orig'),
                          };
                          words1.push(word);
                          words2.push($(this).text().trim().replace(/\s+/g, ' '));
                        } else {
                          const word = {
                            type: 'normal',
                            word: $(this).text().trim().replace(/\s+/g, ' '),
                          };
                          words1.push(word);
                          words2.push($(this).text().trim().replace(/\s+/g, ' '));
                        }
                      });
                    } else {
                      const word = {
                        type: $(this).attr('nsw'),
                        word: $(this).attr('orig'),
                      };
                      words1.push(word);
                      words2.push($(this).text().trim().replace(/\s+/g, ' '));
                    }
                  } else {
                    const word = {
                      type: 'normal',
                      word: $(this).text().trim().replace(/\s+/g, ' '),
                    };
                    words1.push(word);
                    words2.push($(this).text().trim().replace(/\s+/g, ' '));
                  }
                });
              });
              return (
                <div key={sentence._id}>
                  <div style={{
                    paddingTop: 15,
                    paddingBottom: 15,
                    display: 'inline-block',
                    width: '46%',
                    textAlign: 'justify',
                    // borderBottom: '1px solid gray',
                  }}
                  >
                    {words1.map((word, index) => {
                      let orig = word.word;
                      orig = orig.replace(/\//g, '~');
                      orig = encodeURI(orig);
                      const { type } = word;
                      if (highlights1.includes(word.word)) {
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
                            onClick={(e) => handleWordClick(e, type, orig)}
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
                  <div style={{
                    width: '5%', display: 'inline-block',
                  }}
                  />
                  <div style={{
                    paddingTop: 15,
                    paddingBottom: 15,
                    display: 'inline-block',
                    width: '46%',
                    textAlign: 'justify',
                    alignContent: 'center',
                  }}
                  >
                    {words2.map((word, index) => {
                      if (highlights2.includes(word)) {
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
                </div>
              );
            })
          }
        </div>
      );
    });
  };

  const synthetic = async () => {
    const { data } = await axios.post(API_ENDPOINT.SYNTHETIC_ARTICLE, { articleId, voiceSelect });
    if (data.status === 1) {
      openNotification('success', message.SYNTHETIC_SUCCESS);
    }
  };

  const deny = async () => {
    const { data } = await axios.post(API_ENDPOINT.DENY_ARTICLE, { articleId });
    if (data.status === 1) {
      openNotification('success', message.DENY_SUCCESS);
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
        <Col xl={8} lg={6}>
          {
          article.linkAudio && (
            <audio controls style={{ width: '80%' }}>
              <source src={`${audioLink}`} />
            </audio>
          )
          }
        </Col>
        {role === 'manager' && (
          <Col xl={8} lg={6}>
            Chọn giọng
            {': '}
            <Select
              defaultValue="vbee-tts-voice-hn_male_manhdung_news_48k-h"
              style={{ width: '60%', marginTop: 10 }}
              onChange={handleChange}
            >
              {listVoice.map((voice) => (
                <Option key={voice.key} value={voice.value}>{voice.name}</Option>
              ))}
            </Select>
          </Col>
        )}

        <Col xl={8} lg={12}>
          <Button
            style={{ marginRight: 10 }}
            onClick={() => props.history.push(
              role === 'manager'
                ? '/dashboard/pending-articles'
                : '/dashboard/list-valid-articles',
            )}
          >
            Quay lại
          </Button>
          {role === 'editor' && (
          <Button danger style={{ marginRight: 10 }} type="primary" onClick={handleFinish}>
            Lưu & Hoàn thành
          </Button>
          )}
          { role === 'manager' && (
            <span>
              <Button style={{ marginTop: 10, marginRight: 10 }} type="primary" danger onClick={deny}>
                Không duyệt
              </Button>
              <Button style={{ marginTop: 10 }} type="primary" onClick={synthetic}>
                Tổng hợp
              </Button>
            </span>
          )}
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <div style={{
            borderSpacing: 0,
            borderCollapse: 'collapse',
          }}
          >
            {showCleanText(article)}
          </div>
        </Col>
      </Row>
    </div>
  );
}
