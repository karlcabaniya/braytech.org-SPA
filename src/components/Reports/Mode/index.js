import React from 'react';
import { useParams } from 'react-router-dom';

import { t } from '../../../utils/i18n';
import manifest from '../../../utils/manifest';
import { activityModeExtras } from '../../../utils/destinyUtils';
import { formatHistoricalStatValue } from '../../../utils/destinyConverters';
import { ProfileNavLink } from '../../ProfileLink';

import { ResponsiveContainer, CartesianGrid, XAxis, YAxis, ZAxis, Legend, ReferenceLine, Tooltip, ScatterChart, Scatter } from 'recharts';

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

export default function Mode({ data, root = '/multiplayer/crucible', defaultMode = 5 }) {
  const { mode } = useParams();
  const param = parseInt(mode || defaultMode, 10);

  const definitionActivityMode = Object.values(manifest.DestinyActivityModeDefinition).find((d) => d.modeType === data.mode);
  const extras = activityModeExtras(data.mode);

  return (
    <div className='button mode'>
      <div className='basics'>
        <div className='icon mode'>{extras && extras.icon}</div>
        <div className='text'>
          <div className='name'>{(extras && extras.name) || definitionActivityMode?.displayProperties?.name}</div>
          {data.historicalStats ? (
            <>
              <div className='activities-entered'>{formatHistoricalStatValue('activitiesEntered', data.historicalStats.activitiesEntered.basic.value)}</div>
              <div className='stats'>
                <div>
                  <div className='name'>{definitionActivityMode?.activityModeCategory > 1 ? t('Matches') : t('Activities')}</div>
                  <div className='value'>{formatHistoricalStatValue('activitiesEntered', data.historicalStats.activitiesEntered.basic.value)}</div>
                </div>
                {data.historicalStats.activitiesWon ? (
                  <div>
                    <div className='name'>{manifest.DestinyHistoricalStatsDefinition['winRate'].statName}</div>
                    <div className='value'>{formatHistoricalStatValue('winRate', Number.parseFloat((data.historicalStats.activitiesWon.basic.value / data.historicalStats.activitiesEntered.basic.value) * 100))}</div>
                  </div>
                ) : null}
                <div>
                  <div className='name'>{manifest.DestinyHistoricalStatsDefinition['kills'].statName}</div>
                  <div className='value'>{data.historicalStats.kills.basic.value.toLocaleString()}</div>
                </div>
                <div>
                  <div className='name'>{manifest.DestinyHistoricalStatsDefinition['killsDeathsRatio'].statName}</div>
                  <div className='value'>{formatHistoricalStatValue('killsDeathsRatio', data.historicalStats.killsDeathsRatio.basic.value)}</div>
                </div>
              </div>
            </>
          ) : (
            <div className='info'>{t('Reports.Modes.NoStatsAvailable')}</div>
          )}
        </div>
      </div>
      <ProfileNavLink isActive={isActive(param, data.mode)} to={{ pathname: data.mode === parseInt(defaultMode, 10) ? root : `${root}/${data.mode}`, state: {} }} onClick={handler_onClick} />
    </div>
  );
}

const LIFETIME_STAT_KEYS = {
  PRIMARY: ['opponentsDefeated', 'kills', 'assists', 'deaths', 'killsDeathsRatio', 'killsDeathsAssists', 'efficiency'],
  AUXILIARY: [
    'averageLifespan',
    'longestSingleLife',
    'suicides',
    // 'averageDeathDistance',
    // 'bestSingleGameScore',
    'longestKillSpree',
    'bestSingleGameKills',
    'averageKillDistance',
    // 'precisionKills',
    // 'resurrectionsPerformed',
    // 'resurrectionsReceived',
    'secondsPlayed',
  ],
};

export function Details({ data, chart = { key: 'kills' } }) {
  console.log(data);
  if (!data.activityHistory) return null;

  const hasStanding = data.activityHistory[0].values.standing;

  const average = data.activityHistory.reduce((sum, activity) => sum + activity.values[chart.key].basic.value, 0) / data.activityHistory.length;

  // PvP modes with standing
  const wins = data.activityHistory.map((activity, a) => ({
    x: a,
    y: activity.values[chart.key].basic.value,
    z: activity.values.standing?.basic.value === 0 ? 20 : 0,
  }));
  const losses = data.activityHistory.map((activity, a) => ({
    x: a,
    y: activity.values[chart.key].basic.value,
    z: activity.values.standing?.basic.value > 0 ? 20 : 0,
  }));

  // PvE modes
  const flawless = data.activityHistory.map((activity, a) => ({
    x: a,
    y: activity.values[chart.key].basic.value,
    z: activity.values.deaths?.basic.value === 0 ? 20 : 0,
  }));
  const stat = data.activityHistory.map((activity, a) => ({
    x: a,
    y: activity.values[chart.key].basic.value,
    z: flawless[a].z === 0 ? 20 : 0,
  }));

  return (
    <div className='modes details'>
      <h5>{hasStanding ? t('Reports.Modes.Details.Last100.PvP.Name') : t('Reports.Modes.Details.Last100.PvE.Name')}</h5>
      <div className='chart'>
        <ResponsiveContainer width='100%' height={250} debounce={200}>
          <ScatterChart margin={{ left: 0, right: 5, top: 5, bottom: 15 }}>
            <CartesianGrid strokeOpacity='0.4' vertical={false} stroke='#ffffff' strokeOpacity='0.2' />
            <XAxis dataKey='x' type='number' domain={[0, 'dataMax']} hide={true} />
            <YAxis dataKey='y' strokeOpacity='0' tick={{ fill: '#ffffff', fillOpacity: '0.6' }} label={{ value: manifest.DestinyHistoricalStatsDefinition[chart.key].statName, angle: -90, position: 'insideLeft', fill: '#ffffff', fillOpacity: '0.6', offset: 10 }} />
            <ZAxis dataKey='z' range={[0, 20]} />
            <ReferenceLine y={average} stroke='#ffffff' strokeOpacity='0.6' strokeDasharray='4 5' />
            {hasStanding && <Scatter name={t('Reports.Modes.Details.Last100.PvP.DataPoint.Wins.Name')} data={wins} fill='#ffffff' />}
            {hasStanding && <Scatter name={t('Reports.Modes.Details.Last100.PvP.DataPoint.Losses.Name')} data={losses} fill='var(--error)' />}
            {!hasStanding && <Scatter name='stat' legendType='none' data={stat} fill='#ffffff' />}
            {!hasStanding && <Scatter name={t('Reports.Modes.Details.Last100.PvE.DataPoint.Flawless.Name')} data={flawless} fill='hsl(var(--tier-exotic))' />}
            <Legend align='center' iconSize={5} wrapperStyle={{ bottom: -10, color: 'rgba(255, 255, 255, 0.6)' }} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <h5>{t('Reports.Modes.Details.Lifetime.Name')}</h5>
      <div className='lifetime'>
        <ul>
          {LIFETIME_STAT_KEYS.PRIMARY.filter((key) => data.historicalStats[key]?.basic).map((key, k) => (
            <li key={k}>
              <ul>
                <li>{manifest.DestinyHistoricalStatsDefinition[key].statName}</li>
                <li>{formatHistoricalStatValue(key, data.historicalStats[key].basic.value)}</li>
              </ul>
            </li>
          ))}
        </ul>
        <ul>
          {LIFETIME_STAT_KEYS.AUXILIARY.filter((key) => data.historicalStats[key]?.basic).map((key, k) => (
            <li key={k}>
              <ul>
                <li>{manifest.DestinyHistoricalStatsDefinition[key].statName}</li>
                <li>{formatHistoricalStatValue(key, data.historicalStats[key].basic.value)}</li>
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// <Tooltip content={<CustomTooltip/>} wrapperStyle={{visibility: 'visible'}} active={true} isAnimationActive={false}  />

// const CustomTooltip = ({ active, payload, label }) => {
//   if (active) {
//     return (
//       <div id='tooltip' className='visible'>
//         <div className='acrylic' />
//         <div className='frame ui'>
//           <div className='header'>
//             <div className='name'></div>
//             <div className='kind'></div>
//           </div>
//           <div className='black'>
//             hi
//           </div>
//         </div>
//       </div>
//     )
//   } else {
//     return null;
//   }
// }
