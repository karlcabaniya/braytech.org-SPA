import React from 'react';
import { connect } from 'react-redux';
import { transform, isEqual, isObject } from 'lodash';
import cx from 'classnames';

import { t } from '../../../utils/i18n';
import manifest from '../../../utils/manifest';
import ObservedImage from '../../ObservedImage';
import { ProfileLink } from '../../ProfileLink';
import { enumerateRecordState } from '../../../utils/destinyEnums';
import { selfLinkRecord, recordDescription } from '../../Records';

import './styles.css';

/**
 * Deep diff between two object, using lodash
 * @param  {Object} object Object compared
 * @param  {Object} base   Object to compare with
 * @return {Object}        Return a new object who represent the diff
 */

function difference(object, base) {
  function changes(object, base) {
    return transform(object, function(result, value, key) {
      if (!isEqual(value, base[key])) {
        result[key] = isObject(value) && isObject(base[key]) ? changes(value, base[key]) : value;
      }
    });
  }
  return changes(object, base);
}

class NotificationProgress extends React.Component {
  state = {
    progress: {
      type: false,
      hash: false,
      number: 0,
      timedOut: true
    }
  };

  timer = false;

  // this method hides the toast after 10 seconds and unloads the setTimeout
  // if there are any changes to component props, it may also be called by componentDidUpdate
  timeOut = () => {
    if (!this.timer && !this.state.progress.timedOut && this.state.progress.hash) {
      this.timer = setTimeout((prevState = this.state) => {
        this.timer = false;

        console.log('timed out');

        this.setState(p => ({
          progress: {
            ...p.progress,
            timedOut: true
          }
        }));
      }, 10000);
    }
  };

  componentDidUpdate(p) {
    this.timeOut();

    const member = this.props.member;
    const fresh = this.props.member.data;
    const stale = this.props.member.prevData || false;

    if (p.member.membershipId !== this.props.member.membershipId) {
      // console.log('membershipId mismatch');
      return;
    }

    if (!stale) {
      // console.log('not stale yet');
      return;
    }

    if (!this.state.progress.timedOut) {
      // console.log('not timed out yet');
      return;
    }

    const records = {
      ...difference(fresh.profile.profileRecords.data.records, stale.profile.profileRecords.data.records),
      ...difference(fresh.profile.characterRecords.data[member.characterId].records, stale.profile.characterRecords.data[member.characterId].records)
    };

    // console.log(records);

    const progress = {
      type: false,
      hash: false,
      number: 0,
      timedOut: false
    };

    if (Object.keys(records).length > 0) {
      Object.keys(records).forEach(key => {
        if (records[key].state === undefined) {
          return;
        }

        const state = enumerateRecordState(records[key].state);

        if (!state.objectiveNotCompleted) {
          if (progress.hash) {
            progress.number = progress.number + 1;
            return;
          }

          progress.type = 'record';
          progress.hash = key;
          progress.number = progress.number + 1;
        }
      });
    }

    if (this.state.progress.timedOut && progress.type && this.state.progress.hash !== progress.hash) {
      this.setState({
        progress
      });
    }
  }

  render() {
    if (this.state.progress.type === 'record') {
      const definitionRecord = manifest.DestinyRecordDefinition[this.state.progress.hash];

      const link = selfLinkRecord(definitionRecord.hash);     

      return (
        <div id='notification-progress' className={cx('record', { lore: definitionRecord.loreHash, timedOut: this.state.progress.timedOut })}>
          <div className='type'>
            <div className='text'>{t('Triumph completed')}</div>
          </div>
          <div className='item'>
            <div className='properties'>
              <div className='name'>{definitionRecord?.displayProperties.name}</div>
              <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${definitionRecord.displayProperties.icon || manifest.settings.destiny2CoreSettings.undiscoveredCollectibleImage}`} noConstraints />
              <div className='description'>{recordDescription(definitionRecord.hash)}</div>
            </div>
            {this.state.progress.number > 1 ? <div className='more'>{t('And {{number}} more', { number: this.state.progress.number - 1 })}</div> : null}
          </div>
          {link ? <ProfileLink to={link} /> : null}
        </div>
      );
    } else {
      return null;
    }
  }
}

function mapStateToProps(s) {
  return {
    member: s.member
  };
}

export default connect(mapStateToProps)(NotificationProgress);
