import React from 'react';
import { useSelector } from 'react-redux';

import { t } from '../../../utils/i18n';
import manifest from '../../../utils/manifest';

import ProgressBar from '../../UI/ProgressBar';
import { Destinations } from '../../../svg';

import './styles.css';

const iconMap = {
  126924919: Destinations.ArcadianValley, // destinationHash: icon
  2388758973: Destinations.NewPacificArcology,
  1199524104: Destinations.EuropeanDeadZone,
  359854275: Destinations.TheTangledShore,
  308080871: Destinations.HellasBasin,
  1993421442: Destinations.FieldsOfGlass,
  2218917881: Destinations.EchoMesa,
};

const vendorMap = {
  126924919: 1576276905, // destinationHash: vendorHash
  2388758973: 1062861569,
  1199524104: 396892126,
  359854275: 863940356,
  308080871: 1735426333,
  1993421442: 2398407866,
  2218917881: 3982706173,
};

const vendorBubbleMap = {
  1576276905: 4205285323, // vendorHash: bubbleHash
  1062861569: 1291433366,
  396892126: 3091570009,
  863940356: 1608679832,
  1735426333: 1461622515,
  2398407866: 2822410613,
  3982706173: 577912749,
};

const MILESTONE_FLASHPOINT = 463010297;

export default function Flashpoint() {
  const member = useSelector((state) => state.member);
  const milestones = member.data.milestones;

  const definitionMilestoneFlashpoint = manifest.DestinyMilestoneDefinition[463010297];

  const milestoneFlashpointQuestItem = definitionMilestoneFlashpoint?.quests[milestones?.[463010297]?.availableQuests?.[0]?.questItemHash];
  const destinationHash = milestoneFlashpointQuestItem?.destinationHash;

  if (!milestones || !destinationHash) {
    return (
      <div className='user-module flashpoint'>
        <div className='page-header'>
          <div className='sub-name'>{definitionMilestoneFlashpoint?.displayProperties?.name}</div>
          <div className='name'>{t('Unknown')}</div>
        </div>
        <div className='info'>{t('Beep-boop?')}</div>
      </div>
    );
  }

  const definitionFlashpointVendor = vendorMap[destinationHash] && manifest.DestinyVendorDefinition[vendorMap[destinationHash]];
  const definitionFlashpointFaction = definitionFlashpointVendor && manifest.DestinyFactionDefinition[definitionFlashpointVendor.factionHash];

  const Icon = iconMap[destinationHash] || null;

  const vendorName = definitionFlashpointVendor?.displayProperties?.name;
  const locationName = manifest.DestinyDestinationDefinition[destinationHash]?.bubbles.find((b) => b.hash === vendorBubbleMap[definitionFlashpointVendor.hash])?.displayProperties?.name;

  const objective = member.data.profile?.characterProgressions.data[member.characterId].milestones[MILESTONE_FLASHPOINT]?.availableQuests?.[0]?.status?.stepObjectives?.[0];

  return (
    <div className='user-module flashpoint'>
      <div className='icon'>{Icon && <Icon />}</div>
      <div className='page-header'>
        <div className='sub-name'>{definitionMilestoneFlashpoint.displayProperties && definitionMilestoneFlashpoint.displayProperties.name}</div>
        <div className='name'>{manifest.DestinyDestinationDefinition[destinationHash].displayProperties.name}</div>
      </div>
      <ProgressBar {...objective} hideCheck />
      {definitionFlashpointVendor?.displayProperties ? (
        <div className='text'>
          <p>{t('{{vendorName}} is waiting for you at {{destinationName}}.', { vendorName, destinationName: locationName })}</p>
          <p>
            <em>{definitionFlashpointFaction?.displayProperties?.description}</em>
          </p>
        </div>
      ) : (
        <div className='info'>{t('Beep-boop?')}</div>
        )}
    </div>
  );
}
