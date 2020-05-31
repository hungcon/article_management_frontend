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
  const { cleanArticleId, word, type } = useParams();
  const [cleanArticle, setCleanArticle] = useState();
  const [contexts, setContexts] = useState([]);
  const [expansion, setExpansion] = useState();
  const [isChange, setIsChange] = useState();


  const handleSetExpansion = (e) => {
    setExpansion(e.target.value);
    setIsChange(true);
  };

  const handleChangeExpansionRow = (e, sentenceId, word) => {
    setContexts(
      contexts.map((ctx) => {
        if (ctx.id === sentenceId && ctx.word === word) {
          return { ...ctx, expansion: e.target.value, isChange: true };
        }
        return ctx;
      }),
    );
  };

  const handleApply = () => {
    setContexts(
      contexts.map((ctx) => ({ ...ctx, expansion, isChange })),
    );
  };

  const handleSave = () => {
    const listExpansionChange = contexts.filter((ctx) => ctx.isChange === true);
    console.log(listExpansionChange);
  };

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


  useEffect(() => {
    let ignore = false;
    async function fetchData() {
      const cleanArticle = (await axios.post('http://localhost:8000/get-clean-article-by-id', { cleanArticleId })).data;
      if (!ignore) {
        const { sentences } = cleanArticle;
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
          const context = {
            id: listSentences[i]._id,
            key: i,
            sentence: listSentences[i].allophones,
            expansion: getExpansionOfWord(listSentences[i].allophones, word),
            isChange: false,
          };
          contexts.push(context);
        }
        setContexts(contexts);
        setCleanArticle(cleanArticle);
      }
    }
    fetchData();
    return () => { ignore = true; };
  }, []);

  const getSentences = (allophones) => {
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
      <div style={{ padding: 10 }}>
        {words.map((temp, index) => {
          if ([word].includes(temp.word)) {
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
      dataIndex: 'sentence',
      render: (value) => getSentences(value),
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
          onChange={(e) => handleChangeExpansionRow(e, record.id, record.word)}
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
        <Button style={{ marginRight: 10 }} type="primary" onClick={() => props.history.push(`/dashboard/clean-text/${cleanArticle._id}`)}>
          Quay lại
        </Button>
        <Button type="danger" onClick={handleSave}>
          Lưu
        </Button>
      </ButtonGroup>
    </div>
  );
}
