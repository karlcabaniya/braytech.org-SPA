import React from 'react';

import { t } from '../../../utils/i18n';
import Matches from '../../../components/Reports/Matches';
import ParentModeLinks from '../ParentModeLinks';

function All(props) {
  return (
    <div className='view root' id='multiplayer'>
      <div className='module-l1'>
        <div className='module-l2'>
          <div className='content head'>
            <div className='page-header'>
              <div className='sub-name'>{t('Post Game Carnage Reports')}</div>
              <div className='name'>{t('Explore')}</div>
            </div>
          </div>
        </div>
        <div className='module-l2'>
          <ParentModeLinks />
        </div>
      </div>
      <div className='module-l1'>
        <Matches mode={false} limit='40' offset={props.offset} root='/reports/all' />
      </div>
    </div>
  );
}

export default All;
