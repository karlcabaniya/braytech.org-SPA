import fs from 'fs';
import path from 'path';
import Manifest from '../manifest.js';
import _ from 'lodash';

import worthy from './worthy.json';

import data from '../../src/data/checklists/index.json';

import BraytechMaps_EN from '../../src/data/manifest/en/BraytechMaps/index.json';

import DestinyActivityDefinition_EN from '../../src/data/manifest/en/DestinyActivityDefinition/index.json';
import DestinyDestinationDefinition_EN from '../../src/data/manifest/en/DestinyDestinationDefinition/index.json';

const checklists = [
  4178338182, // adventures
  1697465175, // regionChests
  3142056444, // lostSectors
  1297424116, // ahamkaraBones
  2609997025, // corruptedEggs
  2726513366, // catStatues
  365218222, // sleeperNodes
  2360931290, // ghostScans
  2955980198, // latentMemories
  1912364094, // jadeRabbits
  2137293116, // Savathûn's Eyes
  530600409, // Calcified Light
];

const presentationNodes = [
  1420597821, // ghostStories
  3305936921, // awokenOfTheReef
  655926402, // forsakenPrince
  2474271317, // inquisitionOfTheDamned
  4285512244, // lunasLost
];

function mergeWithCustomizer(a, b) {
  if (Array.isArray(a) && b && Array.isArray(b)) {
    return b.concat(a);
  } else if (typeof a === 'string' && b && typeof b === 'string') {
    return b;
  } else if (typeof a === 'number' && b && typeof b === 'number') {
    return b;
  } else if (typeof a === 'object') {
    return _.mergeWith(a, b, mergeWithCustomizer);
  }

  return a;
}

const customsMerge = (a, b) => {
  return _.mergeWith(a, b, mergeWithCustomizer);
};

async function run() {
  const manifest = await Manifest.getManifest();

  customsMerge(manifest.DestinyActivityDefinition, DestinyActivityDefinition_EN);
  customsMerge(manifest.DestinyDestinationDefinition, DestinyDestinationDefinition_EN);

  function checklistItem(checklistId, checklistItem) {
    const existing = (data[checklistId] && data[checklistId].find((c) => c.checklistHash === checklistItem.hash)) || {};

    const definitionDestination = manifest.DestinyDestinationDefinition[existing.destinationHash];
    const definitionPlace = definitionDestination && manifest.DestinyPlaceDefinition[definitionDestination.placeHash];

    const definitionBubble = definitionDestination && _.find(definitionDestination.bubbles, { hash: existing.bubbleHash });
    const bubbleName = definitionBubble && definitionBubble.displayProperties.name;

    const extendedDefinitionBubble = existing.extended && definitionDestination && _.find(definitionDestination.bubbles, { hash: existing.extended.bubbleHash });
    const extendedBubbleName = extendedDefinitionBubble && extendedDefinitionBubble.displayProperties.name;

    // If the item has a name with a number in it, extract it so we can use it later
    // for sorting & display
    const numberMatch = checklistItem.displayProperties.name.match(/([0-9]+)/);
    const itemNumber = numberMatch && numberMatch[0];

    const points = (existing.map && existing.map.points) || [];

    const recordHash = existing.recordHash || undefined;

    let name = bubbleName || (definitionDestination && definitionDestination.displayProperties.name) || '';
    if (manifest.DestinyChecklistDefinition[365218222].entries.find((h) => h.hash === checklistItem.hash)) {
      name = manifest.DestinyInventoryItemDefinition[checklistItem.itemHash].displayProperties.description.replace('CB.NAV/RUN.()', '');
    } else if (checklistItem.activityHash) {
      name = manifest.DestinyActivityDefinition[checklistItem.activityHash].displayProperties.name;
    }
    // else if (recordHash) {
    //   const definitionRecord = manifest.DestinyRecordDefinition[recordHash];
    //   const definitionLore = manifest.DestinyLoreDefinition[definitionRecord.loreHash];

    //   if (definitionLore) name = definitionLore.displayProperties.name;
    // }

    // if (checklistItem.hash === 2127236170) console.log(itemNumber, name)
    // if (name === '') console.log(itemNumber)

    const screenshot = searchScreenshots('screenshots/checklists/sleeper-nodes', name.toLowerCase().replace(/|/g, '').replace(/'/g, '').replace(/ /g, '-'));

    if (screenshot) fs.renameSync(screenshot, `screenshots/checklists/sleeper-nodes/${name.toLowerCase().replace(/|/g, '').replace(/'/g, '').replace(/ /g, '-')}-${checklistItem.hash}.png`);

    // const screenshot = searchScreenshots('public/static/images/screenshots/checklists/sleeper-nodes', name.toLowerCase().replace(/|/g, '').replace(/'/g, '').replace(/ /g, '-'));

    // if (screenshot) fs.renameSync(
    //   screenshot,
    //   `public/static/images/screenshots/checklists/sleeper-nodes/${name.toLowerCase().replace(/|/g, '').replace(/'/g, '').replace(/ /g, '-')}-${checklistItem.hash}.jpg`
    // );
  }

  function presentationItems(presentationHash, dropFirst = true) {
    const root = manifest.DestinyPresentationNodeDefinition[presentationHash];
    let recordHashes = root.children.records.map((r) => r.recordHash);
    if (dropFirst) recordHashes = recordHashes.slice(1);

    recordHashes.forEach((hash, itemNumber) => {
      const existing = (data[presentationHash] && data[presentationHash].find((c) => c.recordHash === hash)) || {};

      const definitionDestination = manifest.DestinyDestinationDefinition[existing.destinationHash];
      const definitionPlace = definitionDestination && manifest.DestinyPlaceDefinition[definitionDestination.placeHash];

      const definitionBubble = definitionDestination && _.find(definitionDestination.bubbles, { hash: existing.bubbleHash });
      const bubbleName = definitionBubble && definitionBubble.displayProperties.name;

      const extendedDefinitionBubble = existing.extended && definitionDestination && _.find(definitionDestination.bubbles, { hash: existing.extended.bubbleHash });
      const extendedBubbleName = extendedDefinitionBubble && extendedDefinitionBubble.displayProperties.name;

      const points = (existing.map && existing.map.points) || [];

      // let name = bubbleName || (definitionDestination && definitionDestination.displayProperties.name) || '';
      // if (checklistItem.activityHash) {
      //   name = manifest.DestinyActivityDefinition[checklistItem.activityHash].displayProperties.name;
      // }

      const definitionRecord = manifest.DestinyRecordDefinition[hash];
      const definitionLore = manifest.DestinyLoreDefinition[definitionRecord.loreHash];

      const name = definitionLore.displayProperties.name;

      console.log(name);

      const screenshot = searchScreenshots('screenshots/records/lunas-lost', hash);

      if (screenshot) fs.renameSync(
        screenshot,
        `screenshots/records/lunas-lost/${
          name.toLowerCase()
            .replace(/ \| /g, ' ')
            .replace(/(\||\?|'|:)/g, '')
            .replace(/ /g, '-')
        }-${hash}.png`
      );

      // const screenshot = searchScreenshots('public/static/images/screenshots/records/lunas-lost', hash);

      // if (screenshot)
      //   fs.renameSync(
      //     screenshot,
      //     `public/static/images/screenshots/records/lunas-lost/${name
      //       .toLowerCase()
      //       .replace(/ \| /g, ' ')
      //       .replace(/(\||\?|'|:)/g, '')
      //       .replace(/ /g, '-')}-${hash}.jpg`
      //   );


    });
  }

  const presentationNodes = [
    1420597821, // ghostStories
    3305936921, // awokenOfTheReef
    655926402, // forsakenPrince
    2474271317, // inquisitionOfTheDamned
    4285512244, // lunasLost
  ];

  presentationItems(4285512244);

  // const checklist = manifest.DestinyChecklistDefinition[365218222];
  // checklist.entries.forEach(entry => {
  //   checklistItem(365218222, entry);
  // });
}

// if (checklistId === 2360931290 && number) {
//   return searchScreenshots('checklists/ghost-scans', `ghost-scans_${number}.jpg`);
// }

// if (checklistId === 1697465175 && number) {
//   return searchScreenshots('checklists/region-chests', `region-chests_${number}.jpg`);
// }

// if (checklistId === 365218222 && name) {
//   return searchScreenshots('checklists/sleeper-nodes', `sleeper-nodes_${name.toLowerCase().replace(' ', '')}.jpg`);
// }

// if (checklistId === 1912364094 && checklistItem.checklistHash) {
//   return searchScreenshots('checklists/jade-rabbits', `jade-rabbits_${checklistItem.checklistHash}.jpg`);
// }

// if (checklistId === 530600409 && checklistItem.checklistHash) {
//   return searchScreenshots('checklists/calcified-light', `${checklistItem.checklistHash}.jpg`);
// }

// if (checklistId === 2137293116 && checklistItem.checklistHash) {
//   return searchScreenshots('checklists/savathuns-eyes', `${checklistItem.checklistHash}.jpg`);
// }

// if (checklistId === 1297424116 && checklistItem.checklistHash) {
//   return searchScreenshots('checklists/ahamkara-bones', `ahamkara-bones_${checklistItem.checklistHash}.jpg`);
// }

// if (checklistId === 2609997025 && checklistItem.checklistHash) {
//   return searchScreenshots('checklists/corrupted-eggs', `corrupted-eggs_${number}_${checklistItem.checklistHash}.jpg`);
// }

// if (checklistId === 2726513366 && checklistItem.checklistHash) {
//   return searchScreenshots('checklists/feline-friends', `feline-friends_${number}_${checklistItem.checklistHash}.jpg`);
// }

run();

function searchScreenshots(path, pattern) {
  const look = fromDir(path, pattern);

  if (look && look.length === 1) {
    return `${path}/${look[0]}`;
  }

  return undefined;
}

function fromDir(startPath, filter) {
  if (!fs.existsSync(startPath)) {
    console.log('no dir ', startPath);

    return;
  }

  const pattern = new RegExp(filter);

  const files = fs.readdirSync(startPath);

  const results = [];

  for (let i = 0; i < files.length; i++) {
    const filename = path.join(startPath, files[i]);
    const stat = fs.lstatSync(filename);

    if (stat.isDirectory()) {
      fromDir(filename, filter);
    } else if (pattern.test(filename)) {
      results.push(files[i]);
    }
  }

  return results;
}
