import React from 'react';

import { removeMemberIds } from '../../utils/paths';
import { ProfileNavLink } from '../../components/ProfileLink';
import { Views } from '../../svg';

class ParentModeLinks extends React.Component {
  render() {
    return (
      <div className='content views'>
        <ul className='list'>
          <li className='linked'>
            <div className='icon'>
              <Views.Reports.Explore />
            </div>
            <ProfileNavLink to='/reports' isActive={(match, location) => {
                if (['/reports', '/reports/all'].includes(removeMemberIds(location.pathname)) || removeMemberIds(location.pathname).includes('/reports/all')) {
                  return true;
                } else {
                  return false;
                }
              }} />
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
              <Views.Reports.Raids />
            </div>
            <ProfileNavLink to='/reports/raids' />
          </li>
        </ul>
      </div>
    )
  }
}

export default ParentModeLinks;
