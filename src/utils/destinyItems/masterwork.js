import manifest from '../manifest';
import { DestinyItemType, enumerateItemState } from '../destinyEnums';

/**
 * These are the utilities that deal with figuring out Masterwork info.
 *
 * This is called from within d2-item-factory.service.ts
 */

// const resistanceMods = {
//   1546607977: DamageType.Kinetic,
//   1546607980: DamageType.Void,
//   1546607978: DamageType.Arc,
//   1546607979: DamageType.Thermal
// };

/**
 * This builds the masterwork info - this isn't whether an item is masterwork, but instead what
 * "type" of masterwork it is, what the kill tracker value is, etc. Exotic weapons can start having
 * kill trackers before they're masterworked.
 */
export const masterwork = (item) => {
  if (!item.sockets) {
    return null;
  }

  let masterworkInfo = null;

  // Pre-Forsaken Masterwork
  if (enumerateItemState(item.state).Masterworked) {
    masterworkInfo = buildMasterworkInfo(item.sockets);
  }

  // Forsaken Masterwork
  if (!masterworkInfo) {
    masterworkInfo = buildForsakenMasterworkInfo(item);
  }

  return masterworkInfo;
};

export default masterwork;

/**
 * Post-Forsaken weapons store their masterwork info and kill tracker on different plugs.
 */
function buildForsakenMasterworkInfo(item) {
  const masterworkStats = buildForsakenMasterworkStats(item);
  const killTracker = buildForsakenKillTracker(item);

  // not all masterworks have masterworked stats i.e. outbreak prime
  if (killTracker) {
    return { ...masterworkStats, objective: killTracker };
  }

  return masterworkStats || null;
}

function buildForsakenKillTracker(item) {
  const killTrackerSocket = item.sockets.sockets?.find((socket) => socket.plug?.plugObjectives?.length);

  if (killTrackerSocket) {
    const plugObjective = killTrackerSocket.plug.plugObjectives[0];

    const definitionObjective = manifest.DestinyObjectiveDefinition[plugObjective.objectiveHash];

    return {
      description: definitionObjective.progressDescription,
      progress: plugObjective.progress,
      type: [3244015567, 2285636663, 38912240].includes(killTrackerSocket.plug.definition.hash) ? 'crucible' : 'vanguard',
    };
  }

  return null;
}

function buildForsakenMasterworkStats(item) {
  const index = item.sockets.sockets?.findIndex((socket) =>
    Boolean(
      socket.plug?.definition?.plug && // can haz plugs
        (socket.plug.definition.plug.plugCategoryIdentifier.includes('masterworks.stat') || // or
          socket.plug.definition.plug.plugCategoryIdentifier.endsWith('masterwork'))
    )
  );

  const socket = item.sockets.sockets?.[index];

  console.log(item);

  if (socket?.plug?.definition?.investmentStats?.length) {
    return {
      socketIndex: index,
      stats: socket.plug.definition.investmentStats.map((stat) => ({
        hash: stat.statTypeHash,
        value: socket.plug.stats ? socket.plug.stats[stat.statTypeHash] : socket.plugOptions.find((plug) => plug.definition.hash === socket.plug.definition.hash)?.stats[stat.statTypeHash] || 0,
      })),
      energy: manifest.DestinyInventoryItemDefinition[item.itemHash]?.itemType === DestinyItemType.Armor && {
        usedValue: item.sockets.sockets.reduce((total, socket) => total + (socket.plug?.definition?.plug?.energyCost?.energyCost || 0), 0),
        ...socket.plug.definition.plug.energyCapacity,
      },
    };
  }

  if (socket && socket.plug?.definition?.itemType === DestinyItemType.Mod && socket.plug?.definition?.inventory?.tierType > 4) {
    return {
      socketIndex: index,
      probably: true,
    };
  }

  return null;
}

/**
 * Pre-Forsaken weapons store their masterwork info on an objective of a plug.
 */
function buildMasterworkInfo(sockets) {
  const index = sockets.sockets.findIndex((socket) => Boolean(socket.plug?.plugObjectives?.length));
  const socket = sockets.sockets[index];

  if (index < 0 || !socket.plug?.plugObjectives?.length) {
    return null;
  }

  const plugObjective = socket.plug.plugObjectives[0];

  const investmentStats = socket.plug.definition.investmentStats;
  if (!investmentStats || !investmentStats.length) {
    return null;
  }

  const statHash = investmentStats[0].statTypeHash;

  const objectiveDef = manifest.DestinyObjectiveDefinition[plugObjective.objectiveHash];
  const statDef = manifest.DestinyStatDefinition[statHash];

  if (!objectiveDef || !statDef) {
    return null;
  }

  socket.isMasterwork = true;

  // console.log(socket.plug.definition.plug.plugCategoryHash === 2109207426 ? 'vanguard' : 'crucible')

  return {
    socketIndex: index,
    stats: investmentStats.map((s) => ({
      hash: s.statTypeHash,
      value: socket.plug.stats[s.statTypeHash] || 0,
    })),
    objective: {
      progress: plugObjective.progress,
      typeName: socket.plug.definition.plug.plugCategoryHash === 2109207426 ? 'vanguard' : 'crucible',
      typeIcon: objectiveDef.displayProperties.icon,
      typeDesc: objectiveDef.progressDescription,
    },
  };
}
