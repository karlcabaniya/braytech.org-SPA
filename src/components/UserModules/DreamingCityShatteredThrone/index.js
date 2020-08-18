import React from 'react';

import { t } from '../../../utils/i18n';
import Records from '../../Records';

import './styles.css';

export default function DreamingCityShatteredThrone() {
  const data = {
    triumphs: [
      2314271318, // Never Again (Complete Shattered Throne)
      1290451257, // Seriously, Never Again (Complete Shattered Throne, Solo, 0 deaths)
      3309476373, // A Thorny Predicament (1 Phase Vorgeth in the Shattered Throne)
      851701008, // Solo-nely (Complete Shattered Throne, Solo)
      1621950319, // Come at Me (Complete Shattered Throne, wearing full set of unpurified Reverie Dawn)
      2029263931, // Curse This (Complete Shattered Throne, 0 deaths)
      3024450468, // Katabasis (Eggs in Shattered Throne)
      1842255612, // Fideicide I (Bones in Shattered Throne)
      1859033175, // Cosmogyre II (Bones in Shattered Throne)
      1859033168, // Archiloquy (Bones in Shattered Throne)
      1859033171, // Brephos I (Bones in Shattered Throne)
    ],
    checklists: [
      {
        checklistId: 2609997025, // corrupted eggs
        items: [1101252162, 1101252163, 1101252168, 1101252169, 1101252171, 1101252172, 1101252173, 1101252174, 1101252175],
      },
      {
        checklistId: 1297424116, // ahamkara bones
        items: [1370818864, 1370818868, 1370818871, 1387596459],
      },
    ],
  };

  return (
    <>
      <div className='content'>
        <div className='sub-header'>
          <div>{t("Savathûn's Curse")}</div>
        </div>
        <h3>{t('The Shattered Throne')}</h3>
        <h4>{t('Triumphs')}</h4>
        <ul className='list record-items'>
          <Records selfLinkFrom='/this-week' hashes={data.triumphs} ordered showInvisible />
        </ul>
      </div>
    </>
  );
}
