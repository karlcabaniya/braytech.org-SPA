import React from 'react';
import { useParams } from 'react-router-dom';

import { t } from '../../../utils/i18n';
import manifest from '../../../utils/manifest';
import { activityModeExtras } from '../../../utils/destinyUtils';
import { ProfileNavLink } from '../../ProfileLink';

import './styles.css';

const isActive = (param, mode) => (match, location) => {
  if (param === mode) {
    return true;
  } else {
    return false;
  }
};

function handler_onClick() {
  const target = document.getElementsByClassName('matches')?.[0];

  if (target) {
    target.scrollIntoView({ behavior: 'smooth' });
  }
}

export default function Mode({ stats, root = '/multiplayer/crucible', defaultMode = 5 }) {
  const { mode } = useParams();
  const param = parseInt(mode || defaultMode, 10);

  const definitionActivityMode = Object.values(manifest.DestinyActivityModeDefinition).find((d) => d.modeType === stats.mode);
  const extras = activityModeExtras(stats.mode);

  return (
    <li className='linked'>
      <div className='icon mode'>{extras && extras.icon}</div>
      <div className='text'>
        <div className='name'>{(extras && extras.name) || definitionActivityMode?.displayProperties?.name}</div>
        {stats.killsDeathsRatio ? (
          <>
            <div className='minor-stats'>
              <div className='stat'>
                <div className='name'>{definitionActivityMode?.activityModeCategory > 1 ? t('Matches') : t('Activities')}</div>
                <div className='value'>{stats.activitiesEntered.basic.value.toLocaleString()}</div>
              </div>
              <div className='stat'>
                <div className='name'>{manifest.DestinyHistoricalStatsDefinition['kills'].statName}</div>
                <div className='value'>{stats.kills.basic.value.toLocaleString()}</div>
              </div>
              <div className='stat'>
                <div className='name'>{manifest.DestinyHistoricalStatsDefinition['deaths'].statName}</div>
                <div className='value'>{stats.deaths.basic.value.toLocaleString()}</div>
              </div>
            </div>
            <div className='stat kdr'>
              <div className='name'>K/D</div>
              <div className='value'>{Number.parseFloat(stats.killsDeathsRatio.basic.value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
          </>
        ) : (
          <div className='no-stats'>
            <div>{t('No stats available')}</div>
          </div>
        )}
      </div>
      <ProfileNavLink isActive={isActive(param, stats.mode)} to={{ pathname: stats.mode === parseInt(defaultMode, 10) ? root : `${root}/${stats.mode}`, state: {} }} onClick={handler_onClick} />
    </li>
  );
}
