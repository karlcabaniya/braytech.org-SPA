import React from 'react';

import { t } from '../../../utils/i18n';
import RecordsTracked from '../../../components/RecordsTracked';

function Tracked(props) {
  return (
    <div className='almost-complete'>
      <div className='sub-header sub'>
        <div>{t('Tracked triumphs')}</div>
      </div>
      <RecordsTracked limit='200' selfLinkFrom='/triumphs/tracked' />
    </div>
  );
}

export default Tracked;
