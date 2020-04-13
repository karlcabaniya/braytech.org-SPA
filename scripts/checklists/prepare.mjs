import fs from 'fs';
import Manifest from '../manifest.js';
import _ from 'lodash';

import lowlidev from './lowlines.json';
import newLight from './worthy.json';

const path = 'src/data/checklists/index.json';
const data = JSON.parse(fs.readFileSync(path));

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

const bubbleHashOverrides = {
  'High Plains': 1519764506,
  'Gardens of Esila': 278887670,
  "Aphelion's Rest": 544256237,
  'Spine of Keres': 768261954,
  "Harbinger's Seclude": 1091325847,
  'Bay of Drowned Wishes': 1091325847,
  'Chamber of Starlight': 3366050756,
  'Ouroborea': 27792021732,
  'Forfeit Shrine': 27792021733,
  'Shattered Ruins': 27792021734,
  'Keep of Honed Edges': 27792021735,
  'Agonarch Abyss': 27792021736,
  'Cimmerian Garrison': 27792021737
};

async function run() {
  const manifest = await Manifest.getManifest();

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

  function checklistItem(id, item) {
    const existing = (data[id] && data[id].find((c) => c.checklistHash === item.hash)) || {};
    const mapping = newLight.checklists[item.hash] || {};
    const lowlines = lowlidev[id] && lowlidev[id].find((n) => n.checklistHash === +item.hash || n.activityHash === +item.activityHash);

    let destinationHash = item.destinationHash || (mapping && mapping.destinationHash) || (existing && existing.destinationHash);
    destinationHash = destinationHashOverrides[destinationHash] ? destinationHashOverrides[destinationHash] : destinationHash;

    const definitionDestination = manifest.DestinyDestinationDefinition[destinationHash];
    const definitionPlace = definitionDestination && manifest.DestinyPlaceDefinition[definitionDestination.placeHash];

    let activityHash = (mapping && mapping.activityHash) || (existing && existing.activityHash) || undefined;
    let bubbleHash = item.bubbleHash || (mapping && mapping.bubbleHash) || (existing && existing.bubbleHash) || (lowlines && lowlines.bubbleName) || undefined;
    bubbleHash = bubbleHashOverrides[bubbleHash] ? bubbleHashOverrides[bubbleHash] : bubbleHash;

    if (bubbleHash === 'Dark Monastery') {
      bubbleHash = undefined;
      activityHash = 1313738982;
    }

    const definitionBubble = definitionDestination && _.find(definitionDestination.bubbles, { hash: bubbleHash });

    const bubbleName = (definitionBubble && definitionBubble.displayProperties.name) || (lowlines && lowlines.bubbleName);

    // If the item has a name with a number in it, extract it so we can use it later
    // for sorting & display
    const numberMatch = item.displayProperties.name.match(/([0-9]+)/);
    const itemNumber = numberMatch && numberMatch[0];

    const recordHash = (mapping && mapping.recordHash) || (existing && existing.recordHash) || undefined;

    let name = bubbleName;
    if (manifest.DestinyChecklistDefinition[365218222].entries.find((h) => h.hash === item.hash)) {
      name = manifest.DestinyInventoryItemDefinition[item.itemHash].displayProperties.description.replace('CB.NAV/RUN.()', '');
    } else if (item.activityHash) {
      name = manifest.DestinyActivityDefinition[item.activityHash].displayProperties.name;
    } else if (recordHash) {
      const definitionRecord = manifest.DestinyRecordDefinition[recordHash];
      const definitionLore = manifest.DestinyLoreDefinition[definitionRecord.loreHash];

      if (definitionLore) name = definitionLore.displayProperties.name;
    }

    const points = (mapping && mapping.map && mapping.map.points) || (existing && existing.map && existing.map.points) || [];

    // check to see if location is inside lost sector. look up item's bubble hash inside self's lost sector's checklist... unless this is a lost sector item
    const withinLostSector = bubbleHash && data[3142056444].find((l) => l.bubbleHash === bubbleHash) && id !== 3142056444;

    let within = undefined;
    if (withinLostSector) {
      within = 'lost-sector';
    } else if (activityHash && manifest.DestinyActivityDefinition[activityHash].activityModeTypes.includes(18)) {
      within = 'strike';
    } else if (activityHash && manifest.DestinyActivityDefinition[activityHash].activityModeTypes.includes(2)) {
      within = 'story';
    } else if (activityHash && id !== 4178338182) {
      // exclude adventures from being located within themselves lol
      within = 'activity';
    }

    const changes = {
      destinationHash,
      bubbleHash,
      activityHash,
      checklistHash: item.hash,
      itemHash: item && item.itemHash,
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
        const mapping = newLight.records[hash];
        const lowlines = lowlidev[presentationHash] && lowlidev[presentationHash].find((n) => n.recordHash === hash);

        let destinationHash = (mapping && mapping.destinationHash) || (existing && existing.destinationHash);

        const definitionDestination = manifest.DestinyDestinationDefinition[destinationHash];
        const definitionPlace = definitionDestination && manifest.DestinyPlaceDefinition[definitionDestination.placeHash];

        let bubbleHash = (mapping && mapping.bubbleHash) || (existing && existing.bubbleHash) || (lowlines && lowlines.bubbleName) || undefined;
        bubbleHash = bubbleHashOverrides[bubbleHash] ? bubbleHashOverrides[bubbleHash] : bubbleHash;
        const definitionBubble = definitionDestination && _.find(definitionDestination.bubbles, { hash: bubbleHash });

        const bubbleName = (definitionBubble && definitionBubble.displayProperties.name) || (lowlines && lowlines.bubbleName);

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

  fs.writeFileSync(path, JSON.stringify(lists, null, '  '));
}

run();
