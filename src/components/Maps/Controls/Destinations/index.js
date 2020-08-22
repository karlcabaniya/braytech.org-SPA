import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';

import manifest from '../../../../utils/manifest';
import { destinations } from '../../../../utils/maps';

import maps from '../../../../data/maps';

export default function Destinations(props) {
  const [isExpanded, setExpanded] = useState(false);

  const handler_onClick = (destinationId) => (event) => {
    if (!isExpanded && props.destinationId === destinationId) {
      event.preventDefault();
    }

    setExpanded(!isExpanded);
  };

  return (
    <div className={cx('control', 'destinations', { visible: isExpanded })}>
      <ul className='list'>
        {destinations
          .filter(({ visible }) => visible)
          .map(({ destinationId }, d) => {
            const definitionActivity = manifest.DestinyActivityDefinition[maps[destinationId]?.destination.activityHash];
            const definitionDestintion = manifest.DestinyDestinationDefinition[maps[destinationId]?.destination.hash];

            const placeHash = definitionActivity?.placeHash || definitionDestintion?.placeHash;
            const definitionPlace = placeHash && manifest.DestinyPlaceDefinition[placeHash];

            const string = [definitionActivity?.displayProperties?.name, definitionDestintion?.displayProperties?.name, definitionPlace?.displayProperties?.name]
              .reduce((array, string) => {
                if (string && array.indexOf(string) < 0) {
                  return [...array, string];
                } else {
                  return array;
                }
              }, [])
              .join(', ');

            return (
              <li key={d} className={cx('linked', 'acrylic', { active: maps[destinationId]?.destination.id === props.destinationId, disabled: !maps[destinationId] && true })}>
                <div className='text'>
                  <div className='name'>{string || '[REDACTED]'}</div>
                </div>
                {maps[destinationId] && <Link to={`/maps/${destinationId}`} onClick={handler_onClick(destinationId)}></Link>}
              </li>
            );
          })}
      </ul>
    </div>
  );
}
