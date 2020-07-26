import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import cx from 'classnames';

import manifest from '../../../utils/manifest';
import duds from '../../../data/records/duds';
import unobtainable from '../../../data/records/unobtainable';
import { enumerateRecordState } from '../../../utils/destinyEnums';
import { isChildOfNodeVaulted } from '../../../utils/destinyUtils';
import { ProfileNavLink } from '../../../components/ProfileLink';
import ObservedImage from '../../../components/ObservedImage';
import Records from '../../../components/Records';

const classNodes = {
  0: [2761465119],
  1: [2623445341],
  2: [555927954],
};

class PresentationNode extends React.Component {
  render() {
    const { settings, member } = this.props;
    const characterRecords = member.data.profile.characterRecords.data;
    const profileRecords = member.data.profile.profileRecords.data.records;
    const characters = member.data.profile.characters.data;
    const character = characters.find((character) => character.characterId === member.characterId);

    const primaryHash = this.props.match.params.primary;
    const definitionPrimary = manifest.DestinyPresentationNodeDefinition[primaryHash] || manifest.DestinyPresentationNodeDefinition[4230728762]; // defaults to account

    const secondaryHash =
      !this.props.match.params.secondary && definitionPrimary?.children.presentationNodes.find((child) => classNodes[character.classType].includes(child.presentationNodeHash))
        ? // no node specified but found a class-specific node to default to
          definitionPrimary.children.presentationNodes.find((child) => classNodes[character.classType].includes(child.presentationNodeHash)).presentationNodeHash
        : !this.props.match.params.secondary || !manifest.DestinyPresentationNodeDefinition[this.props.match.params.secondary]
        ? // default to first node is no hash or can't find hash
          definitionPrimary?.children.presentationNodes[0].presentationNodeHash
        : this.props.match.params.secondary;

    const definitionSecondary = manifest.DestinyPresentationNodeDefinition[secondaryHash];

    const tertiaryHash =
      !this.props.match.params.tertiary && definitionSecondary?.children.presentationNodes.find((child) => classNodes[character.classType].includes(child.presentationNodeHash))
        ? // no node specified but found a class-specific node to default to
          definitionSecondary.children.presentationNodes.find((child) => classNodes[character.classType].includes(child.presentationNodeHash)).presentationNodeHash
        : !this.props.match.params.tertiary || !manifest.DestinyPresentationNodeDefinition[this.props.match.params.tertiary]
        ? // default to first node is no hash or can't find hash
          definitionSecondary?.children.presentationNodes[0].presentationNodeHash
        : this.props.match.params.tertiary;

    const definitionTertiary = manifest.DestinyPresentationNodeDefinition[tertiaryHash];

    const quaternaryHash = this.props.match.params.quaternary;

    const primaryChildren = definitionPrimary.children.presentationNodes.map((node, n) => {
      const definitionNode = manifest.DestinyPresentationNodeDefinition[node.presentationNodeHash];

      const isActive = (match, location) => {
        if (definitionSecondary.hash === node.presentationNodeHash) {
          return true;
        } else {
          return false;
        }
      };

      return (
        <li key={n} className='linked'>
          <ProfileNavLink isActive={isActive} to={`/triumphs/${primaryHash}/${definitionNode.hash}`}>
            <ObservedImage className='image icon' src={`${!definitionNode.displayProperties.localIcon ? 'https://www.bungie.net' : ''}${definitionNode.displayProperties.icon}`} />
          </ProfileNavLink>
        </li>
      );
    });

    const secondaryChildren = definitionSecondary.children.presentationNodes
      .filter((child) => !manifest.DestinyPresentationNodeDefinition[child.presentationNodeHash].redacted)
      .map((child) => {
        const definitionNode = manifest.DestinyPresentationNodeDefinition[child.presentationNodeHash];

        const states = definitionNode.children.records
          .map((record) => {
            const definitionRecord = manifest.DestinyRecordDefinition[record.recordHash];
            const scopeRecord = definitionRecord.scope || 0;
            const recordData = scopeRecord === 1 ? characterRecords[member.characterId].records[definitionRecord.hash] : profileRecords[definitionRecord.hash];

            // skip hardcoded duds
            if (settings.itemVisibility.hideDudRecords && duds.indexOf(record.recordHash) > -1) return false;

            // skip hardcoded unobtainables
            if (recordData.intervalObjectives?.length) {
              if (settings.itemVisibility.hideUnobtainableRecords && recordData.intervalsRedeemedCount === 0 && unobtainable.indexOf(record.recordHash) > -1) return false;
            } else {
              if (settings.itemVisibility.hideUnobtainableRecords && !enumerateRecordState(recordData.state).RecordRedeemed && unobtainable.indexOf(record.recordHash) > -1) return false;
            }

            // skip those with the state of...
            if (settings.itemVisibility.hideInvisibleRecords && enumerateRecordState(recordData.state).Invisible) return false;

            return recordData;
          })
          .filter((record) => record);

        function isActive(match, location) {
          if (definitionTertiary.hash === child.presentationNodeHash) {
            return true;
          } else {
            return false;
          }
        }

        const secondaryProgress = states.filter((record) => enumerateRecordState(record.state).RecordRedeemed).length;
        const secondaryTotal = settings.itemVisibility.hideInvisibleRecords ? states.filter((record) => !enumerateRecordState(record.state).Invisible).length : states.length;

        if (secondaryTotal === 0) {
          return null;
        }

        const hasVaultedChild = !settings.itemVisibility.suppressVaultWarnings && isChildOfNodeVaulted(definitionNode.hash);

        return (
          <li key={definitionNode.hash} className={cx('linked', { completed: secondaryProgress === secondaryTotal && secondaryTotal !== 0, active: definitionTertiary.hash === child.presentationNodeHash, expired: hasVaultedChild })}>
            <div className='text'>
              <div className='name'>{definitionNode.displayProperties.name}</div>
              <div className='progress'>
                <span>{secondaryProgress}</span> / {secondaryTotal}
              </div>
            </div>
            <ProfileNavLink isActive={isActive} to={`/triumphs/${primaryHash}/${secondaryHash}/${definitionNode.hash}`} />
          </li>
        );
      });

    const recordHashes = definitionTertiary.children.records
      .filter((record) => {
        const definitionRecord = manifest.DestinyRecordDefinition[record.recordHash];
        const scopeRecord = definitionRecord.scope || 0;
        const recordData = scopeRecord === 1 ? characterRecords[member.characterId].records[definitionRecord.hash] : profileRecords[definitionRecord.hash];

        // skip hardcoded duds
        if (settings.itemVisibility.hideDudRecords && duds.indexOf(record.recordHash) > -1) return false;

        // skip hardcoded unobtainables
        if (recordData.intervalObjectives?.length) {
          if (settings.itemVisibility.hideUnobtainableRecords && recordData.intervalsRedeemedCount === 0 && unobtainable.indexOf(record.recordHash) > -1) return false;
        } else {
          if (settings.itemVisibility.hideUnobtainableRecords && !enumerateRecordState(recordData.state).RecordRedeemed && unobtainable.indexOf(record.recordHash) > -1) return false;
        }

        // skip those with the state of... 
        if (settings.itemVisibility.hideInvisibleRecords && enumerateRecordState(recordData.state).Invisible) return false;

        return true;
      })
      .map((record) => record.recordHash);

    return (
      <div className='node'>
        <div className='header'>
          <div className='name'>
            {definitionPrimary.displayProperties.name}
            {definitionPrimary.children.presentationNodes.length > 1 ? <span>{definitionSecondary.displayProperties.name}</span> : null}
          </div>
        </div>
        <div className='children'>
          <ul
            className={cx('list', 'primary', {
              'single-primary': definitionPrimary.children.presentationNodes.length === 1,
            })}
          >
            {primaryChildren}
          </ul>
          <ul className='list secondary'>{secondaryChildren}</ul>
        </div>
        <div className='entries'>
          <ul className='list tertiary record-items'>
            <Records hashes={recordHashes} highlight={quaternaryHash} readLink={primaryHash === '564676571'} />
          </ul>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    settings: state.settings,
    member: state.member,
  };
}

export default compose(withRouter, connect(mapStateToProps))(PresentationNode);
