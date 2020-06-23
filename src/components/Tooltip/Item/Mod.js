import React from 'react';
import cx from 'classnames';

import { t, BungieText } from '../../../utils/i18n';
import manifest from '../../../utils/manifest';
import { energyTypeToAsset } from '../../../utils/destinyConverters';
import ObservedImage from '../../ObservedImage';

const Mod = ({ itemHash, vendorHash, vendorItemIndex, ...props }) => {
  const definitionItem = manifest.DestinyInventoryItemDefinition[itemHash];

  // description
  const description = definitionItem.displayProperties && definitionItem.displayProperties.description !== '' && definitionItem.displayProperties.description;

  // source string
  const sourceString = definitionItem.collectibleHash ? manifest.DestinyCollectibleDefinition[definitionItem.collectibleHash] && manifest.DestinyCollectibleDefinition[definitionItem.collectibleHash].sourceString : false;

  // perks
  const perks = definitionItem.perks.filter((perk) => manifest.DestinySandboxPerkDefinition[perk.perkHash]?.isDisplayable && manifest.DestinySandboxPerkDefinition[perk.perkHash].displayProperties?.description !== description);

  // energy cost
  const energyCost = definitionItem.plug.energyCost;
  const energyType = energyCost && energyTypeToAsset(energyCost.energyTypeHash);

  // vendor costs
  const vendorCosts = vendorHash && vendorItemIndex && manifest.DestinyVendorDefinition[vendorHash]?.itemList[vendorItemIndex]?.currencies;

  // is it a masterwork?
  const probablyMasterworkPlug = definitionItem.plug?.plugCategoryIdentifier?.includes('masterworks.stat') || definitionItem.plug?.plugCategoryIdentifier?.endsWith('_masterwork');

  const blocks = [];

  if (energyCost) {
    blocks.push(
      <div className='big-value energy'>
        <div className={cx('value', energyType.string)}>
          <div className='icon'>{energyType.icon}</div> {energyCost.energyCost}
        </div>
        <div className='text'>{t('Energy cost')}</div>
      </div>
    );
  }

  if (probablyMasterworkPlug) {
    blocks.push(
      <div className='big-value masterwork'>
        {definitionItem.investmentStats.map((stat, s) => (
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
        {perks
          .map((perk) => {
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
          })
          .filter((c) => c)}
      </div>
    );
  }

  if ((description && !perks.length && sourceString) || (perks.length && sourceString)) blocks.push(<div className='line' />);

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

export default Mod;
