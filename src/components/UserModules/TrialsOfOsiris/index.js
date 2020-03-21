import React from 'react';
import { connect } from 'react-redux';

import { t } from '../../../utils/i18n';
import manifest from '../../../utils/manifest';
import ObservedImage from '../../../components/ObservedImage';
import { Miscellaneous } from '../../../svg';

import './styles.css';

const passages = [
  1600065451, // Passage of Mercy
  7665310,    // Passage of Ferocity
  1181381245, // Passage of Confidence
  2001563200, // Passage of Wisdom
  2879309661  // Passage of Wealth
];

const perkIcons = {
  989028955:  '0912-0DF0.png',
  1909797390: '0912-0DE1.png',
  713209933:  '0912-0DF7.png',
  628076592:  '0912-0DFE.png',
  1551708877: '0912-0DE8.png'
};

class TrialsOfOsiris extends React.Component {
  render() {
    const member = this.props.member;
    const characterInventory = member.data.profile.characterInventories.data?.[member.characterId].items;
    const progressions = member.data.profile.characterProgressions.data[member.characterId].progressions;

    const definitionActivityMode = manifest.DestinyActivityModeDefinition[1673724806];

    const definitionProgression_wins = manifest.DestinyProgressionDefinition[1062449239];
    const definitionProgression_losses = manifest.DestinyProgressionDefinition[2093709363];

    const wins = progressions[1062449239].level;
    const losses = progressions[2093709363].level;

    const passage = characterInventory?.find(item => passages.indexOf(item.itemHash) > -1);

    const definitionPassage = passage && manifest.DestinyInventoryItemDefinition[passage.itemHash];

    console.log(passage);

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
        {characterInventory ? (
          <>
            <h4>{t('Selected passage')}</h4>
            {passage ? (
              definitionPassage.perks.map((perk, p) => (
                <div key={p} className='passage'>
                  <div className='icon'>
                    <ObservedImage src={`/static/images/extracts/ui/overrides/${perkIcons[perk.perkHash]}`} />
                  </div>
                  <div className='text'>
                    <div className='name'>{manifest.DestinySandboxPerkDefinition[perk.perkHash].displayProperties.name}</div>
                    <div className='description'>{manifest.DestinySandboxPerkDefinition[perk.perkHash].displayProperties.description}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className='info'>{t('Begin your trial by speaking with Saint-14.')}</div>
            )}
          </>
        ) : null}
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
