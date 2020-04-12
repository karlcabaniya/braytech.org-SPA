import React from 'react';

import { t } from '../../../utils/i18n';
import manifest from '../../../utils/manifest';
import { Maps } from '../../../svg';

const cycleInfo = {
  epoch: {
    // start of cycle in UTC
    wanderingNightmares: new Date(`2019-10-01T17:00:00Z`).getTime(),
    curse: new Date(`2018-09-11T17:00:00Z`).getTime(),
  },
  cycle: {
    // how many week cycle
    wanderingNightmares: 4,
    curse: 3,
  },
  elapsed: {}, // elapsed time since cycle started
  week: {}, // current week in cycle
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
        nodeHash: 'wanderingNightmareXortal',
        displayProperties: {
          name: manifest.DestinyObjectiveDefinition[1009409498].progressDescription,
          description: t('Defeat this Nightmare to progress record _{{recordName}}_.', { recordName: manifest.DestinyRecordDefinition[1842542594].displayProperties.name }),
        },
        type: {
          hash: 'patrol-boss',
          name: t('Patrol boss'),
          category: 'enemy',
          race: 'hive',
        },
        icon: <Maps.MapsPatrolBossHive />,
        destinationHash: 290444260,
        bubbleHash: 417490937,
        map: {
          points: [
            {
              x: 430,
              y: 347,
            },
          ],
        },
        availability: {
          type: 'cycle',
          frequency: 'week',
          cycleLength: cycleInfo.cycle.wanderingNightmares,
          now: cycleInfo.week.wanderingNightmares === 1,
        },
        activityLightLevel: 980,
        related: {
          records: [
            {
              recordHash: 1842542594,
            },
          ],
          objectives: [
            {
              recordHash: 1842542594,
              objectiveHash: 1009409498,
            },
          ],
        },
        screenshot: '/static/images/screenshots/enemies/sorrows-harbor_patrol-boss_nightmareXortal.jpg',
      },
      {
        nodeHash: 'wanderingNightmareHorkis',
        displayProperties: {
          name: manifest.DestinyObjectiveDefinition[1009409496].progressDescription,
          description: t('Defeat this Nightmare to progress record _{{recordName}}_.', { recordName: manifest.DestinyRecordDefinition[1842542594].displayProperties.name }),
        },
        type: {
          hash: 'patrol-boss',
          name: t('Patrol boss'),
          category: 'enemy',
          race: 'fallen',
        },
        icon: <Maps.MapsPatrolBossFallenDusk />,
        destinationHash: 290444260,
        bubbleHash: 4025450777,
        map: {
          points: [
            {
              x: 2,
              y: -429,
            },
          ],
        },
        availability: {
          type: 'cycle',
          frequency: 'week',
          cycleLength: cycleInfo.cycle.wanderingNightmares,
          now: cycleInfo.week.wanderingNightmares === 2,
        },
        activityLightLevel: 980,
        related: {
          records: [
            {
              recordHash: 1842542594,
            },
          ],
          objectives: [
            {
              recordHash: 1842542594,
              objectiveHash: 1009409496,
            },
          ],
        },
        screenshot: '/static/images/screenshots/enemies/anchor-of-light_patrol-boss_nightmareHorkis.jpg',
      },
      {
        nodeHash: 'wanderingNightmareJaxx',
        displayProperties: {
          name: manifest.DestinyObjectiveDefinition[1009409497].progressDescription,
          description: t('Defeat this Nightmare to progress record _{{recordName}}_.', { recordName: manifest.DestinyRecordDefinition[1842542594].displayProperties.name }),
        },
        type: {
          hash: 'patrol-boss',
          name: t('Patrol boss'),
          category: 'enemy',
          race: 'hive',
        },
        icon: <Maps.MapsPatrolBossHive />,
        destinationHash: 290444260,
        bubbleHash: 4195493657,
        map: {
          points: [
            {
              x: -192,
              y: -116,
            },
          ],
        },
        availability: {
          type: 'cycle',
          frequency: 'week',
          cycleLength: cycleInfo.cycle.wanderingNightmares,
          now: cycleInfo.week.wanderingNightmares === 3,
        },
        activityLightLevel: 980,
        related: {
          records: [
            {
              recordHash: 1842542594,
            },
          ],
          objectives: [
            {
              recordHash: 1842542594,
              objectiveHash: 1009409497,
            },
          ],
        },
        screenshot: '/static/images/screenshots/enemies/hellmouth_patrol-boss_nightmareJaxx.jpg',
      },
      {
        nodeHash: 'wanderingNightmareFallenCouncil',
        displayProperties: {
          name: manifest.DestinyObjectiveDefinition[1009409499].progressDescription,
          description: t('Defeat this Nightmare to progress record _{{recordName}}_.', { recordName: manifest.DestinyRecordDefinition[1842542594].displayProperties.name }),
        },
        type: {
          hash: 'patrol-boss',
          name: t('Patrol boss'),
          category: 'enemy',
          race: 'fallen',
        },
        icon: <Maps.MapsPatrolBossFallenDusk />,
        destinationHash: 290444260,
        bubbleHash: 3326367698,
        map: {
          points: [
            {
              x: -647,
              y: -539,
            },
          ],
        },
        availability: {
          type: 'cycle',
          frequency: 'week',
          cycleLength: cycleInfo.cycle.wanderingNightmares,
          now: cycleInfo.week.wanderingNightmares === 4,
        },
        activityLightLevel: 980,
        related: {
          records: [
            {
              recordHash: 1842542594,
            },
          ],
          objectives: [
            {
              recordHash: 1842542594,
              objectiveHash: 1009409499,
            },
          ],
        },
        screenshot: '/static/images/screenshots/enemies/archers-line_patrol-boss_nightmareFallenCouncil.jpg',
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
        vendorHash: 1841717884,
        type: {
          category: 'vendor',
        },
        icon: <Maps.Vendor />,
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
        vendorHash: 1841717884,
        type: {
          category: 'vendor',
        },
        icon: <Maps.Vendor />,
        destinationHash: 2779202173,
        bubbleHash: 2762866308,
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
        vendorHash: 1841717884,
        type: {
          category: 'vendor',
        },
        icon: <Maps.Vendor />,
        destinationHash: 2779202173,
        bubbleHash: 706937272,
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
    ],
  };

  if (member && member.data) {
    const hydrated = {};

    for (const destination in nodes) {
      hydrated[destination] = nodes[destination].map((n) => {
        return {
          ...n,
          related: n.related && {
            ...n.related,
            objectives: n.related.objectives && hydrateObjectives(member, n.related.objectives),
          },
        };
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
