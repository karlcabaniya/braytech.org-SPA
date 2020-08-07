import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { t } from '../../../utils/i18n';
import { GetHistoricalStats } from '../../../utils/bungie';
import { useInterval } from '../../../utils/hooks';

import Spinner from '../../../components/UI/Spinner';
import Mode from '../../../components/Reports/Mode';
import Matches from '../../../components/Reports/Matches';

import ParentModeLinks from '../ParentModeLinks';

async function getStats(member) {
  const stats = {
    all: {
      allStrikes: {
        mode: 18,
      },
      scored_nightfall: {
        mode: 46,
      },
    },
  };

  let [stats_all] = await Promise.all([
    GetHistoricalStats(
      member.membershipType,
      member.membershipId,
      member.characterId,
      '1',
      Object.values(stats.all).map((m) => m.mode),
      '0'
    ),
  ]);

  stats_all = (stats_all && stats_all.ErrorCode === 1 && stats_all.Response) || [];

  for (const mode in stats_all) {
    if (stats_all.hasOwnProperty(mode)) {
      if (!stats_all[mode].allTime) {
        continue;
      }

      Object.entries(stats_all[mode].allTime).forEach(([key, value]) => {
        stats.all[mode][key] = value;
      });
    }
  }

  return stats;
}

export default function Crucible(props) {
  const member = useSelector((state) => state.member);

  const [state, setState] = useState({
    loading: true,
    stats: undefined,
  });

  async function updateStats() {
    const { membershipType, membershipId, characterId } = member;

    setState((state) => ({
      ...state,
      loading: true,
    }));

    const stats = await getStats({
      membershipType,
      membershipId,
      characterId,
    });

    setState({
      loading: false,
      stats,
    });
  }

  useEffect(() => {
    if (!state.stats) {
      updateStats();
    }
  }, []);

  useInterval(() => {
    if (!state.loading) {
      updateStats();
    }
  }, 60000);

  return (
    <div className='view strikes' id='multiplayer'>
      <div className='module-l1'>
        <div className='module-l2'>
          <div className='content head'>
            <div className='page-header'>
              <div className='sub-name'>{t('Post Game Carnage Reports')}</div>
              <div className='name'>{t('Strikes')}</div>
            </div>
          </div>
        </div>
        <div className='module-l2'>
          <ParentModeLinks />
        </div>
        <div className='module-l2'>
          <div className='content'>
            {state.stats ? (
              <ul className='list modes'>
                {Object.values(state.stats.all).map((m) => (
                  <Mode key={m.mode} stats={m} root='/reports/strikes' defaultMode='18' />
                ))}
              </ul>
            ) : (
              <Spinner mini />
            )}
          </div>
        </div>
      </div>
      <div className='module-l1'>
        <Matches mode={props.mode || 18} limit='40' offset={props.offset} root='/reports/strikes' />
      </div>
    </div>
  );
}
