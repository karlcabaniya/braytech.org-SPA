import React from 'react';

import store from '../store';

import manifest from '../utils/manifest';
import director from '../data/maps';
import nodes from '../data/maps/nodes';
import runtime from '../data/maps/runtime';
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
};

function findGraph(search) {
  const place = Object.values(director).find((place) => place.map.bubbles?.find(bubble => bubble.nodes.find(node => node[search.key] === +search.value)));
  const bubble = place?.map.bubbles?.find(bubble => bubble.nodes.find(node => node[search.key] === +search.value));
  const node = bubble?.nodes.find(node => node[search.key] === +search.value);

  if (place) {
    return {
      destinationHash: place.destination.hash,
      bubbleHash: bubble.hash,
      node
    }
  }

  return undefined;
}

export function cartographer(search, member) {
  const definitionMaps = manifest.BraytechMapsDefinition[search.value];
  const graph = findGraph(search);
  const filteredNodes = nodes.filter((node) => node[search.key] === +search.value);
  const dynamic = runtime(member, true).find((node) => node.availability.now && node[search.key] === search.value);

  if (!definitionMaps && !filteredNodes && !dynamic) {
    return false;
  }

  const icon = dynamic?.icon || filteredNodes?.icon || (typeof definitionMaps?.icon === 'string' && iconsMap[definitionMaps.icon]);

  return {
    ...(definitionMaps || {}),
    ...(dynamic || {}),
    graph,
    nodes: filteredNodes,
    icon,
  };
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
    id: 'tower',
    destinationHash: 333456177,
  },
  {
    id: 'edz',
    destinationHash: 1199524104,
  },
  {
    id: 'the-moon',
    destinationHash: 290444260,
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
    id: 'echo-mesa',
    destinationHash: 2218917881,
  },
  {
    id: 'fields-of-glass',
    destinationHash: 1993421442,
  },
  {
    id: 'hellas-basin',
    destinationHash: 308080871,
  },
  {
    id: 'tangled-shore',
    destinationHash: 359854275,
  },
  {
    id: 'dreaming-city',
    destinationHash: 2779202173,
    default: true,
  },
];
