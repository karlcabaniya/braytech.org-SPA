import React from 'react';
import { useSelector } from 'react-redux';

import { t } from '../../../utils/i18n';
import manifest from '../../../utils/manifest';
import Items from '../../Items';

import './styles.css';

export default function CharacterEquipment() {
  const member = useSelector((state) => state.member);
  const character = member.data.profile.characters.data.find((c) => c.characterId === member.characterId);
  const characterEquipment = member.data.profile.characterEquipment.data;

  const equipment =
    characterEquipment[member.characterId].items.map((item) => {
      const definitionItem = manifest.DestinyInventoryItemDefinition[item.itemHash];

      if (definitionItem) {
        return {
          ...item,
          displayProperties: definitionItem.displayProperties,
          inventory: definitionItem.inventory,
        };
      } else {
        return false;
      }
    }) || [];

  // console.log(equipment);

  const weapons = [
    equipment.find(item => item.inventory.bucketTypeHash === 3284755031),
    equipment.find(item => item.inventory.bucketTypeHash === 1498876634),
    equipment.find(item => item.inventory.bucketTypeHash === 2465295065),
    equipment.find(item => item.inventory.bucketTypeHash === 953998645),
  ];
  
  const armor = [      
    equipment.find(item => item.inventory.bucketTypeHash === 3448274439),
    equipment.find(item => item.inventory.bucketTypeHash === 3551918588),
    equipment.find(item => item.inventory.bucketTypeHash === 14239492),
    equipment.find(item => item.inventory.bucketTypeHash === 20886954),
    equipment.find(item => item.inventory.bucketTypeHash === 1585787867),
  ];
  
  const aux = [      
    equipment.find(item => item.inventory.bucketTypeHash === 4023194814),
    equipment.find(item => item.inventory.bucketTypeHash === 2025709351),
    equipment.find(item => item.inventory.bucketTypeHash === 284967655),
    equipment.find(item => item.inventory.bucketTypeHash === 1506418338),
  ];

  return (
    <div className='user-module character-equipment'>
      <div className='sub-header'>
        <div>{t('Character equipment')}</div>
      </div>
      <h4>{manifest.DestinyPresentationNodeDefinition[1528930164].displayProperties.name}</h4>
      <ul className='list inventory-items'>
        <Items items={weapons} inspect />
      </ul>
      <h4>{manifest.DestinyPresentationNodeDefinition[1605042242].displayProperties.name}</h4>
      <ul className='list inventory-items'>
        <Items items={armor} inspect />
      </ul>
      <h4>{t('Auxiliary')}</h4>
      <ul className='list inventory-items'>
        <Items items={aux} inspect />
      </ul>
      <h4>{t('Stats')}</h4>
      <div className='stats'>
        {[
          {
            hash: 2996146975,
            icon: 'destiny-mobility',
            char: '',
          },
          {
            hash: 392767087,
            icon: 'destiny-resilience',
            char: '',
          },
          {
            hash: 1943323491,
            icon: 'destiny-recovery',
            char: '',
          },
          {
            hash: 1735777505,
            icon: 'destiny-discipline',
            char: '',
          },
          {
            hash: 144602215,
            icon: 'destiny-intellect',
            char: '',
          },
          {
            hash: 4244567218,
            icon: 'destiny-strength',
            char: '',
          },
        ].map((stat, i) => {
          return (
            <div key={i} className='stat tooltip' data-hash={stat.hash} data-type='stat'>
              <div className='value'>{character.stats[stat.hash] || 0}</div>
              <div className={stat.icon} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
