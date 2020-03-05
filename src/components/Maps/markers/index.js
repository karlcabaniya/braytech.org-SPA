import React from 'react';
import ReactDOMServer from 'react-dom/server';
import L from 'leaflet';
import cx from 'classnames';

import { ReactComponent as SVGFastTravel } from '../../../svg/maps/fast-travel.svg';
import { ReactComponent as SVGVendor } from '../../../svg/maps/vendor.svg';
import { ReactComponent as SVGForgeIgnition } from '../../../svg/maps/forge-ignition.svg';

import './styles.css';

export const icon = (tooltip = {}, classNames = [], marker = {}, text) => {
  let icon = marker.icon || null;
  if (tooltip.type === 'vendor') {
    icon = <SVGVendor />;
  }

  const html = (
    <div className='wrapper'>
      <div className={cx({ tooltip: tooltip.hash })} data-hash={tooltip.hash} data-type={tooltip.type} data-table={tooltip.table}>
        <div className='icon'>{icon}</div>
      </div>
      {text ? <div className='text'>${text}</div> : null}
    </div>
  );

  return L.divIcon({
    className: ['icon-marker'].concat(classNames).join(' '),
    html: ReactDOMServer.renderToString(html)
  });
};

export const text = (classNames = [], name) =>
  L.divIcon({
    className: ['text-marker'].concat(classNames).join(' '),
    html: `<div class='wrapper'><div class='name'>${name}</div></div>`
  });

export const iconPatrolBoss = (tooltip = {}, classNames = []) => {
  const html = (
    <div className='wrapper'>
      <div className='icon tooltip' data-hash={tooltip.hash} data-table={tooltip.table}>
        <div className='patrol-boss'>
          <span className='destiny-raid' />
        </div>
      </div>
    </div>
  );

  return L.divIcon({
    className: ['icon-marker', 'native'].concat(classNames).join(' '),
    html: ReactDOMServer.renderToString(html)
  });
};

export const iconFastTravel = L.divIcon({
  className: 'icon-marker native fast-travel interaction-none',
  html: ReactDOMServer.renderToString(
    <div className='wrapper'>
      <div className='icon'>
        <SVGFastTravel />
      </div>
    </div>
  )
});

export const iconForgeIgnition = {
  1506080581: L.divIcon({
    className: 'icon-marker native forge',
    html: ReactDOMServer.renderToString(
      <div className='wrapper'>
        <div className='icon tooltip' data-hash='1019949956' data-playlist='1506080581' data-type='activity'>
          <SVGForgeIgnition />
        </div>
      </div>
    )
  }),
  957727787: L.divIcon({
    className: 'icon-marker native forge',
    html: ReactDOMServer.renderToString(
      <div className='wrapper'>
        <div className='icon tooltip' data-hash='1483179969' data-playlist='957727787' data-type='activity'>
          <SVGForgeIgnition />
        </div>
      </div>
    )
  }),
  2656947700: L.divIcon({
    className: 'icon-marker native forge',
    html: ReactDOMServer.renderToString(
      <div className='wrapper'>
        <div className='icon tooltip' data-hash='1878615566' data-playlist='2656947700' data-type='activity'>
          <SVGForgeIgnition />
        </div>
      </div>
    )
  }),
  1434072700: L.divIcon({
    className: 'icon-marker native forge',
    html: ReactDOMServer.renderToString(
      <div className='wrapper'>
        <div className='icon tooltip' data-hash='10898844' data-playlist='1434072700' data-type='activity'>
          <SVGForgeIgnition />
        </div>
      </div>
    )
  })
}
