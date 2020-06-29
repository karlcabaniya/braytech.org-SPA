import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import cx from 'classnames';

import packageJSON from '../../../package.json';
import { t } from '../../utils/i18n';
import Spinner from '../../components/UI/Spinner';
import { Common, Loading } from '../../svg';
import { hiddenFooterRoutes } from '../../components/UI/Footer';

import './styles.css';

function SuspenseLoading(props) {
  const hiddenFooter = hiddenFooterRoutes.filter((path) => props.location?.pathname.indexOf(path) > -1).length;
  const full = hiddenFooter || props.full;

  return (
    <div className={cx('view', { full, 'with-nav': hiddenFooter })} id='route-loading'>
      <Spinner />
    </div>
  );
}

class AppLoading extends React.Component {
  loadingStates = {
    error: {
      isError: true,
      status: t('Fatal error'),
      displayProperties: {
        name: t('Unknown error'),
        description: t('Something very unexpected and irrecoverable occurred.')
      }
    },
    error_setUpManifest: {
      isError: true,
      status: t('Fatal error'),
      displayProperties: {
        name: t('Manifest error'),
        description: t('Something went wrong while trying to update the item manifest.\n\nPlease reload the app and try again.')
      }
    },
    error_fetchingManifest: {
      isError: true,
      status: t('Fatal error'),
      displayProperties: {
        name: t('Manifest download failed'),
        description: t('Something went wrong while trying to download the item manifest from Bungie.\n\nPlease reload the app and try again.')
      }
    },
    error_maintenance: {
      shh: true,
      status: ' ',
      displayProperties: {
        name: t('Bungie Maintenance'),
        description: t('The Bungie API is currently down for maintenance.\n\nTune into @BungieHelp on Twitter for more information.')
      }
    },
    navigator_offline: {
      isError: true,
      status: t('No internet'),
      displayProperties: {
        name: t('No internet'),
        description: t('Are you offline? Your web browser thinks you are...')
      }
    },
    checkManifest: {
      status: t('Verifying manifest data')
    },
    fetchManifest: {
      status: t('Downloading data from Bungie')
    },
    setManifest: {
      status: t('Saving manifest data')
    },
    loadingPreviousProfile: {
      status: t('Loading previous member')
    },
    loadingProfile: {
      status: t('Loading member')
    },
    else: {
      status: t('Starting Windows 95')
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
    const state = this.props.state;

    if (state.code) {
      const status = (this.loadingStates[state.code] && this.loadingStates[state.code].status) || this.loadingStates.else.status;
      const isError = this.loadingStates[state.code] && (this.loadingStates[state.code].isError || this.loadingStates[state.code].shh);

      return (
        <div className='view' id='loading'>
          <div className='bg'>
            <div className='grad' />
            <div className='containment'>
              {/* <Loading.WarmindHalf /> */}
            </div>
          </div>
          <div className='logo'>
            <Common.Braytech />
          </div>
          <div className='version'>
            <div><span>S11</span> Clovis Bray ++{packageJSON.version}</div>
            <Loading.ClovisBray />
          </div>
          <div className='text'>
            <div className='name'>Braytech</div>
            <div className={cx('status', { error: isError })}>
              {!isError ? (
                <div>
                  <Spinner mini />
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
  withTranslation(),
  connect(null, mapDispatchToProps))
  (AppLoading);

export { AppLoading, SuspenseLoading };
