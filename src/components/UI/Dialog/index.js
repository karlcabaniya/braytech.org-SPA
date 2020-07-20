import React from 'react';
import cx from 'classnames';

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
              {actions.map((action, i) => {
                if (action.type === 'external') {
                  return (
                    <li key={i}>
                      <a className='button' href={action.target} onClick={action.handler || null} target='_blank' rel='noreferrer noopener'>
                        <DestinyKey type={action.key || 'dismiss'} /> {action.text}
                      </a>
                    </li>
                  );
                } else if (action.type === 'reload') {
                  return (
                    <li key={i}>
                      <Button action={handler_reload}>
                        <DestinyKey type={action.key || 'modify'} /> {action.text}
                      </Button>
                    </li>
                  );
                } else if (action.type === 'agreement') {
                  return (
                    <li key={i}>
                      <Button action={action.handler || null}>
                        <DestinyKey type={action.key || 'accept'} /> {action.text}
                      </Button>
                    </li>
                  );
                } else if (action.type === 'dismiss') {
                  return (
                    <li key={i}>
                      <Button action={action.handler}>
                        <DestinyKey type={action.key || 'dismiss'} /> {action.text}
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
