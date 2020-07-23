import React from 'react';
import cx from 'classnames';

import { t } from '../../../utils/i18n';
import { Button, DestinyKey } from '../../UI/Button';

import './styles.css';

function handler_reload() {
  setTimeout(() => {
    window.location.reload();
  }, 50);
};

export default function Dialog({ children, actions, ...props }) {
  return (
    <div className={cx('dialog', props.type, { error: props.isError })}>
      <div className='wrapper-outer'>
        <div className='background'>
          <div className='border-top' />
          <div className='acrylic' />
        </div>
        <div className={cx('wrapper-inner')}>{children}</div>
        <div className='sticky-nav mini ultra-black'>
          <div className='sticky-nav-inner'>
            <div />
            <ul>
              {actions.map((action, a) => {
                if (action.type === 'external') {
                  return (
                    <li key={a}>
                      <a className='button' href={action.target} onClick={action.handler || null} target='_blank' rel='noreferrer noopener'>
                        <DestinyKey type={action.key || 'more'} /> {action.text || t('Open')}
                      </a>
                    </li>
                  );
                } else if (action.type === 'reload') {
                  return (
                    <li key={a}>
                      <Button action={action.handler || handler_reload}>
                        <DestinyKey type={action.key || 'modify'} /> {action.text || t('Reload')}
                      </Button>
                    </li>
                  );
                } else if (action.type === 'agreement') {
                  return (
                    <li key={a}>
                      <Button action={action.handler || null}>
                        <DestinyKey type={action.key || 'accept'} /> {action.text || t('Accept')}
                      </Button>
                    </li>
                  );
                } else if (action.type === 'dismiss') {
                  return (
                    <li key={a}>
                      <Button action={action.handler || null}>
                        <DestinyKey type={action.key || 'dismiss'} /> {action.text || t('Dismiss')}
                      </Button>
                    </li>
                  );
                } else {
                  return null;
                }
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
