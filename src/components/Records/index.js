import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { orderBy } from 'lodash';
import cx from 'classnames';

import { t } from '../../utils/i18n';
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

  root.children.presentationNodes.forEach((primary) => {
    const definitionPrimaryNode = manifest.DestinyPresentationNodeDefinition[primary.presentationNodeHash];

    definitionPrimaryNode.children.presentationNodes.forEach((secondary) => {
      const definitionSecondaryNode = manifest.DestinyPresentationNodeDefinition[secondary.presentationNodeHash];

      definitionSecondaryNode.children.presentationNodes.forEach((tertiary) => {
        const definitionTertiaryNode = manifest.DestinyPresentationNodeDefinition[tertiary.presentationNodeHash];

        if (definitionTertiaryNode.children.records.length) {
          const record = definitionTertiaryNode.children.records.find((record) => record.recordHash === hash);

          if (record) {
            link.push(definitionPrimaryNode.hash, definitionSecondaryNode.hash, definitionTertiaryNode.hash, record.recordHash);
          }
        } else {
          definitionTertiaryNode.children.presentationNodes.forEach((quaternary) => {
            const definitionQuaternaryNode = manifest.DestinyPresentationNodeDefinition[quaternary.presentationNodeHash];

            if (definitionQuaternaryNode.children.records.length) {
              const record = definitionQuaternaryNode.children.records.find((record) => record.recordHash === hash);

              if (record) {
                link.push(definitionPrimaryNode.hash, definitionSecondaryNode.hash, definitionTertiaryNode.hash, definitionQuaternaryNode.hash, record.recordHash);
              }
            }
          });
        }
      });
    });
  });

  if (link.length === 1) {
    seals.children.presentationNodes.forEach((primary) => {
      const definitionPrimaryNode = manifest.DestinyPresentationNodeDefinition[primary.presentationNodeHash];

      if (definitionPrimaryNode.completionRecordHash === hash) {
        link.push('seal', definitionPrimaryNode.hash);

        return;
      }

      if (definitionPrimaryNode.children.records.length) {
        const record = definitionPrimaryNode.children.records.find((record) => record.recordHash === hash);

        if (record) {
          link.push('seal', definitionPrimaryNode.hash, record.recordHash);
        }
      }
    });
  }

  return link.join('/');
}

function selfLinkRead(hash) {
  const definitionRecord = manifest.DestinyRecordDefinition[hash];

  if (definitionRecord?.loreHash) {
    return `/read/record/${definitionRecord.hash}`;
  } else if (definitionRecord) {
    const parentNodes = definitionRecord.parentNodeHashes.filter((hash) => hash !== 2693736750);

    if (parentNodes.length === 1) {
      return `/read/book/${parentNodes[0]}`;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

function unredeemedRecords(member) {
  const characterRecords = member.data?.profile.characterRecords.data;
  const profileRecords = member.data?.profile.profileRecords.data.records;

  const records = [];

  const merged = {
    ...profileRecords,
    ...characterRecords[member.characterId].records,
  };

  Object.entries(merged).forEach(([key, record]) => {
    const definitionRecord = manifest.DestinyRecordDefinition[key];

    if (!definitionRecord || definitionRecord.redacted) {
      return;
    }

    if (definitionRecord.parentNodeHashes?.length && !enumerateRecordState(record.state).invisible && !enumerateRecordState(record.state).objectiveNotCompleted && !enumerateRecordState(record.state).recordRedeemed) {
      // temporary fix for https://github.com/Bungie-net/api/issues/1167
      // check to see if belongs to transitory expired seal || is undying seal child
      const definitionParent = definitionRecord.parentNodeHashes?.length && manifest.DestinyPresentationNodeDefinition[definitionRecord.parentNodeHashes[0]];
      const parentCompletionRecordData = definitionParent && definitionParent.completionRecordHash && definitionParent.scope === 1 ? characterRecords[member.characterId].records[definitionParent.completionRecordHash] : profileRecords[definitionParent.completionRecordHash];

      if (definitionParent.hash === 3303651244 || (parentCompletionRecordData && enumerateRecordState(parentCompletionRecordData.state).rewardUnavailable && enumerateRecordState(parentCompletionRecordData.state).objectiveNotCompleted) || (parentCompletionRecordData && enumerateRecordState(parentCompletionRecordData).invisible)) {
        return;
      } else {
        const scoreValue = record.intervalObjectives
          ? record.intervalObjectives
              .filter((interval) => interval.complete)
              .reduce((sum, interval) => {
                const scoreValue = definitionRecord.intervalInfo.intervalObjectives.find((objective) => objective.intervalObjectiveHash === interval.objectiveHash)?.intervalScoreValue || 0;

                return sum + scoreValue;
              }, 0)
          : record.scoreValue || 0;

        records.push({
          recordHash: definitionRecord.hash,
          scoreValue,
        });
      }
    }
  });

  return records;
}

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
        top: this.scrollToRecordRef.current.offsetTop + this.scrollToRecordRef.current.offsetHeight / 2 - window.innerHeight / 2,
      });
    }
  }

  handler_toggleTrack = (e) => {
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
    const triumphsPathname = selfLinkRecord(hash);
    const collectionsPathname = `/collections/badge/${isCollectionBadge?.badgeHash}`;
    const readPathname = selfLinkRead(hash);

    if (this.props.readLink) {
      return {
        pathname: !this.props.selfLinkFrom ? readPathname : triumphsPathname,
        state: {
          from: this.props.location.pathname,
        },
      };
    } else if (!this.props.selfLinkFrom && isCollectionBadge) {
      return {
        pathname: collectionsPathname,
        state: {
          from: paths.removeMemberIds(this.props.location.pathname),
        },
      };
    } else if (this.props.selfLinkFrom) {
      return {
        pathname: triumphsPathname,
        state: {
          from: this.props.selfLinkFrom,
        },
      };
    } else {
      return false;
    }
  };

  render() {
    const { hashes, member, triumphs, collectibles, ordered, limit, selfLinkFrom, readLink, forceDisplay = false } = this.props;
    const highlight = +this.props.highlight || false;
    const recordsRequested = hashes;
    const characterId = member.characterId;
    const characterRecords = member.data?.profile.characterRecords.data;
    const profileRecords = member.data?.profile.profileRecords.data.records;
    const profileRecordsTracked = member.data?.profile.profileRecords.data.trackedRecordHash ? [member.data.profile.profileRecords.data.trackedRecordHash] : [];
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
          next: 0,
        },
        objectives: [],
        intervals: [],
        intervalEl: null,
      };

      if (definitionRecord.objectiveHashes) {
        recordState.score = {
          value: definitionRecord.completionInfo.ScoreValue,
          progress: definitionRecord.completionInfo.ScoreValue,
          next: definitionRecord.completionInfo.ScoreValue,
        };

        recordState.objectives = definitionRecord.objectiveHashes.map((hash, i) => {
          const data = recordData && recordData.objectives.find((o) => o.objectiveHash === hash);

          return {
            ...data,
            score: definitionRecord.completionInfo.ScoreValue,
            el: <ProgressBar key={`${hash}${i}`} {...data} />,
          };
        });

        const distance = recordState.objectives.reduce(
          (a, v) => {
            return {
              completionValueDiviser: (a.completionValueDiviser += 1),
              progressValueDecimal: (a.progressValueDecimal += Math.min(v.progress / v.completionValue, 1) || 0),
            };
          },
          {
            completionValueDiviser: 0,
            progressValueDecimal: 0,
          }
        );

        recordState.distance = distance.progressValueDecimal / distance.completionValueDiviser;
      }

      if (definitionRecord.intervalInfo?.intervalObjectives?.length) {
        recordState.intervals = definitionRecord.intervalInfo.intervalObjectives.map((interval, i) => {
          const definitionInterval = manifest.DestinyObjectiveDefinition[interval.intervalObjectiveHash];
          const data = (recordData && recordData.intervalObjectives.find((o) => o.objectiveHash === interval.intervalObjectiveHash)) || {};
          const unredeemed = i + 1 > recordData.intervalsRedeemedCount && data.complete;

          return {
            objectiveHash: definitionInterval.hash,
            completionValue: definitionInterval.completionValue,
            progress: 0,
            ...data,
            unredeemed,
            score: interval.intervalScoreValue,
            el: <ProgressBar key={definitionInterval.hash} {...data} />,
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
          next: (recordData && definitionRecord.intervalInfo.intervalObjectives[recordData.intervalsRedeemedCount] && definitionRecord.intervalInfo.intervalObjectives[recordData.intervalsRedeemedCount].intervalScoreValue) || 0,
        };

        const nextIndex = recordData.intervalObjectives.findIndex((o) => !o.complete);
        const lastIndex = nextIndex - 1 || 0;
        const lastInterval = recordData.intervalObjectives[recordData.intervalObjectives.length - 1];

        if (!recordData.intervalObjectives[nextIndex]) return;

        const progress = lastIndex > -1 ? recordData.intervalObjectives[nextIndex].progress - recordData.intervalObjectives[lastIndex].completionValue : recordData.intervalObjectives[nextIndex].progress;
        const completionValue = lastIndex > -1 ? recordData.intervalObjectives[nextIndex].completionValue - recordData.intervalObjectives[lastIndex].completionValue : recordData.intervalObjectives[nextIndex].completionValue;

        const completionValueDiviser = 1;
        const progressValueDecimal = Math.min(progress / completionValue, 1);

        recordState.distance = progressValueDecimal / completionValueDiviser;

        recordState.intervalEl = (
          <div className='progress-bar intervals'>
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
                highlight: highlight && highlight === definitionRecord.hash,
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
          ),
        });
      } else {
        const isCollectionBadge = associationsCollectionsBadges.find((badge) => badge.recordHash === definitionRecord.hash);

        const link = this.makeLink(hash, isCollectionBadge);

        const rewards = definitionRecord.rewardItems
          ?.map((r) => {
            let definitionItem = manifest.DestinyInventoryItemDefinition[r.itemHash];
            let definitionCollectible = definitionItem.collectibleHash ? manifest.DestinyCollectibleDefinition[definitionItem.collectibleHash] : false;

            if (definitionCollectible && !definitionCollectible.redacted) {
              return definitionCollectible.hash;
            } else {
              return false;
            }
          })
          .filter((r) => r);

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
                'has-intervals': recordState.intervals.length,
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
                    {recordState.intervals.length && recordState.intervals.filter((i) => i.complete).length !== recordState.intervals.length ? (
                      <div className='intervals tooltip' data-hash='record_intervals' data-type='braytech'>
                        {t('{{a}} of {{b}}', { a: recordState.intervals.filter((i) => i.complete).length, b: recordState.intervals.length })}
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
              <div className='objectives'>{recordState.intervals.length ? recordState.intervalEl : recordState.objectives.map((e) => e.el)}</div>
              {rewards && rewards.length ? (
                <ul className='list rewards collection-items'>
                  <Collectibles forceDisplay selfLinkFrom={paths.removeMemberIds(this.props.location.pathname)} hashes={rewards} />
                </ul>
              ) : null}
              {link ? !selfLinkFrom && readLink ? <Link to={link} /> : <ProfileLink to={link} /> : null}
            </li>
          ),
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
        ),
      });
    }

    if (ordered === 'progress') {
      recordsOutput = orderBy(recordsOutput, [(item) => item.progressDistance], ['desc']);
    } else if (ordered) {
      recordsOutput = orderBy(recordsOutput, [(item) => item.completed], ['asc']);
    } else {
    }

    if (limit) {
      recordsOutput = recordsOutput.slice(0, limit);
    }

    return recordsOutput.map((obj) => obj.element);
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    triumphs: state.triumphs,
    collectibles: state.collectibles,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setTrackedTriumphs: (value) => {
      dispatch({ type: 'SET_TRACKED_TRIUMPHS', payload: value });
    },
  };
}

Records = compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(Records);

export { Records, selfLinkRecord, unredeemedRecords, recordDescription };

export default Records;
