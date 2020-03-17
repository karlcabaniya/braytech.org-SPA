import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';

import { t } from '../../../utils/i18n';
import manifest from '../../../utils/manifest';
import { Common } from '../../../svg';

import './styles.css';

const singeMap = [
  {
    hash: 3362074814,
    className: 'void',
    char: '',
    svg: Common.Void
  },
  {
    hash: 3215384520,
    className: 'arc',
    char: '',
    svg: Common.Arc
  },
  {
    hash: 2558957669,
    className: 'solar',
    char: '',
    svg: Common.Solar
  }
];

class WeeklyVanguardSinge extends React.Component {
  render() {
    const characterActivities = this.props.member.data.profile.characterActivities.data;

    const vanguardStrikes = characterActivities[this.props.member.characterId].availableActivities.find(a => a.activityHash === 4252456044);
    const activeSinge = vanguardStrikes && singeMap.find(s => vanguardStrikes.modifierHashes.indexOf(s.hash) > -1);

    const activityNames = [
      {
        hash: 4252456044,
        table: 'DestinyActivityDefinition'
      },
      {
        hash: 3028486709,
        table: 'DestinyPresentationNodeDefinition'
      },
      {
        hash: 175275639,
        table: 'DestinyActivityModeDefinition'
      },
      {
        hash: 1117466231,
        table: 'DestinyPresentationNodeDefinition'
      }
    ]
      .map(l => {
        try {
          if (manifest[l.table][l.hash].displayProperties.name === 'Heroic Adventure') {
            return manifest[l.table][l.hash].displayProperties.name + 's';
          } else {
            return manifest[l.table][l.hash].displayProperties.name;
          }
        } catch (e) {
          return false;
        }
      })
      .map(n => n);

    if (vanguardStrikes && activeSinge) {
      const definitionSinge = manifest.DestinyActivityModifierDefinition[activeSinge.hash];

      const SVG = activeSinge.svg;

      return (
        <div className='user-module weekly-vanguard-singe'>
          <div className='sub-header'>
            <div>{t('Vanguard singe')}</div>
          </div>
          <h3>{definitionSinge.displayProperties.name}</h3>
          <div className='text'>
            <p>
              <em>{t('The elemental burn shared by most activities this week. These activities include {{activities}}.', { activities: activityNames.join(', ') })}</em>
            </p>
          </div>
          <div className={cx('icon', activeSinge.className)}>
            <div className='outer'>
              <SVG />
            </div>
            <div className='inner'>
              <SVG />
            </div>
            {/* <div className='name'>{definitionSinge.displayProperties.name}</div> */}
          </div>
        </div>
      );
    } else {
      return (
        <div className='user-module weekly-vanguard-singe'>
          <div className='sub-header'>
            <div>{t('Vanguard singe')}</div>
          </div>
          <h3>{t('Unknown')}</h3>
          <div className='text'>
            <p>{t('Vanguard Strikes are unavailable for this character.')}</p>
            <p>
              <em>{t('The elemental burn shared by most activities this week. These activities include {{activities}}.', { activities: activityNames.join(', ') })}</em>
            </p>
          </div>
        </div>
      );
    }
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member
  };
}

export default connect(mapStateToProps)(WeeklyVanguardSinge);
