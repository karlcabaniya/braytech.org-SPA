import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import cx from 'classnames';

import manifest from '../../../utils/manifest';
import ObservedImage from '../../ObservedImage';
import destinations from '../../../data/lowlines/maps/destinations';
import nodes from '../../../data/lowlines/maps/nodes';

import { ReactComponent as SVGVendor } from '../../../svg/tooltips/vendor.svg';

import './styles.css';

class Vendor extends React.Component {
  render() {
    const { t, hash } = this.props;

    const definitionVendor = manifest.DestinyVendorDefinition[hash];

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
      const description =definitionVendor.displayProperties?.description;

      const largeIcon = definitionVendor.displayProperties?.largeIcon;

      const locations = definitionVendor.locations?.length;
      const definitionDestination = locations.length > 1 ? manifest.DestinyDestinationDefinition[definitionVendor.locations[1].destinationHash] : manifest.DestinyDestinationDefinition[definitionVendor.locations[0].destinationHash];

      const destination = definitionDestination && Object.values(destinations).find(d => d.destination.hash === definitionDestination.hash);
      const bubble = destination && destination.map.bubbles.find(b => b.nodes.find(n => n.vendorHash === definitionVendor.hash));

      const definitionBubble = (bubble && bubble.hash && definitionDestination.bubbles.find(b => b.hash === bubble.hash)) || (bubble && bubble.name);
      const definitionPlace = definitionDestination && manifest.DestinyPlaceDefinition[definitionDestination.placeHash];

      const destinationName = definitionDestination && definitionDestination.displayProperties.name;
      const placeName = definitionPlace && definitionPlace.displayProperties.name && definitionPlace.displayProperties.name !== definitionDestination.displayProperties.name && definitionPlace.displayProperties.name;
      const bubbleName = definitionBubble && definitionBubble.displayProperties.name;

      const extras = nodes && nodes.find(d => d.vendorHash === definitionVendor.hash);
      const screenshot = extras && extras.screenshot;

      // console.log(definitionVendor.hash, (definitionBubble && definitionBubble.hash) || 'No bubble')

      return (
        <>
          <div className='acrylic' />
          <div className='frame vendor'>
            <div className='header'>
              <div className='icon'>
                <SVGVendor />
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
              {largeIcon ? (
                <div className={cx('screenshot', { extras: screenshot })}>
                  <ObservedImage className='image' src={screenshot ? screenshot : `https://www.bungie.net${largeIcon}`} />
                </div>
              ) : null}
              {description || definitionDestination ? (
                <div className='description'>
                  {definitionDestination ? (
                    <div className='destination'>
                      {[bubbleName, destinationName, placeName].filter(s => s).join(', ')}
                    </div>
                  ) : null}
                  {description ? <pre>{description}</pre> : null}
                </div>
              ) : null}
            </div>
          </div>
        </>
      );
    }
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    viewport: state.viewport,
    tooltips: state.tooltips
  };
}

export default compose(
  connect(mapStateToProps),
  withTranslation()
)(Vendor);
