import React from 'react';

import { ProfileNavLink } from '../../components/ProfileLink';
import { Views } from '../../svg';

class ClanViewsLinks extends React.Component {
  render() {
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
              <Views.Clan.Stats />
            </div>
            <ProfileNavLink to='/clan/stats' />
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
        </ul>
      </div>
    );
  }
}

export default ClanViewsLinks;
