import React from 'react';

import { t } from '../../utils/i18n';
import Button from '../../components/UI/Button';

import './styles.css';

class ErrorBoundary extends React.Component {
  state = { swInstalled: false, swUnregisterAttempt: false, error: false, errorMessage: null };

  static getDerivedStateFromError(error) {
    return { error: true, errorMessage: error.message };
  }

  componentDidCatch(error, errorInfo) {}

  componentDidUpdate(p, s) {
    console.log(this.state);
  }

  async componentDidMount() {
    this.mounted = true;

    const swInstalled = await this.swInstalled();

    if (this.mounted && swInstalled) this.setState({ swInstalled: true });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

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
      console.log(registration);
    });
  };

  render() {
    if (this.state.error) {
      return (
        <div className='view' id='error-boundary'>
          <div className='properties'>
            <div className='name'>{t('Error')}</div>
            <div className='description'>{this.state.errorMessage}</div>
            {this.props.app ? (
              <>
                <div className='next'>{t('Braytech has encountered a fatal error. This incident has been reported.')}</div>
                <div className='actions'>
                  <Button text={t('Reload')} action={this.handler_reload} />
                  {this.swAvailable && this.state.swInstalled ? <Button text={t('Dump service worker')} disabled={!this.state.swInstalled || this.state.swUnregisterAttempt} action={this.handler_swDump} /> : null}
                </div>
              </>
            ) : (
              <>
                <div className='next'>{t('Braytech has encountered a temporary error. This incident has been reported.')}</div>
                <div className='actions'>
                  <Button text={t('Reload')} action={this.handler_reload} />
                </div>
              </>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
