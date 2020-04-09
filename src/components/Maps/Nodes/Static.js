import React from 'react';
import { Marker } from 'react-leaflet';

import manifest from '../../../utils/manifest';

import maps from '../../../data/maps';

import * as marker from '../markers';

class Static extends React.Component {
  state = {}
  
  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const map = maps[this.props.id].map;

    const viewWidth = 1920;
    const viewHeight = 1080;

    const mapXOffset = (map.width - viewWidth) / 2;
    const mapYOffset = -(map.height - viewHeight) / 2;

    return maps[this.props.id].map.bubbles.map(bubble =>
      bubble.nodes.map((node, i) => {
        const markerOffsetX = mapXOffset + viewWidth / 2;
        const markerOffsetY = mapYOffset + map.height + -viewHeight / 2;

        const offsetX = markerOffsetX + (node.x ? node.x : 0);
        const offsetY = markerOffsetY + (node.y ? node.y : 0);

        if (node.type === 'title') {
          const definitionDestination = maps[this.props.id].destination.hash && manifest.DestinyDestinationDefinition[maps[this.props.id].destination.hash];
          const definitionBubble = bubble.hash && definitionDestination?.bubbles && definitionDestination.bubbles.find(b => b.hash === bubble.hash);
          const definitionName = definitionBubble && definitionBubble.displayProperties?.name !== '' && definitionBubble.displayProperties.name;

          const name = (bubble.sub && definitionName && `<i class='segoe-uniE1761'></i> ${definitionName}`) || definitionName || bubble.name;

          const icon = marker.text(['interaction-none', bubble.type], name);

          return <Marker key={i} position={[offsetY, offsetX]} icon={icon} zIndexOffset='-1000' />;
        } else if (node.type === 'vendor' && node.vendorHash !== 2190858386) {
          return <Marker key={i} position={[offsetY, offsetX]} icon={marker.icon({ hash: node.vendorHash, type: 'vendor' }, ['native', 'vendor'])} zIndexOffset='-1000' />;
        } else if (node.type === 'fast-travel') {
          return <Marker key={i} position={[offsetY, offsetX]} icon={marker.iconFastTravel} zIndexOffset='-1000' />;
        } else if (node.type === 'forge') {
          return <Marker key={i} position={[offsetY, offsetX]} icon={marker.iconForgeIgnition[node.playlistHash]} zIndexOffset='-1000' />;
        } else {
          return null;
        }
      })
    );
  }
}

export default Static;
