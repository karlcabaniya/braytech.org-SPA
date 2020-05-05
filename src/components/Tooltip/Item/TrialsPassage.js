import React from 'react';

import { t, BungieText } from '../../../utils/i18n';
import manifest from '../../../utils/manifest';
import * as enums from '../../../utils/destinyEnums';
import ObservedImage from '../../ObservedImage';
import TrialsNodes from '../../UI/TrialsNodes';

const TrialsPassage = (props) => {
  const { itemHash, itemComponents } = props;

  const definitionItem = manifest.DestinyInventoryItemDefinition[itemHash];

  const wins = itemComponents.objectives?.find((o) => o.completionValue === 7)?.progress;
  const losses = itemComponents.objectives?.find((o) => o.completionValue === 3)?.progress;

  return (
    <>
      <BungieText className='description' value={definitionItem.displayProperties.description} />
      <h5>{t('Wins')}</h5>
      <TrialsNodes value={wins} />
      <h5>{t('Losses')}</h5>
      <TrialsNodes value={losses} losses />
      <div className='sockets perks one'>
        {definitionItem.perks
          .map((perk, p) => {
            const definitionPerk = manifest.DestinySandboxPerkDefinition[perk.perkHash];

            return (
              <div key={p} className='socket'>
                <div className='plug enabled'>
                  <ObservedImage className='image icon' src={`/static/images/extracts/ui/overrides/${enums.trialsPerkIcons[perk.perkHash]}`} />
                  <div className='text'>
                    <BungieText className='description' value={definitionPerk.displayProperties?.description} />
                  </div>
                </div>
              </div>
            );
          })
          .filter((c) => c)}
      </div>
    </>
  );
};

export default TrialsPassage;
