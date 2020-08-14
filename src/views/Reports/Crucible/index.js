import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { t } from '../../../utils/i18n';
import { GetHistoricalStats } from '../../../utils/bungie';
import { DestinyActivityModeType } from '../../../utils/destinyEnums';
import { useInterval } from '../../../utils/hooks';

import Spinner from '../../../components/UI/Spinner';
import Mode from '../../../components/Reports/Mode';
import Matches from '../../../components/Reports/Matches';

async function getStats(member) {
  const stats = {
    all: {
      allPvP: {
        mode: DestinyActivityModeType.AllPvP,
      },
    },
    core: {
      rumble: {
        mode: DestinyActivityModeType.Rumble,
      },
      controlQuickplay: {
        mode: DestinyActivityModeType.ControlQuickplay,
      },
      elimination: {
        mode: DestinyActivityModeType.Elimination,
      },
      survival: {
        mode: DestinyActivityModeType.Survival,
      },
      ironBannerControl: {
        mode: DestinyActivityModeType.IronBannerControl,
      },
      trials_of_osiris: {
        mode: DestinyActivityModeType.TrialsOfOsiris,
      },
    },
    rotator: {
      clashQuickplay: {
        mode: DestinyActivityModeType.ClashQuickplay,
      },
      momentum: {
        mode: DestinyActivityModeType.Momentum,
      },
      doubles: {
        mode: DestinyActivityModeType.Doubles,
      },
      crimsonDoubles: {
        mode: DestinyActivityModeType.CrimsonDoubles,
      },
      supremacy: {
        mode: DestinyActivityModeType.Supremacy,
      },
      lockdown: {
        mode: DestinyActivityModeType.Lockdown,
      },
      breakthrough: {
        mode: DestinyActivityModeType.Breakthrough,
      },
      showdown: {
        mode: DestinyActivityModeType.Showdown,
      },
      countdown: {
        mode: DestinyActivityModeType.Countdown,
      },
      allMayhem: {
        mode: DestinyActivityModeType.AllMayhem,
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
      <Matches mode={props.mode || DestinyActivityModeType.AllPvP} limit='40' offset={props.offset} root='/reports/crucible' />
    </div>
  );
}
