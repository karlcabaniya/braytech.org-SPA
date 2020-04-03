import React from 'react';
import { Link } from 'react-router-dom';

import { t } from '../../../utils/i18n';
import ObservedImage from '../../../components/ObservedImage';
import { Grimoire as Icons } from '../../../svg';

class GrimoireTheme extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const { definitions, themeId, pageId, cardId } = this.props;

    const definitionTheme = definitions.DestinyGrimoireDefinition.themeCollection.find(t => t.themeId === themeId);

    const Icon = Icons[themeId];

    return (
      <div className='theme'>
        <div className='header'>
          <div className='icon'>
            <Icon />
          </div>
          <div className='wrapper'>
            <div className='text'>
              <div className='crumbs'>
                <Link to={`/archives/grimoire`}>{t('Grimoire')}</Link>
              </div>
              <div className='name'>{definitionTheme.themeName}</div>
            </div>
          </div>
        </div>
        <div className='content'>
          <div className='wrapper'>
            <div className='pages'>
              {definitionTheme.pageCollection.map((page, p) => (
                <div key={p} className='page'>
                  <h4>{page.pageName}</h4>
                  <div className='cards'>
                    {page.cardBriefs.map(card => (
                      <div key={card.cardId}>
                        <div className='art'>
                          <div className='card'>
                            <ObservedImage src={`https://www.bungie.net${definitions.DestinyGrimoireCardDefinition[card.cardId].highResolution.image.sheetPath}`} />
                          </div>
                          <Link className='button' to={`/archives/grimoire/${themeId}/${page.pageId}/${card.cardId}`} />
                        </div>
                        <div className='text'>
                          <div className='name'>{definitions.DestinyGrimoireCardDefinition[card.cardId].cardName}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default GrimoireTheme;
