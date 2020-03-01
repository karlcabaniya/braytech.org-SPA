import React from 'react';

import { t } from '../../utils/i18n';

import './styles.css';

class ErrorBoundary extends React.Component {
  state = { error: false, errorMessage: null };

  static getDerivedStateFromError(error) {
    return { error: true, errorMessage: error.message };
  }

  componentDidCatch(error, errorInfo) {
    
  }

  render() {
    if (this.state.error) {
      return (
        <div className='view' id='error-boundary'>
          <div className='properties'>
            <div className='name'>{t('Error')}</div>
            <div className='description'>{this.state.errorMessage}</div>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;