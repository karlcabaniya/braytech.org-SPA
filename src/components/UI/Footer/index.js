import React from 'react';
import { Link } from 'react-router-dom';

import { t, fromNow } from '../../../utils/i18n';
import manifest from '../../../utils/manifest';
import packageJSON from '../../../../package.json';
import { Common } from '../../../svg';

import './styles.css';

export const hiddenFooterRoutes = ['/maps'];

class Footer extends React.Component {
  render() {
    const { linkOnClick, minimal } = this.props;

    if (hiddenFooterRoutes.filter((path) => this.props.location?.pathname.indexOf(path) > -1).length) return null;

    return (
      <div id='footer'>
        <div className='wrapper'>
          <div>
            <div>© 2020 <a className='hyperlink' href='https://thomchap.com.au' target='_blank' rel='noopener noreferrer'>Tom Chapman</a></div>
            <div>{t('Version')} <span>{packageJSON.version}</span></div>
            {manifest.statistics.scrapes?.last?.time ? <div>{t('VOLUSPA last indexed')} {fromNow(manifest.statistics.scrapes.last.time)}</div> : null}
          </div>
          <ul>
            {!minimal ? (
              <>
                <li>
                  <Link className='hyperlink' to='/faq' onClick={linkOnClick}>
                    {t('FAQ')}
                  </Link>
                </li>
                <li>
                  <Link className='hyperlink' to='/credits' onClick={linkOnClick}>
                    {t('Credits')}
                  </Link>
                </li>
              </>
            ) : null}
            <li>
              <a className='hyperlink' href='https://twitter.com/BraytechHelp' target='_blank' rel='noopener noreferrer'>
                Twitter
              </a>
            </li>
            <li>
              <a className='hyperlink' href='https://discordapp.com/invite/8jESWWX' target='_blank' rel='noopener noreferrer'>
                Discord
              </a>
            </li>
            <li>
              <a className='hyperlink' href='https://paypal.me/braytechltd' target='_blank' rel='noopener noreferrer'>
                PayPal <Common.PayPal />
              </a>
            </li>
            <li>
              <a className='hyperlink' href='https://www.patreon.com/braytech' target='_blank' rel='noopener noreferrer'>
                Patreon <Common.Patreon />
              </a>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default Footer;
