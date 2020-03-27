import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import cx from 'classnames';

import { t } from '../../../utils/i18n';

import { NavLinks } from '../';

import './styles.css';

import GrimoireCard from './GrimoireCard';

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
    const cardId = this.props.match.params.cardId;

    const definitionCard = definitions.DestinyGrimoireCardDefinition[cardId];

    console.log(definitions, definitionCard);
    
    return (
      <div className='view grimoire' id='archives'>
        <div className='module head'>
          <div className='page-header'>
            <div className='sub-name'>{t('Archives')}</div>
            <div className='name'>{t('Grimoire')}</div>
          </div>
        </div>
        <div className='buff'>
          <NavLinks />
          <div className='content'>
            {definitionCard && <GrimoireCard card={definitionCard} />}
          </div>
        </div>
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