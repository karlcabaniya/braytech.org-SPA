import React from 'react';
import { connect } from 'react-redux';

import './styles.css';

import Root from './Root';
import Crucible from './Crucible';
import Gambit from './Gambit';
import Raids from './Raids';
import Strikes from './Strikes';

class Reports extends React.Component {
  render() {
    const type = this.props.match.params.type;
    const mode = +this.props.match.params.mode || 0;
    const offset = +this.props.match.params.offset || 0;

    if (type === 'crucible') {
      return <Crucible mode={mode} offset={offset} />;
    } else if (type === 'gambit') {
      return <Gambit mode={mode} offset={offset} />;
    } else if (type === 'raids') {
      return <Raids mode={mode} offset={offset} />;
    } else if (type === 'strikes') {
      return <Strikes mode={mode} offset={offset} />;
    } else {
      return <Root offset={offset} />;
    }
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    pgcr: state.pgcr
  };
}

export default connect(mapStateToProps)(Reports);
