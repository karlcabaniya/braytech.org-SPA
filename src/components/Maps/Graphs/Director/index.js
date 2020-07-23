import React from 'react';
import { Marker } from 'react-leaflet';

import maps from '../../../../data/maps';
import * as marker from '../../markers';

function Director() {
  const viewWidth = 1920;
  const viewHeight = 1080;

  const mapXOffset = (maps.director.map.width - viewWidth) / 2;
  const mapYOffset = -(maps.director.map.height - viewHeight) / 2;

  return maps.director.map.layers
    .filter((layer) => layer.type !== 'map')
    .filter((layer) => layer.id === 'earth')
    .map((layer, l) => {
      return layer.nodes.map((node, n) => {
        const markerOffsetX = mapXOffset + viewWidth / 2;
        const markerOffsetY = mapYOffset + maps.director.map.height + -viewHeight / 2;

        if (!layer.x === undefined || !layer.y === undefined) {
          console.warn(node);

          return null;
        }

        const offsetX = markerOffsetX + (layer.x || 0);
        const offsetY = markerOffsetY + (layer.y || 0);

        if (node.type === 'model') {
          const icon = marker.converter(<div className='render' id='earth' />);

          return <Marker key={n} position={[offsetY, offsetX]} icon={icon} zIndexOffset='-1000' />;
        } else {
          return null;
        }
      });
    });
}

export default Director;
