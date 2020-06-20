import React from 'react';
import { connect } from 'react-redux';
import { orderBy } from 'lodash';
import cx from 'classnames';

import { t } from '../../utils/i18n';
import manifest from '../../utils/manifest';
import duds from '../../data/records/duds';
import unobtainable from '../../data/records/unobtainable';
import { enumerateRecordState } from '../../utils/destinyEnums';
import { ProfileLink } from '../../components/ProfileLink';
import Records from '../Records';

class RecordsAlmost extends React.Component {
  scrollToRecordRef = React.createRef();

  render() {
    const { settings, member, sort, limit, selfLinkFrom = false } = this.props;
    const characterRecords = member && member.data.profile.characterRecords.data;
    const profileRecords = member && member.data.profile.profileRecords.data.records;

    let almost = [];
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

    const records = {
      ...profileRecords,
      ...characterRecords[member.characterId].records,
    };

    Object.entries(records).forEach(([key, recordData]) => {
      const hash = +key;

      if (settings.itemVisibility.hideUnobtainableRecords && unobtainable.indexOf(hash) > -1) {
        return;
      }

      if (settings.itemVisibility.hideDudRecords && duds.indexOf(hash) > -1) {
        return;
      }

      if (!manifest.DestinyRecordDefinition[hash] || manifest.DestinyRecordDefinition[hash].redacted) {
        return;
      }

      if (ignores.includes(hash)) {
        return;
      }

      const enumeratedState = enumerateRecordState(recordData.state);

      if (enumeratedState.RecordRedeemed || !enumeratedState.ObjectiveNotCompleted) return;
      if (settings.itemVisibility.hideInvisibleRecords && (enumeratedState.Obscured || enumeratedState.Invisible)) return;

      let completionValueDiviser = 0;
      let progressValueDecimal = 0;

      if (recordData.intervalObjectives) {
        const nextIndex = recordData.intervalObjectives.findIndex((o) => !o.complete);
        const lastIndex = nextIndex - 1 || 0;

        if (!recordData.intervalObjectives[nextIndex]) return;

        // if (hash === 759958308) console.log(recordData, recordData.intervalObjectives[lastIndex], recordData.intervalObjectives[nextIndex]);

        const progress = lastIndex > -1 ? recordData.intervalObjectives[nextIndex].progress - recordData.intervalObjectives[lastIndex].completionValue : recordData.intervalObjectives[nextIndex].progress;
        const completionValue = lastIndex > -1 ? recordData.intervalObjectives[nextIndex].completionValue - recordData.intervalObjectives[lastIndex].completionValue : recordData.intervalObjectives[nextIndex].completionValue;

        // console.log(progress, completionValue)

        completionValueDiviser += 1;
        progressValueDecimal += Math.min(progress / completionValue, 1);
      } else if (recordData.objectives) {
        recordData.objectives.forEach((objective) => {
          completionValueDiviser += 1;
          progressValueDecimal += Math.min((objective.progress || 0) / (objective.completionValue || 1), 1);
        });
      } else {
        return;
      }

      const distance = progressValueDecimal / completionValueDiviser;

      if (distance >= completionValueDiviser) {
        return;
      }

      const definitionRecord = manifest.DestinyRecordDefinition[hash];
      const score = definitionRecord?.completionInfo?.ScoreValue || 0;

      // if (hash === 61221277) console.log(definitionRecord.displayProperties.name, distance, progressValueDecimal, completionValueDiviser);

      almost.push({
        distance,
        score,
        commonality: manifest.statistics.triumphs?.[definitionRecord.hash] || 0,
        recordHash: definitionRecord.hash,
      });
    });

    if (sort === 1) {
      almost = orderBy(almost, [(record) => record.score, (record) => record.distance], ['desc', 'desc']);
    } else if (sort === 2) {
      almost = orderBy(almost, [(record) => record.commonality, (record) => record.distance], ['desc', 'desc']);
    } else {
      almost = orderBy(almost, [(record) => record.distance, (record) => record.score], ['desc', 'desc']);
    }

    almost = limit ? almost.slice(0, limit) : almost;

    return (
      <>
        <ul className={cx('list record-items')}>
          <Records selfLinkFrom={selfLinkFrom} hashes={almost.map((record) => record.recordHash)} />
        </ul>
        {this.props.pageLink ? (
          <ProfileLink className='button' to={{ pathname: '/triumphs/almost-complete', state: { from: '/triumphs' } }}>
            <div className='text'>{t('See next {{limit}}', { limit: 200 })}</div>
          </ProfileLink>
        ) : null}
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    settings: state.settings,
    member: state.member,
  };
}

export default connect(mapStateToProps)(RecordsAlmost);
