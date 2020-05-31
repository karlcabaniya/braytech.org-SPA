import React from 'react';
import { connect } from 'react-redux';

import { t } from '../../../utils/i18n';
import { NoAuth } from '../../../components/BungieAuth';
import Spinner from '../../../components/UI/Spinner';
import RosterAdmin from '../../../components/RosterAdmin';

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
        <div className='module header'>
          <div className='text'>{t('Administration')}</div>
          {groupMembers.members.length > 0 ? (
            <>
              <div className='ttr'>{!groupMembers.loading ? <div className='bar' /> : null}</div>
              {groupMembers.loading ? (
                <div className='state'>
                  <Spinner mini />
                </div>
              ) : (
                <div className='state'>{t('{{online}} online', { online: groupMembers.online })}</div>
              )}
            </>
          ) : null}
        </div>
        <div className='module'>
          {groupMembers.loading && groupMembers.members.length < 1 ? <Spinner /> : null}
          {!groupMembers.loading && groupMembers.error && groupMembers.members.length < 1 ? <div className='info'>{t('There was a network error')}</div> : null}
          <RosterAdmin />
        </div>
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    auth: state.auth,
    groupMembers: state.groupMembers,
  };
}

export default connect(mapStateToProps)(AdminView);
