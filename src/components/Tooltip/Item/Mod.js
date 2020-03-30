import React from 'react';
import cx from 'classnames';

import { t, BungieText } from '../../../utils/i18n';
import manifest from '../../../utils/manifest';
import { energyTypeToAsset } from '../../../utils/destinyConverters';
import ObservedImage from '../../ObservedImage';

const Mod = props => {
  const { itemHash, vendorHash, vendorItemIndex } = props;

  const definitionItem = manifest.DestinyInventoryItemDefinition[itemHash];

  // description
  const description = definitionItem.displayProperties && definitionItem.displayProperties.description !== '' && definitionItem.displayProperties.description;

  // source string
  const sourceString = definitionItem.collectibleHash ? manifest.DestinyCollectibleDefinition[definitionItem.collectibleHash] && manifest.DestinyCollectibleDefinition[definitionItem.collectibleHash].sourceString : false;

  // perks
  const perks = definitionItem.perks.filter(p => manifest.DestinySandboxPerkDefinition[p.perkHash] && manifest.DestinySandboxPerkDefinition[p.perkHash].isDisplayable);

  // energy cost
  const energyCost = definitionItem.plug.energyCost;
  const energyType = energyCost && energyTypeToAsset(energyCost.energyTypeHash);

  // vendor costs
  const vendorCosts = vendorHash && vendorItemIndex && manifest.DestinyVendorDefinition[vendorHash]?.itemList[vendorItemIndex]?.currencies;

  const blocks = [];

  if (energyCost) {
    blocks.push(
      <div className='energy'>
        <div className={cx('value', energyType.string)}>
          <div className='icon'>{energyType.icon}</div> {energyCost.energyCost}
        </div>
        <div className='text'>{t('Energy cost')}</div>
      </div>
    );
  }

  if (description) {
    blocks.push(<BungieText className='description' value={description} />);
  }

  if (description && perks.length) blocks.push(<div className='line' />);

  if (perks.length) {
    blocks.push(
      <div className={cx('sockets perks', { one: perks.length === 0 })}>
        {perks
          .map(p => {
            const definitionPerk = manifest.DestinySandboxPerkDefinition[p.perkHash];

            return (
              <div key={p.perkHash} className='socket'>
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
          .filter(c => c)}
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
