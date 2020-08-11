import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { t } from '../../../utils/i18n';
import { GetHistoricalStats } from '../../../utils/bungie';
import { useInterval } from '../../../utils/hooks';

import Spinner from '../../../components/UI/Spinner';
import Mode from '../../../components/Reports/Mode';
import Matches from '../../../components/Reports/Matches';

async function getStats(member) {
  const stats = {
    all: {
      allPvP: {
        mode: 5,
      },
    },
    core: {
      rumble: {
        mode: 48,
      },
      controlQuickplay: {
        mode: 73,
      },
      elimination: {
        mode: 80,
      },
      survival: {
        mode: 37,
      },
      ironBannerControl: {
        mode: 43,
      },
      trials_of_osiris: {
        mode: 84,
      },
    },
    rotator: {
      clashQuickplay: {
        mode: 71,
      },
      momentum: {
        mode: 81,
      },
      doubles: {
        mode: 50,
      },
      crimsonDoubles: {
        mode: 15,
      },
      supremacy: {
        mode: 31,
      },
      lockdown: {
        mode: 60,
      },
      breakthrough: {
        mode: 65,
      },
      showdown: {
        mode: 59,
      },
      countdown: {
        mode: 38,
      },
      allMayhem: {
        mode: 25,
      },
    },
  };

  let [stats_allPvP, stats_core, stats_rotator] = await Promise.all([
    GetHistoricalStats(
      member.membershipType,
      member.membershipId,
      member.characterId,
      '1',
      Object.values(stats.all).map((m) => m.mode),
      '0'
    ),
    GetHistoricalStats(
      member.membershipType,
      member.membershipId,
      member.characterId,
      '1',
      Object.values(stats.core).map((m) => m.mode),
      '0'
    ),
    GetHistoricalStats(
      member.membershipType,
      member.membershipId,
      member.characterId,
      '1',
      Object.values(stats.rotator).map((m) => m.mode),
      '0'
    ),
  ]);

  stats_allPvP = (stats_allPvP && stats_allPvP.ErrorCode === 1 && stats_allPvP.Response) || [];
  stats_core = (stats_core && stats_core.ErrorCode === 1 && stats_core.Response) || [];
  stats_rotator = (stats_rotator && stats_rotator.ErrorCode === 1 && stats_rotator.Response) || [];

  for (const mode in stats_allPvP) {
    if (stats_allPvP.hasOwnProperty(mode)) {
      if (!stats_allPvP[mode].allTime) {
        continue;
      }

      Object.entries(stats_allPvP[mode].allTime).forEach(([key, value]) => {
        stats.all[mode][key] = value;
      });
    }
  }

  for (const mode in stats_core) {
    if (stats_core.hasOwnProperty(mode)) {
      if (!stats_core[mode].allTime) {
        continue;
      }

      Object.entries(stats_core[mode].allTime).forEach(([key, value]) => {
        stats.core[mode][key] = value;
      });
    }
  }

  for (const mode in stats_rotator) {
    if (stats_rotator.hasOwnProperty(mode)) {
      if (!stats_rotator[mode].allTime) {
        continue;
      }

      Object.entries(stats_rotator[mode].allTime).forEach(([key, value]) => {
        stats.rotator[mode][key] = value;
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
    <div className='type'>
      {state.stats ? (
        <div className='modes'>
          <div className='sub-header'>
            <div>{t('Core modes')}</div>
          </div>
          <div className='content'>
            <ul className='list modes'>
              {Object.values(state.stats.core).map((m) => (
                <Mode key={m.mode} stats={m} root='/reports/crucible' />
              ))}
            </ul>
          </div>
          <div className='sub-header'>
            <div>{t('Rotator modes')}</div>
          </div>
          <div className='content'>
            <ul className='list modes'>
              {Object.values(state.stats.rotator).map((m) => (
                <Mode key={m.mode} stats={m} root='/reports/crucible' />
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className='modes loading'>
          <Spinner />
        </div>
      )}
      <Matches mode={props.mode || 5} limit='40' offset={props.offset} root='/reports/crucible' />
    </div>
  );
}
