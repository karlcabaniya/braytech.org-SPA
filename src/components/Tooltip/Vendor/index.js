import React from 'react';
import cx from 'classnames';

import { t, BungieText } from '../../../utils/i18n';
import manifest from '../../../utils/manifest';
import { cartographer } from '../../../utils/maps';

import ObservedImage from '../../ObservedImage';
import { Tooltips } from '../../../svg';

import './styles.css';

export default function Vendor(props) {
  const definitionVendor = manifest.DestinyVendorDefinition[props.hash];

  if (!definitionVendor) {
    console.warn('Hash not found');

    return null;
  }

  if (definitionVendor.redacted) {
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
  } else {
    const name = definitionVendor.displayProperties?.name || t('Unknown');

    const subTitle = definitionVendor.displayProperties?.subtitle;
    const description = definitionVendor.displayProperties?.description;

    const largeIcon = definitionVendor.displayProperties?.largeIcon;

    const node = cartographer({ key: 'vendorHash', value: definitionVendor.hash });

    const definitionDestination = manifest.DestinyDestinationDefinition[node.destinationHash];
    const definitionBubble = node.bubbleHash && definitionDestination.bubbles.find((bubble) => bubble.hash === node.bubbleHash);
    const definitionPlace = definitionDestination && manifest.DestinyPlaceDefinition[definitionDestination.placeHash];

    const destinationName = definitionDestination && definitionDestination.displayProperties.name;
    const placeName = definitionPlace && definitionPlace.displayProperties.name && definitionPlace.displayProperties.name !== definitionDestination.displayProperties.name && definitionPlace.displayProperties.name;
    const bubbleName = definitionBubble && definitionBubble.displayProperties.name;

    const destination = [bubbleName, destinationName, placeName].filter((string) => string).join(', ');

    return (
      <>
        <div className='acrylic' />
        <div className='frame vendor'>
          <div className='header'>
            <div className='icon'>
              <Tooltips.Vendor />
            </div>
            <div className='text'>
              <div className='name'>{name}</div>
              {subTitle ? (
                <div>
                  <div className='kind'>{subTitle}</div>
                </div>
              ) : null}
            </div>
          </div>
          <div className='black'>
            {node.screenshot || largeIcon ? (
              <div className={cx('screenshot', { extras: node.screenshot })}>
                <ObservedImage className='image' src={node.screenshot || `https://www.bungie.net${largeIcon}`} />
              </div>
            ) : null}
            {description || destination ? (
              <div className='description'>
                {destination ? <div className='destination'>{destination}</div> : null}
                {description ? <BungieText value={description} /> : null}
              </div>
            ) : null}
          </div>
        </div>
      </>
    );
  }
}
