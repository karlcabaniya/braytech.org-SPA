import React from 'react';

import { ImageOverlay } from 'react-leaflet';

import maps from '../../../../data/maps';

import './styles.css';

export default function CloudLayer(props) {
  console.log(props)

  const [offsetX, offsetY] = [0,0];

  const map = maps[props.destinationId].map;

  const viewWidth = 1920;
  const viewHeight = 1080;

  const mapXOffset = (map.width - viewWidth) / 2;
  const mapYOffset = -(map.height - viewHeight) / 2;

  const layerWidth = 1293;
  const layerHeight = 993;

  let offsetT = (map.width - layerWidth) / 2;
  let offsetU = (map.height - layerHeight) / 2;

  offsetT += -offsetT + (offsetX / 10) + mapXOffset;
  offsetU += offsetU + (offsetY / 5) + mapYOffset;

  const bounds = [
    [offsetU, offsetT],
    [layerHeight + offsetU, layerWidth + offsetT],
  ];

  return <ImageOverlay url='/static/images/extracts/maps/clouds/01A3-05F6.png' bounds={bounds} />
}
