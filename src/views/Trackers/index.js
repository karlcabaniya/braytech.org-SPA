import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import cx from 'classnames';

import { t } from '../../utils/i18n';
import manifest from '../../utils/manifest';
import { ProfileNavLink } from '../../components/ProfileLink';
import Metrics from '../../components/Metrics';
import { Views } from '../../svg';

import './styles.css';

// const metrics = this.props.member.data.profile.metrics.data.metrics;

const traitHashes = [
  {
    hash: 1434215347,
    icon: Views.Trackers.TraitAll
  },
  {
    hash: 2356777566,
    icon: Views.Trackers.TraitWeekly
  },
  {
    hash: 2230116619,
    icon: Views.Trackers.TraitSeasonal
  },
  {
    hash: 4263853822,
    icon: Views.Trackers.TraitCareer
  }
];

class TrackersNode extends React.Component {
  entries = React.createRef();

  hanlder__goToEntriesTop = e => {
    const element = this.entries.current;
    window.scrollTo(0, (element.offsetTop - element.scrollTop + element.clientTop - 34));
  }

  render() {
    const { hash1, hash2, hash3 } = this.props.match.params;

    const definitionPrimary = manifest.DestinyPresentationNodeDefinition[manifest.settings.destiny2CoreSettings.metricsRootNode];
    const definitionSecondary = manifest.DestinyPresentationNodeDefinition[hash1 || definitionPrimary?.children?.presentationNodes?.[0].presentationNodeHash];

    console.log(definitionPrimary, definitionSecondary);
    
    definitionSecondary.children.metrics.forEach(m => {
      console.log(manifest.DestinyMetricDefinition[m.metricHash].displayProperties.name, manifest.DestinyMetricDefinition[m.metricHash].traitHashes)
    });

    return (
      <div className='view presentation-node' id='trackers'>
        <div className='node'>
          <div className='header'>
            <div className='name'>
              {t('Trackers')}
              {definitionPrimary.children.presentationNodes.length > 1 ? <span>{definitionSecondary.displayProperties.name}</span> : null}
            </div>
          </div>
          <div className='children'>
            <ul className='list secondary'>
              {definitionPrimary.children.presentationNodes.map((child, c) => {
                const definitionNode = manifest.DestinyPresentationNodeDefinition[child.presentationNodeHash];

                if (definitionNode.redacted) {
                  return null;
                }

                const isActive = (match, location) => {
                  if (hash1 === undefined && definitionPrimary.children.presentationNodes.indexOf(child) === 0) {
                    return true;
                  } else if (match) {
                    console.log(match, location);
                    return true;
                  } else {
                    return false;
                  }
                };

                return (
                  <li key={c} className={cx('linked', { active: definitionSecondary.hash === child.presentationNodeHash })}>
                    <div className='text'>
                      <div className='name'>{definitionNode.displayProperties.name}</div>
                    </div>
                    <ProfileNavLink isActive={isActive} to={`/trackers/${definitionNode.hash}`} />
                  </li>
                );
              })}
            </ul>
          </div>
          <div className='entries' ref={this.entries}>
            <div className='filters'>
              <ul className='list'>
                {traitHashes.map((trait, t) => {
                  const isActive = (match, location) => {
                    if (hash2 === undefined && traitHashes.indexOf(trait) === 2) {
                      return true;
                    } else if (trait.hash === +hash2) {
                      return true;
                    } else {
                      return false;
                    }
                  };

                  return (
                    <li key={t} className='linked'>
                      <trait.icon />
                      <ProfileNavLink isActive={isActive} to={`/trackers/${definitionSecondary.hash}/${trait.hash}`} onClick={this.hanlder__goToEntriesTop} />
                    </li>
                  )
                })}
              </ul>
            </div>
            <ul className='list tertiary metric-items'>
              <Metrics hashes={definitionSecondary.children.metrics.map(m => m.metricHash)} />
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member
  };
}

export default compose(withRouter, connect(mapStateToProps))(TrackersNode);
