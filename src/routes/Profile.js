import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router-dom';

import Clan from '../views/Clan';
import Inventory from '../views/Inventory';
import Reports from '../views/Reports';
import Collections from '../views/Collections';
import Triumphs from '../views/Triumphs';
import Trackers from '../views/Trackers';
import Checklists from '../views/Checklists';
import ThisWeek from '../views/ThisWeek';
import Now from '../views/Now';
import Quests from '../views/Quests';

import { SuspenseLoading } from '../components/Loading';
import PostmasterCapacity from '../components/Notifications/PostmasterCapacity';

class ProfileRoutes extends React.Component {
  componentDidMount() {
    const { membershipId, membershipType, characterId } = this.props.match.params;
    
    this.props.setMemberByRoute({ membershipType, membershipId, characterId });
  }

  // bounces the view back up when changing profiles
  componentDidUpdate(p, s) {
    if (!this.props.member.data) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    const { member, location, match } = this.props;
    // console.log(member, location, match);

    if (member.error || !member.characterId) {
      // Character select will be able to display the error for us & prompt
      // them to pick a new character / member
      return <Redirect to={{ pathname: '/character-select', state: { from: location } }} />;
    }

    if (!member.data) {
      return <SuspenseLoading />;
    }

    return (
      <>
        <PostmasterCapacity />
        <Switch>
          <Route path={`${match.url}/clan/:view?/:subView?/:subSubView?`} exact component={Clan} />
          <Route path={`${match.url}/collections/:primary?/:secondary?/:tertiary?/:quaternary?/:quinary?`} component={Collections} />
          <Route path={`${match.url}/triumphs/:primary?/:secondary?/:tertiary?/:quaternary?`} component={Triumphs} />
          <Route path={`${match.url}/trackers/:hash1(\\d+)?/:hash2(\\d+)?/:hash3(\\d+)?`} component={Trackers} />
          <Route path={`${match.url}/checklists`} exact component={Checklists} />
          <Route path={`${match.url}/this-week/:view?`} component={ThisWeek} />
          <Route path={`${match.url}/now/:view?`} component={Now} />
          <Route path={`${match.url}/inventory`} exact component={Inventory} />
          <Route path={`${match.url}/quests/:filter?/:variable?/:order?`} exact component={Quests} />
          <Route path={`${match.url}/reports/:type?/:mode(\\-?\\d+)?/:offset(\\d+)?`} component={Reports} />
          <Route path={`${match.url}/`} render={route => <Redirect to={{ pathname: `${match.url}/now` }} />} />
        </Switch>
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    member: state.member
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setMemberByRoute: value => {
      dispatch({ type: 'MEMBER_SET_BY_PROFILE_ROUTE', payload: value });
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileRoutes);
