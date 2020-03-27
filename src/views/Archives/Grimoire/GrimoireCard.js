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
      <div className='card'>
        <div className='name'>{definitionCard.cardName}</div>
        {definitionCard.cardIntro ? (
          <div className='intro'>
            <div>{definitionCard.cardIntro}</div>
            <div className='attribution'>{definitionCard.cardIntroAttribution}</div>
          </div>
        ) : null}
        <div className='description'>{definitionCard.cardDescription}</div>
      </div>
    );
  }
}

export default GrimoireCard;