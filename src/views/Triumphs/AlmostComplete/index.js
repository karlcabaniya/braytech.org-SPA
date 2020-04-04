import React from 'react';

import { t } from '../../../utils/i18n';
import RecordsAlmost from '../../../components/RecordsAlmost';

function AlmostComplete(props) {
  return (
    <div className='almost-complete'>
      <div className='sub-header sub'>
        <div>{t('Almost complete')}</div>
      </div>
      <RecordsAlmost sort={props.sort} limit='200' selfLinkFrom='/triumphs/almost-complete' />
    </div>
  );
}

export default AlmostComplete;
