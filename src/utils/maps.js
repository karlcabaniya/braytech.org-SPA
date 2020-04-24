import React from 'react';

import store from '../store';

import manifest from '../utils/manifest';
import director from '../data/maps';
import runtime from '../data/maps/runtime';
import { checklists, checkup } from './checklists';
import { Maps } from '../svg';

export function resolveDestination(value) {
  const destinationById = value && destinations.find((d) => d.id === value);
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
        checklist?.items?.length < 2
          ? checklist.items.map(({ formatted, sorts, ...rest }) => ({
              ...rest,
            }))[0]
          : {},
    };
  }

  return {
    checklist: undefined,
    checklistItem: {},
  };
}

export function cartographer(search) {
  const state = store.getState();

  const definitionMaps = manifest.BraytechMapsDefinition[search.value] || Object.values(manifest.BraytechMapsDefinition).find((definition) => definition[search.key] === +search.value);
  const graph = findGraph(search);
  const { checklist, checklistItem } = findChecklistItems(search);
  const dynamic = runtime(state.member, true).find((node) => node[search.key] === +search.value && node.availability?.now);

  if (!definitionMaps && !graph && !checklist?.items.length && !dynamic) {
    return false;
  }

  const icon = dynamic?.icon || (typeof definitionMaps?.icon === 'string' && iconsMap[definitionMaps.icon]);

  // console.log(`definitionMaps`, definitionMaps);
  // console.log(`graph`, graph);
  // console.log(`checklist`, checklist);
  // console.log(`dynamic`, dynamic);

  const aggregate = {
    ...graph,
    ...(definitionMaps || {}),
    checklist,
    ...checklistItem,
    ...(dynamic || {}),
    icon,
  };

  return aggregate;
}

export function getMapCenter(id) {
  if (!director[id]) return [0, 0];

  const map = director[id].map;

  const centerYOffset = -(map.center && map.center.y) || 0;
  const centerXOffset = (map.center && map.center.x) || 0;

  const center = [map.height / 2 + centerYOffset, map.width / 2 + centerXOffset];

  return center;
}

export const destinations = [
  {
    id: 'fields-of-glass',
    destinationHash: 1993421442,
  },
  {
    id: 'edz',
    destinationHash: 1199524104,
    default: true,
  },
  {
    id: 'tower',
    destinationHash: 333456177,
  },
  {
    id: 'the-farm',
    destinationHash: 4188263703,
  },
  {
    id: 'the-moon',
    destinationHash: 290444260,
  },
  {
    id: 'hellas-basin',
    destinationHash: 308080871,
  },
  {
    id: 'echo-mesa',
    destinationHash: 2218917881,
  },
  {
    id: 'new-pacific-arcology',
    destinationHash: 2388758973,
  },
  {
    id: 'arcadian-valley',
    destinationHash: 126924919,
  },
  {
    id: 'tangled-shore',
    destinationHash: 359854275,
  },
  {
    id: 'dreaming-city',
    destinationHash: 2779202173,
  },
];
