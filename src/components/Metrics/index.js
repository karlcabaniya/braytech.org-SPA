import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { orderBy } from 'lodash';
import cx from 'classnames';

import manifest from '../../utils/manifest';
import { commonality } from '../../utils/destinyUtils';
import { enumerateRecordState, associationsCollectionsBadges } from '../../utils/destinyEnums';
import * as paths from '../../utils/paths';
import dudRecords from '../../data/dudRecords';
import { ProfileLink } from '../../components/ProfileLink';
import Collectibles from '../../components/Collectibles';
import ProgressBar from '../UI/ProgressBar';
import ObservedImage from '../ObservedImage';
import { Common } from '../../svg';

import './styles.css';

const selfLink = hash => {
  let link = ['/triumphs'];
  let root = manifest.DestinyPresentationNodeDefinition[manifest.settings.destiny2CoreSettings.recordsRootNode];
  let seals = manifest.DestinyPresentationNodeDefinition[manifest.settings.destiny2CoreSettings.medalsRootNode];

  root.children.presentationNodes.forEach(nP => {
    let nodePrimary = manifest.DestinyPresentationNodeDefinition[nP.presentationNodeHash];

    nodePrimary.children.presentationNodes.forEach(nS => {
      let nodeSecondary = manifest.DestinyPresentationNodeDefinition[nS.presentationNodeHash];

      nodeSecondary.children.presentationNodes.forEach(nT => {
        let nodeTertiary = manifest.DestinyPresentationNodeDefinition[nT.presentationNodeHash];

        if (nodeTertiary.children.records.length) {
          let found = nodeTertiary.children.records.find(c => c.recordHash === parseInt(hash, 10));
          if (found) {
            link.push(nodePrimary.hash, nodeSecondary.hash, nodeTertiary.hash, found.recordHash);
          }
        } else {
          nodeTertiary.children.presentationNodes.forEach(nQ => {
            let nodeQuaternary = manifest.DestinyPresentationNodeDefinition[nQ.presentationNodeHash];

            if (nodeQuaternary.children.records.length) {
              let found = nodeQuaternary.children.records.find(c => c.recordHash === hash);
              if (found) {
                link.push(nodePrimary.hash, nodeSecondary.hash, nodeTertiary.hash, nodeQuaternary.hash, found.recordHash);
              }
            }
          });
        }
      });
    });
  });

  if (link.length === 1) {
    seals.children.presentationNodes.forEach(nP => {
      let nodePrimary = manifest.DestinyPresentationNodeDefinition[nP.presentationNodeHash];

      if (nodePrimary.completionRecordHash === parseInt(hash, 10)) {
        link.push('seal', nodePrimary.hash);

        return;
      }

      if (nodePrimary.children.records.length) {
        let found = nodePrimary.children.records.find(c => c.recordHash === parseInt(hash, 10));
        if (found) {
          link.push('seal', nodePrimary.hash, found.recordHash);
        }
      }
    });
  }

  link = link.join('/');
  return link;
};

class Metrics extends React.Component {
  scrollToRecordRef = React.createRef();

  componentDidMount() {
    if (this.props.highlight && this.scrollToRecordRef.current !== null) {
      window.scrollTo({
        top: this.scrollToRecordRef.current.offsetTop + this.scrollToRecordRef.current.offsetHeight / 2 - window.innerHeight / 2
      });
    }
  }

  render() {
    const { t, hashes, member, selfLinkFrom } = this.props;
    const highlight = parseInt(this.props.highlight, 10) || false;
    
    return hashes.map((hash, h) => {
      const definitionMetric = manifest.DestinyMetricDefinition[hash];

      if (definitionMetric.redacted) {
        return null;
      }

      return (
        <li key={h}>
          <div className='text'>
            <div className='name'>{definitionMetric.displayProperties.name}</div>
          </div>
        </li>
      );
    });
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member
  };
}

Metrics = compose(
  withRouter,
  connect(
    mapStateToProps
  ),
  withTranslation()
)(Metrics);

export { Metrics, selfLink };

export default Metrics;
