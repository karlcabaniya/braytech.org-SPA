import React from 'react';
import { useParams } from 'react-router-dom';

import { t } from '../../../utils/i18n';
import manifest from '../../../utils/manifest';
import { activityModeExtras } from '../../../utils/destinyUtils';
import { ProfileNavLink } from '../../ProfileLink';

import { ResponsiveContainer, CartesianGrid, AreaChart, Area, Scatter, ScatterChart, XAxis, YAxis, Tooltip, ZAxis } from 'recharts';

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
              <div className='matches'>{data.historicalStats.activitiesEntered.basic.value.toLocaleString()}</div>
              <div className='stats'>
                <div>
                  <div className='name'>{definitionActivityMode?.activityModeCategory > 1 ? t('Matches') : t('Activities')}</div>
                  <div className='value'>{data.historicalStats.activitiesEntered.basic.value.toLocaleString()}</div>
                </div>
                {data.historicalStats.activitiesWon ? (
                  <div>
                    <div className='name'>Win rate</div>
                    <div className='value'>{Number.parseFloat((data.historicalStats.activitiesWon.basic.value / data.historicalStats.activitiesEntered.basic.value) * 100).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}%</div>
                  </div>
                ) : null}
                <div>
                  <div className='name'>{manifest.DestinyHistoricalStatsDefinition['kills'].statName}</div>
                  <div className='value'>{data.historicalStats.kills.basic.value.toLocaleString()}</div>
                </div>
                <div>
                  <div className='name'>K/D</div>
                  <div className='value'>{Number.parseFloat(data.historicalStats.killsDeathsRatio.basic.value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
      <ProfileNavLink isActive={isActive(param, data.mode)} to={{ pathname: data.mode === parseInt(defaultMode, 10) ? root : `${root}/${data.mode}`, state: {} }} onClick={handler_onClick} />
    </div>
  );
}

export function Details({ data, chart = { key: 'kills' } }) {
  if (!data.activityHistory || !data.activityHistory[0].values.standing) return null;
  
  const wins = data.activityHistory.map((activity, a) => ({ x: a, y: activity.values[chart.key].basic.value, z: activity.values.standing.basic.value === 0 ? 20 : 0 }));
  const losses = data.activityHistory.map((activity, a) => ({ x: a, y: activity.values[chart.key].basic.value, z: activity.values.standing.basic.value > 0 ? 20 : 0 }));

  return (
    <div className='modes details'>
      <h4>Last 100</h4>
      {/* <div className='chart'>
        <ResponsiveContainer width='100%' height={240} debounce={200}>
          <AreaChart data={data.activityHistory.map((activity, a) => ({ name: a, kills: activity.values.kills.basic.value, deaths: activity.values.deaths.basic.value }))}>
            <CartesianGrid strokeOpacity='0.2' horizontal={false} />
            <defs>
              <linearGradient id='deaths' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='#dc513b' stopOpacity={0.8} />
                <stop offset='95%' stopColor='#dc513b' stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type='monotone' dataKey='kills' stroke='#ffffff' fillOpacity={0} />
            <Area type='monotone' dataKey='deaths' stroke='#dc513b' fillOpacity={1} fill='url(#deaths)' />
          </AreaChart>
        </ResponsiveContainer>
      </div> */}
      <div className='chart'>
        <ResponsiveContainer width='100%' height={240} debounce={200}>
          <ScatterChart margin={{ left: 0, right: 5, top: 5, bottom: 5 }}>
            <CartesianGrid strokeOpacity='0.4' vertical={false} />
            <XAxis dataKey='x' type='number' domain={[0, 'dataMax']} hide={true} />
            <YAxis dataKey='y' strokeOpacity='0' tick={{ fill: '#ffffff', fillOpacity: '0.6' }} label={{ value: 'Kills', angle: -90, position: 'insideLeft', fill: '#ffffff', fillOpacity: '0.6', offset: 15 }} />
            <ZAxis dataKey='z' range={[0, 20]} />
            <Scatter name='wins' data={wins} fill='#ffffff' />
            <Scatter name='losses' data={losses} fill='#dc513b' />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <h4>Lifetime</h4>
      <div className='info'>More historical stats</div>
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
