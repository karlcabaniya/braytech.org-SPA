import React from 'react';
import { connect } from 'react-redux';

import { t, duration } from '../../../utils/i18n';
import manifest from '../../../utils/manifest';
import { Miscellaneous } from '../../../svg';

import './styles.css';

class TrialsOfOsiris extends React.Component {
  render() {
    const { member } = this.props;

    const definitionActivityMode = manifest.DestinyActivityModeDefinition[1673724806];

    const definitionProgression_wins = manifest.DestinyProgressionDefinition[1062449239];
    const definitionProgression_losses = manifest.DestinyProgressionDefinition[2093709363];

    const wins = member.data.profile.characterProgressions.data[member.characterId].progressions[1062449239].level;
    const losses = member.data.profile.characterProgressions.data[member.characterId].progressions[2093709363].level;

    return (
      <div className='user-module trials-of-osiris'>
        <div className='icon'>
          <Miscellaneous.TrialsOfOsirisDevice />
        </div>
        <div className='sub-header'>
          <div>{definitionActivityMode.displayProperties.name}</div>
        </div>
        <div className='text'>
          <p>
            <em>{definitionActivityMode.displayProperties.description}</em>
          </p>
        </div>
        <h4>{t('Game history')}</h4>
        <div className='history'>
          {definitionProgression_wins.steps.map((step, s) => {
            if (wins > s) {
              return (
                <div key={s} className='game win'>
                  <div />
                </div>
              );
            } else {
              return <div key={s} className='game' />;
            }
          })}
        </div>
        <div className='history'>
          {definitionProgression_losses.steps.map((step, s) => {
            if (losses > s) {
              return (
                <div key={s} className='game loss'>
                  <div />
                </div>
              );
            } else {
              return <div key={s} className='game' />;
            }
          })}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member
  };
}

export default connect(mapStateToProps)(TrialsOfOsiris);
