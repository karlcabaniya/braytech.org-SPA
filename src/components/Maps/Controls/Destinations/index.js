import React from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';

import manifest from '../../../../utils/manifest';

import * as utils from '../../utils';
import maps from '../../../../data/lowlines/maps/destinations';

class Destinations extends React.Component {
  state = {};

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentDidUpdate(p, s) {}

  render() {
    const { id, visible } = this.props;

    return (
      <div className={cx('control', 'destinations', { visible })}>
        <ul className='list'>
          {utils.destinations.map(d => {
            const definitionActivity = manifest.DestinyActivityDefinition[maps[d.id].destination.activityHash];
            const definitionDestintion = manifest.DestinyDestinationDefinition[maps[d.id].destination.hash];

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
              <li key={maps[d.id].destination.id} className={cx('linked', { active: maps[d.id].destination.id === id })}>
                <div className='text'>
                  <div className='name'>{string}</div>
                </div>
                <Link to={`/maps/${maps[d.id].destination.id}`} onClick={this.props.handler}></Link>
              </li>
            );
            
          })}
        </ul>
      </div>
    );
  }
}

export default Destinations;
