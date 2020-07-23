import React from 'react';
import { connect } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import cx from 'classnames';
import ReactGA from 'react-ga';

import { t } from '../../../utils/i18n';
import ObservedImage from '../../ObservedImage';
import Dialog from '../../UI/Dialog';

import { Common } from '../../../svg';

import './styles.css';

class NotificationService extends React.Component {
  setTimeout = (timeout) => {
    this.notificationTimeout = window.setTimeout(this.sunsetNotifcation, timeout * 1000);
  };

  clearTimeout() {
    window.clearInterval(this.notificationTimeout);
  }

  handler_deactivateOverlay = (e) => {
    e.stopPropagation();

    const state = this.active?.[0];

    if (state.displayProperties.timeout) {
      this.clearTimeout();
    }

    this.props.popNotification(state.id);

    ReactGA.event({
      category: state.displayProperties.name || 'unknown',
      action: 'dismiss',
    });
  };

  handler_reload = (e) => {
    const state = this.active?.[0];

    if (this.mounted && state) {
      if (state.displayProperties.timeout) {
        this.clearTimeout();
      }

      this.props.popNotification(state.id);
    }

    setTimeout(() => {
      window.location.reload();
    }, 50);
  };

  sunsetNotifcation = () => {
    if (this.active && this.active.length ? this.active[0] : false) {
      const state = this.active[0];

      if (state.displayProperties.timeout) {
        this.props.popNotification(state.id);
      }
    }
  };

  componentDidUpdate(p, s) {
    if (this.active && this.active.length) {
      const state = this.active[0];

      if (state.displayProperties.timeout) {
        this.clearTimeout();
        this.setTimeout(state.displayProperties.timeout);
      }
    }
  }

  render() {
    const timeNow = new Date().getTime();

    this.active = this.props.notifications?.objects.length
      ? this.props.notifications.objects.filter((o) => {
          const objDate = new Date(o.date).getTime();

          if (objDate + o.expiry > timeNow) {
            return true;
          } else {
            return false;
          }
        })
      : [];

    const remainingInline = this.active.filter((a) => !a.displayProperties.prompt).length - 1;

    if (this.active.length ? this.active[0] : false) {
      const state = this.active[0];

      let isError,
        image,
        icon,
        actions = state.actions || [];

      if (state && state.error && state.javascript?.message === 'maintenance') {
        icon = <Common.DOC />;
        actions = [
          {
            type: 'reload',
            handler: this.handler_reload,
          },
          {
            type: 'external',
            target: 'https://twitter.com/BungieHelp',
            text: t('Go to Twitter'),
            dismiss: false,
          },
        ];
      } else if (state && state.error) {
        isError = true;
        icon = <Common.Error />;
        actions = [
          {
            type: 'reload',
            handler: this.handler_reload,
          },
        ];
      } else if (state && state.displayProperties?.image) {
        image = state.displayProperties.image;
      } else {
        icon = <Common.Info />;
      }

      const dialogActions = [
        ...actions,
        ...[
          {
            type: 'dismiss',
            handler: this.handler_deactivateOverlay,
          },
        ].filter((action) =>
          // if an error
          state.error || actions.filter((action) => action.type === 'agreement').length // if a forced agreement
            ? action.type !== 'dismiss'
            : true
        ),
      ].filter((action) => action);

      if (state && state.displayProperties?.prompt) {
        return (
          <Dialog type='notification' isError={isError} actions={dialogActions}>
            <div className={cx({ 'has-image': image })}>
              <div className='icon'>{image ? <ObservedImage className='image' src={image} /> : icon ? icon : null}</div>
            </div>
            <div>
              <div className='text'>
                <div className='name'>{state.displayProperties && state.displayProperties.name ? state.displayProperties.name : 'Unknown'}</div>
                <div className='description'>{state.displayProperties && state.displayProperties.description ? <ReactMarkdown source={state.displayProperties.description} /> : 'Unknown'}</div>
              </div>
            </div>
          </Dialog>
        );
      } else {
        return (
          <div key={state.id} id='notification-bar' className={cx({ error: isError })} style={{ '--timeout': `${state.displayProperties?.timeout || 4}s` }} onClick={this.handler_deactivateOverlay}>
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
                      <p>{state.displayProperties && state.displayProperties.name ? state.displayProperties.name : t('Unknown')}</p>
                    </div>
                    <div className='description'>{state.displayProperties?.description ? <ReactMarkdown source={state.displayProperties.description} /> : <p>{t('Unknown')}</p>}</div>
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
}

function mapStateToProps(state) {
  return {
    notifications: state.notifications,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    popNotification: (payload) => {
      dispatch({ type: 'POP_NOTIFICATION', payload });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationService);
