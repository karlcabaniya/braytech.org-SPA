import React from 'react';
import { Link } from 'react-router-dom';

import { t, BungieText } from '../../../utils/i18n';
import ObservedImage from '../../../components/ObservedImage';

class GrimoireCard extends React.Component {
  state = {};

  componentDidMount() {
    this.mounted = true;

    window.scrollTo(0, 0);
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const { definitions, themeId, pageId, cardId } = this.props;

    const definitionCard = definitions.DestinyGrimoireCardDefinition[cardId];
    const definitionTheme = definitions.DestinyGrimoireDefinition.themeCollection.find(t => t.themeId === themeId);
    const definitionPage = definitionTheme && definitionTheme.pageCollection.find(p => p.pageId === pageId);

    console.log(definitionCard, definitionTheme, definitionPage);

    return (
      <div className='detail'>
        <div className='header'>
          <div className='wrapper'>
            <div className='text'>
              <div className='crumbs'>
                <Link to={`/archives/grimoire/${definitionTheme.themeId}`}>{definitionTheme.themeName}</Link>
                <Link to={`/archives/grimoire/${definitionTheme.themeId}/${definitionPage.pageId}`}>{definitionPage.pageName}</Link>
              </div>
              <div className='name'>{definitionCard.cardName}</div>
            </div>
            <div className='art'>
              <div className='card'>
                <ObservedImage src={`https://www.bungie.net${definitionCard.highResolution.image.sheetPath}`} />
              </div>
            </div>
          </div>
        </div>
        <div className='content'>
          <div className='wrapper'>
            <div className='text'>
              {definitionCard.cardIntro ? (
                <div className='intro'>
                  <div className='text'>{definitionCard.cardIntro}</div>
                  <div className='attribution'>{definitionCard.cardIntroAttribution}</div>
                </div>
              ) : null}
              <BungieText className='description' value={definitionCard.cardDescription} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default GrimoireCard;
