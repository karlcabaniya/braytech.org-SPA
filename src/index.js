import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import packageJSON from '../package.json';
import runOnceTasks from './utils/runOnceTasks';
import ErrorBoundary from './components/ErrorBoundary';
import * as serviceWorker from './serviceWorker';

import App from './App';

import store from './store';

class AppEntry extends React.Component {
  constructor() {
    super();

    this.state = {
      updateAvailable: false,
      updateInstalling: false,
      beforeInstallPrompt: undefined,
    };

    console.log(`%c Braytech ${packageJSON.version}`, 'font-family: sans-serif; font-size: 24px;');

    runOnceTasks();
  }

  updateAvailable = (registration) => {
    this.setState({
      updateAvailable: registration,
    });
  };

  updateInstalling = () => {
    this.setState({
      updateInstalling: true,
    });
  };

  beforeInstallPrompt = (event) => {
    this.setState({
      beforeInstallPrompt: event,
    });
  };

  componentDidMount() {
    serviceWorker.register({
      updateAvailable: this.updateAvailable,
      updateInstalling: this.updateInstalling,
    });
    serviceWorker.beforeInstallPrompt(this.beforeInstallPrompt);
  }

  render() {
    return (
      <Provider store={store}>
        <ErrorBoundary app {...this.state}>
          <App {...this.state} />
        </ErrorBoundary>
      </Provider>
    );
  }
}

ReactDOM.render(<AppEntry />, document.getElementById('root'));
