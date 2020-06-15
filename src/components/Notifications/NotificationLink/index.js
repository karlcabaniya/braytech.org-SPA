import React from 'react';
import { connect } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import cx from 'classnames';
import ReactGA from 'react-ga';

import { t } from '../../../utils/i18n';
import ObservedImage from '../../ObservedImage';
import { Button, DestinyKey } from '../../UI/Button';
import { Common } from '../../../svg';

import './styles.css';

class NotificationLink extends React.Component {
  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handler_deactivateOverlay = (e) => {
    e.stopPropagation();

    const state = this.active?.[0];

    if (this.mounted && state) {
      if (state.displayProperties.timeout) {
        this.clearTimeout();
      }

      this.props.popNotification(state.id);

      ReactGA.event({
        category: state.displayProperties.name || 'unknown',
        action: 'dismiss',
      });
    }
  };

  setTimeout = (timeout) => {
    this.notificationTimeout = window.setTimeout(this.sunsetNotifcation, timeout * 1000);
  };

  clearTimeout() {
    window.clearInterval(this.notificationTimeout);
  }

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
            text: t('Reload'),
            key: 'modify',
          },
          {
            type: 'external',
            target: 'https://twitter.com/BungieHelp',
            text: t('Go to Twitter'),
            key: 'accept',
            dismiss: false,
          },
        ];
      } else if (state && state.error) {
        isError = true;
        icon = <Common.Error />;
        actions = [
          {
            type: 'reload',
            text: t('Reload'),
            key: 'modify',
          },
        ];
      } else if (state && state.displayProperties?.image) {
        image = state.displayProperties.image;
      } else {
        icon = <Common.Info />;
      }

      actions = [
        ...actions,
        ...[
          {
            type: 'dismiss',
            text: t('Dismiss'),
            dismiss: true,
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
          <div id='notification-overlay' className={cx({ error: isError })}>
            <div className='wrapper-outer'>
              <div className='background'>
                <div className='border-top' />
                <div className='acrylic' />
              </div>
              <div className={cx('wrapper-inner', { 'has-image': state.displayProperties && state.displayProperties.image })}>
                <div>
                  <div className='icon'>{image ? <ObservedImage className='image' src={image} /> : icon ? icon : null}</div>
                </div>
                <div>
                  <div className='text'>
                    <div className='name'>{state.displayProperties && state.displayProperties.name ? state.displayProperties.name : 'Unknown'}</div>
                    <div className='description'>{state.displayProperties && state.displayProperties.description ? <ReactMarkdown source={state.displayProperties.description} /> : 'Unknown'}</div>
                  </div>
                </div>
              </div>
              <div className='sticky-nav mini ultra-black'>
                <div className='sticky-nav-inner'>
                  <div />
                  <ul>
                    {actions.map((action, i) => {
                      if (action.type === 'external') {
                        return (
                          <li key={i}>
                            <a className='button' href={action.target} onClick={action.dismiss ? this.handler_deactivateOverlay : null} target='_blank' rel='noreferrer noopener'>
                              <DestinyKey type={action.key || 'dismiss'} /> {action.text}
                            </a>
                          </li>
                        );
                      } else if (action.type === 'reload') {
                        return (
                          <li key={i}>
                            <Button action={this.handler_reload}>
                              <DestinyKey type={action.key || 'modify'} /> {action.text}
                            </Button>
                          </li>
                        );
                      } else if (action.type === 'agreement') {
                        return (
                          <li key={i}>
                            <Button action={action.dismiss ? this.handler_deactivateOverlay : null}>
                              <DestinyKey type={action.key || 'accept'} /> {action.text}
                            </Button>
                          </li>
                        );
                      } else {
                        return (
                          <li key={i}>
                            <Button action={this.handler_deactivateOverlay}>
                              <DestinyKey type={action.key || 'dismiss'} /> {action.text}
                            </Button>
                          </li>
                        );
                      }
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>
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

function mapStateToProps(state, ownProps) {
  return {
    notifications: state.notifications,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    popNotification: (value) => {
      dispatch({ type: 'POP_NOTIFICATION', payload: value });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationLink);
