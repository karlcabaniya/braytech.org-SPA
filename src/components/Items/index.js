import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { orderBy } from 'lodash';
import cx from 'classnames';

import manifest from '../../utils/manifest';
import * as enums from '../../utils/destinyEnums';
import { displayValue } from '../../utils/destinyConverters';
import { itemComponents } from '../../utils/destinyItems/itemComponents';
import { sockets } from '../../utils/destinyItems/sockets';
import { stats } from '../../utils/destinyItems/stats';
import { masterwork } from '../../utils/destinyItems/masterwork';
import ObservedImage from '../../components/ObservedImage';
import ProgressBar from '../../components/UI/ProgressBar';
import { Common } from '../../svg';

import './styles.css';

const bucketsToExcludeFromInstanceProgressDisplay = [
  4274335291, // Emblems
];

function Items({ member, items, handler, disableTooltip, order, noBorder, showQuantity, hideQuantity, asPanels, placeholders = 0, showHash, selfLinkFrom, inspect }) {
  if (!items || !items.length) {
    console.warn('No items specified');

    return null;
  }

  const output = items.map((item, i) => {
    const definitionItem = item?.itemHash && (manifest.DestinyInventoryItemDefinition[item.itemHash] || manifest.BraytechDefinition[item.itemHash]);

    if (!definitionItem) {
      console.log(`Items: Couldn't find item definition for:`, item);

      return false;
    }

    item.itemComponents = itemComponents(item, member);
    item.sockets = sockets(item);
    item.stats = stats(item);
    item.masterwork = masterwork(item);

    const vendorItemStatus = item.unavailable === undefined && item.saleStatus && enums.enumerateVendorItemStatus(item.saleStatus);

    const masterworked = enums.enumerateItemState(item.state).masterworked || (!item.itemInstanceId && (definitionItem.itemType === enums.DestinyItemType.Armor ? item.masterwork?.stats?.filter((s) => s.value > 9).length : item.masterwork?.stats?.filter((s) => s.value >= 9).length));
    const tracked = enums.enumerateItemState(item.state).tracked;

    return {
      name: definitionItem.displayProperties.name,
      tierType: definitionItem.inventory?.tierType,
      element: (
        <li
          key={i}
          className={cx(
            {
              tooltip: !disableTooltip,
              linked: true,
              masterworked,
              tracked,
              exotic: definitionItem.inventory && definitionItem.inventory.tierType === 6,
              'no-border': (definitionItem.uiItemDisplayStyle === 'ui_display_style_engram' && item.bucketHash !== 3284755031) || (definitionItem.itemCategoryHashes && definitionItem.itemCategoryHashes.includes(268598612)) || (definitionItem.itemCategoryHashes && definitionItem.itemCategoryHashes.includes(18)) || noBorder,
              unavailable: (vendorItemStatus && !vendorItemStatus.success) || item.unavailable,
            },
            `item-type-${definitionItem.itemType || 0}`
          )}
          data-hash={item.itemHash}
          data-instanceid={item.itemInstanceId}
          data-state={item.state}
          data-vendorhash={item.vendorHash}
          data-vendoritemindex={item.vendorItemIndex}
          data-vendorstatus={item.saleStatus}
          data-quantity={item.quantity && item.quantity > 1 ? item.quantity : null}
          onClick={handler ? handler(item) : undefined}
        >
          <div className='icon'>
            <ObservedImage className='image' src={definitionItem.displayProperties.localIcon ? `${definitionItem.displayProperties.icon}` : `https://www.bungie.net${definitionItem.displayProperties.icon}`} />
          </div>
          {tracked ? (
            <div className='track'>
              <Common.Tracking />
            </div>
          ) : null}
          {asPanels ? (
            <div className='text'>
              <div className='name'>{definitionItem.displayProperties.name}</div>
              {showHash ? <div className='hash'>{definitionItem.hash}</div> : null}
            </div>
          ) : null}
          {item.itemComponents?.objectives && item.itemComponents?.objectives.filter((o) => !o.complete).length > 0 && !bucketsToExcludeFromInstanceProgressDisplay.includes(item.bucketHash) ? (
            <ProgressBar
              progress={{
                progress: item.itemComponents?.objectives.reduce((acc, curr) => {
                  return acc + curr.progress;
                }, 0),
                objectiveHash: item.itemComponents?.objectives[0].objectiveHash,
              }}
              objective={{
                completionValue: item.itemComponents?.objectives.reduce((acc, curr) => {
                  return acc + curr.completionValue;
                }, 0),
              }}
              hideCheck
            />
          ) : null}
          {(showQuantity || item.quantity > 1) && !hideQuantity ? <div className={cx('quantity', { 'max-stack': definitionItem.inventory && definitionItem.inventory.maxStackSize === item.quantity })}>{displayValue(item.quantity || 0)}</div> : null}
          {inspect && definitionItem.itemHash ? <Link to={{ pathname: `/inspect/${definitionItem.itemHash}`, state: { from: selfLinkFrom } }} /> : null}
        </li>
      ),
    };
  });

  const elements = order
    ? // filter blanks, order, and output
      orderBy(
        output.filter((item) => item),
        [(item) => item[order], (item) => item.name],
        ['desc', 'asc']
      ).map((item) => item.element)
    : // filter blanks and output
      output.filter((item) => item).map((item) => item.element);

  if (placeholders > 0) {
    while (elements.length < placeholders) {
      elements.push(<li key={elements.length} className='placeholder' />);
    }
  }

  return elements;
}

function mapStateToProps(state) {
  return {
    member: state.member,
  };
}

export default connect(mapStateToProps)(Items);
