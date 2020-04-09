import React from 'react';
import { connect } from 'react-redux';
import { Marker } from 'react-leaflet';

import { Common } from '../../../svg';
import maps from '../../../data/maps';
import nodesRuntime from '../../../data/maps/runtime';

import * as marker from '../markers';

class Runtime extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      nodes: nodesRuntime(this.props.member)
    };
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

          return node.location.points.map(point => {
            const markerOffsetX = mapXOffset + viewWidth / 2;
            const markerOffsetY = mapYOffset + map.height + -viewHeight / 2;

            if (!point.x || !point.y) {
              console.warn(node);

              return null;
            }

            const offsetX = markerOffsetX + point.x;
            const offsetY = markerOffsetY + point.y;

            if (node.type.hash === 'patrol-boss') {
              const icon = marker.icon({ hash: node.nodeHash, type: 'maps' }, ['patrol-boss', node.screenshot ? `has-screenshot` : ''], { icon: node.icon });

              return <Marker key={i} position={[offsetY, offsetX]} icon={icon} zIndexOffset='-1000' />;
            } else if (node.type.category === 'vendor') {
              const icon = marker.icon({ hash: node.vendorHash, type: 'vendor' }, ['native', 'vendor', node.screenshot ? `has-screenshot` : '']);

              return <Marker key={i} position={[offsetY, offsetX]} icon={icon} zIndexOffset='-1000' />;
            } else {
              const icon = marker.icon({ hash: node.nodeHash, type: 'maps' }, [node.screenshot ? `has-screenshot` : ''], { icon: <Common.Info /> });
              
              return <Marker key={i} position={[offsetY, offsetX]} icon={icon} zIndexOffset='-1000' />;
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
