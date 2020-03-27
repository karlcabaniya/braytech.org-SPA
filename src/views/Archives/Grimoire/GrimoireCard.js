import React from 'react';
import cx from 'classnames';

import { t } from '../../../utils/i18n';

class GrimoireCard extends React.Component {
  state = {};

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const definitionCard = this.props.card;

    console.log(definitionCard);
    
    return (
      null
    );
  }
}

export default GrimoireCard;