import React from 'react';
import { connect } from 'react-redux';

import { t } from '../../../utils/i18n';
import Spinner from '../../../components/UI/Spinner';
import RosterProgress from '../../../components/RosterProgress';

import './styles.css';

class RosterView extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <>
        <div className='module header'>
          <div className='text'>{t('Progress')}</div>
          {this.props.groupMembers.members.length > 0 ? (
            <>
              <div className='ttr'>{!this.props.groupMembers.loading ? <div className='bar' /> : null}</div>
              {this.props.groupMembers.loading ? (
                <div className='state'>
                  <Spinner mini />
                </div>
              ) : (
                <div className='state'>{t('{{online}} online', { online: this.props.groupMembers.online })}</div>
              )}
            </>
          ) : null}
        </div>
        <div className='module'>
          {this.props.groupMembers.loading && this.props.groupMembers.members.length < 1 ? <Spinner /> : null}
          {!this.props.groupMembers.loading && this.props.groupMembers.error && this.props.groupMembers.members.length < 1 ? <div className='info'>{t('There was a network error')}</div> : null}
          <RosterProgress />
        </div>
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    groupMembers: state.groupMembers,
  };
}

export default connect(mapStateToProps)(RosterView);
