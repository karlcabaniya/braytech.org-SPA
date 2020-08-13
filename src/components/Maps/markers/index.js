import React from 'react';
import ReactDOMServer from 'react-dom/server';
import L from 'leaflet';
import cx from 'classnames';

import { Maps } from '../../../svg';

import './styles.css';

export const icon = (tooltip = {}, classNames = [], marker = {}, text) => {
  let icon = marker.icon || null;
  if (typeof marker.icon === 'string' && marker.icon === 'vendor') {
    icon = <Maps.Vendor />;
  } else if (typeof marker.icon === 'string' && marker.icon === 'portal') {
    icon = <Maps.Portal />;
  } else if (typeof marker.icon === 'string' && marker.icon === 'ascendant-challenge') {
    icon = <Maps.AscendantChallenge />;
  }

  const jsx = (
    <div className='wrapper'>
      <div data-tooltip={tooltip.hash && true} data-context='maps' data-hash={tooltip.hash} data-type={tooltip.type} data-bubblehash={tooltip.bubbleHash}>
        <div className='icon'>{icon}</div>
      </div>
      {marker.selected ? (
        <div className='selected'>
          <Maps.Selected />
        </div>
      ) : null}
      {text ? <div className='text'>{text}</div> : null}
    </div>
  );

  return L.divIcon({
    className: ['icon-marker'].concat(classNames).join(' '),
    html: ReactDOMServer.renderToString(jsx),
  });
};

export const converter = (jsx, classNames = []) =>
  L.divIcon({
    className: classNames.join(' '),
    html: ReactDOMServer.renderToString(jsx),
  });

export const label = (classNames = [], name) =>
  L.divIcon({
    className: ['label-marker'].concat(classNames).join(' '),
    html: `<div class='wrapper'><div class='name'>${name}</div></div>`,
  });

export const text = (classNames = [], name) =>
  L.divIcon({
    className: ['text-marker'].concat(classNames).join(' '),
    html: `<div class='wrapper'><div class='name'>${name}</div></div>`,
  });

export const iconPatrolBoss = (tooltip = {}, classNames = []) => {
  const jsx = (
    <div className='wrapper'>
      <div className='icon' data-tooltip data-context='maps' data-hash={tooltip.hash} data-type={tooltip.type}>
        <div className='patrol-boss'>
          <span className='destiny-raid' />
        </div>
      </div>
    </div>
  );

  return L.divIcon({
    className: ['icon-marker', 'native'].concat(classNames).join(' '),
    html: ReactDOMServer.renderToString(jsx),
  });
};

export const iconFastTravel = L.divIcon({
  className: 'icon-marker native fast-travel interaction-none',
  html: ReactDOMServer.renderToString(
    <div className='wrapper'>
      <div className='icon'>
        <Maps.FastTravel />
      </div>
    </div>
  ),
});

export const iconPortal = {
  1: L.divIcon({
    className: 'icon-marker native portal',
    html: ReactDOMServer.renderToString(
      <div className='wrapper'>
        <div className='icon' data-tooltip data-type='maps' data-hash='1'>
          <Maps.Portal />
        </div>
      </div>
    ),
  }),
  2: L.divIcon({
    className: 'icon-marker native portal',
    html: ReactDOMServer.renderToString(
      <div className='wrapper'>
        <div className='icon' data-tooltip data-type='maps' data-hash='2'>
          <Maps.Portal />
        </div>
      </div>
    ),
  }),
  3: L.divIcon({
    className: 'icon-marker native portal',
    html: ReactDOMServer.renderToString(
      <div className='wrapper'>
        <div className='icon' data-tooltip data-type='maps' data-hash='3'>
          <Maps.Portal />
        </div>
      </div>
    ),
  }),
  15: L.divIcon({
    className: 'icon-marker native portal',
    html: ReactDOMServer.renderToString(
      <div className='wrapper'>
        <div className='icon' data-tooltip data-type='maps' data-hash='15'>
          <Maps.Portal />
        </div>
      </div>
    ),
  }),
};

export const iconForgeIgnition = {
  1506080581: L.divIcon({
    className: 'icon-marker native forge',
    html: ReactDOMServer.renderToString(
      <div className='wrapper'>
        <div className='icon' data-tooltip data-context='maps' data-hash='1019949956' data-playlist='1506080581' data-type='activity'>
          <Maps.ForgeIgnition />
        </div>
      </div>
    ),
  }),
  957727787: L.divIcon({
    className: 'icon-marker native forge',
    html: ReactDOMServer.renderToString(
      <div className='wrapper'>
        <div className='icon' data-tooltip data-context='maps' data-hash='1483179969' data-playlist='957727787' data-type='activity'>
          <Maps.ForgeIgnition />
        </div>
      </div>
    ),
  }),
  2656947700: L.divIcon({
    className: 'icon-marker native forge',
    html: ReactDOMServer.renderToString(
      <div className='wrapper'>
        <div className='icon' data-tooltip data-context='maps' data-hash='1878615566' data-playlist='2656947700' data-type='activity'>
          <Maps.ForgeIgnition />
        </div>
      </div>
    ),
  }),
  1434072700: L.divIcon({
    className: 'icon-marker native forge',
    html: ReactDOMServer.renderToString(
      <div className='wrapper'>
        <div className='icon' data-tooltip data-context='maps' data-hash='10898844' data-playlist='1434072700' data-type='activity'>
          <Maps.ForgeIgnition />
        </div>
      </div>
    ),
  }),
};

export const iconDungeon = {
  2032534090: L.divIcon({
    className: 'icon-marker native dungeon',
    html: ReactDOMServer.renderToString(
      <div className='wrapper'>
        <div className='icon' data-tooltip data-context='maps' data-hash='2032534090' data-mode='608898761' data-playlist='2032534090' data-type='activity'>
          <Maps.Dungeon />
        </div>
      </div>
    ),
  }),
  1375089621: L.divIcon({
    className: 'icon-marker native dungeon',
    html: ReactDOMServer.renderToString(
      <div className='wrapper'>
        <div className='icon' data-tooltip data-context='maps' data-hash='1375089621' data-mode='608898761' data-playlist='1375089621' data-type='activity'>
          <Maps.Dungeon />
        </div>
      </div>
    ),
  }),
};
