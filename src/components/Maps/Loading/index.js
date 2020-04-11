import React from 'react';
import cx from 'classnames';

import manifest from '../../../utils/manifest';
import Spinner from '../../../components/UI/Spinner';

import './styles.css';

class Loading extends React.Component {
  render() {
    return (
      <div className='loading'>
        <Spinner />
        <div className='state'>
          <ul>
            {this.props.loaded.map((destination, d) => (
              <li key={d} className={cx({ loaded: !destination.loading })}>
                {manifest.DestinyDestinationDefinition[destination.destinationHash].displayProperties.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default Loading;
