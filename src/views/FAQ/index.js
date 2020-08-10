import React, { useEffect } from 'react';

import { t, BraytechText } from '../../utils/i18n';

import { Views } from '../../svg';

import './styles.css';

export default function FAQ(props) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handler_scrollTo = (id) => (e) => {
    e.preventDefault();

    const element = document.getElementById(id);
    element.scrollIntoView({ behavior: 'smooth' });
  };

  const qa = [
    {
      k: 'braytech',
      i: 0,
      q: t('FAQ.Answers.0.Q'),
      a: [<BraytechText key='0' className='markdown' value={t('FAQ.Answers.0.A')} />, <Views.FAQ.Diagram1 key='1' />],
    },
    {
      k: 'braytech',
      i: 1,
      q: t('FAQ.Answers.1.Q'),
      a: [<BraytechText key='0' className='markdown' value={t('FAQ.Answers.1.A')} />],
    },
    {
      k: 'api',
      i: 2,
      q: t('FAQ.Answers.2.Q'),
      a: [<BraytechText key='0' className='markdown' value={t('FAQ.Answers.2.A')} />],
    },
    {
      k: 'api',
      i: 3,
      q: t('FAQ.Answers.3.Q'),
      a: [<BraytechText key='0' className='markdown' value={t('FAQ.Answers.3.A')} />],
    },
  ];

  return (
    <div className='view' id='faq'>
      <div className='module head'>
        <div className='page-header'>
          <div className='name'>{t('Frequently Asked Questions')}</div>
        </div>
      </div>
      <div className='buff'>
        <div className='module overview'>
          <h4>Braytech</h4>
          <ul>
            {qa
              .filter((q) => q.k === 'braytech')
              .map((qa, i) => {
                return (
                  <li key={i} className='qa'>
                    <a className='hyperlink' href='/' onClick={handler_scrollTo(qa.i)}>
                      {qa.q}
                    </a>
                  </li>
                );
              })}
          </ul>
          <h4>API</h4>
          <ul>
            {qa
              .filter((q) => q.k === 'api')
              .map((qa, i) => {
                return (
                  <li key={i} className='qa'>
                    <a className='hyperlink' href='/' onClick={handler_scrollTo(qa.i)}>
                      {qa.q}
                    </a>
                  </li>
                );
              })}
          </ul>
        </div>
        <div className='module faq'>
          <div className='k'>
            {qa.map((qa, i) => {
              return (
                <div key={i} id={qa.i} className='qa'>
                  <div className='q'>{qa.q}</div>
                  <div className='a'>{qa.a}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
