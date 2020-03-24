import React from 'react';
import { connect } from 'react-redux';

import { t } from '../../../utils/i18n';
import { NoAuth } from '../../../components/BungieAuth';
import Spinner from '../../../components/UI/Spinner';
import RosterAdmin from '../../../components/RosterAdmin';

import ClanViewsLinks from '../ClanViewsLinks';

import './styles.css';

class AdminView extends React.Component { 
  componentDidMount() {
    window.scrollTo(0, 0);   
  }

  render() {
    const { auth, groupMembers } = this.props;

    if (!auth) {
      return <NoAuth />;
    }

    return (
      <>
        <ClanViewsLinks />
        <div className='module'>
          {groupMembers.loading && groupMembers.members.length < 1 ? <Spinner /> : null}
          {!groupMembers.loading && groupMembers.error && groupMembers.members.length < 1 ? <div className='info'>{t('There was a network error')}</div> : null}
          <div className='status'>{groupMembers.members.length > 0 ? groupMembers.loading ? <Spinner mini /> : <div className='ttl' /> : null}</div>
          <RosterAdmin />
        </div>
      </>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    auth: state.auth,
    groupMembers: state.groupMembers
  };
}

export default connect(mapStateToProps)(AdminView);