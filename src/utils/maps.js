import React from 'react';

import manifest from '../utils/manifest';
import maps from '../data/maps';
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
    return destinations.find((d) => d.default);
  }
}

const iconsMap = {
  portal: <Maps.Portal />,
};

export function cartographer(search, member) {
  const definitionMaps = manifest.BraytechMapsDefinition[search.value];
  const node = nodes.find((node) => node[search.key] && node[search.key] === +search.value);
  const dynamic = runtime(member, true).find((node) => node.availability.now && node[search.key] && node[search.key] === search.value);

  if (!definitionMaps && !node && !dynamic) {
    return false;
  }

  const icon = typeof definitionMaps?.icon === 'string' && iconsMap[definitionMaps.icon];

  return {
    ...(definitionMaps || {}),
    ...(node || {}),
    ...(dynamic || {}),
    icon,
  };
}

export function getMapCenter(id) {
  if (!maps[id]) return [0, 0];

  const map = maps[id].map;

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
