import React from 'react';

import Scene from '../../components/Three/World/Scene';

import './styles.css';

class TestThree extends React.Component {
  constructor() {
    super();

    this.state = {};
  }

  componentDidMount() {
    this.mounted = true;
    window.scrollTo(0, 0);
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {

    return (
      <div className='view' id='three'>
        <Scene />
      </div>
    );
  }
}

export default TestThree;
