import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import cx from 'classnames';

import { t } from '../../../utils/i18n';
import ObservedImage from '../../../components/ObservedImage';
import { Button, DestinyKey } from '../../../components/UI/Button';

import { NavLinks } from '../';

import './styles.css';

import GrimoireCard from './GrimoireCard';
import GrimoireTheme from './GrimoireTheme';

class Grimoire extends React.Component {
  state = {};

  componentDidMount() {
    this.mounted = true;

    window.scrollTo(0, 0);

    this.props.rebindTooltips();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const { definitions, viewport, member } = this.props;
    const { themeId, pageId, cardId } = this.props.match.params;

    const definitionCard = definitions.DestinyGrimoireCardDefinition[cardId];
    const definitionTheme = definitions.DestinyGrimoireDefinition.themeCollection.find(t => t.themeId === themeId);
    const definitionPage = definitionTheme && definitionTheme.pageCollection.find(p => p.pageId === pageId);

    // console.log(definitions, definitionCard, definitionTheme);

    return (
      <div className='view grimoire' id='archives'>
        <div className='container'>
          {definitionCard ? (
            <GrimoireCard definitions={definitions} {...this.props.match.params} />
          ) : definitionTheme ? (
            <GrimoireTheme definitions={definitions} {...this.props.match.params} />
          ) : (
            <div className='themes'>
              <div className='header'>
                <div className='wrapper'>
                  <div className='text'>
                    <div className='name'>{t('Grimoire')}</div>
                  </div>
                </div>
              </div>
              <div className='content'>
                <div className='wrapper'>
                  <ul className='list'>
                    {definitions.DestinyGrimoireDefinition.themeCollection.map((theme, t) => (
                      <li key={t} className='linked'>
                        <Link to={`/archives/grimoire/${theme.themeId}`}>{theme.themeName}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
        {definitionCard || definitionTheme ? (
          <div className='sticky-nav'>
            <div className='wrapper'>
              <div />
              <ul>
                {definitionCard || definitionTheme ? (
                  <li>
                    <Link className='button' to={definitionCard ? `/archives/grimoire/${definitionTheme.themeId}/${definitionPage.pageId}/` : `/archives/grimoire/`}>
                      <DestinyKey type='dismiss' />
                      {t('Back')}
                    </Link>
                  </li>
                ) : null}
              </ul>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    viewport: state.viewport
  };
}

function mapDispatchToProps(dispatch) {
  return {
    rebindTooltips: value => {
      dispatch({ type: 'REBIND_TOOLTIPS', payload: new Date().getTime() });
    }
  };
}

export default compose(connect(mapStateToProps, mapDispatchToProps), withRouter)(Grimoire);
