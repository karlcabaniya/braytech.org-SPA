import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import cx from 'classnames';

import { t } from '../../../utils/i18n';
import manifest from '../../../utils/manifest';
import * as enums from '../../../utils/destinyEnums';
import ProgressBar from '../../UI/ProgressBar';
import Button from '../../UI/Button';
import { recallMissions } from '../LunasRecall';

import './styles.css';

const groups = [
  [
    2498962144, // Nightfall: The Ordeal with a team score above 100,000.
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
];

function getOverrides(objectiveHash, activityHash) {
  if (objectiveHash === 3683641566) {
    return {
      name: t('Nightmare Hunts'),
      description: t('Your most feared, devastating, tormenting nightmares reincarnate―be immovable in your resolve, Guardian.'),
    };
  } else if (objectiveHash === 2443315975 || objectiveHash === 2498962144) {
    // Nightfall: The Ordeal
    return {
      description: t('Undertake your most perilous albeit rewarding strikes yet, in the name of the Light, the Vanguard, and The Last City.'),
    };
  } else if (objectiveHash === 1296970487) {
    return {
      name: manifest.DestinyObjectiveDefinition[1296970487]?.displayProperties.name,
      description: t('Retrace your steps and unravel the mystery of the Pyramid.'),
    };
  } else if (objectiveHash === 3118376466 || objectiveHash === 1607758693) {
    // Crucible
    return {
      name: manifest.DestinyPlaceDefinition[4088006058].displayProperties.name,
      description: manifest.DestinyPlaceDefinition[4088006058].displayProperties.description,
    };
  }
}

const isLunasRecall = (activityHash) => recallMissions.indexOf(activityHash) > -1;
const isNightmareHunt = (activityHash) => enums.nightmareHunts.find((n) => n.activities.indexOf(activityHash) > -1);
const isNightfallOrdeal = (activityHash) => Object.values(enums.nightfalls).find((n) => n.ordealHashes.indexOf(activityHash) > -1);
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
  const characterActivities = member.data.profile.characterActivities.data;
  const [state, setState] = useState({ filterRewards: false });

  function handler_togglePinnacleFilter() {
    setState({ filterRewards: !state.filterRewards });
  }

  // console.log(groupBy(characterActivities[member.characterId].availableActivities.filter(a => a.challenges), a => a.challenges[0].objective.objectiveHash))

  const challenges = characterActivities[member.characterId].availableActivities
    .filter((a) => a.challenges)
    .reduce((a, v) => [...a, ...(v.challenges.filter((c) => !a.filter((b) => b.objectiveHash === c.objective.objectiveHash).length).map((c) => c.objective) || [])], [])
    .reduce((a, v) => {
      const group = groups.find((g) => g.indexOf(v.objectiveHash) > -1);

      if (group) {
        const indexOf = a.findIndex((g) => g.objectives.filter((h) => group.indexOf(h.objectiveHash) > -1).length);

        if (indexOf > -1) {
          a[indexOf].objectives = [...a[indexOf].objectives, v];

          // potential to-do: this code only knows how to collate objectives
          // currently, only nightfall: the ordeal has more than one objective and each activity has the same objectives

          return a;
        } else {
          return [
            ...a,
            {
              activityHash: v.activityHash,
              activities: characterActivities[member.characterId].availableActivities
                .filter((a) => a.challenges)
                .filter((a) => a.challenges.filter((o) => o.objective.objectiveHash === v.objectiveHash).length)
                .map((a) => a.activityHash),
              objectives: [v],
            },
          ];
        }
      } else {
        return [
          ...a,
          {
            activityHash: v.activityHash,
            activities: characterActivities[member.characterId].availableActivities
              .filter((a) => a.challenges)
              .filter((a) => a.challenges.filter((o) => o.objective.objectiveHash === v.objectiveHash).length)
              .map((a) => a.activityHash),
            objectives: [v],
          },
        ];
      }
    }, []);

  const challengesCompleted = !challenges.filter((activity) => activity.objectives.filter((objective) => !objective.complete).length).length;
  const challengesFiltered = state.filterRewards
    ? challenges
        // filter for incomplete
        .filter((activity) => activity.objectives.filter((objective) => !objective.complete).length)
        // filter for pinnacles
        .filter((activity) => activity.objectives.filter((objective) => !objective.complete && manifest.DestinyActivityDefinition[objective.activityHash].challenges?.find((challenge) => challenge.objectiveHash === objective.objectiveHash)?.dummyRewards.filter((reward) => reward.itemHash === 73143230).length).length)
    : challenges
        // filter for incomplete
        .filter((activity) => activity.objectives.filter((objective) => !objective.complete).length);
  const rewardsRemaining = challengesFiltered.reduce(
    (rewards, activity) =>
      rewards +
      activity.objectives.filter((objective) =>
        !objective.complete && state.filterRewards
          ? // pinnacles only
            manifest.DestinyActivityDefinition[objective.activityHash].challenges?.find((challenge) => challenge.objectiveHash === objective.objectiveHash)?.dummyRewards.filter((reward) => reward.itemHash === 73143230).length
          : // any rewards
            manifest.DestinyActivityDefinition[objective.activityHash].challenges?.find((challenge) => challenge.objectiveHash === objective.objectiveHash)?.dummyRewards.length
      ).length,
    0
  );

  return (
    <div className='user-module challenges'>
      <div className='sub-header'>
        <div>{t('Challenges')}</div>
      </div>
      <div className='state'>
        <div className={cx('rewards', { pinnacle: !state.filterRewards })}>
          <Button text={state.filterRewards ? t('UserModules.Challenges.ShowAllRewards') : t('UserModules.Challenges.ShowPinnacleRewards')} action={handler_togglePinnacleFilter} />
        </div>
        <div className='info'>{t('UserModules.Challenges.RewardsRemaining', { rewardsRemaining })}</div>
      </div>
      {!challengesCompleted ? (
        <ul>
          {challengesFiltered.map((challenge, i) => {
            const override = getOverrides(challenge.objectives[0]?.objectiveHash, challenge.activityHash);
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
                    <div className='name'>{name}</div>
                    <div className='description'>
                      <p>{description}</p>
                    </div>
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
                    const rewards = manifest.DestinyActivityDefinition[objective.activityHash].challenges?.find((challenge) => challenge.objectiveHash === objective.objectiveHash)?.dummyRewards || [];

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
