import React from 'react';

import { t } from '../../utils/i18n';
import { removeMemberIds } from '../../utils/paths';

import { ProfileNavLink } from '../../components/ProfileLink';
import { Views } from '../../svg';

import './styles.css';

import Root from './Root';
import Crucible from './Crucible';
import Gambit from './Gambit';
import Raids from './Raids';
import Dungeons from './Dungeons';
import Strikes from './Strikes';

function navLinkIsActive(match, location) {
  if (['/reports', '/reports/all'].includes(removeMemberIds(location.pathname)) || removeMemberIds(location.pathname).includes('/reports/all')) {
    return true;
  } else {
    return false;
  }
}

export function NavLinks() {
  return (
    <div className='module views'>
      <ul className='list'>
        <li className='linked'>
          <div className='icon'>
            <Views.Reports.Explore />
          </div>
          <ProfileNavLink to='/reports' isActive={navLinkIsActive} />
        </li>
        <li className='linked'>
          <div className='icon'>
            <Views.Reports.Crucible />
          </div>
          <ProfileNavLink to='/reports/crucible' />
        </li>
        <li className='linked'>
          <div className='icon'>
            <Views.Reports.Gambit />
          </div>
          <ProfileNavLink to='/reports/gambit' />
        </li>
        <li className='linked'>
          <div className='icon'>
            <Views.Reports.Strikes />
          </div>
          <ProfileNavLink to='/reports/strikes' />
        </li>
        <li className='linked'>
          <div className='icon'>
            <Views.Reports.Dungeons />
          </div>
          <ProfileNavLink to='/reports/dungeons' />
        </li>
        <li className='linked'>
          <div className='icon'>
            <Views.Reports.Raids />
          </div>
          <ProfileNavLink to='/reports/raids' />
        </li>
      </ul>
    </div>
  );
}

export default function Reports(props) {
  const mode = +props.match.params.mode || 0;
  const offset = +props.match.params.offset || 0;

  const views = {
    crucible: {
      component: Crucible,
      displayProperties: {
        name: t('Crucible'),
      },
    },
    gambit: {
      component: Gambit,
      displayProperties: {
        name: t('Gambit'),
      },
    },
    raids: {
      component: Raids,
      displayProperties: {
        name: t('Raids'),
      },
    },
    dungeons: {
      component: Dungeons,
      displayProperties: {
        name: t('Dungeons'),
      },
    },
    strikes: {
      component: Strikes,
      displayProperties: {
        name: t('Strikes'),
      },
    },
    all: {
      component: Root,
      displayProperties: {
        name: t('Explore'),
      },
    },
  };

  const Component = views[props.match.params.type || 'all'].component;

  return (
    <div className='view' id='multiplayer'>
      <div className='buff'>
        <NavLinks />
        <Component mode={mode} offset={offset} />
      </div>
    </div>
  );
}
