import React from 'react';

import RosterLeaderboards from '../../../components/RosterLeaderboards';

import './styles.css';

class StatsView extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  componentDidUpdate(p) {
    if (p.subView !== this.props.subView || p.subSubView !== this.props.subSubView) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    const { subView, subSubView } = this.props;

    return <RosterLeaderboards mode='70' scopeId={subView} statId={subSubView} />;
  }
}

export default StatsView;
