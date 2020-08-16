import React from 'react';

import { t, BraytechText } from '../../../utils/i18n';
import Collectibles from '../../Collectibles';
import Items from '../../Items';

import './styles.css';

export default function EscalationProtocol({ cycleInfo }) {
  const rotation = {
    1: {
      boss: {
        name: t('UserModules.EscalationProtocol.NurAbath.Name'),
        description: t('UserModules.EscalationProtocol.NurAbath.Description'),
      },
      items: [
        // https://github.com/Bungie-net/api/issues/732
        3243866699, // Worldline Ideasthesia: Torsion
      ],
      collectibles: [
        1041306082, // IKELOS_SG
      ],
    },
    2: {
      boss: {
        name: t('UserModules.EscalationProtocol.Kathok.Name'),
        description: t('UserModules.EscalationProtocol.Kathok.Description'),
      },
      triumphs: [],
      items: [
        3243866698, // Worldline Ideasthesia: Anarkhiia
      ],
      collectibles: [
        2998976141, // IKELOS_SMG
      ],
    },
    3: {
      boss: {
        name: t('UserModules.EscalationProtocol.Damkath.Name'),
        description: t('UserModules.EscalationProtocol.Damkath.Description'),
      },
      triumphs: [],
      items: [
        // https://youtu.be/lrPf16ZHevU?t=104
        3243866697, //Worldline Ideasthesia: Cavalry
      ],
      collectibles: [
        1203091693, // IKELOS_SR
      ],
    },
    4: {
      boss: {
        name: t('UserModules.EscalationProtocol.Naksud.Name'),
        description: t('UserModules.EscalationProtocol.Naksud.Description'),
      },
      triumphs: [],
      items: [
        3243866696, //  Worldline Ideasthesia: Faktura
      ],
      collectibles: [
        1041306082, // IKELOS_SG
        2998976141, // IKELOS_SMG
        1203091693, // IKELOS_SR
      ],
    },
    5: {
      boss: {
        name: t('UserModules.EscalationProtocol.BokLitur.Name'),
        description: t('UserModules.EscalationProtocol.BokLitur.Description'),
      },
      triumphs: [],
      items: [
        3243866703, // Worldline Ideasthesia: Black Square
      ],
      collectibles: [
        1041306082, // IKELOS_SG
        2998976141, // IKELOS_SMG
        1203091693, // IKELOS_SR
      ],
    },
  };

  return (
    <div className='user-module escalation-protocol'>
      <div className='sub-header'>
        <div>{t('Escalation Protocol')}</div>
      </div>
      <h3>{rotation[cycleInfo.week.ep].boss.name}</h3>
      <BraytechText className='text' value={rotation[cycleInfo.week.ep].boss.description} />
      <h4>{t('Collectibles')}</h4>
      <ul className='list collection-items'>
        <Collectibles selfLinkFrom='/this-week' hashes={rotation[cycleInfo.week.ep].collectibles} />
      </ul>
      <h4>{t('Catalyst item')}</h4>
      <ul className='list inventory-items as-panels'>
        <Items
          items={rotation[cycleInfo.week.ep].items.map((i) => {
            return {
              itemHash: i,
            };
          })}
          asPanels
        />
      </ul>
      <div className='info'>{t('UserModules.EscalationProtocol.Info')}</div>
    </div>
  );
}
