/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
/* eslint-disable no-undef */
/* eslint-disable func-names */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-named-as-default */
/* eslint-disable import/no-named-as-default-member */
/* eslint-disable no-shadow */
import React, { useState, useEffect } from 'react';
import {
  Table, Input, Button, Col, Row, Select,
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
import { listTypeWord } from '../../../common/listTypeWord';

const { Option } = Select;

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
  const [wordType, setWordType] = useState(type);
  // const [isChange, setIsChange] = useState();

  const handleSetTypeChange = (value) => {
    setWordType(value);
    // setIsChange(true);
  };

  const handleSetTypeChangeRow = (value, sentenceId, word, index) => {
    setContexts(
      contexts.map((ctx) => {
        if (ctx.id === sentenceId && ctx.index === index) {
          return {
            ...ctx, isChange: true, word, wordType: value,
          };
        }
        return ctx;
      }),
    );
  };

  const renderSelectTag = (defaultValue) => (
    <Select style={{ width: '70%' }} value={defaultValue} onChange={handleSetTypeChange}>
      {listTypeWord
        .map((typeWord, key) => (
          <Option
            key={key}
            value={typeWord.type}
          >
            {typeWord.name}
          </Option>
        )) }
    </Select>
  );

  // const renderSelectTagRow = (defaultValue, sentenceId, word, index) => (
  // );

  const handleSetExpansion = (e) => {
    setExpansion(e.target.value);
    // setIsChange(true);
  };

  const handleChangeExpansionRow = (e, sentenceId, word, index, wordType) => {
    setContexts(
      contexts.map((ctx) => {
        if (ctx.id === sentenceId && ctx.index === index) {
          return {
            ...ctx, expansion: e.target.value, isChange: true, word, wordType,
          };
        }
        return ctx;
      }),
    );
  };

  const handleApply = () => {
    setContexts(
      contexts.map((ctx) => {
        if (ctx.wordType !== wordType || ctx.expansion !== expansion) {
          return {
            ...ctx, expansion, isChange: true, word, wordType,
          };
        }
        return ctx;
      }),
    );
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
        let expansionVal = '';
        $mtu('body')
          .children()
          .each(function () {
            // $(this).attr('nsw') === type &&
            if ($(this).attr('orig') === word) {
              expansionVal = $(this).text().trim().replace(/\s+/g, ' ');
              setExpansion(expansionVal);
            }
          });
        return expansionVal;
      };
      const getTypeOfWord = (allophones, word) => {
        const $ = cheerio.load(allophones, { xmlMode: true, decodeEntities: false });
        const $mtu = cheerio.load($.html($('mtu')));
        let type = '';
        $mtu('body')
          .children()
          .each(function () {
            // $(this).attr('nsw') === type &&
            if ($(this).attr('orig') === word) {
              type = $(this).attr('nsw');
            }
          });
        return type;
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
        const { paragraphs } = article;
        const listSentences = [];
        paragraphs.forEach((paragraph) => {
          const { sentences } = paragraph;
          sentences.forEach((sentence) => {
            const { allophones } = sentence;
            const $ = cheerio.load(allophones, { xmlMode: true, decodeEntities: false });
            const $mtu = cheerio.load($.html($('mtu')));
            $mtu('body')
              .children()
              .each(function () {
                // $(this).attr('nsw') === type
                if ($(this).attr('orig') === word.replace(/~/g, '/')) {
                  if (!listSentences.some((temp) => temp._id === sentence._id)) {
                    listSentences.push(sentence);
                  }
                }
              });
          });
        });
        const contexts = [];
        for (let i = 0; i < listSentences.length; i += 1) {
          const numberOfWords = getNumberOfWord(listSentences[i].allophones, word.replace(/~/g, '/'));
          if (numberOfWords > 1) {
            for (let j = 0; j < numberOfWords; j += 1) {
              const context = {
                id: listSentences[i]._id,
                key: i,
                allophones: listSentences[i].allophones,
                wordType: getTypeOfWord(listSentences[i].allophones, word.replace(/~/g, '/')),
                expansion: getExpansionOfWord(listSentences[i].allophones, word.replace(/~/g, '/')),
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
              wordType: getTypeOfWord(listSentences[i].allophones, word.replace(/~/g, '/')),
              expansion: getExpansionOfWord(listSentences[i].allophones, word.replace(/~/g, '/')),
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
      // temp.type === type
      if (temp.word === word.replace(/~/g, '/')) {
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
          // && temp.type === type
          if (temp.word === word.replace(/~/g, '/') && temp.mark) {
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
      render: (value) => (value += 1),
    },
    {
      title: 'Câu',
      key: 2,
      width: 600,
      dataIndex: 'allophones',
      render: (value, record) => getSentences(value, record.index),
    },
    {
      title: 'Loại từ',
      key: 3,
      width: 200,
      dataIndex: 'wordType',
      render: (value, record) => (
        <Select
          style={{ width: '85%' }}
          value={record.wordType}
          onChange={(value1) => handleSetTypeChangeRow(value1, record.id, word, record.index)}
        >
          {listTypeWord
            .map((typeWord, key) => (
              <Option
                key={key}
                value={typeWord.type}
              >
                {typeWord.name}
              </Option>
            )) }
        </Select>
      ),
    },
    {
      title: 'Cách đọc',
      key: 4,
      width: 200,
      align: 'center',
      render: (record) => (
        <Input
          style={{ width: 150 }}
          value={record.expansion}
          onChange={(e) => handleChangeExpansionRow(e, record.id, word.replace(/~/g, '/'), record.index, record.wordType)}
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
            <span className={classes.word}>{word.replace(/~/g, '/')}</span>
          </div>
        </Col>
        <Col span={6}>
          <b>
            Loại từ:
            {'   '}
          </b>
          { renderSelectTag(wordType) }
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
