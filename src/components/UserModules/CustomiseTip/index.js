import React from 'react';

import { t, BraytechText } from '../../../utils/i18n';
import DismissTip from '../../UI/DismissTip';
import { Common } from '../../../svg';

import './styles.css';

export default function CustomiseTip() {
  return (
    <div className='wrap'>
      <div className='icon'>
        <Common.Info />
      </div>
      <BraytechText className='text' value={t('UserModules.CustomiseTip.Description')} />
      <DismissTip value='CustomiseTipModule' />
    </div>
  );
}
