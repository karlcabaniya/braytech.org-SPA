import React from 'react';

import { t } from '../../../utils/i18n';
import Button from '../../UI/Button';

import './styles.css';

class ServiceWorkerUpdate extends React.Component {
  handler_reload = e => {
    setTimeout(() => {
      window.location.reload();
    }, 50);
  }

  render() {
    const { updateAvailable } = this.props;

    if (updateAvailable) {
      return (
        <div id="service-worker-update">
          <div className='wrapper'>
            <div className='text'>
              {t('An update for Braytech is available. Please reload the app to start using it immediately.')}
            </div>
            <div className='action'>
              <Button text={t('Reload')} action={this.handler_reload} />
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}

export default ServiceWorkerUpdate;
