import React from 'react';
import { useSelector } from 'react-redux';
import { orderBy } from 'lodash';
import cx from 'classnames';

import { t } from '../../utils/i18n';
import manifest from '../../utils/manifest';
import duds from '../../data/records/duds';
import unobtainable from '../../data/records/unobtainable';
import { enumerateRecordState } from '../../utils/destinyEnums';
import { ProfileLink } from '../../components/ProfileLink';
import Records from '../Records';

export default function RecordsAlmost({ sort, limit, selfLinkFrom = false, ...props }) {
  const settings = useSelector((state) => state.settings);
  const member = useSelector((state) => state.member);

  const characterRecords = member.data?.profile.characterRecords.data;
  const profileRecords = member.data?.profile.profileRecords.data.records;

  // build a list of extra ignores

  const ignores = [];

  // ignore collections badges
  manifest.DestinyPresentationNodeDefinition[manifest.settings.destiny2CoreSettings.badgesRootNode].children.presentationNodes.forEach((child) => {
    ignores.push(manifest.DestinyPresentationNodeDefinition[child.presentationNodeHash].completionRecordHash);
    manifest.DestinyPresentationNodeDefinition[child.presentationNodeHash].children.presentationNodes.forEach((subchild) => {
      ignores.push(manifest.DestinyPresentationNodeDefinition[subchild.presentationNodeHash].completionRecordHash);
    });
  });

  // ignore MMXIX bullshit
  manifest.DestinyPresentationNodeDefinition[1002334440].children.records.forEach((record) => {
    ignores.push(record.recordHash);
  });

  // ignore seal completion records
  manifest.DestinyPresentationNodeDefinition[1652422747].children.presentationNodes.forEach((node) => {
    const definitionSeal = manifest.DestinyPresentationNodeDefinition[node.presentationNodeHash];

    ignores.push(definitionSeal.completionRecordHash);
  });

  // collect all the records and prepare them for ordering

  const records = Object.entries({
    ...profileRecords,
    ...characterRecords[member.characterId].records,
  })
    .map(([key, data]) => {
      const hash = +key;

      if (settings.itemVisibility.hideUnobtainableRecords && unobtainable.indexOf(hash) > -1) {
        return false;
      }

      if (settings.itemVisibility.hideDudRecords && duds.indexOf(hash) > -1) {
        return false;
      }

      if (!manifest.DestinyRecordDefinition[hash] || manifest.DestinyRecordDefinition[hash].redacted) {
        return false;
      }

      if (ignores.includes(hash)) {
        return false;
      }

      const enumeratedState = enumerateRecordState(data.state);

      if (enumeratedState.RecordRedeemed || !enumeratedState.ObjectiveNotCompleted) return false;
      if (settings.itemVisibility.hideInvisibleRecords && (enumeratedState.Obscured || enumeratedState.Invisible)) return false;

      const definitionRecord = manifest.DestinyRecordDefinition[hash];

      const record = {
        hash,
        completionValueDiviser: 0,
        progressValueDecimal: 0,
        score: definitionRecord?.completionInfo?.ScoreValue || 0,
        commonality: manifest.statistics.triumphs?.[definitionRecord.hash] || 0,
        distance: 0,
      };

      if (data.intervalObjectives) {
        const nextIndex = data.intervalObjectives.findIndex((o) => !o.complete);
        const lastIndex = nextIndex - 1 || 0;

        if (!data.intervalObjectives[nextIndex]) return false;

        // if (hash === 759958308) console.log(recordData, recordData.intervalObjectives[lastIndex], recordData.intervalObjectives[nextIndex]);

        const progress = lastIndex > -1 ? data.intervalObjectives[nextIndex].progress - data.intervalObjectives[lastIndex].completionValue : data.intervalObjectives[nextIndex].progress;
        const completionValue = lastIndex > -1 ? data.intervalObjectives[nextIndex].completionValue - data.intervalObjectives[lastIndex].completionValue : data.intervalObjectives[nextIndex].completionValue;

        record.completionValueDiviser += 1;
        record.progressValueDecimal += Math.min(progress / completionValue, 1);

        record.score = definitionRecord.intervalInfo?.intervalObjectives?.[nextIndex]?.intervalScoreValue || record.score || 0;
      } else if (data.objectives) {
        data.objectives.forEach((objective) => {
          record.completionValueDiviser += 1;
          record.progressValueDecimal += Math.min((objective.progress || 0) / (objective.completionValue || 1), 1);
        });
      } else {
        return false;
      }

      record.distance = record.progressValueDecimal / record.completionValueDiviser;

      if (record.distance >= record.completionValueDiviser) {
        return false;
      }

      return record;
    })
    // filter out the falsies
    .filter((record) => record);

  // order the records

  let ordered = [];

  if (sort === 1) {
    ordered = orderBy(records, [(record) => record.score, (record) => record.distance], ['desc', 'desc']);
  } else if (sort === 2) {
    ordered = orderBy(records, [(record) => record.commonality, (record) => record.distance], ['desc', 'desc']);
  } else {
    ordered = orderBy(records, [(record) => record.distance, (record) => record.score], ['desc', 'desc']);
  }

  // limit so nothing melts

  ordered = limit ? ordered.slice(0, limit) : ordered;

  return (
    <>
      <ul className={cx('list record-items')}>
        <Records selfLinkFrom={selfLinkFrom} hashes={ordered.map((record) => record.hash)} />
      </ul>
      {props.pageLink ? (
        <ProfileLink className='button' to={{ pathname: '/triumphs/almost-complete', state: { from: '/triumphs' } }}>
          <div className='text'>{t('See next {{limit}}', { limit: 200 })}</div>
        </ProfileLink>
      ) : null}
    </>
  );
}
