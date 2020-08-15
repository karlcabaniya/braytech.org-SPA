import React from 'react';

import { t } from '../../../utils/i18n';
import { Miscellaneous } from '../../../svg';

import './styles.css';

export default function DreamingCityCurseCycle({ cycleInfo }) {
  const rotation = {
    1: {
      strength: t('Lesser'),
    },
    2: {
      strength: t('Middling'),
    },
    3: {
      strength: t('Greater'),
    },
  };

  return (
    <div className='user-module dreaming-city-curse-cycle'>
      <div className='sub-header'>
        <div>{t("Savathûn's Curse")}</div>
      </div>
      <h3>{rotation[cycleInfo.week.curse].strength}</h3>
      <div className='text'>
        <p>{t('The Dreaming City is in stage {{week}} of its ongoing curse.', { week: cycleInfo.week.curse })}</p>
        <p>
          <em>{t("Savathûn's Curse: implemented with Riven's dying breath and reset with every death of Dûl Incaru.")}</em>
        </p>
      </div>
      <div className='icon'>
        <Miscellaneous.CurseCycle />
      </div>
    </div>
  );
}
