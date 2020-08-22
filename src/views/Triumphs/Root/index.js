import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';

import { t } from '../../../utils/i18n';
import manifest from '../../../utils/manifest';
import duds from '../../../data/records/duds';
import unobtainable from '../../../data/records/unobtainable';
import { enumeratePresentationNodeState, enumerateRecordState, sealImages } from '../../../utils/destinyEnums';
import { isChildOfNodeVaulted } from '../../../utils/destinyUtils';
import { displayValue } from '../../../utils/destinyConverters';

import { ProfileLink } from '../../../components/ProfileLink';
import { unredeemedRecords } from '../../../components/Records';
import RecordsAlmost from '../../../components/RecordsAlmost';
import RecordsTracked from '../../../components/RecordsTracked';
import Search from '../../../components/Search';
import ObservedImage from '../../../components/ObservedImage';

function Root({ settings, member, ...props }) {
  const character = member.data.profile.characters.data.find((character) => character.characterId === member.characterId);
  const profilePresentationNodes = member.data.profile.profilePresentationNodes.data.nodes;
  const profileRecords = member.data.profile.profileRecords.data.records;
  const characterRecords = member.data.profile.characterRecords.data;

  const parent = manifest.DestinyPresentationNodeDefinition[manifest.settings.destiny2CoreSettings.recordsRootNode];
  const sealsParent = manifest.DestinyPresentationNodeDefinition[manifest.settings.destiny2CoreSettings.medalsRootNode];

  const nodes = [];
  const sealNodes = [];
  const recordsStates = [];

  // primary nodes
  parent.children.presentationNodes.forEach((child) => {
    const definitionNode = manifest.DestinyPresentationNodeDefinition[child.presentationNodeHash];
    const states = [];

    definitionNode.children.presentationNodes.forEach((nodeChild) => {
      const definitionNodeChildNode = manifest.DestinyPresentationNodeDefinition[nodeChild.presentationNodeHash];

      definitionNodeChildNode.children.presentationNodes.forEach((nodeChildNodeChild) => {
        const definitionNodeChildNodeChildNode = manifest.DestinyPresentationNodeDefinition[nodeChildNodeChild.presentationNodeHash];

        if (definitionNodeChildNodeChildNode.redacted) {
          return;
        }

        definitionNodeChildNodeChildNode.children.records.forEach((record) => {
          const definitionRecord = manifest.DestinyRecordDefinition[record.recordHash];

          const recordScope = definitionRecord.scope || 0;
          const recordData = recordScope === 1 ? characterRecords && characterRecords[member.characterId].records[definitionRecord.hash] : profileRecords && profileRecords[definitionRecord.hash];

          if (recordData) {
            // skip hardcoded duds
            if (settings.itemVisibility.hideDudRecords && duds.indexOf(record.recordHash) > -1) return;

            // skip hardcoded unobtainables
            if (recordData.intervalObjectives?.length) {
              if (settings.itemVisibility.hideUnobtainableRecords && recordData.intervalsRedeemedCount === 0 && unobtainable.indexOf(record.recordHash) > -1) return;
            } else {
              if (settings.itemVisibility.hideUnobtainableRecords && !enumerateRecordState(recordData.state).RecordRedeemed && unobtainable.indexOf(record.recordHash) > -1) return;
            }

            // skip those with the state of...
            if (settings.itemVisibility.hideInvisibleRecords && enumerateRecordState(recordData.state).Invisible) return;
            // if (settings.itemVisibility.hideInvisibleRecords && enumerateRecordState(recordData.state).Obscured) return;

            recordData.hash = definitionRecord.hash;
            recordData.scoreValue = (definitionRecord.completionInfo && definitionRecord.completionInfo.ScoreValue) || 0;

            states.push(recordData);
            recordsStates.push(recordData);
          }
        });
      });
    });

    const nodeProgress = states.filter((record) => enumerateRecordState(record.state).RecordRedeemed).length;
    const nodeTotal = states.length;

    nodes.push(
      <li key={definitionNode.hash} className={cx('linked', { completed: nodeTotal > 0 && nodeProgress === nodeTotal })}>
        {nodeTotal && nodeProgress !== nodeTotal ? <div className='progress-bar-background' style={{ width: `${(nodeProgress / nodeTotal) * 100}%` }} /> : null}
        <ObservedImage className='image icon' src={`https://www.bungie.net${definitionNode.originalIcon}`} />
        <div className='displayProperties'>
          <div className='name'>{definitionNode.displayProperties.name}</div>
          {nodeTotal ? (
            <div className='progress'>
              <span>{nodeProgress}</span> / {nodeTotal}
            </div>
          ) : null}
        </div>
        <ProfileLink to={`/triumphs/${definitionNode.hash}`} />
      </li>
    );
  });

  // seal nodes
  sealsParent.children.presentationNodes.forEach((child) => {
    const definitionSeal = manifest.DestinyPresentationNodeDefinition[child.presentationNodeHash];
    const definitionCompletionRecord = manifest.DestinyRecordDefinition[definitionSeal?.completionRecordHash];

    if (!definitionSeal || definitionSeal.redacted) {
      console.log(`Seal ${child.presentationNodeHash} is redacted or 404`);

      return;
    }

    const nodeData = profilePresentationNodes[definitionSeal.hash];

    if (enumeratePresentationNodeState(nodeData.state).Invisible || enumeratePresentationNodeState(nodeData.state).Obscured) {
      return null;
    }

    const nodeProgress = nodeData.progressValue;
    const nodeTotal = definitionSeal.hash === 1002334440 ? 24 : nodeData.completionValue;
    const isComplete = nodeProgress >= nodeTotal;

    const sealTitle = !definitionCompletionRecord.redacted && definitionCompletionRecord.titleInfo && definitionCompletionRecord.titleInfo.titlesByGenderHash[character.genderHash];

    // console.log(definitionSeal.displayProperties.name, enumeratePresentationNodeState(profilePresentationNodes[definitionSeal.hash].state), profilePresentationNodes[definitionSeal.hash])

    const hasVaultedChild = !settings.itemVisibility.suppressVaultWarnings && isChildOfNodeVaulted(definitionSeal.hash);

    sealNodes.push({
      completed: isComplete,
      element: (
        <li
          key={definitionSeal.hash}
          className={cx('linked', {
            completed: isComplete,
            expired: hasVaultedChild,
          })}
        >
          {!isComplete ? <div className='progress-bar-background' style={{ width: `${(nodeProgress / nodeTotal) * 100}%` }} /> : null}
          <ObservedImage className='image icon' src={sealImages[definitionSeal.hash] ? `/static/images/extracts/badges/${sealImages[definitionSeal.hash]}` : `https://www.bungie.net${definitionSeal.displayProperties.icon}`} />
          <div className='displayProperties'>
            <div className='name'>{sealTitle || definitionSeal.displayProperties.name}</div>
            {nodeTotal ? (
              <div className='progress'>
                <span>{nodeProgress}</span> / {nodeTotal}
              </div>
            ) : null}
          </div>
          <ProfileLink to={`/triumphs/seal/${definitionSeal.hash}`} />
        </li>
      ),
    });
  });

  const unredeemedTriumphLength = unredeemedRecords(member).map((record) => record.recordHash).length;
  const unredeemedTriumphScoreValue = unredeemedRecords(member).reduce((sum, record) => sum + record.scoreValue, 0);

  return (
    <>
      <div className='module'>
        <div className='sub-header'>
          <div>{t('Total score')}</div>
        </div>
        <div className='total-score'>{member.data.profile.profileRecords.data.score.toLocaleString()}</div>
        {unredeemedTriumphLength > 1 ? (
          <>
            <ul className='list record-items notification-unredeemed'>
              <li className='linked unredeemed'>
                <div className='text'>{t('{{unredeemed}} unredeemed triumphs', { unredeemed: unredeemedTriumphLength })}</div>
                <i className='segoe-mdl-arrow-right' />
                <ProfileLink to={{ pathname: '/triumphs/unredeemed', state: { from: '/triumphs' } }} />
              </li>
            </ul>
            <div className='info'>{t('Redeem these records and increase your triumph score by {{scoreValue}} points.', { scoreValue: displayValue(unredeemedTriumphScoreValue) })}</div>
          </>
        ) : null}
        <div className='sub-header'>
          <div>{t('Search')}</div>
        </div>
        <Search table='DestinyRecordDefinition' />
        <div className='sub-header'>
          <div>{t('Triumphs')}</div>
          <div>
            {recordsStates.filter((state) => !state.seal).filter((state) => enumerateRecordState(state.state).RecordRedeemed).length}/{recordsStates.filter((state) => !state.seal).length}
          </div>
        </div>
        <ul className='list parents'>{nodes}</ul>
        <div className='sub-header'>
          <div>{t('Seals')}</div>
          <div>
            {sealNodes.filter((n) => n.completed).length}/{sealNodes.length}
          </div>
        </div>
        <ul className='list parents seals'>{sealNodes.map((n) => n.element)}</ul>
      </div>
      <div className='module'>
        <div className='sub-header'>
          <div>{t('Almost complete')}</div>
        </div>
        <div className='almost-complete'>
          <RecordsAlmost limit='7' selfLinkFrom='/triumphs' pageLink />
        </div>
      </div>
      <div className='module'>
        <div className='sub-header'>
          <div>{t('Tracked records')}</div>
        </div>
        <div className='tracked'>
          <RecordsTracked limit='7' selfLinkFrom='/triumphs' pageLink />
        </div>
      </div>
    </>
  );
}

function mapStateToProps(state) {
  return {
    settings: state.settings,
    member: state.member,
  };
}

export default connect(mapStateToProps)(Root);
