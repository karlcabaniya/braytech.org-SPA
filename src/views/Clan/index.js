import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';

import './styles.css';

import About from './About';
import Roster from './Roster';
import Stats from './Stats';
import Admin from './Admin';
import NoClan from './NoClan';
import ViewportWidth from './ViewportWidth';

class Clan extends React.Component {
  render() {
    const { member, viewport } = this.props;
    const group = member.data.groups.results.length > 0 ? member.data.groups.results[0].group : false;

    if (group) {
      const views = {
        about: {
          name: 'about',
          component: About
        },
        roster: {
          name: 'roster',
          component: Roster
        },
        stats: {
          name: 'stats',
          component: Stats
        },
        admin: {
          name: viewport.width >= 1280 ? 'admin' : 'error',
          component: viewport.width >= 1280 ? Admin : ViewportWidth
        }
      };

      let view = this.props.match.params.view || 'about';

      if (!views[view]) view = 'about';

      const ViewComponent = views[view].component;

      return (
        <div className={cx('view', views[view].name)} id='clan'>
          <ViewComponent {...this.props.match.params} />
        </div>
      );
    } else {
      return <NoClan />;
    }
  }
}

function mapStateToProps(state, ownProps) {
  return {
    viewport: state.viewport,
    member: state.member
  };
}

export default connect(mapStateToProps)(Clan);
