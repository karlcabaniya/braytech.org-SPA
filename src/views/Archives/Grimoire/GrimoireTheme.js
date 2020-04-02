import React from 'react';
import { Link } from 'react-router-dom';

import { t } from '../../../utils/i18n';
import ObservedImage from '../../../components/ObservedImage';

class GrimoireTheme extends React.Component {
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

    const definitionTheme = definitions.DestinyGrimoireDefinition.themeCollection.find(t => t.themeId === themeId);

    return (
      <div className='theme'>
        <div className='header'>
          <div className='wrapper'>
            <div className='text'>
              <div className='sub-name'>{t('Grimoire')}</div>
              <div className='name'>{definitionTheme.themeName}</div>
            </div>
          </div>
        </div>
        <div className='content'>
          <div className='wrapper'>
            <div className='pages'>
              {definitionTheme.pageCollection.map((page, p) => (
                <div key={p} className='page'>
                  <div className='name'>{page.pageName}</div>
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
