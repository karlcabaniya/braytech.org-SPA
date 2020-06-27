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
          {destinations.map(d => {
            const definitionActivity = manifest.DestinyActivityDefinition[maps[d.destinationId].destination.activityHash];
            const definitionDestintion = manifest.DestinyDestinationDefinition[maps[d.destinationId].destination.hash];

            const placeHash = definitionActivity?.placeHash || definitionDestintion?.placeHash;
            const definitionPlace = placeHash && manifest.DestinyPlaceDefinition[placeHash];

            const string = [
              definitionActivity?.displayProperties?.name,
              definitionDestintion?.displayProperties?.name,
              definitionPlace?.displayProperties?.name,
            ].reduce((array, string) => {
              if (string && array.indexOf(string) < 0) {
                return [
                  ...array,
                  string
                ];
              } else {
                return array;
              }
            }, []).join(', ')

            return (
              <li key={maps[d.destinationId].destination.id} className={cx('linked', { active: maps[d.destinationId].destination.id === this.props.destinationId })}>
                <div className='text'>
                  <div className='name'>{string}</div>
                </div>
                <Link to={`/maps/${maps[d.destinationId].destination.id}`} onClick={this.props.handler}></Link>
              </li>
            );
            
          })}
        </ul>
      </div>
    );
  }
}

export default Destinations;
