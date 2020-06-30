import React from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';

import manifest from '../../../../utils/manifest';
import { destinations } from '../../../../utils/maps';

import maps from '../../../../data/maps';

class Destinations extends React.Component {
  state = {};

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    return (
      <div className={cx('control', 'destinations', { visible: this.props.visible })}>
        <ul className='list'>
          {destinations
            //.filter((d) => d.type === 'map')
            .map((desto, d) => {
              const definitionActivity = manifest.DestinyActivityDefinition[maps[desto.destinationId].destination.activityHash];
              const definitionDestintion = manifest.DestinyDestinationDefinition[maps[desto.destinationId].destination.hash];

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
                <li key={d} className={cx('linked', { active: maps[desto.destinationId].destination.id === this.props.destinationId })}>
                  <div className='text'>
                    <div className='name'>{string || desto.destinationId}</div>
                  </div>
                  <Link to={`/maps/${maps[desto.destinationId].destination.id}`} onClick={this.props.handler}></Link>
                </li>
              );
            })}
        </ul>
      </div>
    );
  }
}

export default Destinations;
