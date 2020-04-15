import React from 'react';

import Spinner from '../../../components/UI/Spinner';

import './styles.css';

class Loading extends React.Component {
  render() {
    return (
      <div className='loading'>
        <Spinner />
        {this.props.loaded.length ? (
          <div className='state'>
            <span>{this.props.loaded.filter((d) => !d.loading).length}</span>/{this.props.loaded.length}
          </div>
        ) : null}
      </div>
    );
  }
}

export default Loading;
