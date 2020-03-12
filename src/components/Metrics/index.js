import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';
import cx from 'classnames';

import manifest from '../../utils/manifest';
import * as utils from '../../utils/destinyUtils';
import ProgressBar from '../UI/ProgressBar';
import ObservedImage from '../ObservedImage';

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
    const highlight = +this.props.highlight || false;
    const metrics = member.data?.profile.metrics.data.metrics;
    
    return hashes.map((hash, h) => {
      const definitionMetric = manifest.DestinyMetricDefinition[hash];

      if (!definitionMetric || definitionMetric.redacted) {
        return null;
      }

      const objectiveProgress = metrics?.[definitionMetric.hash].objectiveProgress || {};

      const traitHash = definitionMetric.traitHashes.find(h => h !== 1434215347);
      const definitionTrait = traitHash && manifest.DestinyTraitDefinition[traitHash];

      const images = utils.metricImages(definitionMetric.hash);

      return (
        <li key={h} className={cx({ completed: objectiveProgress.complete })}>
          <div className='properties'>
            <div className='metric'>
              <div className='name'>{definitionMetric.displayProperties.name}</div>
              <div className='trait'>{definitionTrait.displayProperties.name}</div>
              <div className='description'>{utils.stringToIcons(definitionMetric.displayProperties.description)}</div>
            </div>
            <div className='objective'>
              <ProgressBar {...objectiveProgress} hideDescription />
            </div>
          </div>
          <div className={cx('gonfalon', { complete: objectiveProgress.complete })}>
            <ObservedImage className='image banner' src={`https://www.bungie.net${images.banner}`} />
            <ObservedImage className='image trait' src={`https://www.bungie.net${images.trait}`} />
            <ObservedImage className='image metric' src={`https://www.bungie.net${images.metric}`} />
            <ObservedImage className='image banner complete' src='/static/images/extracts/ui/metrics/01E3-10F0.png' />
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
