import React from 'react';
import { connect } from 'react-redux';
import { Marker } from 'react-leaflet';
import cx from 'classnames';

import { t } from '../../../../utils/i18n';
import { Maps } from '../../../../svg';
import maps from '../../../../data/maps';
import * as marker from '../../markers';

// import World from '../../../Three/World/Scene';

function Director() {
  console.log('render director :<');

  const viewWidth = 1920;
  const viewHeight = 1080;

  const mapXOffset = (maps.director.map.width - viewWidth) / 2;
  const mapYOffset = -(maps.director.map.height - viewHeight) / 2;

  return maps.director.map.layers.filter(layer => layer.type !== 'map').filter(layer => layer.id === 'earth').map((layer, l) => {

    return layer.nodes.map((node, n) => {
      const markerOffsetX = mapXOffset + viewWidth / 2;
      const markerOffsetY = mapYOffset + maps.director.map.height + -viewHeight / 2;

      if (!layer.x === undefined || !layer.y === undefined) {
        console.warn(node);

        return null;
      }

      const offsetX = markerOffsetX + (layer.x || 0);
      const offsetY = markerOffsetY + (layer.y || 0);

      const icon = marker.converter(<div className='render'><canvas /></div>);

      return <Marker key={n} position={[offsetY, offsetX]} icon={icon} zIndexOffset='-1000' />;
    });
  });
}

export default Director;
