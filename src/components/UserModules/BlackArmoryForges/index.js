import React from 'react';
import { useSelector } from 'react-redux';

import { t } from '../../../utils/i18n';
import manifest from '../../../utils/manifest';

import './styles.css';

export default function BlackArmoryForges() {
  const member = useSelector((state) => state.member);
  const characterActivities = member.data.profile.characterActivities.data;

  const dailyBlackArmoryForges = characterActivities[member.characterId].availableActivities.filter((a) => {
    const definitionActivity = manifest.DestinyActivityDefinition[a.activityHash];

    if (definitionActivity && definitionActivity.activityTypeHash === 838603889) {
      return true;
    } else {
      return false;
    }
  });

  return (
    <div className='user-module black-armory-forges'>
      <div className='sub-header'>
        <div>{t('Black Armory Forges')}</div>
      </div>
      <div className='text'>
        <p>
          <em>{t('UserModules.BlackArmoryForges.Description')}</em>
        </p>
      </div>
      <h4>{t('Available activities')}</h4>
      {dailyBlackArmoryForges.length ? (
        <ul className='list activities'>
          {dailyBlackArmoryForges.map((a, i) => {
            const definitionActivity = manifest.DestinyActivityDefinition[a.activityHash];

            return (
              <li key={i} className='linked tooltip' data-type='activity' data-hash={a.activityHash}>
                <div className='name'>{definitionActivity.selectionScreenDisplayProperties && definitionActivity.selectionScreenDisplayProperties.name ? definitionActivity.selectionScreenDisplayProperties.name : definitionActivity.displayProperties && definitionActivity.displayProperties.name ? definitionActivity.displayProperties.name : t('Unknown')}</div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className='info'>{t("There aren't any activities available to you. Perhaps you don't meet the requirements...")}</div>
      )}
    </div>
  );
}
