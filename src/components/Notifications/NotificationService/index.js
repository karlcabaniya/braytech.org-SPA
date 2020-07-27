import React, { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import cx from 'classnames';
import ReactGA from 'react-ga';
import ReactMarkdown from 'react-markdown';

import { t } from '../../../utils/i18n';
import actions from '../../../store/actions';
import { GetNotifications } from '../../../utils/voluspa';
import packageJSON from '../../../../package.json';

import ObservedImage from '../../ObservedImage';
import Dialog from '../../UI/Dialog';

import { Common } from '../../../svg';

import './styles.css';

const appVersion = +packageJSON.version.replace(/\./g, '');

export default function NotificationService() {
  const dispatch = useDispatch();
  // stores a static reference to the service interval
  const serviceInterval = useRef();
  // stores a static reference to the current timer
  const notificationTimeout = useRef();

  // regularly check for dynamic notifications
  useEffect(() => {
    // run on initialisation
    pingVoluspa();
    // run every 5 minutes
    serviceInterval.current = window.setInterval(pingVoluspa, 300 * 1000);

    return () => {
      window.clearInterval(serviceInterval.current);
    };
  }, []);

  function setTimeout(timeout) {
    notificationTimeout.current = window.setTimeout(sunsetNotifcation, timeout * 1000);
  }

  function clearTimeout() {
    window.clearTimeout(notificationTimeout.current);
  }

  async function pingVoluspa() {
    const response = await GetNotifications();

    if (response?.ErrorCode === 1) {
      response.Response
        // filter based on release type
        .filter((notification) => (notification.release.type === 'dev' ? process.env.NODE_ENV === 'development' : true))
        .filter((notification) => (notification.release.type === 'beta' ? process.env.REACT_APP_BETA === 'true' : true))
        // filter based on release version
        .filter((notification) => (notification.release.version ? appVersion >= +notification.release.version.replace(/\./g, '') : true))
        // dispatch!
        .forEach(({ expiry, ...notification }) => {
          dispatch(
            actions.notifications.push({
              ...notification,
              expiry: expiry * 1000,
            })
          );
        });
    }
  }

  function sunsetNotifcation() {
    if (notification?.displayProperties.timeout) {
      dispatch(actions.notifications.pop(notification.hash));
    }
  }

  function handler_dismiss(e) {
    e.stopPropagation();

    if (notification.displayProperties.timeout) {
      clearTimeout();
    }

    dispatch(actions.notifications.pop(notification.hash));

    ReactGA.event({
      label: notification.analytics?.label || undefined,
      category: (notification.displayProperties?.prompt && notification.displayProperties.name) || 'Toast' || 'Unknown',
      action: 'Dismiss',
    });
  }

  function handler_reload() {
    if (notification?.displayProperties.timeout) {
      clearTimeout();
    }

    dispatch(actions.notifications.pop(notification.hash));

    window.setTimeout(() => {
      window.location.reload();
    }, 50);
  }

  // time now in ms
  const nowMs = new Date().getTime();

  // grabs all possible unexpried notifications
  const notifications = useSelector((state) =>
    state.notifications.objects.filter((notification) => {
      const dateMs = new Date(notification.date).getTime();

      if (dateMs + notification.expiry > nowMs) {
        return true;
      } else {
        return false;
      }
    })
  );

  // trashed notifications
  // const trash = useSelector((state) => state.notifications.trash);

  // number of queued inline notifications
  const remainingInline = notifications.filter((notification) => !notification.displayProperties.prompt).length - 1;

  // current notification
  const notification = notifications[0];

  // every time the notifification reference changes,
  // check if the notification has a timeout (is of inline style)
  // and set timeouts accordingly
  useEffect(() => {
    if (notification?.displayProperties.timeout) {
      clearTimeout();
      setTimeout(notification.displayProperties.timeout);
    }

    return () => {
      clearTimeout();
    };
  }, [notification]);

  // console.log(trash, notifications)



  

  if (notification) {
    const postman = {
      isError: false,
      actions:
        notification.actions?.map((action) =>
          action.dismiss
            ? // if dismiss, add dismiss handler
              { ...action, handler: handler_dismiss }
            : action
        ) || [],
      displayProperties: { ...notification.displayProperties } || {},
    };

    if (notification.error && notification.javascript?.message === 'maintenance') {
      // very special notification for when the API reports maintenance
      postman.actions = [
        {
          type: 'reload',
          handler: handler_reload,
        },
        {
          type: 'external',
          target: 'https://twitter.com/BungieHelp',
          text: t('Go to Twitter'),
          dismiss: false,
        },
      ];
      postman.displayProperties.icon = <Common.DOC />;
    } else if (notification.error) {
      // this is an error
      postman.isError = true;
      postman.actions = [
        {
          type: 'reload',
          handler: handler_reload,
        },
      ];
      postman.displayProperties.icon = <Common.Error />;
    } else {
      // general notification
      postman.displayProperties.icon = <Common.Info />;
    }

    const dialogActions = [
      ...postman.actions,
      ...[
        {
          type: 'dismiss',
          handler: handler_dismiss,
        },
      ].filter((action) =>
        // if an error
        notification.error ||
        // if a forced agreement
        postman.actions.filter((action) => action.type === 'agreement').length ||
        // already has a default dismiss
        postman.actions.filter((action) => action.type === 'dismiss').length
          ? action.type !== 'dismiss'
          : true
      ),
    ].filter((action) => action);

    if (postman.displayProperties?.prompt) {
      return (
        <Dialog type='notification' isError={postman.isError} actions={dialogActions}>
          <div className={cx({ 'has-image': postman.displayProperties.image })}>
            <div className='icon'>{postman.displayProperties.image ? <ObservedImage className='image' src={postman.displayProperties.image} /> : postman.displayProperties.icon ? postman.displayProperties.icon : null}</div>
          </div>
          <div>
            <div className='text'>
              <div className='name'>{postman.displayProperties?.name ? postman.displayProperties.name : 'Unknown'}</div>
              <div className='description'>{postman.displayProperties?.description ? <ReactMarkdown source={postman.displayProperties.description} /> : 'Unknown'}</div>
            </div>
          </div>
        </Dialog>
      );
    } else {
      return (
        <div key={notification.hash} className={cx('toast', { error: postman.isError, 'no-timeout': !postman.displayProperties?.timeout })} style={{ '--timeout': `${postman.displayProperties?.timeout || 4}s` }} onClick={handler_dismiss}>
          <div className='wrapper-outer'>
            <div className='background'>
              <div className='border-top'>
                <div className='inner' />
              </div>
              <div className='acrylic' />
            </div>
            <div className='wrapper-inner'>
              <div>
                <div className='icon'>
                  <span className='destiny-ghost' />
                </div>
              </div>
              <div>
                <div className='text'>
                  <div className='name'>
                    <p>{postman.displayProperties?.name ? postman.displayProperties.name : t('Unknown')}</p>
                  </div>
                  <div className='description'>{postman.displayProperties?.description ? <ReactMarkdown source={postman.displayProperties.description} /> : <p>{t('Unknown')}</p>}</div>
                </div>
                {remainingInline > 0 ? (
                  <div className='more'>
                    <p>{t('And {{number}} more', { number: remainingInline })}</p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      );
    }
  } else {
    return null;
  }
}
