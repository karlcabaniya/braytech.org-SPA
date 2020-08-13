import React from 'react';
import { Marker } from 'react-leaflet';

import manifest from '../../../utils/manifest';

import maps from '../../../data/maps';

import * as marker from '../markers';

class Static extends React.Component {
  state = {};

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  shouldComponentUpdate(p, s) {
    if (p.destinationId !== this.props.destinationId) {
      return true;
    }

    if (p.selected.nodeHash !== this.props.selected.nodeHash || p.selected.vendorHash !== this.props.selected.vendorHash) {
      return true;
    }

    return false;
  }

  render() {
    const map = maps[this.props.destinationId].map;
    const destination = maps[this.props.destinationId].destination;

    const viewWidth = 1920;
    const viewHeight = 1080;

    const mapXOffset = (map.width - viewWidth) / 2;
    const mapYOffset = -(map.height - viewHeight) / 2;

    if (!maps[this.props.destinationId].map.bubbles) return null;

    return maps[this.props.destinationId].map.bubbles.map((bubble, b) =>
      bubble.nodes.map((node, n) => {
        const markerOffsetX = mapXOffset + viewWidth / 2;
        const markerOffsetY = mapYOffset + map.height + -viewHeight / 2;

        const offsetX = markerOffsetX + (node.x || 0);
        const offsetY = markerOffsetY + (node.y || 0);

        const selected = node.nodeHash && this.props.selected.nodeHash === node.nodeHash;

        if (node.type === 'place') {
          const definitionDestintion = manifest.DestinyDestinationDefinition[destination.hash];
          const definitionPlace = manifest.DestinyPlaceDefinition[definitionDestintion?.placeHash];
          const definitionActivity = manifest.DestinyActivityDefinition[destination.activityHash];

          const text = definitionActivity?.displayProperties.name || definitionPlace?.displayProperties.name;

          const icon = marker.text(['interaction-none', node.type], text);

          return <Marker key={n} position={[offsetY, offsetX]} icon={icon} zIndexOffset='-1000' />;
        } else if (node.type === 'title') {
          const definitionDestination = maps[this.props.destinationId].destination.hash && manifest.DestinyDestinationDefinition[maps[this.props.destinationId].destination.hash];
          const definitionBubble = bubble.hash && definitionDestination?.bubbles && definitionDestination.bubbles.find((b) => b.hash === bubble.hash);
          const definitionName = definitionBubble && definitionBubble.displayProperties?.name !== '' && definitionBubble.displayProperties.name;

          const name = (bubble.sub && (definitionName || bubble.name) && `<i class='segoe-uniE1761'></i> ${definitionName || bubble.name}`) || definitionName || bubble.name;

          const icon = marker.label(['interaction-none', bubble.type], name);

          return <Marker key={n} position={[offsetY, offsetX]} icon={icon} zIndexOffset='-1000' />;
        }
        // else if (node.type === 'flavour') {
        //   const definitionDestintion = manifest.DestinyDestinationDefinition[destination.hash];
        //   const definitionPlace = manifest.DestinyPlaceDefinition[definitionDestintion?.placeHash];

        //   const text = definitionPlace?.displayProperties.description;

        //   const icon = marker.text(['interaction-none', node.type], text);

        //   return <Marker key={n} position={[offsetY, offsetX]} icon={icon} zIndexOffset='-1000' />;
        // }
        else if (node.type === 'vendor' && node.vendorHash !== 2190858386) {
          return <Marker key={n} position={[offsetY, offsetX]} icon={marker.icon({ hash: node.vendorHash, type: 'vendor' }, ['native', 'vendor'], { icon: 'vendor', selected: node.vendorHash === this.props.selected.vendorHash })} zIndexOffset='-1000' onClick={this.props.handler({ vendorHash: node.vendorHash })} />;
        } else if (node.type === 'fast-travel') {
          return <Marker key={n} position={[offsetY, offsetX]} icon={marker.iconFastTravel} zIndexOffset='-1000' />;
        } else if (node.type === 'portal') {
          return <Marker key={n} position={[offsetY, offsetX]} icon={marker.icon({ hash: node.nodeHash, type: 'maps' }, ['native', 'portal', node.screenshot ? 'has-screenshot' : ''], { icon: 'portal', selected })} zIndexOffset='-1000' onClick={this.props.handler({ nodeHash: node.nodeHash })} />;
        } else if (node.type === 'ascendant-challenge') {
          return <Marker key={n} position={[offsetY, offsetX]} icon={marker.icon({ hash: node.nodeHash, type: 'maps' }, ['native', 'ascendant-challenge'], { icon: 'ascendant-challenge', selected })} zIndexOffset='-1000' onClick={this.props.handler({ nodeHash: node.nodeHash })} />;
        } else if (node.type === 'forge') {
          return <Marker key={n} position={[offsetY, offsetX]} icon={marker.iconForgeIgnition[node.playlistHash]} zIndexOffset='-1000' />;
        } else if (node.type === 'dungeon') {
          return <Marker key={n} position={[offsetY, offsetX]} icon={marker.iconDungeon[node.activityHash]} zIndexOffset='-1000' onClick={this.props.handler({ activityHash: node.activityHash })} />;
        } else {
          return null;
        }
      })
    );
  }
}

export default Static;
