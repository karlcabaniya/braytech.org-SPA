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
import { displayValue } from '../../utils/destinyConverters';
import * as paths from '../../utils/paths';
import { ProfileLink } from '../../components/ProfileLink';
import Collectibles from '../../components/Collectibles';
import ProgressBar from '../UI/ProgressBar';
import ObservedImage from '../ObservedImage';
import { Common } from '../../svg';

import './styles.css';

function selfLinkRecord(hash) {
  const link = ['/triumphs'];
  const root = manifest.DestinyPresentationNodeDefinition[manifest.settings.destiny2CoreSettings.recordsRootNode];
  const seals = manifest.DestinyPresentationNodeDefinition[manifest.settings.destiny2CoreSettings.medalsRootNode];

  root.children.presentationNodes.forEach(nP => {
    const nodePrimary = manifest.DestinyPresentationNodeDefinition[nP.presentationNodeHash];

    nodePrimary.children.presentationNodes.forEach(nS => {
      const nodeSecondary = manifest.DestinyPresentationNodeDefinition[nS.presentationNodeHash];

      nodeSecondary.children.presentationNodes.forEach(nT => {
        const nodeTertiary = manifest.DestinyPresentationNodeDefinition[nT.presentationNodeHash];

        if (nodeTertiary.children.records.length) {
          const found = nodeTertiary.children.records.find(c => c.recordHash === hash);

          if (found) {
            link.push(nodePrimary.hash, nodeSecondary.hash, nodeTertiary.hash, found.recordHash);
          }
        } else {
          nodeTertiary.children.presentationNodes.forEach(nQ => {
            const nodeQuaternary = manifest.DestinyPresentationNodeDefinition[nQ.presentationNodeHash];

            if (nodeQuaternary.children.records.length) {
              const found = nodeQuaternary.children.records.find(c => c.recordHash === hash);

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
      const nodePrimary = manifest.DestinyPresentationNodeDefinition[nP.presentationNodeHash];

      if (nodePrimary.completionRecordHash === hash) {
        link.push('seal', nodePrimary.hash);

        return;
      }

      if (nodePrimary.children.records.length) {
        const found = nodePrimary.children.records.find(c => c.recordHash === hash);

        if (found) {
          link.push('seal', nodePrimary.hash, found.recordHash);
        }
      }
    });
  }

  return link.join('/');
};

function unredeemedRecords(member) {
  const characterRecords = member && member.data.profile.characterRecords.data;
  const profileRecords = member && member.data.profile.profileRecords.data.records;

  const hashes = [];

  const records = {
    ...profileRecords,
    ...characterRecords[member.characterId].records
  };

  Object.entries(records).forEach(([key, record]) => {
    const definitionRecord = manifest.DestinyRecordDefinition[key];

    if (definitionRecord && definitionRecord.redacted) {
      return;
    }

    if (definitionRecord.parentNodeHashes?.length && !enumerateRecordState(record.state).invisible && !enumerateRecordState(record.state).objectiveNotCompleted && !enumerateRecordState(record.state).recordRedeemed) {
      
      // temporary fix for https://github.com/Bungie-net/api/issues/1167
      // check to see if belongs to transitory expired seal || is undying seal child
      const definitionParent = definitionRecord.parentNodeHashes?.length && manifest.DestinyPresentationNodeDefinition[definitionRecord.parentNodeHashes[0]];
      const parentCompletionRecordData = definitionParent && definitionParent.completionRecordHash && definitionParent.scope === 1 ? characterRecords[member.characterId].records[definitionParent.completionRecordHash] : profileRecords[definitionParent.completionRecordHash];

      if ((definitionParent.hash === 3303651244) || (parentCompletionRecordData && enumerateRecordState(parentCompletionRecordData.state).rewardUnavailable && enumerateRecordState(parentCompletionRecordData.state).objectiveNotCompleted) || (parentCompletionRecordData && enumerateRecordState(parentCompletionRecordData).invisible)) {
        return;
      } else {
        hashes.push(key);
      }
    }
  });

  return hashes;
};

function recordDescription(hash) {
  const definitionRecord = manifest.DestinyRecordDefinition[hash];

  if (definitionRecord?.displayProperties?.description !== '') {
    return definitionRecord.displayProperties?.description;
  } else if (definitionRecord?.loreHash && manifest.DestinyLoreDefinition[definitionRecord.loreHash]) {
    return manifest.DestinyLoreDefinition[definitionRecord.loreHash]?.displayProperties.description.slice(0, 142).trim() + '...';
  } else {
    return '';
  }
}

class Records extends React.Component {
  scrollToRecordRef = React.createRef();

  componentDidMount() {
    if (this.props.highlight && this.scrollToRecordRef.current !== null) {
      window.scrollTo({
        top: this.scrollToRecordRef.current.offsetTop + this.scrollToRecordRef.current.offsetHeight / 2 - window.innerHeight / 2
      });
    }
  }

  handler_toggleTrack = e => {
    let tracked = this.props.triumphs.tracked;
    const hashToTrack = +e.currentTarget.dataset.hash;
    const target = tracked.indexOf(hashToTrack);

    if (target > -1) {
      tracked = tracked.filter((hash, index) => index !== target);
    } else {
      tracked.push(hashToTrack);
    }

    this.props.setTrackedTriumphs(tracked);
  };

  makeLink = (hash, isCollectionBadge) => {
    const definitionRecord = manifest.DestinyRecordDefinition[hash];
    
    const triumphsPathname = selfLinkRecord(hash);
    const collectionsPathname = `/collections/badge/${isCollectionBadge?.badgeHash}`;
    const readPathname = `/read/record/${definitionRecord.hash}`;
    
    if (this.props.readLink) {
      return {
        pathname: definitionRecord.loreHash && !this.props.selfLinkFrom ? readPathname : triumphsPathname,
        state: {
          from: this.props.location.pathname
        }
      };
    } else if (!this.props.selfLinkFrom && isCollectionBadge) {
      return {
        pathname: collectionsPathname,
        state: {
          from: paths.removeMemberIds(this.props.location.pathname)
        }
      };
    } else if (this.props.selfLinkFrom) {
      return {
        pathname: triumphsPathname,
        state: {
          from: this.props.selfLinkFrom
        }
      };
    } else {
      return false;
    }
  }

  render() {
    const { t, hashes, member, triumphs, collectibles, ordered, limit, selfLinkFrom, readLink, forceDisplay = false } = this.props;
    const highlight = +this.props.highlight || false;
    const recordsRequested = hashes;
    const characterId = member.characterId;
    const characterRecords = member.data && member.data.profile.characterRecords.data;
    const profileRecords = member.data && member.data.profile.profileRecords.data.records;
    const profileRecordsTracked = member.data && member.data.profile.profileRecords.data.trackedRecordHash ? [member.data.profile.profileRecords.data.trackedRecordHash] : [];
    const tracked = triumphs.tracked;

    let recordsOutput = [];
    recordsRequested.forEach((hash, h) => {
      const definitionRecord = manifest.DestinyRecordDefinition[hash];

      if (!definitionRecord) return;

      // console.log(definitionRecord.displayProperties.name);
      
      const recordScope = definitionRecord.scope || 0;
      const recordData = recordScope === 1 ? characterRecords && characterRecords[characterId].records[definitionRecord.hash] : profileRecords && profileRecords[definitionRecord.hash];

      // if (definitionRecord.intervalInfo.intervalObjectives.length)

      // console.log(recordData);

      const recordState = {
        distance: 0,
        score: {
          value: 0,
          progress: 0,
          next: 0
        },
        objectives: [],
        intervals: [],
        intervalEl: null
      };

      if (definitionRecord.objectiveHashes) {
        recordState.score = {
          value: definitionRecord.completionInfo.ScoreValue,
          progress: definitionRecord.completionInfo.ScoreValue,
          next: definitionRecord.completionInfo.ScoreValue
        };

        recordState.objectives = definitionRecord.objectiveHashes.map((hash, i) => {
          const data = recordData && recordData.objectives.find(o => o.objectiveHash === hash);

          return {
            ...data,
            score: definitionRecord.completionInfo.ScoreValue,
            el: <ProgressBar key={`${hash}${i}`} {...data} />
          };
        });

        const distance = recordState.objectives.reduce(
          (a, v) => {
            return {
              completionValueDiviser: a.completionValueDiviser += 1,
              progressValueDecimal: (a.progressValueDecimal += Math.min(v.progress / v.completionValue, 1) || 0)
            };
          },
          {
            completionValueDiviser: 0,
            progressValueDecimal: 0
          }
        );

        recordState.distance = distance.progressValueDecimal / distance.completionValueDiviser;
      }

      if (definitionRecord.intervalInfo?.intervalObjectives?.length) {
        recordState.intervals = definitionRecord.intervalInfo.intervalObjectives.map((interval, i) => {
          const definitionInterval = manifest.DestinyObjectiveDefinition[interval.intervalObjectiveHash];
          const data = (recordData && recordData.intervalObjectives.find(o => o.objectiveHash === interval.intervalObjectiveHash)) || {};
          const unredeemed = i + 1 > recordData.intervalsRedeemedCount && data.complete;

          return {
            objectiveHash: definitionInterval.hash,
            completionValue: definitionInterval.completionValue,
            progress: 0,
            ...data,
            unredeemed,
            score: interval.intervalScoreValue,
            el: <ProgressBar key={definitionInterval.hash} {...data} />
          };
        });

        recordState.score = {
          value: definitionRecord.intervalInfo.intervalObjectives.reduce((a, v) => {
            return a + (v.intervalScoreValue || 0);
          }, 0),
          progress: definitionRecord.intervalInfo.intervalObjectives.reduce((a, v, i) => {
            if (recordData && recordData.intervalsRedeemedCount > i) {
              return a + (v.intervalScoreValue || 0);
            } else {
              return a;
            }
          }, 0),
          next: (recordData && definitionRecord.intervalInfo.intervalObjectives[recordData.intervalsRedeemedCount] && definitionRecord.intervalInfo.intervalObjectives[recordData.intervalsRedeemedCount].intervalScoreValue) || 0
        };

        recordState.objectives = [...recordState.intervals.slice(-1)];
        
        const nextIncomplete = recordData && recordData.intervalObjectives.find(o => !o.complete);

        recordState.distance = nextIncomplete && Math.min(nextIncomplete.progress / nextIncomplete.completionValue, 1);

        const lastInterval = recordState.intervals[recordState.intervals.length - 1];

        recordState.intervalEl = (
          <div className='progress-bar intervals'>
            {/* <div className={cx('check', { ed: lastInterval.completionValue && lastInterval.complete })} /> */}
            <div className='bar full'>
              <div className='text'>
                <div className='description'>{lastInterval.objectiveHash && manifest.DestinyObjectiveDefinition[lastInterval.objectiveHash] && manifest.DestinyObjectiveDefinition[lastInterval.objectiveHash].progressDescription}</div>
                {lastInterval.completionValue ? (
                  <div className='fraction'>
                    {displayValue(lastInterval.progress)}/{displayValue(lastInterval.completionValue)}
                  </div>
                ) : null}
              </div>
              <div className='bars'>
                {recordState.intervals.map((int, i) => {
                  const prevInt = recordState.intervals[Math.max(i - 1, 0)];

                  if (int.complete) {
                    return (
                      <div key={i} className={cx('bar', { completed: int.complete, unredeemed: int.unredeemed })}>
                        <div className='fill' style={{ width: `${(int.progress / int.completionValue) * 100}%` }} />
                      </div>
                    );
                  } else if (int.complete && !int.unredeemed) {
                    return (
                      <div key={i} className={cx('bar', { completed: int.complete, unredeemed: int.unredeemed })}>
                        <div className='fill' style={{ width: `${(int.progress / int.completionValue) * 100}%` }} />
                      </div>
                    );
                  } else if (prevInt && prevInt.complete) {
                    return (
                      <div key={i} className={cx('bar', { completed: int.complete, unredeemed: int.unredeemed })}>
                        <div className='fill' style={{ width: `${((int.progress - prevInt.completionValue) / (int.completionValue - prevInt.completionValue)) * 100}%` }} />
                      </div>
                    );
                  } else if (i === 0) {
                    return (
                      <div key={i} className={cx('bar', { completed: int.complete, unredeemed: int.unredeemed })}>
                        <div className='fill' style={{ width: `${(int.progress / int.completionValue) * 100}%` }} />
                      </div>
                    );
                  } else {
                    return <div key={i} className={cx('bar', { completed: int.complete, unredeemed: int.unredeemed })} />;
                  }
                })}
              </div>
            </div>
          </div>
        );
      }

      const enumerableState = recordData && Number.isInteger(recordData.state) ? recordData.state : 4;
      const enumeratedState = enumerateRecordState(enumerableState);

      if (!forceDisplay && collectibles.hideInvisibleRecords && (enumeratedState.invisible || enumeratedState.obscured)) {
        return;
      }

      if (!forceDisplay && collectibles.hideCompletedRecords && enumeratedState.recordRedeemed) {
        return;
      }

      const ref = highlight === definitionRecord.hash ? this.scrollToRecordRef : null;

      if (definitionRecord.redacted) {
        recordsOutput.push({
          completed: enumeratedState.recordRedeemed,
          progressDistance: recordState.distance,
          hash: definitionRecord.hash,
          element: (
            <li
              key={h}
              ref={ref}
              className={cx('redacted', {
                highlight: highlight && highlight === definitionRecord.hash
              })}
            >
              <div className='properties'>
                <div className='icon'>
                  <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${manifest.settings.destiny2CoreSettings.undiscoveredCollectibleImage}`} />
                </div>
                <div className='text'>
                  <div className='name'>{t('Classified record')}</div>
                  <div className='description'>{t('This record is classified and may be revealed at a later time.')}</div>
                </div>
              </div>
            </li>
          )
        });
      } else {
        const isCollectionBadge = associationsCollectionsBadges.find(badge => badge.recordHash === definitionRecord.hash);

        const link = this.makeLink(hash, isCollectionBadge);

        const rewards = definitionRecord.rewardItems
          ?.map(r => {
            let definitionItem = manifest.DestinyInventoryItemDefinition[r.itemHash];
            let definitionCollectible = definitionItem.collectibleHash ? manifest.DestinyCollectibleDefinition[definitionItem.collectibleHash] : false;

            if (definitionCollectible && !definitionCollectible.redacted) {
              return definitionCollectible.hash;
            } else {
              return false;
            }
          })
          .filter(r => r);
        
        const description = recordDescription(definitionRecord.hash);

        recordsOutput.push({
          completed: enumeratedState.recordRedeemed,
          progressDistance: recordState.distance,
          hash: definitionRecord.hash,
          element: (
            <li
              key={h}
              ref={ref}
              className={cx({
                linked: Boolean(link),
                highlight: highlight && highlight === definitionRecord.hash,
                completed: enumeratedState.recordRedeemed,
                unredeemed: !enumeratedState.recordRedeemed && !enumeratedState.objectiveNotCompleted,
                tracked: tracked.concat(profileRecordsTracked).includes(definitionRecord.hash) && !enumeratedState.recordRedeemed && enumeratedState.objectiveNotCompleted,
                'no-description': !description,
                'has-intervals': recordState.intervals.length
              })}
            >
              {!enumeratedState.recordRedeemed && enumeratedState.objectiveNotCompleted && !profileRecordsTracked.includes(definitionRecord.hash) ? (
                <div className='track' onClick={this.handler_toggleTrack} data-hash={definitionRecord.hash}>
                  <Common.Tracking />
                </div>
              ) : null}
              <div className='properties'>
                <div className='icon'>
                  <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${definitionRecord.displayProperties.icon || manifest.settings.destiny2CoreSettings.undiscoveredCollectibleImage}`} />
                </div>
                <div className='text'>
                  <div className='name'>{definitionRecord.displayProperties.name}</div>
                  <div className='meta'>
                    {manifest.statistics.triumphs ? (
                      <div className='commonality tooltip' data-hash='commonality' data-type='braytech' data-related={definitionRecord.hash}>
                        {commonality(manifest.statistics.triumphs[definitionRecord.hash]).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%
                      </div>
                    ) : null}
                    {recordState.intervals.length && recordState.intervals.filter(i => i.complete).length !== recordState.intervals.length ? (
                      <div className='intervals tooltip' data-hash='record_intervals' data-type='braytech'>
                        {t('{{a}} of {{b}}', { a: recordState.intervals.filter(i => i.complete).length, b: recordState.intervals.length })}
                      </div>
                    ) : null}
                    {recordState.score.value !== 0 ? (
                      <div className='score tooltip' data-hash='score' data-type='braytech'>
                        {recordState.intervals.length && recordState.score.progress !== recordState.score.value ? `${recordState.score.next}/${recordState.score.value}` : recordState.score.value}
                      </div>
                    ) : null}
                  </div>
                  <div className='description'>{description}</div>
                </div>
              </div>
              <div className='objectives'>{recordState.intervals.length ? recordState.intervalEl : recordState.objectives.map(e => e.el)}</div>
              {rewards && rewards.length ? (
                <ul className='list rewards collection-items'>
                  <Collectibles forceDisplay selfLinkFrom={paths.removeMemberIds(this.props.location.pathname)} hashes={rewards} />
                </ul>
              ) : null}
              {link ? !selfLinkFrom && readLink ? <Link to={link} /> : <ProfileLink to={link} /> : null}
            </li>
          )
        });
      }
    });

    if (recordsRequested.length > 0 && recordsOutput.length === 0 && collectibles && collectibles.hideCompletedRecords && !forceDisplay) {
      recordsOutput.push({
        element: (
          <li key='lol' className='all-completed'>
            <div className='properties'>
              <div className='text'>{t('All completed')}</div>
            </div>
          </li>
        )
      });
    }

    if (ordered === 'progress') {
      recordsOutput = orderBy(recordsOutput, [item => item.progressDistance], ['desc']);
    } else if (ordered) {
      recordsOutput = orderBy(recordsOutput, [item => item.completed], ['asc']);
    } else {
    }

    if (limit) {
      recordsOutput = recordsOutput.slice(0, limit);
    }

    return recordsOutput.map(obj => obj.element);
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    triumphs: state.triumphs,
    collectibles: state.collectibles
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setTrackedTriumphs: value => {
      dispatch({ type: 'SET_TRACKED_TRIUMPHS', payload: value });
    }
  };
}

Records = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withTranslation()
)(Records);

export { Records, selfLinkRecord, unredeemedRecords, recordDescription };

export default Records;
