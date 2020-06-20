import React, { useState, useEffect } from 'react';
import { compose } from 'redux';
import { connect, useDispatch } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import cx from 'classnames';
import queryString from 'query-string';

import { t, BungieText } from '../../utils/i18n';
import manifest from '../../utils/manifest';
import { rebind } from '../../store/actions/tooltips';
import * as enums from '../../utils/destinyEnums';
import { commonality } from '../../utils/destinyUtils';
import { damageTypeToAsset, breakerTypeToIcon, itemRarityToString, ammoTypeToAsset } from '../../utils/destinyConverters';
import ObservedImage from '../../components/ObservedImage';
import { DestinyKey } from '../../components/UI/Button';

import { sockets } from '../../utils/destinyItems/sockets';
import { stats, statsMs } from '../../utils/destinyItems/stats';
import { masterwork } from '../../utils/destinyItems/masterwork';
import { getSocketsWithStyle, getModdedStatValue, getSumOfArmorStats } from '../../utils/destinyItems/utils';

// import Scene from '../../components/Three/Inspect/Scene';

import './styles.css';

function Sockets({ itemHash, itemSockets, category, sockets, selected, ...props }) {
  const [socketState, setSocketState] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(rebind());
  }, [dispatch, socketState]);

  const toggleSocket = (socketIndex) => (e) => {
    if (socketState.indexOf(socketIndex) > -1) {
      setSocketState([...socketState.filter((i) => i !== socketIndex)]);
    } else {
      setSocketState([
        //...socketState,
        socketIndex,
      ]);
    }
  };

  const socketsToMap = sockets.filter((socket) => socket.socketDefinition.defaultVisible).filter((socket) => !socket.isTracker);
  const expandedSocket = socketsToMap.find((socket) => socketState.indexOf(socket.socketIndex) > -1);

  return (
    <div className={cx('module', 'category', { mods: category.categoryStyle === enums.DestinySocketCategoryStyle.Consumable, intrinsic: category.categoryStyle === enums.DestinySocketCategoryStyle.LargePerk })}>
      <div className='module-name'>{category.displayProperties.name}</div>
      <div className='category-sockets'>
        {socketsToMap.map((socket, s) => {
          // intrinsics
          if (category.categoryStyle === enums.DestinySocketCategoryStyle.LargePerk && sockets.length === 1 && sockets[0].isIntrinsic && sockets[0].plugOptions.length === 1) {
            return (
              <div key={s} className='socket intrinsic'>
                {socket.plugOptions.map((plug, p) => {
                  return (
                    <div key={p} className='plug active'>
                      <div className='icon'>
                        <ObservedImage src={`https://www.bungie.net${plug.definition.displayProperties.icon}`} />
                      </div>
                      <div className='text'>
                        <div className='name'>{plug.definition.displayProperties.name}</div>
                        <BungieText className='description' value={plug.definition.displayProperties.description} />
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          } // perks
          else if (category.categoryStyle !== enums.DestinySocketCategoryStyle.Consumable) {
            return (
              <div key={s} className={cx('socket', { columned: category.categoryStyle !== 2 && socket.plugOptions.length > 7 })} style={{ '--socket-columns': Math.ceil(socket.plugOptions.length / 6) }}>
                {socket.plugOptions.map((plug, p) => {
                  return (
                    <div key={p} className={cx('plug', 'tooltip', { active: plug.definition.hash === socket.plug.definition?.hash })} data-hash={plug.definition.hash} data-style='ui'>
                      <div className='icon'>
                        <ObservedImage src={`https://www.bungie.net${plug.definition.displayProperties.icon}`} />
                      </div>
                      <Link to={socketsUrl(itemHash, itemSockets, selected, socket.socketIndex, plug.definition.hash)} />
                    </div>
                  );
                })}
              </div>
            );
          } // mods
          else {
            return (
              <div key={s} className={cx('socket', { expanded: socketState.indexOf(socket.socketIndex) > -1 })}>
                {socket.plugOptions
                  .filter((plugOption) => plugOption.definition?.hash === socket.plug.definition?.hash)
                  .map((plug, p) => {
                    return (
                      <div key={p} className={cx('plug', 'tooltip', { active: plug.definition.hash === socket.plug.definition?.hash })} data-hash={plug.definition.hash} onClick={toggleSocket(socket.socketIndex)}>
                        <div className='icon'>
                          <ObservedImage src={`https://www.bungie.net${plug.definition.displayProperties.icon}`} />
                        </div>
                      </div>
                    );
                  })}
              </div>
            );
          }
        })}
        {expandedSocket ? (
          <div className='socket options'>
            {expandedSocket.plugOptions.map((plug, p) => {
              return (
                <div key={p} className={cx('plug', 'tooltip', { active: plug.definition.hash === expandedSocket.plug.definition?.hash })} data-hash={plug.definition.hash}>
                  <div className='icon'>
                    <ObservedImage src={`https://www.bungie.net${plug.definition.displayProperties.icon}`} />
                  </div>
                  <Link to={socketsUrl(itemHash, itemSockets, selected, expandedSocket.socketIndex, plug.definition.hash)} onClick={toggleSocket(expandedSocket.socketIndex)} />
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function socketsUrl(itemHash, sockets, selectedSockets, socketIndex, plugHash) {
  const socketsString = sockets.map((socket, s) => {
    // replace with plugHash at appropriate socket index
    if (socket.socketIndex === socketIndex) return plugHash;

    // return current or null
    return selectedSockets?.[s] || '';
  });

  // create string
  return `/inspect/${itemHash}?sockets=${socketsString.join('/')}`;
}

class Inspect extends React.Component {
  state = {
    from: undefined,
  };

  static getDerivedStateFromProps(p, s) {
    if (s.from) {
      return null;
    }

    return {
      from: p.location.state?.from || '/collections',
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);

    this.props.rebindTooltips();
  }

  render() {
    const { settings, member, location } = this.props;

    const query = queryString.parse(location.search);
    const selectedSockets = query.sockets?.split('/').map((socketHash) => Number(socketHash) || '');

    const item = {
      itemHash: this.props.match.params.hash,
      itemInstanceId: false,
      itemComponents: false,
      showHiddenStats: true,
      showDefaultSockets: true,
    };

    const definitionItem = manifest.DestinyInventoryItemDefinition[item.itemHash];

    // process sockets
    item.sockets = sockets(item);

    // adjust sockets according to user selection
    if (item.sockets.sockets) {
      item.sockets.sockets = item.sockets.sockets.map((socket, s) => {
        const selectedPlugHash = selectedSockets?.[s] || 0;

        // if user has selected a plug
        if (selectedPlugHash > 0) {
          // set active plug as primary plug
          socket.plug = (selectedPlugHash && socket.plugOptions.find((plugOption) => selectedPlugHash === plugOption.definition.hash)) || socket.plug;

          return socket;
        }

        return socket;
      });
    }

    // stats and masterwork as per usual
    item.stats = stats(item);
    item.masterwork = masterwork(item);

    item.primaryStat = (definitionItem.itemType === 2 || definitionItem.itemType === 3) &&
      definitionItem.stats &&
      !definitionItem.stats.disablePrimaryStatDisplay &&
      definitionItem.stats.primaryBaseStatHash && {
        hash: definitionItem.stats.primaryBaseStatHash,
        displayProperties: manifest.DestinyStatDefinition[definitionItem.stats.primaryBaseStatHash].displayProperties,
        value: 950,
      };

    if (item.primaryStat && item.itemComponents && item.itemComponents.instance?.primaryStat) {
      item.primaryStat.value = item.itemComponents.instance.primaryStat.value;
    } else if (item.primaryStat && member && member.data) {
      let character = member.data.profile.characters.data.find((characrer) => characrer.characterId === member.characterId);

      item.primaryStat.value = Math.floor((942 / 973) * character.light);
    }

    console.log(item);

    // weapon damage type
    const damageTypeHash = definitionItem.itemType === enums.DestinyItemType.Weapon && (item.itemComponents?.instance ? item.itemComponents.instance.damageTypeHash : definitionItem.defaultDamageTypeHash);

    const preparedSockets = item.sockets?.socketCategories?.reduce((sockets, socketCategory) => {
      // console.log(sockets, socketCategory)

      // if it's a mod and we've already processed a mod socket before
      const modCategoryIndex = sockets.findIndex((category) => category.category.categoryStyle === 2);

      if (modCategoryIndex > -1) {
        sockets[modCategoryIndex].sockets.push(...socketCategory.sockets);

        return sockets;
      } else {
        return [...sockets, socketCategory];
      }
    }, []);

    const armor2MasterworkSockets = item.sockets && item.sockets.socketCategories && getSocketsWithStyle(item.sockets, enums.DestinySocketCategoryStyle.EnergyMeter);

    const powerCap = definitionItem.inventory.tierType === enums.DestinyTierType.Superior && manifest.DestinyPowerCapDefinition[definitionItem.quality?.versions?.[0]?.powerCapHash]?.powerCap;

    const definitionLore = manifest.DestinyLoreDefinition[definitionItem.loreHash];

    const displayTaxonomy = powerCap || definitionItem.equippingBlock?.ammoType || definitionItem.breakerType > 0 || definitionItem.defaultDamageTypeHash;
    const displayCommonality = definitionItem.collectibleHash && manifest.statistics.collections?.[definitionItem.collectibleHash];
    const displayStats = (item.stats?.length && !item.stats.find((stat) => stat.statHash === -1000)) || (item.stats?.length && item.stats.find((s) => s.statHash === -1000));
    const displaySockets = item.sockets && item.sockets.socketCategories && item.sockets.sockets.filter((socket) => (socket.isPerk || socket.isIntrinsic || socket.isMod || socket.isOrnament || socket.isSpawnFX) && !socket.isTracker && !socket.isShader && socket.plug).length;
    const displayStatsOrIntrinsic = displayStats || (displaySockets && preparedSockets.filter((socketCategory) => socketCategory.category.categoryStyle === enums.DestinySocketCategoryStyle.LargePerk && socketCategory.sockets.length === 1 && socketCategory.sockets[0].plugOptions.length === 1))?.length;

    return (
      <>
        <div className='view' id='inspect'>
          <div className={cx('item-rarity', itemRarityToString(definitionItem.inventory.tierType))} />
          <div className={cx('wrap', { uniform: !(displayTaxonomy || displayCommonality) })}>
            <div className='module header'>
              <div className='icon'>{definitionItem.displayProperties.icon ? <ObservedImage src={`https://www.bungie.net${definitionItem.displayProperties.icon}`} /> : null}</div>
              <div className='text'>
                <div className='name'>{definitionItem.displayProperties.name}</div>
                <div className='type'>{definitionItem.itemTypeDisplayName}</div>
              </div>
              <BungieText className='flair' value={definitionItem.displayProperties.description} />
            </div>
            {displayTaxonomy || displayCommonality ? (
              <div className='module'>
                {displayTaxonomy ? (
                  <div className='module taxonomy'>
                    <div className='module-name'>{t('Basic characteristics')}</div>
                    {powerCap ? (
                      <div className='term power-cap'>
                        <div className='icon' />
                        <div className='text'>
                          <div className='name'>{powerCap}</div>
                          <div className='type'>{t('Power limit')}</div>
                        </div>
                      </div>
                    ) : null}
                    {definitionItem.equippingBlock?.ammoType ? (
                      <div className='term ammo-type'>
                        <div className='icon'>{ammoTypeToAsset(definitionItem.equippingBlock.ammoType).icon}</div>
                        <div className='text'>
                          <div className='name'>{ammoTypeToAsset(definitionItem.equippingBlock.ammoType).string}</div>
                          <div className='type'>{t('Ammo type')}</div>
                        </div>
                      </div>
                    ) : null}
                    {definitionItem.breakerType > 0 ? (
                      <div className='term breaker-type'>
                        <div className='icon'>{breakerTypeToIcon(definitionItem.breakerTypeHash)}</div>
                        <div className='text'>
                          <div className='name'>{manifest.DestinyBreakerTypeDefinition[definitionItem.breakerTypeHash].displayProperties.name}</div>
                          <div className='type'>{t('Breaker type')}</div>
                        </div>
                      </div>
                    ) : null}
                    {definitionItem.defaultDamageTypeHash ? (
                      <div className='term damage-type'>
                        <div className={cx('icon', damageTypeToAsset(definitionItem.defaultDamageTypeHash).string)}>{damageTypeToAsset(definitionItem.defaultDamageTypeHash).char}</div>
                        <div className='text'>
                          <div className='name'>{manifest.DestinyDamageTypeDefinition[definitionItem.defaultDamageTypeHash].displayProperties.name}</div>
                          <div className='type'>{t('Energy affinity')}</div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : null}
                {definitionItem.collectibleHash && manifest.statistics.collections?.[definitionItem.collectibleHash] ? (
                  <div className='module commonality'>
                    <div className='module-name'>{t('Commonality')}</div>
                    <div>
                      <div className='value tooltip' data-hash='commonality' data-type='braytech' data-related={definitionItem.collectibleHash}>
                        {commonality(manifest.statistics.collections[definitionItem.collectibleHash]).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%
                      </div>
                    </div>
                    <div className='info'>{t("The collectible's rarity represented as a percentage of players who are indexed by VOLUSPA who've collected it.")}</div>
                  </div>
                ) : null}
              </div>
            ) : null}
            {displayStatsOrIntrinsic ? (
              <div className='module'>
                {displayStats ? (
                  <div className='module stats'>
                    <div className='module-name'>{definitionItem.itemType === enums.DestinyItemType.Armor ? t('Armor stats') : t('Weapon stats')}</div>
                    {item.stats.map((stat) => {
                      // map through stats

                      const armor2MasterworkValue = armor2MasterworkSockets && getSumOfArmorStats(armor2MasterworkSockets, [stat.statHash]);

                      const moddedValue = item.sockets && item.sockets.sockets && getModdedStatValue(item.sockets, stat);
                      const masterworkValue = (item.masterwork && item.masterwork.stats?.find((m) => m.hash === stat.statHash) && item.masterwork.stats?.find((m) => m.hash === stat.statHash).value) || armor2MasterworkValue || 0;

                      let baseBar = stat.value;

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
                        <div key={stat.statHash} className='stat'>
                          <div className='name'>{stat.statHash === -1000 ? t('Total') : stat.displayProperties.name}</div>
                          <div className={cx('value', { bar: stat.bar })}>
                            {stat.bar ? (
                              <>
                                {segments.map(([value, className], i) => (
                                  <div key={i} className={cx('bar', className)} data-value={value} style={{ width: `${Math.min(100, Math.floor(100 * (value / stat.maximumValue)))}%` }} />
                                ))}
                                <div className='int'>{stat.value}</div>
                              </>
                            ) : (
                              <div className={cx('text', { masterwork: masterworkValue !== 0, modded: moddedValue !== 0 })}>
                                {stat.value} {statsMs.includes(stat.statHash) && 'ms'}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : null}
                {displaySockets ? (
                  <div className='module sockets'>
                    {preparedSockets
                      .filter((socketCategory) => socketCategory.category.categoryStyle === enums.DestinySocketCategoryStyle.LargePerk && socketCategory.sockets.length === 1 && socketCategory.sockets[0].plugOptions.length === 1)
                      .map((socketCategory, c) => (
                        <Sockets key={c} itemHash={item.itemHash} itemSockets={item.sockets.sockets} {...socketCategory} selected={selectedSockets} />
                      ))}
                  </div>
                ) : null}
              </div>
            ) : null}
            {displaySockets ? (
              <div className='module sockets perks'>
                {preparedSockets
                  .filter((socketCategory) => socketCategory.category.categoryStyle !== enums.DestinySocketCategoryStyle.LargePerk)
                  .map((socketCategory, c) => (
                    <Sockets key={c} itemHash={item.itemHash} itemSockets={item.sockets.sockets} {...socketCategory} selected={selectedSockets} />
                  ))}
              </div>
            ) : null}
            {definitionLore ? (
              <div className='module lore'>
                <div className='module-name'>{t('Lore')}</div>
                <BungieText className='text' value={definitionLore.displayProperties.description} />
              </div>
            ) : null}
            {definitionItem.screenshot && definitionItem.screenshot !== '' ? (
              <div className='module screenshot'>
                <div className='module-name'>{t('Screenshot')}</div>
                <ObservedImage src={`https://www.bungie.net${definitionItem.screenshot}`} />
              </div>
            ) : null}
          </div>
        </div>
        <div className='sticky-nav'>
          <div className='wrapper'>
            <div />
            <ul>
              <li>
                <Link className='button' to={this.state.from}>
                  <DestinyKey type='dismiss' />
                  {t('Dismiss')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    settings: state.settings,
    member: state.member,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    rebindTooltips: (value) => {
      dispatch({ type: 'REBIND_TOOLTIPS', payload: new Date().getTime() });
    },
  };
}

export default compose(connect(mapStateToProps, mapDispatchToProps), withRouter)(Inspect);
