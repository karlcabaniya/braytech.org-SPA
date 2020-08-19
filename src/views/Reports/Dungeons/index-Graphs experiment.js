import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { t } from '../../../utils/i18n';
import { GetHistoricalStats, GetActivityHistory } from '../../../utils/bungie';
import { DestinyActivityModeType } from '../../../utils/destinyEnums';
import { useInterval } from '../../../utils/hooks';

import Spinner from '../../../components/UI/Spinner';
import Mode from '../../../components/Reports/Mode';
import Matches from '../../../components/Reports/Matches';

import { AreaChart, Area, ResponsiveContainer } from 'recharts';

export default function Dungeons(props) {
  const auth = useSelector((state) => state.auth);
  const member = useSelector((state) => state.member);

  const [state, setState] = useState({
    loading: true,
    historicalStats: undefined,
    activityHistory: undefined,
  });

  async function updateData() {
    const { membershipType, membershipId, characterId } = member;

    setState((state) => ({
      ...state,
      loading: true,
    }));

    const [historicalStats, activityHistory] = await Promise.all([
      GetHistoricalStats(membershipType, membershipId, characterId, '1', DestinyActivityModeType.Dungeon, '0'),
      GetActivityHistory({
        params: {
          membershipType,
          membershipId,
          characterId,
          count: 250,
          mode: DestinyActivityModeType.Dungeon,
          page: 0,
        },
        withAuth: auth?.destinyMemberships?.find((d) => d.membershipId === membershipId) && true,
      }),
    ]);

    console.log(historicalStats, activityHistory);

    setState({
      loading: false,
      historicalStats: historicalStats.Response.dungeon.allTime,
      activityHistory: activityHistory.Response.activities,
    });
  }

  useEffect(() => {
    if (!state.stats) {
      updateData();
    }
  }, []);

  useInterval(() => {
    if (!state.loading) {
      updateData();
    }
  }, 60000);

  const data = [
    {
      name: 'Page A',
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: 'Page B',
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: 'Page C',
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: 'Page D',
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: 'Page E',
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: 'Page F',
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: 'Page G',
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

  return (
    <div className='type'>
      {state.historicalStats ? (
        <div className='modes'>
          <div className='sub-header'>
            <div>{t('Modes')}</div>
          </div>
          <div className='content'>
            <ResponsiveContainer height={280}>
              <AreaChart data={state.activityHistory.map((activity, a) => ({ name: a, kills: activity.values.kills.basic.value, deaths: activity.values.deaths.basic.value }))}>
                <defs>
                  <linearGradient id='colorPv' x1='0' y1='0' x2='0' y2='1'>
                    <stop offset='5%' stopColor='#ff0000' stopOpacity={0.8} />
                    <stop offset='95%' stopColor='#ff0000' stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type='monotone' dataKey='kills' stroke='#ffffff' fillOpacity={0} />
                <Area type='monotone' dataKey='deaths' stroke='#ff0000' fillOpacity={1} fill='url(#colorPv)' />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className='modes loading'>
          <Spinner />
        </div>
      )}
      <Matches mode={props.mode || DestinyActivityModeType.Dungeon} limit='40' offset={props.offset} root='/reports/dungeons' />
    </div>
  );
}
