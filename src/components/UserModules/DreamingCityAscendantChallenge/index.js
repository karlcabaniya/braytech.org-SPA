import React from 'react';

import { t, BungieText } from '../../../utils/i18n';
import manifest from '../../../utils/manifest';
import Records from '../../Records';

class DreamingCityAscendantChallenge extends React.Component {
  render() {
    const definitions = [4, 6, 8, 10, 12, 14];
    const definitionNode = manifest.BraytechMapsDefinition[definitions[this.props.cycleInfo.week.ascendant - 1]];

    return (
      <>
        <div className='sub-header'>
          <div>{t('Ascendant Challenge')}</div>
        </div>
        <h3>{definitionNode.displayProperties.name}</h3>
        <BungieText className='text' source={definitionNode.displayProperties.description} />
        <h4>{t('Triumphs')}</h4>
        <ul className='list record-items'>
          <Records selfLinkFrom='/this-week' hashes={definitionNode.related.records.map((record) => record.recordHash)} ordered showInvisible />
        </ul>
      </>
    );
  }
}

export default DreamingCityAscendantChallenge;
