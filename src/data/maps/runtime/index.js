import React from 'react';

import { t } from '../../../utils/i18n';
import manifest from '../../../utils/manifest';
import { Maps } from '../../../svg';

const cycleInfo = {
  epoch: {
    ascendant: new Date(`2018-09-04T17:00:00Z`).getTime(),
    curse: new Date(`2018-09-11T17:00:00Z`).getTime(),
    wanderingNightmares: new Date(`2019-10-01T17:00:00Z`).getTime(),
  },
  cycle: {
    ascendant: 6,
    curse: 3,
    wanderingNightmares: 4,
  },
  elapsed: {},
  week: {},
};

const time = new Date().getTime();
const msPerWk = 604800000;

for (var cycle in cycleInfo.cycle) {
  cycleInfo.elapsed[cycle] = time - cycleInfo.epoch[cycle];
  cycleInfo.week[cycle] = Math.floor((cycleInfo.elapsed[cycle] / msPerWk) % cycleInfo.cycle[cycle]) + 1;
}

const hydrateObjectives = (member, objectives) => {
  const characterId = member && member.characterId;
  const characterRecords = member && member.data && member.data.profile.characterRecords.data;
  const profileRecords = member && member.data && member.data.profile.profileRecords.data.records;

  return objectives.map((o) => {
    const definitionRecord = manifest.DestinyRecordDefinition[o.recordHash];

    const recordScope = definitionRecord.scope || 0;
    const recordData = recordScope === 1 ? characterRecords && characterRecords[characterId].records[definitionRecord.hash] : profileRecords && profileRecords[definitionRecord.hash];

    const data = recordData && recordData.objectives.find((d) => d.objectiveHash === o.objectiveHash);

    return {
      ...o,
      ...data,
    };
  });
};

export default (member, array) => {
  const nodes = {
    tower: [],
    edz: [],
    'the-moon': [
      {
        nodeHash: 16,
        nodeType: 'patrol-boss',
        displayProperties: {
          name: manifest.DestinyObjectiveDefinition[1009409498].progressDescription,
          description: t('Defeat this Nightmare to progress record _{{recordName}}_.', { recordName: manifest.DestinyRecordDefinition[1842542594].displayProperties.name }),
        },
        icon: <Maps.MapsPatrolBossHive />,
        availability: {
          type: 'cycle',
          frequency: 'week',
          cycleLength: cycleInfo.cycle.wanderingNightmares,
          now: cycleInfo.week.wanderingNightmares === 1,
        },
        map: {
          points: [
            {
              x: 430,
              y: 347,
            },
          ],
        },
      },
      {
        nodeHash: 17,
        nodeType: 'patrol-boss',
        displayProperties: {
          name: manifest.DestinyObjectiveDefinition[1009409496].progressDescription,
          description: t('Defeat this Nightmare to progress record _{{recordName}}_.', { recordName: manifest.DestinyRecordDefinition[1842542594].displayProperties.name }),
        },
        icon: <Maps.MapsPatrolBossFallenDusk />,
        availability: {
          type: 'cycle',
          frequency: 'week',
          cycleLength: cycleInfo.cycle.wanderingNightmares,
          now: cycleInfo.week.wanderingNightmares === 2,
        },
        map: {
          points: [
            {
              x: 2,
              y: -429,
            },
          ],
        },
      },
      {
        nodeHash: 18,
        nodeType: 'patrol-boss',
        displayProperties: {
          name: manifest.DestinyObjectiveDefinition[1009409497].progressDescription,
          description: t('Defeat this Nightmare to progress record _{{recordName}}_.', { recordName: manifest.DestinyRecordDefinition[1842542594].displayProperties.name }),
        },
        icon: <Maps.MapsPatrolBossHive />,
        availability: {
          type: 'cycle',
          frequency: 'week',
          cycleLength: cycleInfo.cycle.wanderingNightmares,
          now: cycleInfo.week.wanderingNightmares === 3,
        },
        map: {
          points: [
            {
              x: -192,
              y: -116,
            },
          ],
        },
      },
      {
        nodeHash: 19,
        nodeType: 'patrol-boss',
        displayProperties: {
          name: manifest.DestinyObjectiveDefinition[1009409499].progressDescription,
          description: t('Defeat this Nightmare to progress record _{{recordName}}_.', { recordName: manifest.DestinyRecordDefinition[1842542594].displayProperties.name }),
        },
        icon: <Maps.MapsPatrolBossFallenDusk />,
        availability: {
          type: 'cycle',
          frequency: 'week',
          cycleLength: cycleInfo.cycle.wanderingNightmares,
          now: cycleInfo.week.wanderingNightmares === 4,
        },
        map: {
          points: [
            {
              x: -647,
              y: -539,
            },
          ],
        },
      },
    ],
    'new-pacific-arcology': [],
    'arcadian-valley': [],
    'echo-mesa': [],
    'fields-of-glass': [],
    'hellas-basin': [],
    'tangled-shore': [],
    'dreaming-city': [
      {
        nodeType: 'vendor',
        vendorHash: 1841717884,
        destinationHash: 2779202173,
        bubbleHash: 3522109173,
        map: {
          points: [
            {
              x: 503,
              y: -310,
            },
          ],
        },
        availability: {
          type: 'cycle',
          frequency: 'week',
          cycleLength: cycleInfo.cycle.curse,
          now: cycleInfo.week.curse === 1,
        },
        screenshot: '/static/images/screenshots/vendors/vendors_petra-1-2.jpg',
      },
      {
        nodeType: 'vendor',
        vendorHash: 1841717884,
        icon: <Maps.Vendor />,
        destinationHash: 2779202173,
        bubbleHash: 706937272,
        map: {
          points: [
            {
              x: -430,
              y: -138,
            },
          ],
        },
        availability: {
          type: 'cycle',
          frequency: 'week',
          cycleLength: cycleInfo.cycle.curse,
          now: cycleInfo.week.curse === 2,
        },
        screenshot: '/static/images/screenshots/vendors/vendors_petra-2-2.jpg',
      },
      {
        nodeType: 'vendor',
        vendorHash: 1841717884,
        icon: <Maps.Vendor />,
        destinationHash: 2779202173,
        bubbleHash: 2762866308,
        map: {
          points: [
            {
              x: 68,
              y: 259,
            },
          ],
        },
        availability: {
          type: 'cycle',
          frequency: 'week',
          cycleLength: cycleInfo.cycle.curse,
          now: cycleInfo.week.curse === 3,
        },
        screenshot: '/static/images/screenshots/vendors/vendors_petra-3-2.jpg',
      },
      {
        nodeHash: 5,
        nodeType: 'portal',
        map: {
          points: [
            {
              x: 390,
              y: -37,
            },
          ],
          in: 'lost-sector',
        },
        availability: {
          type: 'cycle',
          frequency: 'week',
          cycleLength: cycleInfo.cycle.ascendant,
          now: cycleInfo.week.ascendant === 1,
        },
      },
      {
        nodeHash: 15,
        nodeType: 'portal',
        map: {
          points: [
            {
              x: -164,
              y: -12,
            },
          ],
        },
        in: 'lost-sector',
        availability: {
          type: 'cycle',
          frequency: 'week',
          cycleLength: cycleInfo.cycle.ascendant,
          now: cycleInfo.week.ascendant === 6,
        },
      },
    ],
  };

  if (member && member.data) {
    const hydrated = {};

    for (const destination in nodes) {
      hydrated[destination] = nodes[destination].map((node) => {
        if (node.related) {
          return {
            ...node,
            related: {
              ...node.related,
              objectives: node.related.objectives && hydrateObjectives(member, node.related.objectives),
            },
          };
        } else {
          return node;
        }
      });
    }

    if (array) {
      return Object.entries(hydrated).reduce((array, [destination, nodes]) => [...array, ...nodes], []);
    } else {
      return hydrated;
    }
  } else {
    if (array) {
      return Object.entries(nodes).reduce((array, [destination, nodes]) => [...array, ...nodes], []);
    } else {
      return nodes;
    }
  }
};
