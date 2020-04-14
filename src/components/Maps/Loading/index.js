import React from 'react';

import Spinner from '../../../components/UI/Spinner';

import './styles.css';

class Loading extends React.Component {
  render() {
    return (
      <div className='loading'>
        <Spinner />
        <div className='state'>
          <span>{this.props.loaded.filter(d => !d.loading).length}</span>/{this.props.loaded.length}
        </div>
      </div>
    );
  }
}

export default Loading;
