import React from 'react';
import { useSelector } from 'react-redux';
import { orderBy } from 'lodash';

import { t, BraytechText } from '../../../utils/i18n';
import manifest from '../../../utils/manifest';
import * as enums from '../../../utils/destinyEnums';
import Records from '../../Records';

import './styles.css';

export default function NightmareHunts() {
  const member = useSelector((state) => state.member);
  const characterActivities = member.data.profile.characterActivities.data;

  // const nightmareStrings = Object.values(manifest.DestinyActivityDefinition).filter(a => a.destinationHash === 290444260 && a.directActivityModeType === 2 && a.displayProperties?.name && a.displayProperties?.name !== '' && a.displayProperties.name.indexOf('Nightmare') > -1);

  // const lol = nightmareStrings.map(def => {
  //   return (`{
  //     storyHash: ${def.hash},    // ${def.displayProperties.name.replace('Nightmare Hunt: ', '')}
  //     activities: ${JSON.stringify(Object.values(manifest.DestinyActivityDefinition).filter(a => a.destinationHash === 290444260 && a.hash !== def.hash && a.displayProperties?.name && a.displayProperties?.name !== '' && a.displayProperties.name.indexOf(def.displayProperties.name) > -1).map(d => d.hash))}
  //   }`)
  // }).join(',\n')

  //const activeHunts = characterActivities[member.characterId].availableActivities.filter(a => nightmareHunts.find(h => h.activities.includes(a.activityHash)));
  const activeHunts = enums.nightmareHunts.filter((h) => h.activities.find((a) => characterActivities[member.characterId].availableActivities.find((c) => c.activityHash === a)));

  // console.log(activeHunts);

  return (
    <div className='user-module nightmare-hunts'>
      <div className='sub-header'>
        <div>{manifest.DestinyDestinationDefinition[290444260].displayProperties?.name}</div>
      </div>
      <h3>{t('Nightmare Hunts')}</h3>
      <BraytechText className='text' value={t('UserModules.NightmareHunts.Description')} />
      <h4>{t('Available activities')}</h4>
      {activeHunts.length ? (
        <>
          <ul className='list activities'>
            {activeHunts.map((a, i) => {
              const masterHash = orderBy(a.activities, [(hash) => manifest.DestinyActivityDefinition[hash].activityLightLevel], ['desc'])?.[0];

              const definitionActivity = manifest.DestinyActivityDefinition[masterHash];

              return (
                <li key={i} className='linked tooltip' data-type='activity' data-hash={definitionActivity.hash} data-mode='175275639'>
                  <div className='name'>{manifest.DestinyActivityDefinition[a.storyHash]?.displayProperties.name.replace('Nightmare Hunt: ', '')}</div>
                </li>
              );
            })}
          </ul>
          <h4>{t('Triumphs')}</h4>
          <ul className='list record-items'>
            <Records selfLinkFrom='/this-week' hashes={activeHunts.map((a, i) => a.triumphs).flat()} ordered />
          </ul>
        </>
      ) : (
        <div className='info'>{t("There aren't any activities available to you. Perhaps you don't meet the requirements...")}</div>
      )}
    </div>
  );
}
