import { compact, orderBy } from 'lodash';

import manifest from '../manifest';
import * as enums from '../destinyEnums';

import * as utils from './utils';

/**
 * These are the utilities that deal with Sockets and Plugs on items. Sockets and Plugs
 * are how perks, mods, and many other things are implemented on items.
 *
 * This is called from within d2-item-factory.service.ts
 */

/**
 * Plugs to hide from plug options (if not socketed)
 * removes the "Default Ornament" plug, "Default Shader" and "Rework Masterwork"
 * TODO: with AWA we may want to put some of these back
 */
export const defaultPlugs = [
  // Default ornament
  2931483505,
  1959648454,
  702981643,
  // Rework Masterwork
  39869035,
  1961001474,
  3612467353,
  // Default Shader
  4248210736,
  // Default Transmat Effect (SpawnFX)
  1390587439,
];

const DEFAULT_MASTERWORK_PLUG = 23239861010;

// used in displaying the modded segments on item stats
export const modItemCategoryHashes = [
  1052191496, // weapon mods
  4062965806, // armor mods (pre-2.0)
  4104513227, // armor 2.0 mods
];

/** The item category hash for "intrinsic perk" */
export const INTRINSIC_PLUG_CATEGORY = 2237038328;
/** The item category hash for "masterwork mods" */
export const MASTERWORK_MOD_CATEGORY = 141186804;
/** The item category hash for "ghost projections" */
const GHOST_MOD_CATEGORY = 1404791674;

/** the default shader InventoryItem in every empty shader slot */
export const DEFAULT_SHADER = 4248210736;

/**
 * Calculate all the sockets we want to display (or make searchable). Sockets represent perks,
 * mods, and intrinsic properties of the item. They're really the swiss army knife of item
 * customization.
 */
export const sockets = (item) => {
  const definitionItem = manifest.DestinyInventoryItemDefinition[item.itemHash];

  let sockets = null;
  let missingSockets = false;

  const socketData = (item.itemInstanceId && item.itemComponents?.sockets) || undefined;
  const reusablePlugData = (item.itemInstanceId && item.itemComponents?.reusablePlugs?.plugs) || undefined;
  const plugObjectivesData = (item.itemInstanceId && item.itemComponents?.plugObjectives?.objectivesPerPlug) || undefined;

  if (socketData) {
    sockets = buildInstancedSockets(item, socketData, reusablePlugData, plugObjectivesData);
  }

  // If we didn't have live data (for example, when viewing vendor items or collections),
  // get sockets from the item definition.
  if (!sockets && definitionItem?.sockets) {
    // If this really *should* have live sockets, but didn't...
    if (item.itemInstanceId && socketData && !socketData[item.itemInstanceId]) {
      missingSockets = true;
    }
    sockets = buildDefinedSockets(item);
  }

  return { ...sockets, missingSockets };
};

export default sockets;

/**
 * Build sockets that come from the live instance.
 */
export function buildInstancedSockets(item, sockets, reusablePlugData, plugObjectivesData) {
  const definitionItem = manifest.DestinyInventoryItemDefinition[item.itemHash];

  if (!item.itemInstanceId || !definitionItem.sockets || !definitionItem.sockets.socketEntries.length || !sockets || !sockets.length) {
    return null;
  }

  const realSockets = sockets.map((socket, s) => buildSocket(item, socket, definitionItem.sockets.socketEntries[s], s, reusablePlugData && reusablePlugData[s], plugObjectivesData));

  const categories = definitionItem.sockets.socketCategories.map((category) => {
    return {
      category: manifest.DestinySocketCategoryDefinition[category.socketCategoryHash],
      sockets: category.socketIndexes.map((index) => realSockets[index]).filter(Boolean),
    };
  });

  return {
    sockets: realSockets.filter(Boolean), // Flat list of sockets
    socketCategories: orderBy(categories.sort(utils.compareBy((category) => category.category.index)), [(category) => category.sockets.filter((socket) => socket.isIntrinsic).length], ['desc']), // sockets organized by category then I force intrinsic-containing categories to top
  };
}

/**
 * Build sockets that come from only the definition. We won't be able to tell which ones are selected.
 */
function buildDefinedSockets(item) {
  const definitionItem = manifest.DestinyInventoryItemDefinition[item.itemHash];

  if (!definitionItem.sockets.socketEntries || !definitionItem.sockets.socketEntries.length) {
    return null;
  }

  const realSockets = definitionItem.sockets.socketEntries.map((socket, s) => buildDefinedSocket(item, socket, s));

  const socketCategories = definitionItem.sockets.socketCategories.map((category) => {
    return {
      category: manifest.DestinySocketCategoryDefinition[category.socketCategoryHash],
      sockets: compact(category.socketIndexes.map((index) => realSockets[index])).filter((socket) => socket.plugOptions.length),
    };
  });

  return {
    sockets: compact(realSockets), // Flat list of sockets
    socketCategories: orderBy(socketCategories.sort(utils.compareBy((socketCategory) => socketCategory.category.index)), [(category) => category.sockets.filter((socket) => socket.isIntrinsic).length], ['desc']), // sockets organized by category then I force intrinsic-containing categories to top
  };
}

function buildDefinedSocket(item, definitionSocket, index) {
  const definitionItem = manifest.DestinyInventoryItemDefinition[item.itemHash];

  if (!definitionSocket) {
    return undefined;
  }

  const definitionSocketType = manifest.DestinySocketTypeDefinition[definitionSocket.socketTypeHash];
  if (!definitionSocketType) {
    return undefined;
  }

  const definitionSocketCategory = manifest.DestinySocketCategoryDefinition[definitionSocketType.socketCategoryHash];
  if (!definitionSocketCategory) {
    return undefined;
  }

  const isPerk = Boolean(
    // most items
    definitionSocketCategory.categoryStyle === enums.DestinySocketCategoryStyle.Reusable ||
      // Ghosts
      (definitionItem.itemType === enums.DestinyItemType.Ghost && definitionSocketCategory.categoryStyle === enums.DestinySocketCategoryStyle.Unlockable) ||
      // Vehicles
      (definitionItem.itemType === enums.DestinyItemType.Vehicle && definitionSocketCategory.categoryStyle === enums.DestinySocketCategoryStyle.Unlockable)
  );

  const reusablePlugItems = (definitionSocket.reusablePlugSetHash && manifest.DestinyPlugSetDefinition[definitionSocket.reusablePlugSetHash]?.reusablePlugItems) || [];

  const randomizedPlugs = (definitionSocket.randomizedPlugSetHash && manifest.DestinyPlugSetDefinition[definitionSocket.randomizedPlugSetHash]?.reusablePlugItems) || [];

  const reusablePlugs = compact(
    (definitionSocket.reusablePlugItems || [])
      .concat(reusablePlugItems)
      .concat(randomizedPlugs)
      .filter((obj, index, plugs) => {
        return plugs.map((mapObj) => mapObj.plugItemHash).indexOf(obj.plugItemHash) === index;
      })
      .map((reusablePlug) => buildPlug(definitionSocket, reusablePlug))
  );

  const probablyMasterworkSocket = reusablePlugs[0]?.definition?.plug?.plugCategoryIdentifier?.includes('masterworks.stat') || reusablePlugs[0]?.definition?.plug?.plugCategoryIdentifier?.endsWith('_masterwork');

  const processedPlugs =
    // see if it's a masterwork socket based on the plug options
    (probablyMasterworkSocket
      ? // okay, it's a masterwork socket probably so let's add a super cool default plug, DEFAULT_MASTERWORK_PLUG, and filter out all the low-tier masterworks
        [
          // build the default plug
          buildPlug(definitionSocket, { plugItemHash: DEFAULT_MASTERWORK_PLUG }),
          ...reusablePlugs.filter((reusablePlug) => definitionItem.itemType === enums.DestinyItemType.Weapon ? reusablePlug.definition.investmentStats?.[0]?.value === 10 : true),
        ]
      : // i was wrong, do nothing.
        reusablePlugs) ||
    // there's no reusablePlugs
    [];

  const plugItem =
    buildPlug(
      definitionSocket,
      // use available singleInitialItemHash
      (definitionSocket.singleInitialItemHash && definitionSocket.singleInitialItemHash !== 0 && { plugItemHash: definitionSocket.singleInitialItemHash }) ||
        // let's choose our own initial plug
        (!definitionSocket?.singleInitialItemHash || definitionSocket?.singleInitialItemHash === 0
          ? // singleInitialItemHash was found to === 0 so let's try the first reusablePlug hash
            processedPlugs?.[0]?.definition?.hash && { plugItemHash: probablyMasterworkSocket ? DEFAULT_MASTERWORK_PLUG : processedPlugs[0].definition.hash }
          : undefined) ||
        // got nothin'
        undefined
    ) || false;

  const plugOptions = plugItem ? [plugItem] : [];

  if (processedPlugs.length) {
    processedPlugs.forEach((reusablePlug) => {
      if (filterReusablePlug(reusablePlug)) {
        if (plugItem && reusablePlug.definition.hash === plugItem.definition.hash) {
          // Use the inserted plug we built earlier in this position, rather than the one we build from reusablePlugs.
          plugOptions.shift();
          plugOptions.push(plugItem);
        } else {
          // API Bugfix: Filter out intrinsic perks past the first: https://github.com/Bungie-net/api/issues/927
          if (!reusablePlug.definition.itemCategoryHashes || !reusablePlug.definition.itemCategoryHashes.includes(INTRINSIC_PLUG_CATEGORY)) {
            plugOptions.push(reusablePlug);
          }
        }
      }
    });
  }

  const isIntrinsic = plugItem && Boolean(plugItem.definition.itemCategoryHashes?.includes(2237038328));
  const isMod = plugItem && Boolean(plugItem.definition.itemCategoryHashes?.filter((hash) => modItemCategoryHashes.includes(hash)).length > 0);
  const isShader = plugItem && Boolean(plugItem.definition.inventory?.bucketTypeHash === enums.DestinyInventoryBucket.Shaders);
  const isOrnament = plugItem && Boolean(plugItem.definition.itemSubType === enums.DestinyItemSubType.Ornament);
  const isSpawnFX = plugItem && Boolean(plugItem.definition.plug?.plugCategoryIdentifier?.includes('spawnfx'));
  const isMasterwork = plugItem && Boolean(plugItem.definition.plug?.plugCategoryIdentifier?.includes('masterworks.stat') || plugItem.definition.plug?.plugCategoryIdentifier?.endsWith('_masterwork') || plugItem.definition.hash === DEFAULT_MASTERWORK_PLUG);
  const isTracker = plugItem && Boolean(plugItem.definition.plug?.plugCategoryIdentifier?.includes('trackers'));

  return {
    socketIndex: index,
    plug: plugItem,
    plugOptions,
    hasRandomizedPlugItems: Boolean(definitionSocket.randomizedPlugSetHash) || definitionSocketType.alwaysRandomizeSockets,
    isPerk,
    isIntrinsic,
    isMod,
    isShader,
    isOrnament,
    isSpawnFX,
    isMasterwork,
    isTracker,
    socketDefinition: definitionSocket,
  };
}

/**
 * Build information about an individual socket, and its plugs, using live information.
 */
function buildSocket(item, socket, definitionSocket, index, reusablePlugs, plugObjectivesData) {
  // if (
  //   !socketDef ||
  //   (!socket.isVisible &&
  //     // Keep the kill-tracker socket around even though it may not be visible
  //     // TODO: does this really happen? I think all these sockets are visible
  //     !(socket.plugHash && plugObjectivesData[socket.plugHash].length, (o) => o))
  // ) {
  //   return undefined;
  // }

  const definitionItem = manifest.DestinyInventoryItemDefinition[item.itemHash];

  const definitionSocketType = manifest.DestinySocketTypeDefinition[definitionSocket.socketTypeHash];
  if (!definitionSocketType) {
    return undefined;
  }

  const definitionSocketCategory = manifest.DestinySocketCategoryDefinition[definitionSocketType.socketCategoryHash];
  if (!definitionSocketCategory) {
    return undefined;
  }

  const isPerk = Boolean(
    // most items
    definitionSocketCategory.categoryStyle === enums.DestinySocketCategoryStyle.Reusable ||
      // Ghosts
      (definitionItem.itemType === enums.DestinyItemType.Ghost && definitionSocketCategory.categoryStyle === enums.DestinySocketCategoryStyle.Unlockable) ||
      // Vehicles
      (definitionItem.itemType === enums.DestinyItemType.Vehicle && definitionSocketCategory.categoryStyle === enums.DestinySocketCategoryStyle.Unlockable)
  );

  // The currently equipped plug, if any.
  const plugItem = buildPlug(definitionSocket, socket, plugObjectivesData);

  const plugOptions = plugItem ? [plugItem] : [];

  // We only build a larger list of plug options if this is a perk socket, since users would
  // only want to see (and search) the plug options for perks. For other socket types (mods, shaders, etc.)
  // we will only populate plugOptions with the currently inserted plug.
  if (isPerk) {
    if (reusablePlugs) {
      // This perk's list of plugs comes from the live reusablePlugs component.
      const reusableDimPlugs = reusablePlugs ? compact(reusablePlugs.map((reusablePlug) => buildPlug(definitionSocket, reusablePlug, plugObjectivesData))) : [];

      if (reusableDimPlugs.length) {
        reusableDimPlugs.forEach((reusablePlug) => {
          if (filterReusablePlug(reusablePlug)) {
            if (plugItem && reusablePlug.definition.hash === plugItem.definition.hash) {
              // Use the inserted plug we built earlier in this position, rather than the one we build from reusablePlugs.
              plugOptions.shift();
              plugOptions.push(plugItem);
            } else {
              // API Bugfix: Filter out intrinsic perks past the first: https://github.com/Bungie-net/api/issues/927
              if (!reusablePlug.definition.itemCategoryHashes || !reusablePlug.definition.itemCategoryHashes.includes(INTRINSIC_PLUG_CATEGORY)) {
                plugOptions.push(reusablePlug);
              }
            }
          }
        });
      }
    } else if (definitionSocket.reusablePlugItems) {
      // This perk's list of plugs come from the definition's list of items?
      // TODO: should we fill this in for perks?
    } else if (definitionSocket.reusablePlugSetHash) {
      // This perk's list of plugs come from a plugSet
      // TODO: should we fill this in for perks?
    }
  }

  // TODO: is this still true?
  const hasRandomizedPlugItems = Boolean(definitionSocket && definitionSocket.randomizedPlugSetHash) || definitionSocketType.alwaysRandomizeSockets;

  const isIntrinsic = plugItem && Boolean(plugItem.definition.itemCategoryHashes?.includes(2237038328));
  const isMod = plugItem && Boolean(plugItem.definition.itemCategoryHashes?.filter((hash) => modItemCategoryHashes.includes(hash)).length > 0);
  const isShader = plugItem && Boolean(plugItem.definition.inventory?.bucketTypeHash === enums.DestinyInventoryBucket.Shaders);
  const isOrnament = plugItem && Boolean(plugItem.definition.itemSubType === enums.DestinyItemSubType.Ornament);
  const isSpawnFX = plugItem && Boolean(plugItem.definition.plug?.plugCategoryIdentifier?.includes('spawnfx'));
  const isMasterwork = plugItem && Boolean(plugItem.definition.plug?.plugCategoryIdentifier?.includes('masterworks.stat') || plugItem.definition.plug?.plugCategoryIdentifier?.endsWith('_masterwork') || plugItem.definition.hash === DEFAULT_MASTERWORK_PLUG);
  const isTracker = plugItem && Boolean(plugItem.definition.plug?.plugCategoryIdentifier?.includes('trackers'));

  return {
    socketIndex: index,
    plug: plugItem,
    plugOptions,
    hasRandomizedPlugItems,
    isPerk,
    isIntrinsic,
    isMod,
    isShader,
    isOrnament,
    isSpawnFX,
    isMasterwork,
    isTracker,
    socketDefinition: definitionSocket,
  };
}

function buildPlug(definitionSocket, plug, plugObjectivesData) {
  const plugHash = plug && (plug.plugItemHash || plug.plugHash);

  if (!plugHash) {
    return null;
  }

  const definitionPlug = manifest.DestinyInventoryItemDefinition[plugHash] || (definitionSocket.singleInitialItemHash && manifest.DestinyInventoryItemDefinition[definitionSocket.singleInitialItemHash]);

  if (!definitionPlug) {
    return null;
  }

  const failReasons = plug.enableFailIndexes ? plug.enableFailIndexes.map((index) => definitionPlug.plug.enabledRules[index].failureMessage).join('\n') : '';

  return {
    definition: definitionPlug,
    enableFailReasons: failReasons,
    plugObjectives: (plugObjectivesData && plugObjectivesData[plugHash]) || [],
    perks: definitionPlug.perks?.map((perk) => manifest.DestinySandboxPerkDefinition[perk.perkHash]) || [],
    stats: null,
  };
}

function filterReusablePlug(reusablePlug) {
  // const itemCategoryHashes = reusablePlug.definition.itemCategoryHashes || [];

  return reusablePlug.definition;
  //!itemCategoryHashes.includes(GHOST_MOD_CATEGORY)
  // !defaultPlugs.includes(reusablePlug.definition.hash) &&
  // !itemCategoryHashes.includes(MASTERWORK_MOD_CATEGORY) &&
  // (!reusablePlug.definition.plug && !reusablePlug.definition.plug.plugCategoryIdentifier.includes('masterworks.stat'))
}
