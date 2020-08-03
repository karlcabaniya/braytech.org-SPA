import React from 'react';
import { Polygon } from 'react-leaflet';

import maps from '../../../data/maps';

function getOffset(map, [x, y]) {
  const mapXOffset = (map.width - 1920) / 2;
  const mapYOffset = -(map.height - 1080) / 2;

  const markerOffsetX = mapXOffset + 1920 / 2;
  const markerOffsetY = mapYOffset + map.height + -1080 / 2;

  const offsetX = markerOffsetX + x;
  const offsetY = markerOffsetY + y;

  return [offsetY, offsetX];
}

export default function Borders(props) {
  if (!maps[props.destinationId].map.bubbles) return null;

  return [
    ...maps[props.destinationId].map.bubbles.map((bubble, b) => {
      if (!bubble.borders?.length) return null;

      const positions = bubble.borders.map((pair) => getOffset(maps[props.destinationId].map, pair));

      return <Polygon key={bubble.id} className='region' positions={positions} />;
    }),
    <Polygon key='debug' className='region debug' positions={(props.debug || []).map((pair) => getOffset(maps[props.destinationId].map, pair))} />,
  ];
}
