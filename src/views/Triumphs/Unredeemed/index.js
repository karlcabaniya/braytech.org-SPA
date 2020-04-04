import React from 'react';

import { t } from '../../../utils/i18n';
import RecordsUnredeemed from '../../../components/RecordsUnredeemed';

function Unredeemed(props) {
  return (
    <div className='almost-complete'>
      <div className='sub-header sub'>
        <div>{t('Unredeemed triumphs')}</div>
      </div>
      <RecordsUnredeemed limit='200' selfLinkFrom='/triumphs/unredeemed' />
    </div>
  );
}

export default Unredeemed;
