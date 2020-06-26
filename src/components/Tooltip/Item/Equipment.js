import React from 'react';
import i18n from 'i18next';
import cx from 'classnames';

import { t, BungieText } from '../../../utils/i18n';
import manifest from '../../../utils/manifest';
import * as enums from '../../../utils/destinyEnums';
import { stringToIcons } from '../../../utils/destinyUtils';
import { damageTypeToAsset, ammoTypeToAsset, breakerTypeToIcon, energyTypeToAsset, energyStatToType } from '../../../utils/destinyConverters';
import { getSocketsWithStyle, getModdedStatValue, getSumOfArmorStats } from '../../../utils/destinyItems/utils';
import { statsMs } from '../../../utils/destinyItems/stats';
import lightcapToSeason from '../../../data/d2-additional-info/lightcap-to-season.json';
import ObservedImage from '../../ObservedImage';

const Equipment = ({ itemHash, itemComponents, primaryStat, stats, sockets, masterwork, vendorHash, vendorItemIndex }) => {
  // definition of item
  const definitionItem = manifest.DestinyInventoryItemDefinition[itemHash];

  // quality/power cap
  const powerCap = definitionItem.inventory.tierType === enums.DestinyTierType.Superior && manifest.DestinyPowerCapDefinition[definitionItem.quality?.versions?.[0]?.powerCapHash]?.powerCap;

  // description as flair string
  const flair = definitionItem.displayProperties?.description !== '' && definitionItem.displayProperties.description;

  // source string
  const sourceString = definitionItem.collectibleHash ? manifest.DestinyCollectibleDefinition[definitionItem.collectibleHash] && manifest.DestinyCollectibleDefinition[definitionItem.collectibleHash].sourceString : false;

  // vendor costs
  const vendorCosts = vendorHash && vendorItemIndex && manifest.DestinyVendorDefinition[vendorHash]?.itemList[vendorItemIndex]?.currencies;

  // weapon damage type
  const damageTypeHash = itemComponents?.instance?.damageTypeHash ? itemComponents.instance.damageTypeHash : definitionItem.itemType === enums.DestinyItemType.Weapon && definitionItem.damageTypeHashes?.[0] ? definitionItem.damageTypeHashes[0] : false;

  const displayStats = (stats && stats.length && !stats.find((stat) => stat.statHash === -1000)) || (stats && stats.length && stats.find((s) => s.statHash === -1000 && s.value !== 0));
  const displaySockets = sockets && sockets.socketCategories && sockets.sockets.filter((socket) => (socket.isPerk || socket.isIntrinsic || socket.isMod || socket.isOrnament || socket.isSpawnFX) && !socket.isTracker && !socket.isShader && socket.plug).length;

  const armor2MasterworkSockets = sockets?.socketCategories && getSocketsWithStyle(sockets, enums.DestinySocketCategoryStyle.EnergyMeter);

  const energy =
    definitionItem.itemType === enums.DestinyItemType.Armor &&
    ((itemComponents && itemComponents.instance && itemComponents.instance.energy) ||
      (masterwork &&
        armor2MasterworkSockets.length && {
          energyTypeHash: energyStatToType(masterwork.stats[0].hash),
          energyCapacity: masterwork.stats[0].value,
        }));
  const definitionEnergy = energy && energyTypeToAsset(energy.energyTypeHash);

  const blocks = [];

  // primary stat block for weapons and armor
  if (primaryStat) {
    if (definitionItem.itemType === enums.DestinyItemType.Weapon) {
      blocks.push(
        <>
          <div className='damage weapon'>
            <div className={cx('power', damageTypeToAsset(damageTypeHash)?.string)}>
              {definitionItem.breakerType > 0 && <div className='breaker-type'>{breakerTypeToIcon(definitionItem.breakerTypeHash)}</div>}
              <div className={cx('icon', damageTypeToAsset(damageTypeHash)?.string)} />
              <div className='text'>{primaryStat.value}</div>
            </div>
            <div className='slot'>
              <div className={cx('icon', `ammo-type-${definitionItem.equippingBlock.ammoType}`)} />
              <div className='text'>{ammoTypeToAsset(definitionItem.equippingBlock.ammoType).string}</div>
            </div>
          </div>
        </>
      );
    } else {
      blocks.push(
        <>
          <div className='damage armour'>
            <div className='power'>
              <div className='text'>{primaryStat.value}</div>
              <div className='text'>{primaryStat.displayProperties.name}</div>
            </div>
            {energy ? (
              <div className='big-value energy'>
                <div className='stat'>
                  <div className={cx('value', definitionEnergy.string)}>
                    <div className='icon'>{definitionEnergy.icon}</div> {energy.energyCapacity}
                  </div>
                  <div className='text'>{i18n.t('Energy')}</div>
                </div>
              </div>
            ) : null}
          </div>
        </>
      );
    }
  }

  if (primaryStat && flair) blocks.push(<div className='line' />);

  // flair
  if (flair) {
    blocks.push(<BungieText className='flair' value={flair} />);
  }

  if ((powerCap && flair) || (primaryStat && powerCap)) blocks.push(<div className='line' />);

  // power cap
  if (powerCap) {
    blocks.push(
      <div className='power-cap'>
        <div className='text'>
          <div>{t('Power limit')}</div>
          <div className='light'>{powerCap}</div>
        </div>
        {lightcapToSeason[powerCap] ? (
          <div className='text'>
            <div>{t('Sunset')}</div>
            <div>{t('Season {{season}}', { season: lightcapToSeason[powerCap] })}</div>
          </div>
        ) : null}
      </div>
    );
  }

  if ((primaryStat && displayStats) || (powerCap && displayStats) || (flair && displayStats) || (flair && !displayStats && displaySockets)) blocks.push(<div className='line' />);

  if (masterwork?.objective?.progress) {
    blocks.push(
      <div className='kill-tracker'>
        <div className='text'>
          <div>{masterwork.objective.typeDesc}</div>
          <div>{masterwork.objective.progress.toLocaleString()}</div>
        </div>
      </div>
    );
  }

  if (masterwork?.objective?.progress && displayStats) blocks.push(<div className='line' />);

  // stats
  if (displayStats) {
    blocks.push(
      <div className='stats'>
        {stats.map((s) => {
          // map through stats

          const armor2MasterworkValue = armor2MasterworkSockets && getSumOfArmorStats(armor2MasterworkSockets, [s.statHash]);

          const moddedValue = sockets && sockets.sockets && getModdedStatValue(sockets, s);
          const masterworkValue = (masterwork && masterwork.stats?.find((m) => m.hash === s.statHash) && masterwork.stats?.find((m) => m.hash === s.statHash).value) || armor2MasterworkValue || 0;

          let baseBar = s.value;

          if (moddedValue) {
            baseBar -= moddedValue;
          }

          if (masterworkValue) {
            baseBar -= masterworkValue;
          }

          const segments = [[baseBar]];

          if (moddedValue) {
            segments.push([moddedValue, 'modded']);
          }

          if (masterworkValue) {
            segments.push([masterworkValue, 'masterwork']);
          }

          return (
            <div key={s.statHash} className='stat'>
              <div className='name'>{s.statHash === -1000 ? i18n.t('Total') : s.displayProperties.name}</div>
              <div className={cx('value', { bar: s.bar })}>
                {s.bar ? (
                  <>
                    {segments.map(([value, className], i) => (
                      <div key={i} className={cx('bar', className)} data-value={value} style={{ width: `${Math.min(100, Math.floor(100 * (value / s.maximumValue)))}%` }} />
                    ))}
                    <div className='int'>{s.value}</div>
                  </>
                ) : (
                  <div className={cx('text', { masterwork: masterworkValue !== 0 })}>
                    {s.value} {statsMs.includes(s.statHash) && 'ms'}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  if (displayStats && displaySockets) blocks.push(<div className='line' />);

  if (displaySockets) {
    blocks.push(
      <div
        className={cx('sockets', {
          // styling for single plug sockets
          one:
            sockets.sockets
              .filter((socket) => (socket.isPerk || socket.isIntrinsic || socket.isMod || socket.isOrnament || socket.isSpawnFX) && !socket.isTracker && !socket.isShader && socket.plug)
              .map((socket) => socket.plugOptions)
              .filter((socket) => socket.length).length === 1,
        })}
      >
        {sockets.socketCategories
          .map((category, c) => {
            // map through socketCategories

            if (category.sockets.length) {
              const socketsWithPlugs = category.sockets.filter((socket) => (socket.isPerk || socket.isIntrinsic || socket.isMod || socket.isOrnament || socket.isSpawnFX) && !socket.isTracker && !socket.isShader && socket.plug);

              if (socketsWithPlugs.length) {
                return (
                  <div key={c} className='category'>
                    {socketsWithPlugs.map((socket, s) => {
                      // filter for perks and map through sockets
                      return (
                        <div key={s} className='socket'>
                          {socket.plugOptions
                            // removed plug.isEnabled // 2.24.74
                            .filter((plug) => plug.definition?.hash === socket.plug?.definition?.hash)
                            .map((plug, p) => {
                              // filter for enabled plugs and map through

                              const type = socket.isIntrinsic ? plug.definition.displayProperties.description : plug.definition.itemTypeDisplayName;

                              return (
                                <div key={p} className={cx('plug', { intrinsic: socket.isIntrinsic, enabled: true })}>
                                  <ObservedImage className='image icon' src={`https://www.bungie.net${plug.definition.displayProperties.icon ? plug.definition.displayProperties.icon : `/img/misc/missing_icon_d2.png`}`} />
                                  <div className='text'>
                                    <div className='name'>{plug.definition.displayProperties.name}</div>
                                    {type ? <div className='type'>{stringToIcons(type)}</div> : null}
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      );
                    })}
                  </div>
                );
              } else {
                return false;
              }
            } else {
              return false;
            }
          })
          .filter((c) => c)}
      </div>
    );
  }

  if (sourceString) blocks.push(<div className='line' />);

  // sourceString
  if (sourceString) {
    blocks.push(
      <div className='source'>
        <p>{sourceString}</p>
      </div>
    );
  }

  if ((sourceString && vendorCosts?.length) || vendorCosts?.length) blocks.push(<div className='line' />);

  // vendor costs
  if (vendorCosts?.length) {
    blocks.push(
      <div className='vendor-costs'>
        <ul>
          {vendorCosts.map((cost, c) => (
            <li key={c}>
              <ul>
                <li>
                  <ObservedImage className='image icon' src={`https://www.bungie.net${manifest.DestinyInventoryItemDefinition[cost.itemHash]?.displayProperties.icon}`} />
                  <div className='text'>{manifest.DestinyInventoryItemDefinition[cost.itemHash]?.displayProperties.name}</div>
                </li>
                <li>{cost.quantity.toLocaleString()}</li>
              </ul>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return blocks.map((b, i) => <React.Fragment key={i}>{b}</React.Fragment>);
};

export default Equipment;
