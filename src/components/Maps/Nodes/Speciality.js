import React from 'react';
import { connect } from 'react-redux';
import { Marker } from 'react-leaflet';

import { t } from '../../../utils/i18n';
import { Maps } from '../../../svg';
import maps from '../../../data/maps';
import { converter } from '../markers';

function MakeNodes(member, destinationHash) {
  if (destinationHash === 308080871) {
    const checklist = Object.values(member.data?.profile?.profileProgression?.data.checklists?.['2955980198'] || {});

    const LatentMemoryFragmentCount = {
      map: {
        points: [
          {
            x: 511,
            y: -280,
          },
        ],
      },
      classNames: ['widgets', 'latent-memory-fragment'],
      icon: (
        <div className='wrapper tooltip' data-context='maps' data-hash='latent-memories' data-type='braytech'>
          <div className='value'>{checklist.filter((f) => f).length}/45</div>
          <div className='name'>{t('Data Recovered')}</div>
          <div className='icon'>
            <Maps.LatentMemoryFragment />
          </div>
        </div>
      ),
    };

    return [LatentMemoryFragmentCount];
  }

  return [];
}

class Speciality extends React.Component {
  state = {};

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

    const nodes = MakeNodes(this.props.member, this.props.destinationHash);

    return nodes.map((node, n) => {
      const selected = node.nodeHash && this.props.selected.nodeHash === node.nodeHash;

      return node.map.points.map((point) => {
        const markerOffsetX = mapXOffset + viewWidth / 2;
        const markerOffsetY = mapYOffset + map.height + -viewHeight / 2;

        if (!point.x || !point.y) {
          console.warn(node);

          return null;
        }

        const offsetX = markerOffsetX + point.x;
        const offsetY = markerOffsetY + point.y;

        return <Marker key={n} position={[offsetY, offsetX]} icon={converter(node.icon, node.classNames)} zIndexOffset='-1000' onClick={node.inspect ? this.props.handler({ nodeHash: node.nodeHash }) : undefined} />;
      });
    });
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
  };
}

export default connect(mapStateToProps)(Speciality);
