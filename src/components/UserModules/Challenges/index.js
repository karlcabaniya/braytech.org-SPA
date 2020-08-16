import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import cx from 'classnames';

import ls from '../../../utils/localStorage';
import { t, BungieText } from '../../../utils/i18n';
import manifest from '../../../utils/manifest';
import actions from '../../../store/actions';
import { nightfalls, nightmareHunts } from '../../../utils/destinyEnums';

import ProgressBar from '../../UI/ProgressBar';
import Button from '../../UI/Button';

import { recallMissions } from '../LunasRecall';

import './styles.css';

const MILESTONE_FLASHPOINT = 463010297;
const MILESTONE_VANGUARD_STRIKES = 1437935813;
const MILESTONE_GAMBIT = 3448738070;
const MILESTONE_BOUNTIES_ZAVALA = 2709491520;
const MILESTONE_BOUNTIES_BANSHEE44 = 3899487295;
const MILESTONE_BOUNTIES_DRIFTER = 3802603984;
const MILESTONE_BOUNTIES_SHAXX = 2594202463;

const milestoneHashes = [
  // MILESTONE_FLASHPOINT,
  // MILESTONE_VANGUARD_STRIKES,
  // MILESTONE_GAMBIT,
  MILESTONE_BOUNTIES_ZAVALA,
  MILESTONE_BOUNTIES_BANSHEE44,
  MILESTONE_BOUNTIES_DRIFTER,
  MILESTONE_BOUNTIES_SHAXX,
];

// groups of objective hashes
const groups = [
  [
    2498962144, // Nightfall: The Ordeal with a team score above 100,000
    2443315975, // Nightfall: The Ordeal activities completion
  ],
  [
    3118376466, // Crucible core playlists
    1607758693, // Crucible Rotator playlists
  ],
  [
    3683641566, // Nightmare Hunt activities completion
    2190387136, // Nightmare Hunt on Master difficulty
  ],
  [
    4140117227, // Vanguard Service (Zavala)
    2338381314, // Vanguard Service (Zavala) - Reward
    1408783815, // Spare Parts (Banshee-44)
    313458118, // Spare Parts (Banshee-44) - Reward
    877997339, // Shady Schemes (The Drifter)
    967175154, // Shady Schemes (The Drifter) - Reward
    565013971, // Live-Fire Exercises (Shaxx)
    4026431786, // Live-Fire Exercises (Shaxx) - Reward
  ],
  [
    2749094865, // European Aerial Zone Bosses
    446326564, // European Aerial Zone Chests
  ],
];

function getOverrides({ objectiveHash, activityHash, milestoneHash, ...rest }) {
  if (milestoneHash === 463010297) {
    // Flashpoint

    return undefined;
  } else if (milestoneHash === MILESTONE_BOUNTIES_ZAVALA || milestoneHash === MILESTONE_BOUNTIES_BANSHEE44 || milestoneHash === MILESTONE_BOUNTIES_DRIFTER) {
    // Flashpoint

    return {
      name: t('UserModules.Challenges.Overrides.VendorBounties.Name'),
      description: t('UserModules.Challenges.Overrides.VendorBounties.Description'),
    };
  } else if (objectiveHash === 3683641566) {
    return {
      name: t('Nightmare Hunts'),
      description: t('UserModules.NightmareHunts.Description'),
    };
  } else if (objectiveHash === 2443315975 || objectiveHash === 2498962144) {
    // Nightfall: The Ordeal
    return {
      description: t('UserModules.Challenges.Overrides.Nightfalls.Description'),
    };
  } else if (objectiveHash === 1296970487) {
    // Luna's Recall
    return {
      name: manifest.DestinyObjectiveDefinition[1296970487]?.displayProperties.name,
      description: t('UserModules.Challenges.Overrides.LunasRecall.Name'),
    };
  } else if (objectiveHash === 3118376466 || objectiveHash === 1607758693) {
    // Crucible
    return {
      name: manifest.DestinyPlaceDefinition[4088006058].displayProperties.name,
      description: manifest.DestinyPlaceDefinition[4088006058].displayProperties.description,
    };
  } else {
    return undefined;
  }
}

const isLunasRecall = (activityHash) => recallMissions.indexOf(activityHash) > -1;
const isNightmareHunt = (activityHash) => nightmareHunts.find((n) => n.activities.indexOf(activityHash) > -1);
const isNightfallOrdeal = (activityHash) => Object.values(nightfalls).find((n) => n.ordealHashes.indexOf(activityHash) > -1);
const isDungeon = (activityHash) => manifest.DestinyActivityDefinition[activityHash]?.activityTypeHash === 608898761;
const isRaid = (activityHash) => manifest.DestinyActivityDefinition[activityHash]?.activityTypeHash === 2043403989;

function getActivities(activities) {
  if (isNightmareHunt(activities[0]) || isNightfallOrdeal(activities[0])) {
    return activities.filter((activityHash) => manifest.DestinyActivityDefinition[activityHash].activityLightLevel > 1000 && manifest.DestinyActivityDefinition[activityHash].activityLightLevel < 1050);
  } else if (isLunasRecall(activities[0]) || isDungeon(activities[0]) || isRaid(activities[0])) {
    return activities;
  } else {
    return [];
  }
}

function Challenges() {
  const member = useSelector((state) => state.member);
  const dispatch = useDispatch();
  const [state, setState] = useState({ filterRewards: ls.get('setting.modules.challenges')?.filterRewards || false });

  useEffect(() => {
    // runs on init for each socket. unsure how to fix cleanly
    dispatch(actions.tooltips.rebind());
  }, [dispatch, state]);

  function handler_togglePinnacleFilter() {
    const change = {
      filterRewards: !state.filterRewards,
    };

    ls.set('setting.modules.challenges', change);
    setState(change);
  }

  const characterActivities = member.data.profile.characterActivities.data;
  const characterProgressions = member.data.profile.characterProgressions.data;

  const objectives =
    // get activities with challenges
    characterActivities[member.characterId].availableActivities
      .filter((a) => a.challenges)
      // reduce the activities list into an array of objective objects
      .reduce((a, v) => [...a, ...(v.challenges.filter((c) => !a.filter((b) => b.objectiveHash === c.objective.objectiveHash).length).map((c) => c.objective) || [])], []);
  // milestone objective objects
  const milestones = milestoneHashes
    .map((milestoneHash) => {
      if (milestoneHash === MILESTONE_VANGUARD_STRIKES) {
        const milestoneActivity = characterProgressions[member.characterId].milestones[milestoneHash]?.activities?.[0] || {};
        const milestoneObjective = milestoneActivity?.challenges?.[0]?.objective || {};

        return {
          ...milestoneActivity,
          ...milestoneObjective,
          milestoneHash,
        };
      } else {
        return {
          ...(characterProgressions[member.characterId].milestones[milestoneHash]?.availableQuests?.[0]?.status?.stepObjectives?.[0] || {}),
          milestoneHash,
        };
      }
    })
    .filter((milestone) => milestone.complete !== undefined);

  // console.log(milestones);

  const challenges = [...milestones, ...objectives].reduce((a, v) => {
    const group = groups.find((g) => g.indexOf(v.objectiveHash) > -1);

    // this objective belongs to a group
    if (group) {
      const indexOf = a.findIndex((g) => g.objectives.filter((h) => group.indexOf(h.objectiveHash) > -1).length);

      if (indexOf > -1) {
        a[indexOf].objectives = [...a[indexOf].objectives, v];

        // potential to-do: this code only knows how to collate objectives
        // currently, only nightfall: the ordeal has more than one objective and each activity has the same objectives

        return a;
      } else {
        const objectives = [v];

        return [
          ...a,
          {
            activityHash: v.activityHash,
            milestoneHash: v.milestoneHash,
            activities: characterActivities[member.characterId].availableActivities
              .filter((a) => a.challenges)
              .filter((a) => a.challenges.filter((o) => o.objective.objectiveHash === v.objectiveHash).length)
              .map((a) => a.activityHash),
            objectives,
            progress: objectives.reduce((sum, value) => sum + value.progress, 0) / objectives.reduce((sum, value) => sum + value.completionValue, 0) || 0,
          },
        ];
      }
    }
    // a lone wolf
    else {
      const objectives = [v];

      return [
        ...a,
        {
          activityHash: v.activityHash,
          milestoneHash: v.milestoneHash,
          activities: characterActivities[member.characterId].availableActivities
            .filter((a) => a.challenges)
            .filter((a) => a.challenges.filter((o) => o.objective.objectiveHash === v.objectiveHash).length)
            .map((a) => a.activityHash),
          objectives,
          progress: objectives.reduce((sum, value) => sum + value.progress, 0) / objectives.reduce((sum, value) => sum + value.completionValue, 0) || 0,
        },
      ];
    }
  }, []);

  // console.log(Object.values(characterProgressions[member.characterId].milestones).map((m) => ({ name: manifest.DestinyMilestoneDefinition[m.milestoneHash].displayProperties.name, ...m })));

  // console.log(challenges);

  const challengesFiltered = state.filterRewards
    ? challenges
        // filter for incomplete
        .filter((activity) => activity.objectives.filter((objective) => !objective.complete).length)
        // filter for pinnacles
        .filter(
          (activity) =>
            activity.objectives.filter((objective) => {
              if (!objective.complete) {
                // this is a milestone
                if (manifest.DestinyMilestoneDefinition[activity.milestoneHash]?.quests) {
                  return manifest.DestinyInventoryItemDefinition[
                    // get questItemHash from first - and probably only - dumb quests object on the milestone definition
                    Object.values(manifest.DestinyMilestoneDefinition[activity.milestoneHash]?.quests)?.[0]?.questItemHash
                  ]?.value?.itemValue?.filter((reward) => reward.itemHash === 73143230).length;
                } else {
                  return manifest.DestinyActivityDefinition[objective.activityHash].challenges?.find((challenge) => challenge.objectiveHash === objective.objectiveHash)?.dummyRewards.filter((reward) => reward.itemHash === 73143230).length;
                }
              }

              return false;
            }).length
        )
    : challenges
        // filter for incomplete
        .filter((activity) => activity.objectives.filter((objective) => !objective.complete).length);
  const rewardsRemaining = challengesFiltered.reduce(
    (rewards, activity) =>
      rewards +
      activity.objectives.filter((objective) => {
        if (!objective.complete) {
          // this is a milestone
          if (manifest.DestinyMilestoneDefinition[activity.milestoneHash]?.quests) {
            // pinnacles only
            if (state.filterRewards) {
              return manifest.DestinyInventoryItemDefinition[
                // get questItemHash from first - and probably only - dumb quests object on the milestone definition
                Object.values(manifest.DestinyMilestoneDefinition[activity.milestoneHash]?.quests)?.[0]?.questItemHash
              ]?.value?.itemValue?.filter((reward) => reward.itemHash === 73143230).length;
            }
            // any rewards
            else {
              return manifest.DestinyInventoryItemDefinition[
                // get questItemHash from first - and probably only - dumb quests object on the milestone definition
                Object.values(manifest.DestinyMilestoneDefinition[activity.milestoneHash]?.quests)?.[0]?.questItemHash
              ]?.value?.itemValue?.filter((reward) => reward.itemHash).length;
            }
          } else {
            // pinnacles only
            if (state.filterRewards) {
              return manifest.DestinyActivityDefinition[objective.activityHash].challenges?.find((challenge) => challenge.objectiveHash === objective.objectiveHash)?.dummyRewards.filter((reward) => reward.itemHash === 73143230).length;
            }
            // any rewards
            else {
              return manifest.DestinyActivityDefinition[objective.activityHash].challenges?.find((challenge) => challenge.objectiveHash === objective.objectiveHash)?.dummyRewards.length;
            }
          }
        }

        return false;
      }).length,
    0
  );

  challengesFiltered.sort((a, b) => b.progress - a.progress);

  return (
    <div className='user-module challenges'>
      <div className='sub-header'>
        <div>{t('Challenges')}</div>
      </div>
      <div className='state'>
        <div className={cx('rewards', { pinnacle: state.filterRewards })}>
          <Button text={state.filterRewards ? t('UserModules.Challenges.ShowPinnacleRewards') : t('UserModules.Challenges.ShowAllRewards')} action={handler_togglePinnacleFilter} />
        </div>
        <div className='remaining'>
          <div className='info'>{t('UserModules.Challenges.RewardsRemaining', { rewardsRemaining })}</div>
        </div>
      </div>
      {rewardsRemaining ? (
        <ul>
          {challengesFiltered.map((challenge, i) => {
            const override = getOverrides({ ...challenge, objectiveHash: challenge.objectives[0]?.objectiveHash });
            const activities = getActivities(challenge.activities);

            const name = override?.name || manifest.DestinyActivityDefinition[challenge.activityHash].originalDisplayProperties?.name || manifest.DestinyActivityDefinition[challenge.activityHash].displayProperties.name;
            const description = override?.description || manifest.DestinyActivityDefinition[challenge.activityHash].originalDisplayProperties?.description || manifest.DestinyActivityDefinition[challenge.activityHash].displayProperties.description;

            const objectives = state.filterRewards
              ? // filter for objectives that reward pinnacle gear
                challenge.objectives.filter((objective) => !objective.complete && manifest.DestinyActivityDefinition[objective.activityHash].challenges?.find((challenge) => challenge.objectiveHash === objective.objectiveHash)?.dummyRewards.filter((reward) => reward.itemHash === 73143230).length)
              : // all incomplete objectives
                challenge.objectives.filter((objective) => !objective.complete);
            return (
              <li key={i}>
                <div className='activity'>
                  <div className='text'>
                    <BungieText className='name' value={name} textOnly />
                    <BungieText className='description' value={description} />
                  </div>
                  {activities.length ? (
                    <>
                      <h4>{t('Available activities')}</h4>
                      <ul className='list activities'>
                        {activities.map((activityHash, a) => {
                          const definitionActivity = manifest.DestinyActivityDefinition[activityHash];

                          const name = isNightfallOrdeal(activityHash) ? definitionActivity.originalDisplayProperties.description : definitionActivity.originalDisplayProperties?.name.replace('Nightmare Hunt: ', '') || definitionActivity.displayProperties.name;

                          return (
                            <li key={a} className='linked tooltip' data-type='activity' data-hash={definitionActivity.hash} data-mode={definitionActivity.directActivityModeHash}>
                              <div className='name'>{name}</div>
                            </li>
                          );
                        })}
                      </ul>
                    </>
                  ) : null}
                </div>
                <div className={cx('challenges', { completed: !objectives.filter((o) => !o.complete).length })}>
                  {objectives.map((objective, o) => {
                    const rewards = manifest.DestinyMilestoneDefinition[challenge.milestoneHash]?.quests
                      ? // this is a milestone
                        manifest.DestinyInventoryItemDefinition[
                          // get questItemHash from first - and probably only - dumb quests object on the milestone definition
                          Object.values(manifest.DestinyMilestoneDefinition[challenge.milestoneHash]?.quests)?.[0]?.questItemHash
                        ]?.value?.itemValue?.filter((reward) => reward.itemHash)
                      : // this is an activity
                        manifest.DestinyActivityDefinition[objective.activityHash].challenges?.find((challenge) => challenge.objectiveHash === objective.objectiveHash)?.dummyRewards || [];

                    return (
                      <div key={o} className={cx('challenge', { completed: objective.complete })}>
                        <div className='objective'>
                          <div className='text'>
                            <p>{manifest.DestinyObjectiveDefinition[objective.objectiveHash].displayProperties.description}</p>
                          </div>
                          <ProgressBar key={o} {...objective} />
                          {/* <p>{objective.objectiveHash}</p> */}
                        </div>
                        {rewards.length ? <div className={cx('rewards', { pinnacle: rewards.filter((reward) => reward.itemHash === 73143230).length })}>{rewards.map((reward) => manifest.DestinyInventoryItemDefinition[reward.itemHash]?.displayProperties.name).join(', ')}</div> : null}
                      </div>
                    );
                  })}
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className='no-challenges'>
          <div className='info'>{t('UserModules.Challenges.NoChallenges')}</div>
        </div>
      )}
    </div>
  );
}

export default Challenges;
