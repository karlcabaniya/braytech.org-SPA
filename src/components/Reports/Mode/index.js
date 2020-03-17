import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import cx from 'classnames';

import manifest from '../../../utils/manifest';
import { ProfileNavLink } from '../../ProfileLink';
import { Activities } from '../../../svg';

import './styles.css';

class Mode extends React.Component {
  render() {
    const { t, match, location, stats, root = '/multiplayer/crucible', defaultMode = 5 } = this.props;
    const modeParam = parseInt(match.params.mode || defaultMode, 10);
   
    const definitionActivityMode = Object.values(manifest.DestinyActivityModeDefinition).find(d => d.modeType === stats.mode);

    const modeExtras = [
      // Crucible
      {
        modes: [73],
        icon: <Activities.Crucible.Control />,
        name: manifest.DestinyActivityDefinition[3176544780].displayProperties.name
      },
      {
        modes: [37],
        icon: <Activities.Crucible.Survival />
      },
      {
        modes: [80],
        icon: <Activities.Crucible.Elimination />
      },
      {
        modes: [48],
        icon: <Activities.Crucible.Rumble />
      },
      {
        modes: [71],
        icon: <Activities.Crucible.Clash />,
        name: manifest.DestinyActivityDefinition[2303927902].displayProperties.name
      },
      {
        modes: [43],
        icon: <Activities.Crucible.IronBanner />,
        name: manifest.DestinyActivityDefinition[3753505781].displayProperties.name
      },
      {
        modes: [81],
        icon: <Activities.Crucible.MomentumControl />,
        name: manifest.DestinyActivityDefinition[952904835].displayProperties.name
      },
      {
        modes: [50],
        icon: <Activities.Crucible.Doubles />
      },
      {
        modes: [15],
        icon: <Activities.Crucible.CrimsonDoubles />
      },
      {
        modes: [31],
        icon: <Activities.Crucible.Supremacy />
      },
      {
        modes: [60],
        icon: <Activities.Crucible.Lockdown />
      },
      {
        modes: [65],
        icon: <Activities.Crucible.Breakthrough />
      },
      {
        modes: [59],
        icon: <Activities.Crucible.Showdown />
      },
      {
        modes: [38],
        icon: <Activities.Crucible.Countdown />
      },
      {
        modes: [25],
        icon: <Activities.Crucible.Mayhem />
      },
      {
        modes: [61, 62],
        icon: <Activities.Crucible.TeamScorched />
      },
      {
        modes: [84],
        icon: <Activities.Crucible.TrialsOfOsiris />
      },

      // Gambit
      {
        modes: [63],
        icon: <Activities.Gambit.Gambit />
      },
      {
        modes: [75],
        icon: <Activities.Gambit.GambitPrime />
      },
      {
        modes: [76],
        icon: <Activities.Gambit.Reckoning />
      },

      // Raid
      {
        modes: [4],
        icon: <Activities.Raid.Raid />
      },

      // Vanguard
      {
        modes: [18],
        icon: <Activities.Strikes.Strikes />
      },
      {
        modes: [46],
        icon: <Activities.Strikes.ScoredNightfallStrikes />
      },

      // Default
      {
        modes: [5],
        icon: <Activities.Crucible.Default />
      }
    ];

    const modeExtra = modeExtras.find(m => m.modes.includes(stats.mode));
    const isActive = (match, location) => {
      if (modeParam === stats.mode) {
        return true;
      } else {
        return false;
      }
    };
    
    return (
      <li className={cx('linked', { active: isActive(match, location) })}>
        <div className='icon'>
          {modeExtra && modeExtra.icon}
        </div>
        <div className='text'>
          <div className='name'>{(modeExtra && modeExtra.name) || definitionActivityMode?.displayProperties?.name}</div>
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
          ) : <div className='no-stats'><div>{t('No stats available')}</div></div>}
        </div>
        <ProfileNavLink isActive={isActive} to={{ pathname: stats.mode === parseInt(defaultMode, 10) ? root : `${root}/${stats.mode}`, state: {  } }} onClick={() => {
          let element = document.getElementById('matches');
          element.scrollIntoView({behavior: "smooth"});
        }} />
      </li>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member
  };
}

export default compose(
  connect(mapStateToProps),
  withTranslation(),
  withRouter
)(Mode);
