import React from 'react';
import ReactMarkdown from 'react-markdown';

import { t, BraytechText } from '../../utils/i18n';
import Button from '../../components/UI/Button';
import ServiceWorkerUpdate from '../../components/Notifications/ServiceWorkerUpdate';

import './styles.css';

class ErrorBoundary extends React.Component {
  state = { swInstalled: false, swUnregisterAttempt: false, error: false, errorInfo: undefined };

  static getDerivedStateFromError(error) {
    return { error };
  }

  // componentDidCatch(error, errorInfo) {
  //   this.setState({ errorInfo });
  // }

  async componentDidMount() {
    this.mounted = true;

    const swInstalled = await this.swInstalled();

    if (this.mounted && swInstalled) this.setState({ swInstalled: true });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  swAvailable = process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator;

  swInstalled = async () => {
    if (this.swAvailable) {
      const registration = await navigator.serviceWorker.getRegistration('/');

      if (registration) return true;
    }

    return false;
  };

  handler_reload = e => {
    setTimeout(() => {
      window.location.reload();
    }, 50);
  };

  handler_swDump = () => {
    if (this.mounted) this.setState({ swUnregisterAttempt: true });

    navigator.serviceWorker.getRegistration('/').then(function(registration) {
      registration.unregister();
    });
  };

  render() {
    if (this.state.error) {
      return (
        <>
          <ServiceWorkerUpdate {...this.props} />
          <div className='view' id='error-boundary'>
            <div className='properties'>
              <div className='name'>{t('Error')}</div>
              <div className='description'>{this.state.error.message}</div>
              {this.state.error.stack ? (
                <div className='stack'>
                  <pre>{this.state.error.stack}</pre>
                </div>
              ) : null}
              {this.props.app ? (
                <>
                  <BraytechText className='next' value={t('Braytech has encountered a fatal error. If one of the available actions does not resolve your issue, please join the [Discord](https://discord.braytech.org) for further assistance.')} />
                  <div className='actions'>
                    <Button text={t('Reload')} action={this.handler_reload} />
                    {this.swAvailable && this.state.swInstalled ? <Button text={t('Dump service worker')} disabled={!this.state.swInstalled || this.state.swUnregisterAttempt} action={this.handler_swDump} /> : null}
                  </div>
                </>
              ) : (
                <>
                  <BraytechText className='next' value={t('Braytech has encountered a fatal error. If one of the available actions does not resolve your issue, please join the [Discord](https://discord.braytech.org) for further assistance.')} />
                  <div className='actions'>
                    <Button text={t('Reload')} action={this.handler_reload} />
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
