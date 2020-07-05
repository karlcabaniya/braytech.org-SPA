import React from 'react';
import { useSelector } from 'react-redux';
import cx from 'classnames';

import { t } from '../../../utils/i18n';
import manifest from '../../../utils/manifest';
import ObservedImage from '../../ObservedImage';

import './styles.css';

import Default from './Default';
import Braytech from './Braytech';

const woolworths = {
  braytech: Braytech,
};

function UI({ ...props }) {
  const viewport = useSelector((state) => state.viewport);

  const item = {
    itemHash: props.hash,
    itemInstanceId: props.instanceid,
    itemComponents: null,
    relatedHash: props.related,
    quantity: +props.quantity || 1,
    state: +props.state || 0,
    rarity: 'common',
    type: props.type,
  };

  const definition = item.type === 'braytech' ? manifest.BraytechDefinition[item.itemHash] : item.type === 'stat' ? manifest.DestinyStatDefinition[item.itemHash] || manifest.DestinyHistoricalStatsDefinition[item.itemHash] : item.type === 'modifier' ? manifest.DestinyActivityModifierDefinition[item.itemHash] : false;

  if (!definition) {
    return null;
  }

  if (definition.redacted) {
    return (
      <>
        <div className='acrylic' />
        <div className={cx('frame', 'common')}>
          <div className='header'>
            <div className='name'>{t('Classified')}</div>
            <div>
              <div className='kind'>{t('Insufficient clearance')}</div>
            </div>
          </div>
          <div className='black'>
            <div className='description'>
              <pre>{t('Keep it clean.')}</pre>
            </div>
          </div>
        </div>
      </>
    );
  }

  const Meat = item.type && woolworths[item.type];

  return (
    <>
      <div className='acrylic' />
      <div className='frame ui'>
        <div className='header'>
          <div className='name'>{definition.displayProperties?.name || definition.statName}</div>
          {definition.itemTypeDisplayName ? <div className='kind'>{definition.itemTypeDisplayName}</div> : <div />}
        </div>
        <div className='black'>
          {viewport.width <= 600 && definition.screenshot ? (
            <div className='screenshot'>
              <ObservedImage className='image' src={`https://www.bungie.net${definition.screenshot}`} />
            </div>
          ) : null}
          {woolworths[item.type] ? <Meat {...item} /> : <Default {...item} />}
        </div>
      </div>
    </>
  );
}

export default UI;
