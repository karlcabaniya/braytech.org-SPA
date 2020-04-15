import React from 'react';
import { connect } from 'react-redux';
import { Marker } from 'react-leaflet';

import { Common } from '../../../svg';
import maps from '../../../data/maps';
import nodesRuntime from '../../../data/maps/runtime';

import * as marker from '../markers';

class Runtime extends React.Component {
  state = {};

  static getDerivedStateFromProps(p, s) {
    if (!s.nodes) {
      return {
        nodes: nodesRuntime(p.member),
      };
    }

    return null;
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentDidUpdate(p, s) {   
    if (this.mounted && (p.member.updated !== this.props.member.updated || p.member.characterId !== this.props.member.characterId)) {
      this.setState({ nodes: nodesRuntime(this.props.member) })
    }
  }

  render() {
    const map = maps[this.props.id].map;

    const viewWidth = 1920;
    const viewHeight = 1080;

    const mapXOffset = (map.width - viewWidth) / 2;
    const mapYOffset = -(map.height - viewHeight) / 2;

    return (
      (this.state.nodes &&
        this.state.nodes[this.props.id].map((node, i) => {
          if (node.availability && node.availability.now !== undefined && !node.availability.now) return null;

          return node.map.points.map(point => {
            const markerOffsetX = mapXOffset + viewWidth / 2;
            const markerOffsetY = mapYOffset + map.height + -viewHeight / 2;

            if (!point.x || !point.y) {
              console.warn(node);

              return null;
            }

            const offsetX = markerOffsetX + point.x;
            const offsetY = markerOffsetY + point.y;

            if (node.nodeType === 'patrol-boss') {
              const icon = marker.icon({ hash: node.nodeHash, type: 'maps' }, ['patrol-boss', node.screenshot ? 'has-screenshot' : ''], { icon: node.icon });

              return <Marker key={i} position={[offsetY, offsetX]} icon={icon} zIndexOffset='-1000' onClick={this.props.handler({ nodeHash: node.nodeHash })} />;
            } else if (node.nodeType === 'vendor') {
              const icon = marker.icon({ hash: node.vendorHash, type: 'vendor' }, ['native', 'vendor', node.screenshot ? 'has-screenshot' : ''], { icon: 'vendor' });

              return <Marker key={i} position={[offsetY, offsetX]} icon={icon} zIndexOffset='-1000' />;
            } else if (node.nodeType === 'portal') {
              const icon = marker.icon({ hash: node.nodeHash, type: 'maps' }, ['native', 'portal', node.screenshot ? 'has-screenshot' : '', node.availability.type === 'cycle' ? 'unstable' : ''], { icon: 'portal' });

              return <Marker key={i} position={[offsetY, offsetX]} icon={icon} zIndexOffset='-1000' onClick={this.props.handler({ nodeHash: node.nodeHash })} />;
            } else {
              const icon = marker.icon({ hash: node.nodeHash, type: 'maps' }, [node.screenshot ? 'has-screenshot' : ''], { icon: <Common.Info /> });
              
              return <Marker key={i} position={[offsetY, offsetX]} icon={icon} zIndexOffset='-1000' onClick={this.props.handler({ nodeHash: node.nodeHash })} />;
            }
          });
        })) ||
      null
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member
  };
}

export default connect(mapStateToProps)(Runtime);
