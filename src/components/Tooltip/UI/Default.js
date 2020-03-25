import React from 'react';

import { BungieText } from '../../../utils/i18n';
import manifest from '../../../utils/manifest';

const Default = props => {
  const { itemHash, type } = props;

  const definition = type === 'braytech' ? manifest.BraytechDefinition[itemHash] : type === 'stat' ? manifest.DestinyStatDefinition[itemHash] || manifest.DestinyHistoricalStatsDefinition[itemHash] : type === 'modifier' ? manifest.DestinyActivityModifierDefinition[itemHash] : false;

  // description
  const description = definition && (definition.statDescription || (definition.displayProperties?.description !== '' && definition.displayProperties?.description));

  return description ? <BungieText value={description} /> : null;
};

export default Default;
