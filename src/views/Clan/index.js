import React from 'react';
import { useSelector } from 'react-redux';
import cx from 'classnames';

import { t } from '../../utils/i18n';
import { ProfileNavLink } from '../../components/ProfileLink';
import { Views } from '../../svg';

import './styles.css';

import About from './About';
import Roster from './Roster';
import RosterAdmin from './RosterAdmin';
import Stats from './Stats';

export function NavLinks() {
  return (
    <div className='module views'>
      <ul className='list'>
        <li className='linked'>
          <div className='icon'>
            <Views.Clan.About />
          </div>
          <ProfileNavLink to='/clan' exact />
        </li>
        <li className='linked'>
          <div className='icon'>
            <Views.Clan.Roster />
          </div>
          <ProfileNavLink to='/clan/roster' />
        </li>
        <li className='linked'>
          <div className='icon'>
            <Views.Clan.RosterAdmin />
          </div>
          <ProfileNavLink to='/clan/admin' />
        </li>
        <li className='linked'>
          <div className='icon'>
            <Views.Clan.Stats />
          </div>
          <ProfileNavLink to='/clan/stats' />
        </li>
      </ul>
    </div>
  );
}

function ViewportWidth() {
  return (
    <div className='module'>
      <div className='properties'>
        <div className='name'>{t('Clan Admin')}</div>
        <div className='description'>
          <p>{t('Clan Admin mode is intended for use on larger displays. Please use a display with a viewport of atleast 1280px.')}</p>
        </div>
      </div>
    </div>
  );
}

function NoClan() {
  return (
    <div className='module'>
      <div className='properties'>
        <div className='name'>{t('No clan affiliation')}</div>
        <div className='description'>
          <p>{t('Clans are optional groups of friends that enhance your online gaming experience. Coordinate with your clanmates to take on co-op challenges or just simply represent them in your solo play to earn extra rewards.')}</p>
          <p>{t("Join your friend's clan, meet some new friends, or create your own on the companion app or at bungie.net.")}</p>
        </div>
      </div>
    </div>
  );
}

export default function Clan(props) {
  const viewport = useSelector(state => state.viewport);
  const member = useSelector(state => state.member);

  const views = {
    about: About,
    roster: Roster,
    admin: RosterAdmin,
    stats: Stats,
    'no-clan': NoClan,
    'viewport-width': ViewportWidth,
  };

  let view = props.match.params.view || 'about';

  if (!member.data.groups.clan) view = 'no-clan';
  if (view === 'admin' && viewport.width < 1280) view = 'viewport-width';
  if (!views[view]) view = 'about';

  const Component = views[view];

  return (
    <div className={cx('view', view, { error: view === 'no-clan' || view === 'viewport-width' })} id='clan'>
      <div className='buff'>
        <NavLinks />
        <div className='content'>
          <Component {...props.match.params} />
        </div>
      </div>
    </div>
  );
}
