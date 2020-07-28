import React from 'react';
import cx from 'classnames';

import { t, BungieText } from '../../../utils/i18n';
import manifest from '../../../utils/manifest';
import { energyTypeToAsset } from '../../../utils/destinyConverters';
import { energyCostsStatHashes } from '../../../utils/destinyEnums';
import { plugScaledStats } from '../../../utils/destinyItems/stats';
import ObservedImage from '../../ObservedImage';

import { VendorCosts } from './';

const Mod = ({ itemHash, vendorHash, vendorItemIndex, ...props }) => {
  const definitionItem = manifest.DestinyInventoryItemDefinition[itemHash];

  // description
  const description = definitionItem.displayProperties && definitionItem.displayProperties.description !== '' && definitionItem.displayProperties.description;

  // source string
  const sourceString = definitionItem.collectibleHash ? manifest.DestinyCollectibleDefinition[definitionItem.collectibleHash] && manifest.DestinyCollectibleDefinition[definitionItem.collectibleHash].sourceString : false;

  // is it a masterwork?
  const probablyMasterworkPlug = definitionItem.plug?.plugCategoryIdentifier?.includes('masterworks.stat') || definitionItem.plug?.plugCategoryIdentifier?.endsWith('_masterwork');

  // perks
  const perks = definitionItem.perks.filter((perk) => manifest.DestinySandboxPerkDefinition[perk.perkHash]?.isDisplayable && manifest.DestinySandboxPerkDefinition[perk.perkHash].displayProperties?.description !== description);

  // raw investment stats
  const rawInvestmentStats = definitionItem.investmentStats?.length
      ? // filter through investmentStats for stats that have a value and a name
        definitionItem.investmentStats.filter((stat) => !energyCostsStatHashes.includes(stat.statTypeHash) && manifest.DestinyStatDefinition[stat.statTypeHash]?.displayProperties.name !== '' && stat.value !== 0)
      : // nothing to show
      [];
  // if investment stats to display, do some more work
  const investmentStatsScaled = plugScaledStats({ itemHash: props.baseHash, plugItemHash: itemHash });
  // combine raw investment stats with scaled values
  const investmentStats = rawInvestmentStats.map(stat => ({ ...stat, value: investmentStatsScaled[stat.statTypeHash] || stat.value }));

  // energy cost
  const energyCost = definitionItem.plug.energyCost;
  const energyType = energyCost && energyTypeToAsset(energyCost.energyTypeHash);

  // vendor costs
  const vendorCosts = manifest.DestinyVendorDefinition[vendorHash]?.itemList[vendorItemIndex]?.currencies.filter((cost) => cost.quantity > 0);

  const blocks = [];

  if (energyCost) {
    blocks.push(
      <div className='big-value energy'>
        <div className='stat'>
          <div className={cx('value', energyType.string)}>
            <div className='icon'>{energyType.icon}</div> {energyCost.energyCost}
          </div>
          <div className='text'>{t('Energy cost')}</div>
        </div>
      </div>
    );
  }

  if (probablyMasterworkPlug) {
    blocks.push(
      <div className='big-value masterwork'>
        {investmentStats.map((stat, s) => (
          <div key={s} className='stat'>
            <div className='value'>{stat.value}</div>
            <div className='text'>{manifest.DestinyStatDefinition[stat.statTypeHash]?.displayProperties.name}</div>
          </div>
        ))}
      </div>
    );
  }

  if (description) {
    blocks.push(<BungieText className='description' value={description} />);
  }

  if (description && perks.length) blocks.push(<div className='line' />);

  if (perks.length) {
    blocks.push(
      <div className='sockets perks'>
        {perks.map((perk) => {
          const definitionPerk = manifest.DestinySandboxPerkDefinition[perk.perkHash];

          return (
            <div key={perk.perkHash} className='socket'>
              <div className={cx('plug', { enabled: true })}>
                <ObservedImage className='image icon' src={`https://www.bungie.net${definitionPerk.displayProperties?.icon || `/img/misc/missing_icon_d2.png`}`} />
                <div className='text'>
                  <div className='name'>{definitionPerk.displayProperties?.name}</div>
                  <BungieText className='description' value={definitionPerk.displayProperties?.description} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  if ((description && !perks.length && !probablyMasterworkPlug && investmentStats.length) || (perks.length && !probablyMasterworkPlug && investmentStats.length)) blocks.push(<div className='line' />);

  if (!probablyMasterworkPlug && investmentStats.length) {
    blocks.push(
      <div className='investment'>
        {investmentStats.map((stat, s) => (
          <div key={s} className='stat'>
            <div className='name'>{manifest.DestinyStatDefinition[stat.statTypeHash]?.displayProperties.name}</div>
            <div className={cx('value', { negative: stat.value < 0 })}>
              {stat.value > 0 && '+'}
              {stat.value}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if ((description && !investmentStats.length && sourceString) || (perks.length && sourceString) || (investmentStats.length && sourceString)) blocks.push(<div className='line' />);

  if (sourceString) {
    blocks.push(
      <div className='source'>
        <p>{sourceString}</p>
      </div>
    );
  }

  if ((sourceString && vendorCosts?.length) || (description && vendorCosts?.length)) blocks.push(<div className='line' />);

  // vendor costs
  if (vendorCosts?.length) {
    blocks.push(<VendorCosts costs={vendorCosts} />);
  }

  return blocks.map((block, b) => <React.Fragment key={b}>{block}</React.Fragment>);
};

export default Mod;
