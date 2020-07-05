import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import cx from 'classnames';

import { pushNotification } from '../../store/actions/notifications';
import packageJSON from '../../../package.json';
import Spinner from '../../components/UI/Spinner';
import { hiddenFooterRoutes } from '../../components/UI/Footer';
import { Common, Loading } from '../../svg';

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

function AppLoading({ state, ...props }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const loadingStates = {
    error: {
      isError: true,
      status: t('Fatal error'),
      displayProperties: {
        name: t('Unknown error'),
        description: t('Something very unexpected and irrecoverable occurred.'),
      },
    },
    error_setUpManifest: {
      isError: true,
      status: t('Fatal error'),
      displayProperties: {
        name: t('Manifest error'),
        description: t('Something went wrong while trying to update the item manifest.\n\nPlease reload the app and try again.'),
      },
    },
    error_fetchingManifest: {
      isError: true,
      status: t('Fatal error'),
      displayProperties: {
        name: t('Manifest download failed'),
        description: t('Something went wrong while trying to download the item manifest from Bungie.\n\nPlease reload the app and try again.'),
      },
    },
    error_indexedDb: {
      isError: true,
      status: t('Fatal error'),
      displayProperties: {
        name: 'Indexed DB',
        description: t('Something went wrong while trying to access browser storage.\n\nSome browsers disallow access to _Indexed DB_ when browsing in private modes.\n\nPlease reload the app and try again.'),
      },
    },
    error_maintenance: {
      shh: true,
      status: ' ',
      displayProperties: {
        name: t('Bungie Maintenance'),
        description: t('The Bungie API is currently down for maintenance.\n\nTune into @BungieHelp on Twitter for more information.'),
      },
    },
    navigator_offline: {
      isError: true,
      status: t('No internet'),
      displayProperties: {
        name: t('No internet'),
        description: t('Are you offline? Your web browser thinks you are...'),
      },
    },
    checkManifest: {
      status: t('Verifying manifest data'),
    },
    fetchManifest: {
      status: t('Downloading data from Bungie'),
    },
    setManifest: {
      status: t('Saving manifest data'),
    },
    loadingPreviousProfile: {
      status: t('Loading previous member'),
    },
    loadingProfile: {
      status: t('Loading member'),
    },
    else: {
      status: t('Starting Windows 95'),
    },
  };

  useEffect(() => {
    if (loadingStates[state.code]?.isError || loadingStates[state.code]?.shh) {
      dispatch(
        pushNotification({
          error: true,
          date: new Date().toISOString(),
          expiry: 86400000,
          displayProperties: {
            ...loadingStates[state.code]?.displayProperties,
            prompt: true,
          },
          javascript: state.detail,
        })
      );
    }

    return () => {};
  }, [state.code]);

  if (state.code) {
    const status = loadingStates[state.code]?.status || loadingStates.else.status;
    const isError = loadingStates[state.code]?.isError || loadingStates[state.code]?.shh;

    return (
      <div className='view' id='loading'>
        <div className='bg'>
          <div className='grad' />
          <div className='containment'>{/* <Loading.WarmindHalf /> */}</div>
        </div>
        <div className='logo'>
          <Common.Braytech />
        </div>
        <div className='version'>
          <div>
            <span>S11</span> Clovis Bray ++{packageJSON.version}
          </div>
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
  }

  return null;
}

export { AppLoading, SuspenseLoading };
