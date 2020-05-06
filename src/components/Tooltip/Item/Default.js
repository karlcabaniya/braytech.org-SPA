import React from 'react';

import { t, duration, timestampToDuration, BungieText } from '../../../utils/i18n';
import manifest from '../../../utils/manifest';
import ObservedImage from '../../ObservedImage';
import ProgressBar from '../../UI/ProgressBar';
import { getRewardsQuestLine } from '../../QuestLine';

const Default = (props) => {
  const { itemHash, itemComponents, quantity, vendorHash, vendorItemIndex } = props;
  const characters = props.data.profile?.characters.data;
  const character = characters?.find((character) => character.characterId === props.characterId);

  const definitionItem = manifest.DestinyInventoryItemDefinition[itemHash];

  // description
  const description = definitionItem.displayProperties && definitionItem.displayProperties.description !== '' && definitionItem.displayProperties.description;

  // source string
  const sourceString = definitionItem.collectibleHash ? manifest.DestinyCollectibleDefinition[definitionItem.collectibleHash] && manifest.DestinyCollectibleDefinition[definitionItem.collectibleHash].sourceString : false;

  // flair string
  const flair = definitionItem.displaySource && definitionItem.displaySource !== '' && definitionItem.displaySource;

  const expirationDate = itemComponents && itemComponents.item && itemComponents.item.expirationDate;
  const timestamp = expirationDate && new Date().getTime();
  const timestampExpiry = expirationDate && new Date(expirationDate).getTime();

  // item objectives
  const objectives =
    definitionItem.objectives?.objectiveHashes.map((hash, h) => {
      const definitionObjective = manifest.DestinyObjectiveDefinition[hash];

      const instanceProgressObjective = itemComponents?.objectives?.length && itemComponents.objectives.find((o) => o.objectiveHash === hash);

      const playerProgress = {
        complete: false,
        progress: 0,
        objectiveHash: definitionObjective.hash,
        ...instanceProgressObjective,
      };

      return <ProgressBar key={h} objectiveHash={definitionObjective.hash} {...playerProgress} />;
    }) || [];

  // potential rewards
  const rewards =
    getRewardsQuestLine(manifest.DestinyInventoryItemDefinition[definitionItem.objectives?.questlineItemHash] || definitionItem, character?.classType).map((value, v) => {
      const definitionReward = manifest.DestinyInventoryItemDefinition[value.itemHash];

      return (
        <li key={v}>
          <div className='icon'>{definitionReward.displayProperties.icon && <ObservedImage className='image' src={`https://www.bungie.net${definitionReward.displayProperties.icon}`} />}</div>
          <div className='text'>
            {definitionReward.displayProperties.name}
            {value.quantity > 1 ? <> +{value.quantity}</> : null}
          </div>
        </li>
      );
    }) || [];

  // vendor costs
  const vendorCosts = manifest.DestinyVendorDefinition[vendorHash]?.itemList[vendorItemIndex]?.currencies;

  const blocks = [];

  // flair
  if (flair) {
    blocks.push(
      <div className='flair'>
        <p>{flair}</p>
      </div>
    );
  }

  if (flair && description) blocks.push(<div className='line' />);

  // description
  if (description) {
    blocks.push(<BungieText className='description' value={description} />);
  }

  // objectives?
  if (objectives.length) {
    blocks.push(<div className='objectives'>{objectives}</div>);
  }

  // rewards?
  if (rewards.length) {
    blocks.push(
      <div className='rewards'>
        <div>{t('Rewards')}</div>
        <ul>{rewards}</ul>
      </div>
    );
  }

  // instance expiry
  if (itemComponents?.objectives?.length && itemComponents.objectives.filter((o) => !o.complete).length > 0 && expirationDate) {
    blocks.push(<div className='expiry'>{timestampExpiry > timestamp ? <p>{t('Expires in {{duration}}.', { duration: duration(timestampToDuration(expirationDate)) })}</p> : <p>{definitionItem.inventory?.expiredInActivityMessage || t('Expired')}</p>}</div>);
  }

  // quantity
  if (quantity && definitionItem.inventory && definitionItem.inventory.maxStackSize > 1 && quantity === definitionItem.inventory.maxStackSize) {
    blocks.push(
      <div className='quantity'>
        {t('Quantity')}: <span>{quantity}</span> <span className='max'>({t('max')})</span>
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

  return blocks.map((block, i) => <React.Fragment key={i}>{block}</React.Fragment>);
};

export default Default;
