/* eslint-disable no-undef */
/* eslint-disable func-names */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-named-as-default */
/* eslint-disable import/no-named-as-default-member */
/* eslint-disable no-shadow */
import React, { useState, useEffect } from 'react';
import {
  Table, Input, Button, Col, Row,
} from 'antd';
import cheerio from 'cheerio';
import ButtonGroup from 'antd/lib/button/button-group';
import { makeStyles } from '@material-ui/core/styles';
import { css } from 'emotion';
import axios from 'axios';
import {
  useParams,
} from 'react-router-dom';
import openNotification from '../../Notifications';
import { message } from '../../../common';


const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    maxHeight: 400,
    fontFamily: 'Montserrat',
  },
  word: {
    fontWeight: 700,
    color: 'red',
  },
}));


export default function NormalizeWord(props) {
  const classes = useStyles();
  const { articleId, word, type } = useParams();
  const [contexts, setContexts] = useState([]);
  const [expansion, setExpansion] = useState();
  const [isChange, setIsChange] = useState();


  const handleSetExpansion = (e) => {
    setExpansion(e.target.value);
    setIsChange(true);
  };

  const handleChangeExpansionRow = (e, sentenceId, word, index) => {
    setContexts(
      contexts.map((ctx) => {
        if (ctx.id === sentenceId && ctx.index === index) {
          return {
            ...ctx, expansion: e.target.value, isChange: true, word, type,
          };
        }
        return ctx;
      }),
    );
  };

  const handleApply = () => {
    if (expansion === undefined) {
      openNotification('warning', message.ALERT);
    } else {
      setContexts(
        contexts.map((ctx) => ({
          ...ctx, expansion, isChange, word, type,
        })),
      );
    }
  };

  const handleSave = async () => {
    const listExpansionChange = contexts.filter((ctx) => ctx.isChange === true);
    const { data } = await axios.post('http://localhost:8000/normalize-word', { listExpansionChange, articleId });
    if (data.status === 1) {
      openNotification('success', message.NORMALIZE_SUCCESS);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function fetchData() {
      const getExpansionOfWord = (allophones, word) => {
        const $ = cheerio.load(allophones, { xmlMode: true, decodeEntities: false });
        const $mtu = cheerio.load($.html($('mtu')));
        let expansion = '';
        $mtu('body')
          .children()
          .each(function () {
            if ($(this).attr('nsw') === type && $(this).attr('orig') === word) {
              expansion = $(this).text().trim().replace(/\s+/g, ' ');
            }
          });
        return expansion;
      };

      const getNumberOfWord = (allophones, word) => {
        const $ = cheerio.load(allophones, { xmlMode: true, decodeEntities: false });
        const $mtu = cheerio.load($.html($('mtu')));
        let number = 0;
        $mtu('body')
          .children()
          .each(function () {
            if ($(this).attr('nsw') === type && $(this).attr('orig') === word) {
              number += 1;
            }
          });
        return number;
      };
      const article = (await axios.post('http://localhost:8000/get-valid-article-by-id', { articleId })).data;
      if (!ignore) {
        const { sentences } = article;
        const listSentences = [];
        sentences.forEach((sentence) => {
          const { allophones } = sentence;
          const $ = cheerio.load(allophones, { xmlMode: true, decodeEntities: false });
          const $mtu = cheerio.load($.html($('mtu')));
          $mtu('body')
            .children()
            .each(function () {
              if ($(this).attr('nsw') === type && $(this).attr('orig') === word) {
                if (!listSentences.some((temp) => temp._id === sentence._id)) {
                  listSentences.push(sentence);
                }
              }
            });
        });
        const contexts = [];
        for (let i = 0; i < listSentences.length; i += 1) {
          const numberOfWords = getNumberOfWord(listSentences[i].allophones, word);
          if (numberOfWords > 1) {
            for (let j = 0; j < numberOfWords; j += 1) {
              const context = {
                id: listSentences[i]._id,
                key: i,
                allophones: listSentences[i].allophones,
                expansion: getExpansionOfWord(listSentences[i].allophones, word),
                isChange: false,
                index: j,
              };
              contexts.push(context);
            }
          } else {
            const context = {
              id: listSentences[i]._id,
              key: i,
              allophones: listSentences[i].allophones,
              expansion: getExpansionOfWord(listSentences[i].allophones, word),
              isChange: false,
              index: 0,
            };
            contexts.push(context);
          }
        }
        setContexts(contexts);
      }
    }
    fetchData();
    return () => { ignore = true; };
  }, [articleId, type, word]);

  const getSentences = (allophones, position) => {
    const $ = cheerio.load(allophones, { xmlMode: true, decodeEntities: false });
    const $phrase = cheerio.load($.html($('phrase')));
    const words = [];
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
    let i = 0;
    for (const temp of words) {
      if (temp.type === type && temp.word === word) {
        i += 1;
      }
      if (i === (position + 1)) {
        temp.mark = true;
        break;
      }
    }
    return (
      <div style={{ padding: 10 }}>
        {words.map((temp, index) => {
          if (temp.word === word && temp.type === type && temp.mark) {
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
              >
                {temp.word}
                {' '}
              </span>
            );
          }
          return (
            <span key={index}>
              {temp.word}
              {' '}
            </span>
          );
        })}
      </div>
    );
  };

  const columns = [
    {
      title: 'STT',
      width: 50,
      key: 1,
      dataIndex: 'key',
    },
    {
      title: 'Câu',
      key: 2,
      width: 600,
      dataIndex: 'allophones',
      render: (value, record) => getSentences(value, record.index),
    },
    {
      title: 'Cách đọc',
      key: 3,
      width: 200,
      align: 'center',
      render: (record) => (
        <Input
          style={{ width: 150 }}
          value={record.expansion}
          onChange={(e) => handleChangeExpansionRow(e, record.id, word, record.index)}
        />
      ),
    },
  ];
  const tableCSS = css({
    backgroundColor: 'white',
    '& table': {
      borderCollapse: 'collapse',
    },
    '& thead > tr > th': {
      backgroundColor: '#33b35a',
      color: '#FFF',
      fontWeight: 'bold',
    },
  });


  return (
    <div className={classes.root}>
      <Row gutter={16} style={{ marginBottom: 15 }}>
        <Col span={6}>
          <div style={{ marginTop: 7 }}>
            <b>Từ cần chuẩn hoá:</b>
            {' '}
            <span className={classes.word}>{word}</span>
          </div>
        </Col>
        <Col span={6}>
          <b>
            Cách đọc:
            {'   '}
          </b>
          <Input style={{ width: '50%' }} value={expansion} onChange={handleSetExpansion} />
        </Col>
        <Col span={6}>
          <Button type="primary" onClick={handleApply}>
            Áp dụng cho tất cả các câu
          </Button>
        </Col>
      </Row>

      <Table
        className={tableCSS}
        dataSource={contexts}
        columns={columns}
        bordered
        scroll={{ y: 400 }}
      />

      <ButtonGroup style={{
        display: 'block',
        float: 'right',
        marginTop: '30px',
      }}
      >
        <Button style={{ marginRight: 10 }} onClick={() => props.history.push(`/dashboard/list-valid-articles/${articleId}`)}>
          Quay lại
        </Button>
        <Button style={{ marginRight: 10 }} type="danger" onClick={handleSave}>
          Lưu
        </Button>
      </ButtonGroup>
    </div>
  );
}
