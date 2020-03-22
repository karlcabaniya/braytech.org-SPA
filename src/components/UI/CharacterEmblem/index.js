import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import cx from 'classnames';

import { t } from '../../../utils/i18n';
import * as utils from '../../../utils/destinyUtils';
import { displayValue } from '../../../utils/destinyConverters';
import ObservedImage from '../../ObservedImage';

import './styles.css';

class CharacterEmblem extends React.Component {
  render() {
    const { member, onboarding, characterSelect, responsive } = this.props;

    if (member.data && !onboarding && !characterSelect) {
      const groups = member.data.groups;
      const profile = member.data.profile.profile;
      const characters = member.data.profile.characters.data;
      const characterEquipment = member.data.profile.characterEquipment.data;

      const characterId = this.props.characterId || member.characterId;

      const character = characters.find(c => c.characterId === characterId);

      const emblem = characterEquipment[character.characterId].items.find(i => i.bucketHash === 4274335291);
      const metricImages = emblem?.metricHash && utils.metricImages(emblem.metricHash);

      return (
        <div className={cx('character-emblem', { responsive })}>
          <div className='wrapper'>
            <ObservedImage
              className={cx('image', 'emblem', {
                missing: !character.emblemBackgroundPath
              })}
              src={`https://www.bungie.net${character.emblemBackgroundPath ? character.emblemBackgroundPath : `/img/misc/missing_icon_d2.png`}`}
            />
            {metricImages ? (
              <div className='metric'>
                <div className='progress'>{displayValue(emblem.metricObjective.progress, emblem.metricObjective.objectiveHash)}</div>
                <div className={cx('gonfalon', { complete: emblem.metricObjective.complete })}>
                  <ObservedImage className='image banner' src={`https://www.bungie.net${metricImages.banner}`} />
                  <ObservedImage className='image trait' src={`https://www.bungie.net${metricImages.trait}`} />
                  <ObservedImage className='image metric' src={`https://www.bungie.net${metricImages.metric}`} />
                  <ObservedImage className='image banner complete' src='/static/images/extracts/ui/metrics/01E3-10F0.png' />
                </div>
              </div>
            ) : null}
            <div className='displayName'>{profile.data.userInfo.displayName}</div>
            <div className='group'>{groups && groups.results && groups.results.length ? groups.results[0].group.name : ''}</div>
            <div className='light'>{character.light}</div>
          </div>
        </div>
      );
    } else if (onboarding && !characterSelect) {
      return (
        <div className={cx('character-emblem', 'auxiliary', { responsive })}>
          <div className='wrapper'>
            <div className='abs'>
              <div className='text'>{t('Select a character')}</div>
              <div className='icon'><i className='segoe-uniE0AB' /></div>
              <Link to={{ pathname: '/character-select', state: { from: { pathname: '/maps' } } }} />
            </div>
          </div>
        </div>
      );
    } else if (characterSelect) {
      return (
        <div className={cx('character-emblem', 'auxiliary', { responsive })}>
          <div className='wrapper'>
            <div className='abs'>
              <div className='text'>{t('Change profile')}</div>
              <div className='icon'><i className='segoe-uniE0AB' /></div>
              <Link to={{ pathname: '/character-select', state: { from: { pathname: '/maps' } } }} />
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member
  };
}

export default connect(mapStateToProps)(CharacterEmblem);