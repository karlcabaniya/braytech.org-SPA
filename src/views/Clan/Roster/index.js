import React from 'react';
import { connect } from 'react-redux';

import { t } from '../../../utils/i18n';
import Spinner from '../../../components/UI/Spinner';
import Roster from '../../../components/Roster';

import ClanViewsLinks from '../ClanViewsLinks';

import './styles.css';

class RosterView extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const { groupMembers } = this.props;

    return (
      <>
        <ClanViewsLinks />
        <div className='module'>
          {groupMembers.loading && groupMembers.members.length < 1 ? <Spinner /> : null}
          {!groupMembers.loading && groupMembers.error && groupMembers.members.length < 1 ? <div className='info'>{t('There was a network error')}</div> : null}
          <div className='status'>{groupMembers.members.length > 0 ? groupMembers.loading ? <Spinner mini /> : <div className='ttl' /> : null}</div>
          <Roster />
        </div>
      </>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    groupMembers: state.groupMembers
  };
}

export default connect(mapStateToProps)(RosterView);
