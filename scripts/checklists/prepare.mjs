import fs from 'fs';
import path from 'path';
import Manifest from '../manifest.js';
import _ from 'lodash';

import worthy from './worthy.json';

import data from '../../src/data/checklists/index.json';

import BraytechMaps_EN from '../../src/data/manifest/en/BraytechMaps/index.json';

import DestinyActivityDefinition_EN from '../../src/data/manifest/en/DestinyActivityDefinition/index.json';
import DestinyDestinationDefinition_EN from '../../src/data/manifest/en/DestinyDestinationDefinition/index.json';

// For when the mappings generated from lowlines' data don't have a
// bubbleHash but do have a bubbleId. Inferred by cross-referencing
// with https://docs.google.com/spreadsheets/d/1qgZtT1qbUFjyV8-ni73m6UCHTcuLmuLBx-zn_B7NFkY/edit#gid=1808601275
const manualBubbleNames = {
  default: 'The Farm',
  'high-plains': 'High Plains',
  erebus: 'The Shattered Throne',
  descent: 'The Shattered Throne',
  eleusinia: 'The Shattered Throne',
  'cimmerian-garrison': 'Cimmerian Garrison',
  'shattered-ruins': 'Shattered Ruins',
  'agonarch-abyss': 'Agonarch Abyss',
  'keep-of-honed-edges': 'Keep of Honed Edges',
  ouroborea: 'Ouroborea',
  'forfeit-shrine': 'Forfeit Shrine',
  adytum: 'The Corrupted',
  'queens-court': 'The Queens Court',
  'ascendant-plane': 'Dark Monastery',
};

const itemDeletions = [
  1116662180, // Ghost Scan 74 / The Reservoir, Earth / UNAVAILABLE
  3856710545, // Ghost Scan 75 / The Reservoir, Earth / UNAVAILABLE
  508025838, // Ghost Scan 76 / The Reservoir, Earth / UNAVAILABLE
];

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
];

const presentationNodes = [
  1420597821, // ghostStories
  3305936921, // awokenOfTheReef
  655926402, // forsakenPrince
  2474271317, // inquisitionOfTheDamned
  4285512244, // lunasLost
];

const destinationHashOverrides = {
  4188263703: 1199524104, // The Farm -> EDZ
};

const ascendantChallenges = [
  {
    hash: 27792021731,
    displayProperties: {
      name: 'The Confluence',
    },
  },
  {
    hash: 27792021732,
    displayProperties: {
      name: 'Ouroborea',
    },
  },
  {
    hash: 27792021733,
    displayProperties: {
      name: 'Forfeit Shrine',
    },
  },
  {
    hash: 27792021734,
    displayProperties: {
      name: 'Shattered Ruins',
    },
  },
  {
    hash: 27792021735,
    displayProperties: {
      name: 'Keep of Honed Edges',
    },
  },
  {
    hash: 27792021736,
    displayProperties: {
      name: 'Agonarch Abyss',
    },
  },
  {
    hash: 27792021737,
    displayProperties: {
      name: 'Cimmerian Garrison',
    },
  },
  {
    hash: 27792021738,
    displayProperties: {
      name: 'Ascendant Plane',
    },
  },
];

const bubbleHashOverrides = {
  'High Plains': 1519764506,
  'Gardens of Esila': 278887670,
  "Aphelion's Rest": 544256237,
  'Spine of Keres': 768261954,
  "Harbinger's Seclude": 1091325847,
  'Bay of Drowned Wishes': 1091325847,
  'Chamber of Starlight': 3366050756,
  Ouroborea: 27792021732,
  'Forfeit Shrine': 27792021733,
  'Shattered Ruins': 27792021734,
  'Keep of Honed Edges': 27792021735,
  'Agonarch Abyss': 27792021736,
  'Cimmerian Garrison': 27792021737,
};

function mergeWithCustomizer(a, b) {
  if (Array.isArray(a)) {
    return a.concat(b);
  }
  
  return a;
}

const customsMerge = (bungie, customs) => {
  for (const key in customs) {
    if (customs.hasOwnProperty(key) && bungie.hasOwnProperty(key)) {
      bungie[key] = _.mergeWith(bungie[key], customs[key], mergeWithCustomizer);
    }
  }

  return bungie;
};

async function run() {
  const manifest = await Manifest.getManifest();

  customsMerge(manifest.DestinyActivityDefinition, DestinyActivityDefinition_EN);
  customsMerge(manifest.DestinyDestinationDefinition, DestinyDestinationDefinition_EN);

  function merger(e, c) {
    if (Array.isArray(c)) {
      if (!Array.isArray(e)) {
        return c;
      } else if (e.length < 1 && c.length >= 1) {
        return c;
      } else if (c.length === 1 && e.length >= 1) {
        return c;
      } else if (c.length > 1 && e.length > 1) {
        // not emotionally ready to deal with this sorry
        return e;
      } else {
        return e;
      }
    } else if (typeof c === 'object') {
      return _.mergeWith(e, c, merger);
    }
    // else if (c && c !== '') {
    //   return c;
    // }
    // else if (e !== c) {
    //   return c;
    // }
    else {
      // console.log(c)
      return c;
    }
  }

  function checklistItem(checklistId, checklistItem) {
    const existing = (data[checklistId] && data[checklistId].find((c) => c.checklistHash === checklistItem.hash)) || {};
    const mapping = worthy.checklists[checklistItem.hash] || {};

    let destinationHash = checklistItem.destinationHash || (mapping && mapping.destinationHash) || (existing && existing.destinationHash);
    destinationHash = destinationHashOverrides[destinationHash] ? destinationHashOverrides[destinationHash] : destinationHash;

    const definitionDestination = manifest.DestinyDestinationDefinition[destinationHash];
    const definitionPlace = definitionDestination && manifest.DestinyPlaceDefinition[definitionDestination.placeHash];

    let activityHash = (mapping && mapping.activityHash) || (existing && existing.activityHash) || undefined;
    let bubbleHash = checklistItem.bubbleHash || (mapping && mapping.bubbleHash) || (existing && existing.bubbleHash) || undefined;
    bubbleHash = bubbleHashOverrides[bubbleHash] ? bubbleHashOverrides[bubbleHash] : bubbleHash;

    if (bubbleHash === 'Dark Monastery') {
      bubbleHash = undefined;
      activityHash = 1313738982;
    } else if (bubbleHash === 'The Corrupted') {
      bubbleHash = undefined;
      activityHash = 3374205762;
    } else if (bubbleHash === 2241206483) {
      bubbleHash = undefined;
    }

    const definitionBubble = definitionDestination && _.find(definitionDestination.bubbles, { hash: bubbleHash });

    const bubbleName = (definitionBubble && definitionBubble.displayProperties.name);

    // If the item has a name with a number in it, extract it so we can use it later
    // for sorting & display
    const numberMatch = checklistItem.displayProperties.name.match(/([0-9]+)/);
    const itemNumber = numberMatch && numberMatch[0];

    const recordHash = (mapping && mapping.recordHash) || (existing && existing.recordHash) || undefined;

    let name = bubbleName;
    if (manifest.DestinyChecklistDefinition[365218222].entries.find((h) => h.hash === checklistItem.hash)) {
      name = manifest.DestinyInventoryItemDefinition[checklistItem.itemHash].displayProperties.description.replace('CB.NAV/RUN.()', '');
    } else if (checklistItem.activityHash) {
      name = manifest.DestinyActivityDefinition[checklistItem.activityHash].displayProperties.name;
    } else if (recordHash) {
      const definitionRecord = manifest.DestinyRecordDefinition[recordHash];
      const definitionLore = manifest.DestinyLoreDefinition[definitionRecord.loreHash];

      if (definitionLore) name = definitionLore.displayProperties.name;
    }

    const points = (mapping && mapping.map && mapping.map.points) || (existing && existing.map && existing.map.points) || [];

    // check to see if location is inside lost sector. look up item's bubble hash inside self's lost sector's checklist... unless this is a lost sector item
    const withinLostSector = bubbleHash && data[3142056444].find((l) => l.bubbleHash === bubbleHash) && checklistId !== 3142056444;

    let within = undefined;
    if (withinLostSector) {
      within = 'lost-sector';
    } else if (activityHash && manifest.DestinyActivityDefinition[activityHash].activityModeTypes.includes(18)) {
      within = 'strike';
    } else if (activityHash && manifest.DestinyActivityDefinition[activityHash].activityModeTypes.includes(2)) {
      within = 'story';
    } else if (activityHash && checklistId !== 4178338182) {
      // exclude adventures from being located within themselves lol
      within = 'activity';
    } else if (bubbleHash && ascendantChallenges.find((b) => b.hash === bubbleHash)) {
      within = 'ascendant-challenge';
    }

    const changes = {
      destinationHash,
      bubbleHash,
      activityHash,
      checklistHash: checklistItem.hash,
      itemHash: checklistItem && checklistItem.itemHash,
      recordHash,
      map: {
        points,
        in: within,
      },
      sorts: {
        destination: definitionDestination && definitionDestination.displayProperties.name,
        bubble: bubbleName,
        place: definitionPlace && definitionPlace.displayProperties.name,
        name,
        number: itemNumber && parseInt(itemNumber, 10),
      },
    };

    const screenshot = getScreenshot(checklistId, changes);

    if (screenshot) {
      doJson({
        checklistHash: checklistItem.hash,
        screenshot,
      });
    }

    // const updates = _.mergeWith(existing, changes, merger);
    const updates = changes;

    return updates;
  }

  function presentationItems(presentationHash, dropFirst = true) {
    const root = manifest.DestinyPresentationNodeDefinition[presentationHash];
    let recordHashes = root.children.records.map((r) => r.recordHash);
    if (dropFirst) recordHashes = recordHashes.slice(1);

    return recordHashes
      .map((hash, itemNumber) => {
        const existing = (data[presentationHash] && data[presentationHash].find((c) => c.recordHash === hash)) || {};
        const mapping = worthy.records[hash];

        let destinationHash = (mapping && mapping.destinationHash) || (existing && existing.destinationHash);

        const definitionDestination = manifest.DestinyDestinationDefinition[destinationHash];
        const definitionPlace = definitionDestination && manifest.DestinyPlaceDefinition[definitionDestination.placeHash];

        let bubbleHash = (mapping && mapping.bubbleHash) || (existing && existing.bubbleHash) || undefined;
        bubbleHash = bubbleHashOverrides[bubbleHash] ? bubbleHashOverrides[bubbleHash] : bubbleHash;
        const definitionBubble = definitionDestination && _.find(definitionDestination.bubbles, { hash: bubbleHash });

        const bubbleName = (definitionBubble && definitionBubble.displayProperties.name);

        const recordHash = hash;

        let name = bubbleName;
        if (recordHash) {
          const definitionRecord = manifest.DestinyRecordDefinition[recordHash];
          const definitionLore = manifest.DestinyLoreDefinition[definitionRecord.loreHash];

          if (definitionLore) name = definitionLore.displayProperties.name;
        }

        const points = (mapping && mapping.map && mapping.map.points) || (existing && existing.map && existing.map.points) || [];

        // check to see if location is inside lost sector. look up item's bubble hash inside self's lost sector's checklist... unless this is a lost sector item
        const withinLostSector = definitionBubble && definitionBubble.hash && data[3142056444].find((l) => l.bubbleHash === definitionBubble.hash) && hash !== 3142056444;

        const pursuitHash = (mapping && mapping.pursuitHash) || (existing && existing.pursuitHash) || undefined;
        const activityHash = (mapping && mapping.activityHash) || (existing && existing.activityHash) || undefined;

        let within = undefined;
        if (withinLostSector) {
          within = 'lost-sector';
        } else if (activityHash && manifest.DestinyActivityDefinition[activityHash].activityModeTypes.includes(18)) {
          within = 'strike';
        } else if (activityHash && manifest.DestinyActivityDefinition[activityHash].activityModeTypes.includes(2)) {
          within = 'story';
        } else if (activityHash) {
          within = 'activity';
        } else if (bubbleHash && ascendantChallenges.find((b) => b.hash === bubbleHash)) {
          within = 'ascendant-challenge';
        }

        // if (hash === 242464657) console.log(existing, bubbleHash)

        const changes = {
          destinationHash,
          bubbleHash,
          recordHash,
          pursuitHash,
          activityHash,
          map: {
            points,
            in: within,
          },
          sorts: {
            destination: definitionDestination && definitionDestination.displayProperties.name,
            bubble: bubbleName,
            place: definitionPlace && definitionPlace.displayProperties.name,
            name,
            number: itemNumber + 1,
          },
        };

        const screenshot = getScreenshot(presentationHash, changes);

        if (screenshot) {
          doJson({
            recordHash,
            screenshot,
          });
        }

        //if (changes.recordHash === 3390078236) console.log(mapping, existing)
        // console.log(changes)
        // console.log({
        //   ...existing,
        //   ...changes,
        //   ...itemOverrides[item.hash]
        // }
        // )

        // Object.keys(changes).forEach(key => {
        //   if (!changes[key]) delete changes[key];
        // });

        //const updates = _.mergeWith(existing, changes, merger);
        const updates = changes;

        //if (changes.recordHash === 242464657) console.log(existing, changes, updates)

        return updates;
      })
      .filter((i) => i);
  }

  const lists = {};

  checklists.concat(presentationNodes).forEach((hash) => {
    if (presentationNodes.includes(hash)) {
      lists[hash] = presentationItems(hash);
    } else {
      const checklist = manifest.DestinyChecklistDefinition[hash];

      lists[hash] = checklist.entries
        .filter((entry) => itemDeletions.indexOf(entry.hash) < 0)
        .map((entry) => {
          return checklistItem(hash, entry);
        });
    }
  });

  fs.writeFileSync('src/data/checklists/index.json', JSON.stringify(lists, null, '  '));

  BraytechMapsExports.forEach((load) => {
    if (load.checklistHash || load.recordHash) {
      const existing = Object.keys(BraytechMaps_EN).find((hash) => {
        if (BraytechMaps_EN[hash].checklistHash && BraytechMaps_EN[hash].checklistHash === load.checklistHash) {
          // console.log(BraytechMaps_EN[hash].checklistHash, load.checklistHash)
          return true;
        } else if (BraytechMaps_EN[hash].recordHash && BraytechMaps_EN[hash].recordHash === load.recordHash) {
          // console.log(BraytechMaps_EN[hash].recordHash, load.recordHash)
          return true;
        } else {
          return false;
        }
      });

      // console.log(existing)

      if (existing) {
        const hash = existing;

        BraytechMaps_EN[hash] = {
          ...BraytechMaps_EN[hash],
          // displayProperties:
          //   (load.displayProperties && load.displayProperties.description) || (BraytechMaps_EN[hash].displayProperties && BraytechMaps_EN[hash].displayProperties.description) || (BraytechMaps_EN[hash].displayProperties && Object.keys(BraytechMaps_EN[hash].displayProperties).length)
          //     ? {
          //         ...BraytechMaps_EN[hash].displayProperties,
          //         description: load.displayProperties.description || BraytechMaps_EN[hash].displayProperties.description,
          //       }
          //     : undefined,
          screenshot: load.screenshot || BraytechMaps_EN[hash].screenshot,
        };
      } else {
        let hash = 1;
        while (Object.keys(BraytechMaps_EN).find((key) => +key === +hash)) {
          // console.log(hash)
          hash++;
        }

        BraytechMaps_EN[hash] = load;
      }
    }
  });

  fs.writeFileSync('src/data/manifest/en/BraytechMaps/index.json', JSON.stringify(BraytechMaps_EN, null, '  '));
}

const BraytechMapsExports = [];
function doJson(payload) {
  BraytechMapsExports.push(payload);
}

function getScreenshot(checklistId, checklistItem) {
  let screenshot = undefined;

  if (checklistId === 2360931290 && checklistItem.sorts && checklistItem.sorts.number) {
    screenshot = searchScreenshots('ghost-scans', `ghost-scans_${checklistItem.sorts.number}.jpg`);
  }

  if (checklistId === 1697465175 && checklistItem.sorts && checklistItem.sorts.number) {
    screenshot = searchScreenshots('region-chests', `region-chests_${checklistItem.sorts.number}.jpg`);
  }

  if (checklistId === 3142056444 && checklistItem.sorts && checklistItem.sorts.name) {
    screenshot = searchScreenshots('lost-sectors', `lost-sectors_${checklistItem.sorts.name.toLowerCase().replace(/'/g, '').replace(/ /g, '-')}.jpg`);
  }

  if (checklistId === 1420597821 && checklistItem.recordHash) {
    screenshot = searchScreenshots('lore', `ghost-stories_${checklistItem.recordHash}.jpg`);
  }

  if (checklistId === 655926402 && checklistItem.recordHash) {
    screenshot = searchScreenshots('lore', `the-forsaken-prince_${checklistItem.recordHash}.jpg`);
  }

  if (checklistId === 3305936921 && checklistItem.recordHash) {
    screenshot = searchScreenshots('lore', `the-awoken-of-the-reef_${checklistItem.recordHash}.jpg`);
  }

  if (checklistId === 4285512244 && checklistItem.recordHash) {
    screenshot = searchScreenshots('lore', `lunas-lost_${checklistItem.recordHash}.jpg`);
  }

  if (checklistId === 2474271317 && checklistItem.recordHash) {
    screenshot = searchScreenshots('lore', `necrotic-cyphers_${checklistItem.recordHash}.jpg`);
  }

  if (checklistId === 1912364094 && checklistItem.checklistHash) {
    screenshot = searchScreenshots('jade-rabbits', `jade-rabbits_${checklistItem.checklistHash}.jpg`);
  }

  return screenshot;
}

function searchScreenshots(listName, pattern) {
  const look = fromDir(`public/static/images/screenshots/${listName}/`, pattern);

  if (look && look.length === 1) {
    return `/static/images/screenshots/${listName}/${look[0]}`;
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

run();
