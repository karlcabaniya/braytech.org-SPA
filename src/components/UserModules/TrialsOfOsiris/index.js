import React from 'react';
import { useSelector } from 'react-redux';

import { t } from '../../../utils/i18n';
import manifest from '../../../utils/manifest';
import * as enums from '../../../utils/destinyEnums';
import TrialsNodes from '../../../components/UI/TrialsNodes';
import ObservedImage from '../../../components/ObservedImage';
import { Miscellaneous } from '../../../svg';

import './styles.css';

export default function TrialsOfOsiris() {
  const member = useSelector((state) => state.member);
  const characterInventory = member.data.profile.characterInventories.data?.[member.characterId].items;
  const progressions = member.data.profile.characterProgressions.data[member.characterId].progressions;

  const definitionActivityMode = manifest.DestinyActivityModeDefinition[1673724806];

  const wins = progressions[1062449239].level;
  const losses = progressions[2093709363].level;

  const passage = characterInventory?.find((item) => enums.trialsPassages.indexOf(item.itemHash) > -1);

  const definitionPassage = passage && manifest.DestinyInventoryItemDefinition[passage.itemHash];

  return (
    <div className='user-module trials-of-osiris'>
      <div className='icon'>
        <Miscellaneous.TrialsOfOsirisDevice />
      </div>
      <div className='sub-header'>
        <div>{definitionActivityMode.displayProperties.name}</div>
      </div>
      <div className='text'>
        <p>
          <em>{definitionActivityMode.displayProperties.description}</em>
        </p>
      </div>
      <h4>{t('Game history')}</h4>
      <TrialsNodes value={wins} />
      <TrialsNodes value={losses} losses />
      {characterInventory ? (
        <>
          <h4>{t('Selected passage')}</h4>
          {passage ? (
            definitionPassage.perks.map((perk, p) => (
              <div key={p} className='passage'>
                <div className='icon'>
                  <ObservedImage src={`/static/images/extracts/ui/overrides/${enums.trialsPerkIcons[perk.perkHash]}`} />
                </div>
                <div className='text'>
                  <div className='name'>{manifest.DestinySandboxPerkDefinition[perk.perkHash].displayProperties.name}</div>
                  <div className='description'>{manifest.DestinySandboxPerkDefinition[perk.perkHash].displayProperties.description}</div>
                </div>
              </div>
            ))
          ) : (
            <div className='info'>{t('UserModules.TrialsOfOsiris.Info')}</div>
          )}
        </>
      ) : null}
    </div>
  );
}
