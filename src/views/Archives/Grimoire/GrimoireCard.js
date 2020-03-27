import React from 'react';
import ReactMarkdown from 'react-markdown';

import { t } from '../../../utils/i18n';
import ObservedImage from '../../../components/ObservedImage';

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
        <ObservedImage src={`https://www.bungie.net${definitionCard.highResolution.image.sheetPath}`} />
        <div className='text'>
          <div className='name'>{definitionCard.cardName}</div>
          {definitionCard.cardIntro ? (
            <div className='intro'>
              <div className='text'>{definitionCard.cardIntro}</div>
              <div className='attribution'>{definitionCard.cardIntroAttribution}</div>
            </div>
          ) : null}
          <ReactMarkdown className='description' source={definitionCard.cardDescription} />
        </div>
      </div>
    );
  }
}

export default GrimoireCard;