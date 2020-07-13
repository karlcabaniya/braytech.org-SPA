import React from 'react';

import store from '../store';

import manifest from '../utils/manifest';
import director from '../data/maps';
import runtime from '../data/maps/runtime';
import { withinString } from './i18n';
import { checklists, checkup } from './checklists';
import { Maps } from '../svg';

export function resolveMap(value) {
  const destinationById = value && destinations.find((d) => d.destinationId === value);
  const destinationByHash = value && destinations.find((d) => d.destinationHash === +value);

  if (destinationById) {
    return destinationById;
  } else if (destinationByHash) {
    return destinationByHash;
  } else {
    const state = store.getState();
    const milestones = state.member.data?.milestones;

    const definitionMilestoneFlashpoint = manifest.DestinyMilestoneDefinition[463010297];

    const milestoneFlashpointQuestItem = definitionMilestoneFlashpoint?.quests[milestones?.[463010297]?.availableQuests?.[0]?.questItemHash];
    const destinationHash = milestoneFlashpointQuestItem?.destinationHash;

    if (destinationHash) return destinations.find((d) => d.destinationHash === destinationHash);

    return destinations.find((d) => d.default);
  }
}

const iconsMap = {
  portal: <Maps.Portal />,
  'ascendant-challenge': <Maps.AscendantChallenge />,
};

function findGraph(search) {
  const place = Object.values(director).find((place) => place.map.bubbles?.find((bubble) => bubble.nodes.find((node) => node[search.key] === +search.value)));
  const bubble = place?.map.bubbles?.find((bubble) => bubble.nodes.find((node) => node[search.key] === +search.value));
  const node = bubble?.nodes.find((node) => node[search.key] === +search.value);

  if (place) {
    return {
      destinationHash: place.destination.hash,
      bubbleHash: bubble.hash,
      nodeHash: node.nodeHash,
      map: {
        points: [
          {
            x: node.x,
            y: node.y,
          },
        ],
      },
    };
  }

  return {};
}

function findChecklistItems(search) {
  const lookup = checkup(search);
  const checklist = lookup?.checklistId && checklists[lookup.checklistId]({ requested: { key: search.key, array: [search.value] } });

  if (checklist?.items.length) {
    return {
      checklist,
      checklistItem:
        // only if it's an exact match
        checklist?.items?.length < 2
          ? checklist.items.map(({ displayProperties, ...rest }) => ({
              ...rest,
            }))[0]
          : {},
    };
  }

  return {
    checklist: {},
    checklistItem: {},
  };
}

export function cartographer(search) {
  if (!search) return false;

  // get profile data
  const state = store.getState();

  // maps core
  const graph = findGraph(search);
  // BraytechMapsDefinition
  const definitionMaps = manifest.BraytechMapsDefinition[search.value] || Object.values(manifest.BraytechMapsDefinition).find((definition) => definition[search.key] === +search.value);
  // checklists
  const { checklist, checklistItem } = findChecklistItems(search);
  // runtime
  const dynamic = runtime(state.member, true).find((node) => node[search.key] === +search.value && node.availability?.now);

  // got nothing?
  if (!definitionMaps && !graph && !checklist?.items.length && !dynamic) {
    return false;
  }

  const icon = dynamic?.icon || (typeof definitionMaps?.icon === 'string' && iconsMap[definitionMaps.icon]);

  // console.log(`definitionMaps`, definitionMaps);
  // console.log(`graph`, graph);
  // console.log(`checklist`, checklist);
  // console.log(`dynamic`, dynamic);

  const map = {
    ...(graph.map || {}),
    ...(checklistItem.map || {}),
    ...(dynamic?.map || {}),
  };

  if (map.points?.length) {
    map.points = map.points.map((point) => {
      if (point.bubbleHash) {
        return {
          ...point,
          screenshot: definitionMaps?.extended?.screenshots.find((screenshot) => screenshot.bubbleHash === point.bubbleHash)?.screenshot,
        };
      } else {
        return point;
      }
    });
  }

  // const bubbleHash =
  //   // if search.bubbleHash is valid, use it
  //   (search.bubbleHash && map.points.find(point => point.bubbleHash === search.bubbleHash) && search.bubbleHash) || checklistItem?.bubbleHash || definitionMaps?.bubbleHash || graph?.bubbleHash;

  const screenshot = map.points?.find((point) => point.bubbleHash === search.bubbleHash)?.screenshot || definitionMaps?.screenshot;

  const extended = {
    ...(checklistItem?.extended || {}),
    ...(definitionMaps?.extended || {}),
  };

  if (search.bubbleHash && checklist?.checklistId === 3142056444 && checklistItem?.extended?.bubbleHash && map.points.find((point) => point.bubbleHash === search.bubbleHash)?.bubbleHash) {
    extended.bubbleHash = search.bubbleHash;
  }

  return {
    // maps core
    ...graph,
    // BraytechMapsDefinition
    ...(definitionMaps || {}),
    // checklists
    checklist,
    ...checklistItem,
    // runtime
    ...(dynamic || {}),
    map,
    icon,
    screenshot,
    extended,
  };
}

export function getMapCenter(destinationId) {
  if (!director[destinationId]) return [0, 0];

  const map = director[destinationId].map;

  const centerYOffset = -(map.center && map.center.y) || 0;
  const centerXOffset = (map.center && map.center.x) || 0;

  const center = [map.height / 2 + centerYOffset, map.width / 2 + centerXOffset];

  return center;
}

export const destinations = [
  // {
  //   type: 'graph',
  //   destinationId: 'director',
  // },
  {
    type: 'map',
    destinationId: 'fields-of-glass',
    destinationHash: 1993421442,
  },
  {
    type: 'map',
    destinationId: 'edz',
    destinationHash: 1199524104,
    default: true,
  },
  {
    type: 'map',
    destinationId: 'tower',
    destinationHash: 333456177,
  },
  {
    type: 'map',
    destinationId: 'the-farm',
    destinationHash: 4188263703,
  },
  {
    type: 'map',
    destinationId: 'the-moon',
    destinationHash: 290444260,
  },
  {
    type: 'map',
    destinationId: 'hellas-basin',
    destinationHash: 308080871,
  },
  {
    type: 'map',
    destinationId: 'echo-mesa',
    destinationHash: 2218917881,
  },
  {
    type: 'map',
    destinationId: 'new-pacific-arcology',
    destinationHash: 2388758973,
  },
  {
    type: 'map',
    destinationId: 'arcadian-valley',
    destinationHash: 126924919,
  },
  {
    type: 'map',
    destinationId: 'tangled-shore',
    destinationHash: 359854275,
  },
  {
    type: 'map',
    destinationId: 'dreaming-city',
    destinationHash: 2779202173,
  },
];

export function findNodeType({ checklistHash, recordHash, nodeHash, activityHash, vendorHash, ...rest }) {
  if (checklistHash) {
    return {
      key: 'checklistHash',
      value: checklistHash,
      ...rest,
    };
  } else if (recordHash) {
    return {
      key: 'recordHash',
      value: recordHash,
      ...rest,
    };
  } else if (nodeHash) {
    return {
      key: 'nodeHash',
      value: nodeHash,
      ...rest,
    };
  } else if (activityHash) {
    return {
      key: 'activityHash',
      value: activityHash,
      ...rest,
    };
  } else if (vendorHash) {
    return {
      key: 'vendorHash',
      value: vendorHash,
      ...rest,
    };
  }
}

export function locationStrings({ activityHash, destinationHash, bubbleHash, map, extended }) {
  const definitionActivity = manifest.DestinyActivityDefinition[activityHash];
  const definitionDestination = manifest.DestinyDestinationDefinition[destinationHash];
  const definitionPlace = manifest.DestinyPlaceDefinition[definitionDestination?.placeHash];
  const definitionBubble = definitionDestination?.bubbles?.find((bubble) => bubble.hash === (extended?.bubbleHash || bubbleHash));
  const definitionAir = map?.bubbleHash && definitionDestination?.bubbles?.find((bubble) => bubble.hash === map.bubbleHash);

  const destinationName = definitionDestination?.displayProperties?.name;
  const placeName = definitionPlace?.displayProperties?.name && definitionPlace.displayProperties.name !== destinationName && definitionPlace.displayProperties.name;
  const bubbleName = definitionBubble?.displayProperties?.name;
  const airName = definitionAir?.displayProperties?.name;
  const activityName = definitionActivity?.originalDisplayProperties?.name || definitionActivity?.displayProperties.name;

  const destinationString = [bubbleName, activityName, !(airName || activityName) && destinationName, placeName]
    // remove falsey values
    .filter((string) => string)
    // remove duplicate values
    .filter((a, b, self) => self.indexOf(a) === b)
    .join(', ');

  const within = map?.in;
  const withinName = within === 'ascendant-challenge' ? airName || bubbleName : (within && (definitionActivity?.originalDisplayProperties?.name || definitionActivity?.displayProperties.name)) || airName || bubbleName;

  return {
    destinationString,
    withinString: within && withinString(within, withinName),
  };
}

export function screenshotFilename(node) {
  const checklistItem = node.checklist?.items?.[0];

  const definitionDestination = manifest.DestinyDestinationDefinition[checklistItem?.destinationHash];
  const definitionBubble = definitionDestination?.bubbles?.find((bubble) => bubble.hash === (checklistItem?.map?.bubbleHash || checklistItem?.extended?.bubbleHash || checklistItem?.bubbleHash));

  if (node.checklist?.checklistId === 2360931290 && checklistItem?.displayProperties.number) {
    return `${definitionBubble?.displayProperties.name.toLowerCase().replace(/'/g, '').replace(/ /g, '-')}_ghost-scans_${checklistItem.displayProperties.number}`;
  } else if (node.checklist?.checklistId === 1697465175 && checklistItem?.displayProperties.number) {
    return `${definitionBubble?.displayProperties.name.toLowerCase().replace(/'/g, '').replace(/ /g, '-')}_region-chests_${checklistItem.displayProperties.number}`;
  } else if (node.checklist?.checklistId === 3142056444 && checklistItem?.displayProperties.name) {
    return `${definitionBubble?.displayProperties.name.toLowerCase().replace(/'/g, '').replace(/ /g, '-')}_lost-sectors_${checklistItem.displayProperties.name.toLowerCase().replace(/'/g, '').replace(/ /g, '-')}`;
  } else if (node.checklist?.checklistId === 365218222 && checklistItem?.displayProperties.name) {
    return `sleeper-nodes_${checklistItem.displayProperties.name.toLowerCase().replace(' ', '')}`;
  } else if (node.checklist?.checklistId === 1420597821 && checklistItem.recordHash) {
    return `${definitionBubble?.displayProperties.name.toLowerCase().replace(/'/g, '').replace(/ /g, '-')}_ghost-stories_${checklistItem.recordHash}`;
  } else if (node.checklist?.checklistId === 655926402 && checklistItem.recordHash) {
    return `${definitionBubble?.displayProperties.name.toLowerCase().replace(/'/g, '').replace(/ /g, '-')}_the-forsaken-prince_${checklistItem.recordHash}`;
  } else if (node.checklist?.checklistId === 3305936921 && checklistItem.recordHash) {
    return `${definitionBubble?.displayProperties.name.toLowerCase().replace(/'/g, '').replace(/ /g, '-')}_the-awoken-of-the-reef_${checklistItem.recordHash}`;
  } else if (node.checklist?.checklistId === 4285512244 && checklistItem.recordHash) {
    return `${definitionBubble?.displayProperties.name.toLowerCase().replace(/'/g, '').replace(/ /g, '-')}_lunas-lost_${checklistItem.recordHash}`;
  } else if (node.checklist?.checklistId === 2474271317 && checklistItem.recordHash) {
    return `${definitionBubble?.displayProperties.name.toLowerCase().replace(/'/g, '').replace(/ /g, '-')}_necrotic-cyphers_${checklistItem.recordHash}`;
  } else if (node.checklist?.checklistId === 1912364094 && checklistItem.checklistHash) {
    return `jade-rabbits_${checklistItem.checklistHash}`;
  } else if (node.checklist?.checklistId === 1297424116 && checklistItem.checklistHash) {
    return `ahamkara-bones_${checklistItem.checklistHash}`;
  } else if (node.checklist?.checklistId === 2609997025 && checklistItem?.displayProperties.number) {
    return `${definitionBubble?.displayProperties.name.toLowerCase().replace(/'/g, '').replace(/ /g, '-')}_corrupted-eggs_${checklistItem.displayProperties.number}_${checklistItem.checklistHash}`;
  } else if (node.checklist?.checklistId === 2726513366 && checklistItem?.displayProperties.number) {
    return `${definitionBubble?.displayProperties.name.toLowerCase().replace(/'/g, '').replace(/ /g, '-')}_feline-friends_${checklistItem.displayProperties.number}_${checklistItem.checklistHash}`;
  } else if (node.checklist?.checklistId === 530600409 && checklistItem.checklistHash) {
    return `${checklistItem.checklistHash}`;
  } else if (node.checklist?.checklistId === 2137293116 && checklistItem.checklistHash) {
    return `${checklistItem.checklistHash}`;
  }

  return undefined;
}
