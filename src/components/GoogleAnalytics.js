import React from 'react';
import ReactGA from 'react-ga';

import packageJSON from '../../package.json';
import { removeMemberIds } from '../utils/paths';

class GoogleAnalytics extends React.Component {
  componentDidMount() {
    this.logPageChange(this.props.location.pathname, this.props.location.search);
  }

  componentDidUpdate({ location: prevLocation }) {
    const {
      location: { pathname, search }
    } = this.props;

    const isDifferentPathname = pathname !== prevLocation.pathname;
    const isDifferentSearch = search !== prevLocation.search;

    if (isDifferentPathname || isDifferentSearch) {
      this.logPageChange(pathname, search);
    }
  }

  logPageChange(pathname, search = '') {
    const page = pathname + search;
    const { location } = window;

    console.log(page, `${location.origin}${page}`)

    ReactGA.set({
      page,
      location: removeMemberIds(`${location.origin}${page}`),
      appName: 'Braytech',
      appVersion: packageJSON.version,
      ...this.props.options
    });
    ReactGA.pageview(page);
  }

  render() {
    return null;
  }
}

const init = (options = {}) => {
  const isGAEnabled = !!process.env.REACT_APP_GA_TRACKING_ID || !!process.env.REACT_APP_GA_TRACKING_ID_BETA;

  if (isGAEnabled) {
    ReactGA.initialize(process.env.REACT_APP_BETA ? process.env.REACT_APP_GA_TRACKING_ID_BETA : process.env.REACT_APP_GA_TRACKING_ID, {
      debug: process.env.REACT_APP_GA_DEBUG === 'true',
      ...options
    });
  }

  return isGAEnabled;
};

export default {
  GoogleAnalytics,
  init
};
