import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { cloneDeep } from 'lodash';
import cx from 'classnames';

import { t, BungieText } from '../../utils/i18n';
import manifest from '../../utils/manifest';
import { stepsWithRecords, rewardsQuestLineOverrides, rewardsQuestLineOverridesShadowkeep, setDataQuestLineOverrides } from '../../data/questLines';
import { removeMemberIds } from '../../utils/paths';
import Records from '../Records/';
import Items from '../Items';
import ProgressBar from '../UI/ProgressBar';
import { Views } from '../../svg';

import './styles.css';

function questTrait(hash) {
  const definitionItem = manifest.DestinyInventoryItemDefinition[hash];

  if (!definitionItem) return 'all';

  if (definitionItem.traitIds?.indexOf('quest.new_light') > -1) {
    return 'new-light';
  } else if (definitionItem.traitIds?.indexOf('quest.current_release') > -1) {
    return 'expansion';
  } else if (definitionItem.traitIds?.indexOf('quest.seasonal') > -1) {
    return 'seasonal';
  } else if (definitionItem.traitIds?.indexOf('quest.playlists') > -1) {
    return 'playlists';
  } else if (definitionItem.traitIds?.indexOf('quest.exotic') > -1) {
    return 'exotics';
  } else if (definitionItem.traitIds?.indexOf('quest.past') > -1) {
    return 'past';
  } else {
    return 'all';
  }
}

const questFilterMap = {
  bounties: {
    displayProperties: {
      name: t('Bounties'),
      icon: <Views.Quests.Bounties />,
    },
  },
  all: {
    displayProperties: {
      name: t('All quests'),
      description: t('All quests and related items in your inventory'),
      icon: <Views.Quests.All />,
    },
  },
  'new-light': {
    displayProperties: {
      name: t('New Light'),
      description: t('Quests related to New Light, tutorials, and introductions'),
      icon: <Views.Quests.NewLight />,
    },
  },
  seasonal: {
    displayProperties: {
      name: t('Seasonal'),
      description: t('Quests from the current season'),
      icon: <Views.Quests.Seasonal />,
    },
    preview: '/static/images/extracts/ui/quests/01E3-06C0.png',
  },
  expansion: {
    displayProperties: {
      name: t('Shadowkeep'),
      description: t('Quests from the latest expansion'),
      icon: <Views.Quests.Expansion />,
    },
    preview: '/static/images/extracts/ui/quests/01E3-06CA.png',
  },
  playlists: {
    displayProperties: {
      name: t('Playlists'),
      description: t('Vanguard, Crucible, and Gambit quests'),
      icon: <Views.Quests.Playlists />,
    },
    preview: '/static/images/extracts/ui/quests/01E3-06D3.png',
  },
  exotics: {
    displayProperties: {
      name: t('Exotics'),
      description: t('Exotic Gear and Catalyst quests'),
      icon: <Views.Quests.Exotics />,
    },
    preview: '/static/images/extracts/ui/quests/01E3-06C5.png',
  },
  past: {
    displayProperties: {
      name: t('The Past'),
      description: t('Quests from past expansions'),
      icon: <Views.Quests.Past />,
    },
    preview: '/static/images/extracts/ui/quests/01E3-06BB.png',
  },
};

function getSetDataQuestLine(questLine) {
  let setData = (questLine.setData?.itemList?.length && questLine.setData.itemList) || [];

  if (setDataQuestLineOverrides[questLine.hash]) setData = setDataQuestLineOverrides[questLine.hash];

  return setData;
}

export function getRewardsQuestLine(questLine, classType) {
  let rewards = (questLine.value?.itemValue?.length && questLine.value.itemValue.filter((v) => v.itemHash !== 0 && ((manifest.DestinyInventoryItemDefinition[v.itemHash].classType < 3 && manifest.DestinyInventoryItemDefinition[v.itemHash].classType === classType) || manifest.DestinyInventoryItemDefinition[v.itemHash].classType > 2 || manifest.DestinyInventoryItemDefinition[v.itemHash].classType === undefined))) || [];

  if (rewardsQuestLineOverrides[questLine.hash]) rewards = rewardsQuestLineOverrides[questLine.hash];

  const setData = getSetDataQuestLine(questLine);
  const rewardsShadowkeep = setData && rewardsQuestLineOverridesShadowkeep.find((s) => setData.find((d) => d.itemHash === s.itemHash));

  if (rewardsShadowkeep) rewards = rewardsShadowkeep.rewards;

  return rewards;
}

class QuestLine extends React.Component {
  render() {
    const { member, item } = this.props;
    const characters = member.data.profile.characters.data;
    const character = characters.find((c) => c.characterId === member.characterId);
    const itemComponents = member.data.profile.itemComponents;
    const characterUninstancedItemComponents = member.data.profile.characterUninstancedItemComponents[member.characterId].objectives.data;

    const definitionItem = manifest.DestinyInventoryItemDefinition[manifest.DestinyInventoryItemDefinition[item.itemHash]?.objectives?.questlineItemHash] || manifest.DestinyInventoryItemDefinition[item.itemHash];

    if (definitionItem) {
      const questLine = cloneDeep(definitionItem);

      const setData = getSetDataQuestLine(questLine);

      let assumeCompleted = true;
      const steps =
        setData &&
        setData.length &&
        setData.map((s, i) => {
          s.i = i + 1;
          s.definitionStep = manifest.DestinyInventoryItemDefinition[s.itemHash];
          s.completed = assumeCompleted;

          if (s.itemHash === item.itemHash || setData.length === 1) {
            assumeCompleted = false;
            s.completed = false;
            s.active = true;
            s.itemInstanceId = item.itemInstanceId || null;
          }

          let progressData = item.itemInstanceId && itemComponents.objectives.data[item.itemInstanceId] ? itemComponents.objectives.data[item.itemInstanceId].objectives : characterUninstancedItemComponents && characterUninstancedItemComponents[item.itemHash] ? characterUninstancedItemComponents[item.itemHash].objectives : false;

          let stepMatch = false;
          if (progressData && s.definitionStep.objectives && s.definitionStep.objectives.objectiveHashes.length === progressData.length) {
            progressData.forEach((o) => {
              if (s.definitionStep.objectives.objectiveHashes.includes(o.objectiveHash)) {
                stepMatch = true;
              } else {
                stepMatch = false;
              }
            });
          }

          if (stepMatch) {
            s.progress = progressData;
          } else if (assumeCompleted && s.definitionStep.objectives && s.definitionStep.objectives.objectiveHashes.length) {
            s.progress = s.definitionStep.objectives.objectiveHashes.map((o) => {
              let definitionObjective = manifest.DestinyObjectiveDefinition[o];

              return {
                complete: true,
                progress: definitionObjective.completionValue,
                completionValue: definitionObjective.completionValue,
                objectiveHash: definitionObjective.hash,
              };
            });
          } else {
            s.progress = [];
          }

          return s;
        });

      const questLineName = (questLine.setData?.questLineName && questLine.setData.questLineName !== '' && questLine.setData.questLineName) || questLine.displayProperties.name;

      const questLineDescription = questLine.displaySource && questLine.displaySource !== '' ? questLine.displaySource : questLine.displayProperties.description && questLine.displayProperties.description !== '' ? questLine.displayProperties.description : steps[0].definitionStep.displayProperties.description;
      
      const questLineSource = questLine.sourceData && questLine.sourceData.vendorSources && questLine.sourceData.vendorSources.length ? questLine.sourceData.vendorSources : steps && steps.length && steps[0].definitionStep.sourceData && steps[0].definitionStep.sourceData.vendorSources && steps[0].definitionStep.sourceData.vendorSources.length ? steps[0].definitionStep.sourceData.vendorSources : false;

      const rewardsQuestLine = getRewardsQuestLine(questLine, character.classType);
      const rewardsQuestStep = (steps && steps.length && steps.filter((s) => s.active) && steps.filter((s) => s.active).length && steps.filter((s) => s.active)[0].definitionStep && steps.filter((s) => s.active)[0].definitionStep.value && steps.filter((s) => s.active)[0].definitionStep.value.itemValue && steps.filter((s) => s.active)[0].definitionStep.value.itemValue.length && steps.filter((s) => s.active)[0].definitionStep.value.itemValue.filter((v) => v.itemHash !== 0)) || [];

      return (
        <div className='quest-line'>
          <div className='module'>
            <div className='summary'>
              <div className='icon'>{questFilterMap[questTrait(definitionItem.hash)].displayProperties.icon}</div>
              <div className='text'>
                <div className='name'>{questLineName}</div>
                <BungieText className='displaySource' value={questLineDescription} />
                {rewardsQuestLine.length ? (
                  <>
                    <h4>{t('Rewards')}</h4>
                    <ul className='list inventory-items'>
                      <Items items={rewardsQuestLine} />
                    </ul>
                  </>
                ) : null}
                {questLineSource ? (
                  <>
                    <h4>{t('Source')}</h4>
                    <div className='sources'>
                      {questLineSource.map((s) => {
                        if (s.vendorHash) {
                          let definitionVendor = manifest.DestinyVendorDefinition[s.vendorHash];
                          let definitionFaction = definitionVendor && definitionVendor.factionHash ? manifest.DestinyFactionDefinition[definitionVendor.factionHash] : false;

                          return (
                            <div key={s.vendorHash} className='vendor tooltip' data-hash={s.vendorHash} data-type='vendor'>
                              <div className='name'>{definitionVendor.displayProperties.name}</div>
                              {definitionFaction ? <div className='faction'>{definitionFaction.displayProperties.name}</div> : null}
                            </div>
                          );
                        } else {
                          return null;
                        }
                      })}
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </div>
          <div className='module'>
            {steps ? (
              <>
                <h4>{t('Steps')}</h4>
                <div className='steps'>
                  {steps &&
                    steps.length &&
                    steps.map((s) => {
                      let objectives = [];
                      s.definitionStep &&
                        s.definitionStep.objectives &&
                        s.definitionStep.objectives.objectiveHashes.forEach((element) => {
                          let definitionObjective = manifest.DestinyObjectiveDefinition[element];

                          let progress = {
                            complete: false,
                            progress: 0,
                            completionValue: definitionObjective.completionValue,
                            objectiveHash: definitionObjective.hash,
                            ...s.progress.find((o) => o.objectiveHash === definitionObjective.hash),
                          };

                          let relatedRecords = stepsWithRecords.filter((r) => r.objectiveHash === definitionObjective.hash).map((r) => r.recordHash);

                          objectives.push(
                            <React.Fragment key={definitionObjective.hash}>
                              <ProgressBar {...progress} />
                              {relatedRecords && relatedRecords.length ? (
                                <ul className='list record-items'>
                                  <Records selfLinkFrom={removeMemberIds(this.props.location.pathname)} showCompleted hashes={relatedRecords} />
                                </ul>
                              ) : null}
                            </React.Fragment>
                          );
                        });

                      const descriptionStep = s.definitionStep.displayProperties.description && s.definitionStep.displayProperties.description !== '' ? s.definitionStep.displayProperties.description : false;

                      return (
                        <div key={s.itemHash} className={cx('step', { completed: s.completed })}>
                          <div className='header'>
                            <div className='number'>{s.i}</div>
                            <div className='name'>{s.definitionStep.displayProperties.name}</div>
                          </div>
                          {descriptionStep ? <BungieText className='description' value={descriptionStep} /> : null}
                          {objectives.length ? <div className='objectives'>{objectives}</div> : null}
                        </div>
                      );
                    })}
                </div>
              </>
            ) : null}
          </div>
        </div>
      );
    }

    return null;
  }
}

function mapStateToProps(state) {
  return {
    member: state.member,
  };
}

QuestLine = compose(connect(mapStateToProps), withRouter)(QuestLine);

export { QuestLine, questFilterMap };

export default QuestLine;
