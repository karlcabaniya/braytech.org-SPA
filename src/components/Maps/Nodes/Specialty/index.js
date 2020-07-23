import React from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Marker } from 'react-leaflet';

import { t } from '../../../../utils/i18n';
import maps from '../../../data/maps';
import { converter } from '../../markers';
import { Maps } from '../../../../svg';

import './styles.css';

function MakeNodes(destinationHash, member, routerHistory) {
  // European Dead Zone
  if (destinationHash === 1199524104) {
    const TheFarm = {
      map: {
        points: [
          {
            x: 807,
            y: 385,
          },
        ],
      },
      classNames: ['icon-marker', 'native', 'the-farm'],
      icon: (
        <div className='wrapper' data-tooltip data-context='maps' data-hash='1309646866' data-type='activity'>
          <div className='icon'>
            <div className='layer big-spikes' />
            <div className='layer onion-skin' />
            <div className='layer leather' />
            <div className='layer outlines' />
            <div className='layer zigs-a' />
            <div className='layer zigs-b' />
            <div className='layer sand-patterns' />
            <div className='layer symbol' />
            <div className='flippers'>
              <div className='layer x t' />
              <div className='layer x b' />
              <div className='layer y l' />
              <div className='layer y r' />
            </div>
          </div>
        </div>
      ),
      handler: () => routerHistory.push(`/maps/the-farm`),
    };

    return [TheFarm];
  }

  // Hellas Basin
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
        <div className='wrapper' data-tooltip data-context='maps' data-hash='latent-memories' data-type='braytech'>
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

export default function Speciality({ destinationId, destinationHash, ...props }) {
  const member = useSelector((state) => state.member);
  const history = useHistory();

  const map = maps[destinationId].map;

  const viewWidth = 1920;
  const viewHeight = 1080;

  const mapXOffset = (map.width - viewWidth) / 2;
  const mapYOffset = -(map.height - viewHeight) / 2;

  const nodes = MakeNodes(destinationHash, member, history);

  return nodes.map((node, n) => {
    return node.map.points.map((point) => {
      const markerOffsetX = mapXOffset + viewWidth / 2;
      const markerOffsetY = mapYOffset + map.height + -viewHeight / 2;

      if (!point.x || !point.y) {
        console.warn(node);

        return null;
      }

      const offsetX = markerOffsetX + point.x;
      const offsetY = markerOffsetY + point.y;

      return <Marker key={n} position={[offsetY, offsetX]} icon={converter(node.icon, node.classNames)} zIndexOffset='-1000' onClick={node.handler ? node.handler : node.inspect ? props.handler({ nodeHash: node.nodeHash }) : undefined} />;
    });
  });
}
