import React from 'react';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import { orderBy } from 'lodash';
import cx from 'classnames';
import moment from 'moment';
import Moment from 'react-moment';

import manifest from '../../../utils/manifest';
import * as enums from '../../../utils/destinyEnums';
import ObservedImage from '../../ObservedImage';

import { ReactComponent as CrucibleIconStandingVictory } from '../../../svg/crucible/standing-victory.svg';
import { ReactComponent as CrucibleIconStandingDefeat } from '../../../svg/crucible/standing-defeat.svg';
import { ReactComponent as CrucibleIconStandingVictoryGambit } from '../../../svg/gambit/standing-victory-gambit.svg';

class ReportHeader extends React.Component {
  render() {
    const { characterIds, activityDetails, period, entries } = this.props;

    const modeExtras = [
      {
        modes: [73],
        name: manifest.DestinyActivityDefinition[3176544780].displayProperties.name
      },
      {
        modes: [71],
        name: manifest.DestinyActivityDefinition[2303927902].displayProperties.name
      },
      {
        modes: [43],
        name: manifest.DestinyActivityDefinition[3753505781].displayProperties.name
      },
      {
        modes: [81],
        name: manifest.DestinyActivityDefinition[952904835].displayProperties.name
      },
      {
        modes: [4],
        name: manifest.DestinyActivityModeDefinition[2043403989].displayProperties.name
      }
    ];

    const modeExtra = modeExtras.find(m => m.modes.includes(activityDetails.mode));

    // map definition - Rusted Lands, etc
    const definitionMap = manifest.DestinyActivityDefinition[activityDetails.referenceId];

    // activity definition - specific strike
    const definitionActivity = manifest.DestinyActivityDefinition[activityDetails.directorActivityHash];

    // mode definition - control, survival, etc
    const definitionMode = manifest.DestinyActivityModeDefinition[definitionActivity?.directActivityModeHash];

    // get current character entry or entry with longest activityDurationSeconds
    const entry = entries && ((characterIds && entries.find(entry => characterIds.includes(entry.characterId))) || (entries.length && orderBy(entries, [e => e.values && e.values.activityDurationSeconds && e.values.activityDurationSeconds.basic.value], ['desc'])[0]));

    // add activityDurationSeconds to activity start time
    const realEndTime = moment(period).add(entry.values.activityDurationSeconds.basic.value, 'seconds');

    let mode = definitionMode?.displayProperties?.name;
    if (modeExtra?.name) {
      mode = modeExtra.name;
    } else if (definitionActivity?.directActivityModeType === 37) {
      mode = definitionActivity.displayProperties?.name;
    } else if (definitionActivity?.hash === 1166905690) {
      mode = definitionActivity.displayProperties.name;
    }

    return (
      <div className='basic'>
        <div className='mode'>{mode}</div>
        <div className='map'>{definitionMap?.displayProperties?.name}</div>
        <div className='ago'>
          <Moment fromNow withTitle>{realEndTime}</Moment>
        </div>
      </div>
    );
  }
}

class ReportHeaderLarge extends React.Component {
  render() {
    const { t, characterIds, activityDetails, period, entries, teams } = this.props;

    const modeExtras = [
      {
        modes: [73],
        name: manifest.DestinyActivityDefinition[3176544780].displayProperties.name
      },
      {
        modes: [71],
        name: manifest.DestinyActivityDefinition[2303927902].displayProperties.name
      },
      {
        modes: [43],
        name: manifest.DestinyActivityDefinition[3753505781].displayProperties.name
      },
      {
        modes: [81],
        name: manifest.DestinyActivityDefinition[952904835].displayProperties.name
      },
      {
        modes: [4],
        name: manifest.DestinyActivityModeDefinition[2043403989].displayProperties.name
      }
    ];

    const modeExtra = modeExtras.find(m => m.modes.includes(activityDetails.mode));

    // map definition - Rusted Lands, etc
    const definitionMap = manifest.DestinyActivityDefinition[activityDetails.referenceId];

    // activity definition - specific strike
    const definitionActivity = manifest.DestinyActivityDefinition[activityDetails.directorActivityHash];

    // mode definition - control, survival, etc
    const definitionMode = manifest.DestinyActivityModeDefinition[definitionActivity?.directActivityModeHash];

    // get current character entry or entry with longest activityDurationSeconds
    const entry = entries && ((characterIds && entries.find(entry => characterIds.includes(entry.characterId))) || (entries.length && orderBy(entries, [e => e.values && e.values.activityDurationSeconds && e.values.activityDurationSeconds.basic.value], ['desc'])[0]));

    // add activityDurationSeconds to activity start time
    const realEndTime = moment(period).add(entry.values.activityDurationSeconds.basic.value, 'seconds');

    // standing based on current character, if possible
    const standing = entry.values.standing && entry.values.standing.basic.value !== undefined ? entry.values.standing.basic.value : -1;

    // score total
    const scoreTotal = entry.values.score ? entries.reduce((v, e) => v + e.values.score.basic.value, 0) : false;

    // team scores
    const alpha = teams && teams.length ? teams.find(t => t.teamId === 17) : false;
    const bravo = teams && teams.length ? teams.find(t => t.teamId === 18) : false;
    const teamScores =
      teams && teams.length && alpha && bravo ? (
        <>
          <div className={cx('value', 'alpha', { victory: teams.find(t => t.teamId === 17 && t.standing.basic.value === 0) })}>{alpha.score.basic.displayValue}</div>
          <div className={cx('value', 'bravo', { victory: teams.find(t => t.teamId === 18 && t.standing.basic.value === 0) })}>{bravo.score.basic.displayValue}</div>
        </>
      ) : null;
    
    const simplifiedAcivityMode = enums.simplifiedAcivityModes.find(m => m.modes.indexOf(activityDetails.mode) > -1);

    const StandingVictorySVG = simplifiedAcivityMode?.name === 'gambit' ? CrucibleIconStandingVictoryGambit : CrucibleIconStandingVictory;

    let mode = definitionMode?.displayProperties?.name;
    if (modeExtra?.name) {
      mode = modeExtra.name;
    } else if (definitionActivity?.directActivityModeType === 37) {
      mode = definitionActivity.displayProperties?.name;
    } else if (definitionActivity?.hash === 1166905690) {
      mode = definitionActivity.displayProperties.name;
    }

    return (
      <div className={cx('head', simplifiedAcivityMode?.name)}>
        {definitionMap?.pgcrImage && <ObservedImage className='image bg' src={`https://www.bungie.net${definitionMap.pgcrImage}`} />}
        <div className='detail'>
          <div>
            <div className='mode'>{mode}</div>
            <div className='map'>{definitionMap?.displayProperties?.name}</div>
          </div>
          <div>
            <div className='duration'>{entry.values.activityDurationSeconds.basic.displayValue}</div>
            <div className='ago'>
              <Moment fromNow withTitle>{realEndTime}</Moment>
            </div>
          </div>
        </div>
        {standing > -1 ? (
          <>
            <div className='standing'>
              <div className='icon'>{standing === 0 ? <StandingVictorySVG /> : <CrucibleIconStandingDefeat />}</div>
              <div className='text'>{standing === 0 ? t('Victory') : t('Defeat')}</div>
            </div>
            <div className='score teams'>{teamScores}</div>
          </>
        ) : null}
        {scoreTotal && standing < 0 ? (
          <>
            <div className='score'>{scoreTotal.toLocaleString()}</div>
          </>
        ) : null}
      </div>
    );
  }
}

ReportHeader = compose(withTranslation())(ReportHeader);

ReportHeaderLarge = compose(withTranslation())(ReportHeaderLarge);

export { ReportHeader, ReportHeaderLarge };
