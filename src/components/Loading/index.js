import React from 'react';
import { withTranslation } from 'react-i18next';
import { compose } from 'redux';
import { connect } from 'react-redux';
import cx from 'classnames';

import packageJSON from '../../../package.json';
import Spinner from '../../components/UI/Spinner';
import { Common, Loading } from '../../svg';

import './styles.css';

function SuspenseLoading({ full }) {
  return (
    <div className={cx('view', { full })} id='route-loading'>
      <Spinner />
    </div>
  );
}

class AppLoading extends React.Component {
  loadingStates = {
    error: {
      isError: true,
      status: this.props.t('Fatal error'),
      displayProperties: {
        name: this.props.t('Unknown error'),
        description: this.props.t('Something very unexpected and irrecoverable occurred.')
      }
    },
    error_setUpManifest: {
      isError: true,
      status: this.props.t('Fatal error'),
      displayProperties: {
        name: this.props.t('Manifest error'),
        description: this.props.t('Something went wrong while trying to update the item manifest.\n\nPlease refresh the app and try again.')
      }
    },
    error_fetchingManifest: {
      isError: true,
      status: this.props.t('Fatal error'),
      displayProperties: {
        name: this.props.t('Manifest download failed'),
        description: this.props.t('Something went wrong while trying to download the item manifest from Bungie.\n\nPlease refresh the app and try again.')
      }
    },
    error_maintenance: {
      shh: true,
      status: ' ',
      displayProperties: {
        name: this.props.t('Bungie Maintenance'),
        description: this.props.t('The Bungie API is currently down for maintenance.\n\nTune into @BungieHelp on Twitter for more information.')
      }
    },
    navigator_offline: {
      isError: true,
      status: this.props.t('No internet'),
      displayProperties: {
        name: this.props.t('No internet'),
        description: this.props.t('Are you offline? Your web browser thinks you are...')
      }
    },
    checkManifest: {
      status: this.props.t('Verifying manifest data')
    },
    fetchManifest: {
      status: this.props.t('Downloading data from Bungie')
    },
    setManifest: {
      status: this.props.t('Saving manifest data')
    },
    loadingPreviousProfile: {
      status: this.props.t('Loading previous member')
    },
    loadingProfile: {
      status: this.props.t('Loading member')
    },
    else: {
      status: this.props.t('Starting Windows 95')
    }
  }

  componentDidUpdate(p, s) {
    if (p.state !== this.props.state) {
      const state = this.props.state;

      if (this.loadingStates[state.code] && (this.loadingStates[state.code].isError || this.loadingStates[state.code].shh)) {
        this.props.pushNotification({
          error: true,
          date: new Date().toISOString(),
          expiry: 86400000,
          displayProperties: {
            ...(this.loadingStates[state.code] && this.loadingStates[state.code].displayProperties),
            prompt: true
          },
          javascript: state.detail
        });
      }
    }
  }

  render() {
    const { t } = this.props;
    const state = this.props.state;

    if (state.code) {
      const status = (this.loadingStates[state.code] && this.loadingStates[state.code].status) || this.loadingStates.else.status;
      const isError = this.loadingStates[state.code] && (this.loadingStates[state.code].isError || this.loadingStates[state.code].shh);

      return (
        <div className='view' id='loading'>
          <div className='bg'>
            <div className='containment'>
              <Loading.WarmindHalf />
            </div>
          </div>
          <div className='logo'>
            <Common.Braytech />
          </div>
          <div className='version'>
            <div><span>S10</span> Clovis Bray ++{packageJSON.version}</div>
            <Loading.ClovisBray />
          </div>
          <div className='text'>
            <div className='name'>Braytech</div>
            <div className={cx('status', { error: isError })}>
              {!isError ? (
                <div>
                  <Spinner mini dark />
                </div>
              ) : null}
              <div>{status}</div>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}

function mapDispatchToProps(dispatch) {
  return {
    pushNotification: value => {
      dispatch({ type: 'PUSH_NOTIFICATION', payload: value });
    }
  };
}

AppLoading = compose(
  connect(null, mapDispatchToProps),
  withTranslation()
)(AppLoading);

export { AppLoading, SuspenseLoading };
