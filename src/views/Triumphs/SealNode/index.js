import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import cx from 'classnames';

import { t } from '../../../utils/i18n';
import manifest from '../../../utils/manifest';
import { commonality } from '../../../utils/destinyUtils';
import { sealImages } from '../../../utils/destinyEnums';
import ObservedImage from '../../../components/ObservedImage';
import Records from '../../../components/Records';

function SealNode({ match, member, ...props }) {
  const characters = member.data.profile.characters.data;
  const character = characters.find((character) => character.characterId === member.characterId);
  const profilePresentationNodes = member.data.profile.profilePresentationNodes.data.nodes;

  const definitionSeal = manifest.DestinyPresentationNodeDefinition[match.params.secondary];
  const definitionCompletionRecord = manifest.DestinyRecordDefinition[definitionSeal?.completionRecordHash];

  const nodeData = profilePresentationNodes[definitionSeal.hash];

  const nodeProgress = nodeData.progressValue;
  const nodeTotal = definitionSeal.hash === 1002334440 ? 24 : nodeData.completionValue;
  const isComplete = nodeTotal && nodeProgress >= nodeTotal;

  const sealTitle = !definitionCompletionRecord.redacted && definitionCompletionRecord.titleInfo && definitionCompletionRecord.titleInfo.titlesByGenderHash[character.genderHash];

  return (
    <div className='node seal'>
      <div className='children'>
        <div className='icon'>
          <div className='corners t' />
          <ObservedImage className='image' src={sealImages[definitionSeal.hash] ? `/static/images/extracts/badges/${sealImages[definitionSeal.hash]}` : `https://www.bungie.net${definitionSeal.displayProperties.icon}`} />
          <div className='corners b' />
        </div>
        <div className='text'>
          <div className='name'>{definitionSeal.displayProperties.name}</div>
          <div className='description'>{definitionSeal.displayProperties.description}</div>
        </div>
        <div className='until'>
          {nodeTotal && isComplete ? <h4 className='completed'>{t('Seal completed')}</h4> : <h4>{t('Seal progress')}</h4>}
          <div className='progress'>
            <div className='text'>
              <div className='title'>{sealTitle}</div>
              {nodeTotal ? (
                <div className='fraction'>
                  {nodeProgress}/{nodeTotal}
                </div>
              ) : null}
            </div>
            <div className={cx('bar', { completed: isComplete })}>
              {nodeTotal ? (
                <div
                  className='fill'
                  style={{
                    width: `${(nodeProgress / nodeTotal) * 100}%`,
                  }}
                />
              ) : null}
            </div>
          </div>
        </div>
        {manifest.statistics.triumphs?.[definitionSeal.completionRecordHash] ? (
          <div className='commonality'>
            <h4>{t('Seal commonality')}</h4>
            <div className='value tooltip' data-hash='commonality' data-type='braytech' data-related={definitionSeal.completionRecordHash}>
              {commonality(manifest.statistics.triumphs?.[definitionSeal.completionRecordHash]).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%
            </div>
            <div className='description'>{t("The seal's rarity represented as a percentage of players who are indexed by VOLUSPA.")}</div>
          </div>
        ) : null}
      </div>
      <div className='entries'>
        <ul className='list tertiary record-items'>
          <Records hashes={definitionSeal.children.records.map((child) => child.recordHash)} highlight={match.params.tertiary} />
        </ul>
      </div>
    </div>
  );
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    collectibles: state.collectibles,
  };
}

export default compose(withRouter, connect(mapStateToProps))(SealNode);
