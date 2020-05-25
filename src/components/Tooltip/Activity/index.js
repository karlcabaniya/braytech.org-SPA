import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';

import { t, BungieText } from '../../../utils/i18n';
import manifest from '../../../utils/manifest';
import * as enums from '../../../utils/destinyEnums';
import * as utils from '../../../utils/destinyUtils';
import ObservedImage from '../../ObservedImage';
import { cartographer } from '../../../utils/maps';

import { Tooltips } from '../../../svg';

import './styles.css';

function activityType(hash, modeHash, playlistHash) {
  const definitionActivity = manifest.DestinyActivityDefinition[hash];
  const definitionActivityMode = manifest.DestinyActivityModeDefinition[modeHash];
  const definitionActivityModeParent = manifest.DestinyActivityModeDefinition[definitionActivityMode?.parentHashes?.[0]];
  const definitionActivityPlaylist = manifest.DestinyActivityDefinition[playlistHash];
  const definitionActivityType = manifest.DestinyActivityTypeDefinition[definitionActivityPlaylist?.activityTypeHash];
  const definitionDestination = manifest.DestinyDestinationDefinition[definitionActivity?.destinationHash];
  const definitionPlace = manifest.DestinyPlaceDefinition[definitionActivity?.placeHash];

  const node = cartographer({ key: 'activityHash', value: definitionActivity.hash });
  const definitionBubble = node.bubbleHash && definitionDestination?.bubbles?.find((bubble) => bubble.hash === node.bubbleHash);

  const defaults = {
    name: definitionActivity.selectionScreenDisplayProperties && definitionActivity.selectionScreenDisplayProperties.name ? definitionActivity.selectionScreenDisplayProperties.name : definitionActivity.displayProperties && definitionActivity.displayProperties.name ? definitionActivity.displayProperties.name : t('Unknown'),
    mode: definitionActivityMode && definitionActivityMode.displayProperties && definitionActivityMode.displayProperties.name,
    description: definitionActivity.selectionScreenDisplayProperties && definitionActivity.selectionScreenDisplayProperties.description ? definitionActivity.selectionScreenDisplayProperties.description : definitionActivity.displayProperties && definitionActivity.displayProperties.description ? definitionActivity.displayProperties.description : t('Unknown'),
    destination: [definitionBubble?.displayProperties.name, definitionDestination?.displayProperties.name, definitionPlace?.displayProperties.name] // remove falsey values
      .filter((string) => string)
      // remove duplicate values
      .filter((a, b, self) => self.indexOf(a) === b)
      .join(', '),
    activityLightLevel: definitionActivity.activityLightLevel && definitionActivity.activityLightLevel !== 10 && definitionActivity.activityLightLevel,
    icon: <Tooltips.FastTravel />,
    pgcrImage: definitionActivity.pgcrImage,
    completed: node.completed,
  };

  const activityModeHashes = [...(definitionActivity.activityModeHashes || []), modeHash];

  if (enums.adventures.includes(definitionActivity.hash)) {
    return {
      ...defaults,
      mode: t('Adventure'),
      className: 'adventure',
      icon: <Tooltips.Adventure />,
      pgcrImage: false,
    };
  } else if (enums.ordealHashes.includes(definitionActivity.hash)) { // Nightfall: Ordeals
    const strikeHash = Object.keys(enums.nightfalls).find((k) => enums.nightfalls[k].ordealHashes.includes(definitionActivity.hash));
    const definitionStrke = manifest.DestinyActivityDefinition[strikeHash];

    return {
      ...defaults,
      name: definitionStrke.selectionScreenDisplayProperties.name,
      mode: manifest.DestinyActivityTypeDefinition[2884569138].displayProperties.name,
      description: definitionStrke.displayProperties.description,
      className: 'strike',
      icon: <Tooltips.Strike />,
    };
  } else if (activityModeHashes.includes(2394616003)) { // Strikes
    return {
      ...defaults,
      mode: manifest.DestinyActivityTypeDefinition[2884569138].displayProperties.name,
      className: 'strike',
      icon: <Tooltips.Strike />,
    };
  } else if (definitionActivity.activityTypeHash === 838603889) {
    return {
      ...defaults,
      name: definitionActivityPlaylist?.displayProperties.name || definitionActivity.displayProperties.name || t('Unknown'),
      description: definitionActivityPlaylist?.displayProperties.description || definitionActivity.displayProperties.description || t('Unknown'),
      mode: definitionActivityType?.displayProperties.name || manifest.DestinyActivityTypeDefinition[definitionActivity.activityTypeHash].displayProperties.name,
      activityLightLevel: definitionActivityPlaylist?.activityLightLevel || definitionActivity.activityLightLevel,
      className: 'forge',
      pgcrImage: definitionActivityPlaylist?.pgcrImage || definitionActivity.pgcrImage,
      icon: <Tooltips.ForgeIgnition />,
    };
  } else if (definitionActivity.activityTypeHash === 400075666) {
    return {
      ...defaults,
      destination: definitionDestination?.displayProperties.name,
      mode: false,
      activityLightLevel: definitionActivityPlaylist?.activityLightLevel,
      className: 'menagerie',
      icon: <Tooltips.Menagerie />,
    };
  } else if (activityModeHashes.includes(608898761)) {
    return {
      ...defaults,
      name: definitionActivityPlaylist?.originalDisplayProperties?.name || definitionActivityPlaylist?.displayProperties.name || definitionActivity.displayProperties.name,
      mode: manifest.DestinyActivityTypeDefinition[608898761].displayProperties.name,
      className: 'dungeon',
      icon: <Tooltips.Dungeon />,
    };
  } else if (activityModeHashes.includes(1686739444)) {
    return {
      ...defaults,
      mode: manifest.DestinyActivityTypeDefinition[1686739444].displayProperties.name,
      className: 'story',
      icon: <Tooltips.Story />,
    };
  } else if (activityModeHashes.includes(1164760504)) {
    // Survival, Survival: Freelance
    if (definitionActivityPlaylist?.hash === 135537449 || definitionActivityPlaylist?.hash === 740891329) {
      return {
        ...defaults,
        name: definitionActivityPlaylist?.displayProperties?.name || t('Unknown'),
        mode: manifest.DestinyActivityModeDefinition[1164760504].displayProperties.name,
        description: definitionActivityPlaylist?.displayProperties?.description || t('Unknown'),
        destination: `${definitionActivity.displayProperties.name}, ${definitionActivity.displayProperties.description}`,
        className: 'crucible',
        activityLightLevel: false,
        isCrucible: true,
        hasScore: true,
        icon: <Tooltips.Crucible />,
      };
    } // Trials of Osiris
    else if (definitionActivityPlaylist?.hash === 1166905690) {
      return {
        ...defaults,
        name: definitionActivityPlaylist?.displayProperties?.name || t('Unknown'),
        mode: manifest.DestinyActivityModeDefinition[1164760504].displayProperties.name,
        description: definitionActivityPlaylist?.displayProperties?.description || t('Unknown'),
        destination: `${definitionActivity.displayProperties.name}, ${definitionActivity.displayProperties.description}`,
        className: 'crucible trials-of-osiris',
        activityLightLevel: false,
        isCrucible: true,
        hasScore: true,
        icon: <Tooltips.TrialsOfOsiris />,
      };
    } // Iron Banner
    else if (definitionActivityPlaylist?.hash === 3753505781) {
      return {
        ...defaults,
        name: definitionActivityPlaylist?.displayProperties?.name || t('Unknown'),
        mode: manifest.DestinyActivityModeDefinition[1164760504].displayProperties.name,
        description: definitionActivityPlaylist?.displayProperties?.description || t('Unknown'),
        destination: `${definitionActivity.displayProperties.name}, ${definitionActivity.displayProperties.description}`,
        className: 'crucible iron-banner',
        activityLightLevel: false,
        isCrucible: true,
        hasScore: true,
        icon: <Tooltips.IronBanner />,
      };
    } else {
      return {
        ...defaults,
        name: definitionActivityPlaylist?.displayProperties?.name || t('Unknown'),
        mode: manifest.DestinyActivityModeDefinition[1164760504].displayProperties.name,
        description: definitionActivityPlaylist?.displayProperties?.description || t('Unknown'),
        destination: `${definitionActivity.displayProperties.name}, ${definitionActivity.displayProperties.description}`,
        className: 'crucible',
        activityLightLevel: false,
        isCrucible: true,
        hasScore: true,
        icon: <Tooltips.Crucible />,
      };
    }
  } else if (definitionActivity.activityTypeHash === 2043403989) {
    return {
      ...defaults,
      name: definitionActivity.displayProperties.name,
      description: definitionActivity.displayProperties.description,
      mode: definitionActivityMode?.displayProperties.name || manifest.DestinyActivityModeDefinition[2043403989]?.displayProperties.name,
      className: 'raid',
      icon: <Tooltips.Raid />,
    };
  } else if (activityModeHashes.includes(3894474826)) {
    return {
      ...defaults,
      mode: definitionActivity.originalDisplayProperties?.name,
      description: definitionActivityPlaylist?.displayProperties?.description || t('Unknown'),
      className: 'reckoning',
      icon: <Tooltips.Reckoning />,
    };
  } else if (activityModeHashes.includes(1418469392) || activityModeHashes.includes(1848252830)) {
    return {
      ...defaults,
      name: definitionActivityMode.displayProperties.name,
      mode: definitionActivityModeParent.displayProperties.name,
      description: definitionActivityMode.displayProperties.description,
      destination: `${definitionActivity.displayProperties.name}, ${definitionActivity.displayProperties.description}`,
      className: 'gambit',
      activityLightLevel: false,
      hasScore: definitionActivityMode.hash === 1848252830,
      icon: definitionActivityMode.hash === 1418469392 ? <Tooltips.GambitPrime /> : <Tooltips.Gambit />,
    };
  } else if (definitionActivity.activityTypeHash === 332181804) {
    return {
      ...defaults,
      name: definitionActivity.displayProperties.name,
      mode: manifest.DestinyActivityTypeDefinition[definitionActivity.activityTypeHash].displayProperties.name,
      description: definitionActivity.displayProperties.description,
      suggestion: t('Equip Dreambane armor mods to enhance your light within this activity.'),
      className: 'shadowkeep nightmare-hunt',
      icon: <Tooltips.Shadowkeep />,
    };
  } else if (activityModeHashes.includes(2319502047)) {
    return {
      ...defaults,
      name: definitionActivityPlaylist?.displayProperties.name,
      description: definitionActivityPlaylist?.displayProperties.description,
      mode: manifest.DestinyActivityTypeDefinition[263019149].displayProperties.name,
      className: 'seasonal-arena',
      icon: <Tooltips.SeasonalArena />,
    };
  } // Explore
  else if (activityModeHashes.includes(3497767639)) {
    return {
      ...defaults,
      destination: definitionPlace?.displayProperties.name,
      description: manifest.DestinyActivityTypeDefinition[3497767639].displayProperties.description,
      activityLightLevel: false,
      mode: definitionActivityMode && definitionActivityMode.displayProperties && definitionActivityMode.displayProperties.name,
      pgcrImage: false,
    };
  } // Orbit
  else if (definitionActivity.placeHash === 2961497387) {
    return {
      ...defaults,
      name: manifest.DestinyPlaceDefinition[2961497387].displayProperties.name,
      mode: undefined,
      destination: false,
      description: t('In orbit, planning something terribly heroic.'),
      activityLightLevel: false,
    };
  }

  return defaults;
}

function joinability({ closedReasons, openSlots, privacySetting }, maxParty) {
  const enumeratedClosedReasons = enums.enumerateJoinClosedReasons(closedReasons);

  if (privacySetting > 2) {
    return t('Fireteam closed');
  } else if (enumeratedClosedReasons.inMatchmaking) {
    return t('Matchmaking');
  } else if (enumeratedClosedReasons.soloMode) {
    return t('Single player activity');
  } else if (enumeratedClosedReasons.loading) {
    return t('Match is loading');
  } else if (openSlots < 1 && privacySetting < 2) {
    return t('Fireteam full');
  } else if (openSlots > 0 && privacySetting < 2 && !(enumeratedClosedReasons.disallowedByGameState || enumeratedClosedReasons.internalReasons || enumeratedClosedReasons.offline)) {
    return `${t('Open fireteam')}${maxParty && maxParty > 1 ? ` (${maxParty - openSlots}/${maxParty})` : ''}`;
  }

  return false;
}

function Activity({ member, groupMembers, context, hash, mode, playlist, membershipid }) {
  const definitionActivity = manifest.DestinyActivityDefinition[hash];
  const definitionActivityPlaylist = manifest.DestinyActivityDefinition[playlist];

  if (!definitionActivity) {
    console.warn('Hash not found');

    return null;
  }

  if (definitionActivity.redacted) {
    return (
      <>
        <div className='acrylic' />
        <div className={cx('frame', 'common')}>
          <div className='header'>
            <div className='name'>{t('Classified')}</div>
            <div>
              <div className='kind'>{t('Insufficient clearance')}</div>
            </div>
          </div>
          <div className='black'>
            <div className='description'>
              <pre>{t('Keep it clean.')}</pre>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    const properties = activityType(hash, mode, playlist);

    const matchmakingProperties = definitionActivityPlaylist?.matchmaking || definitionActivity.matchmaking;

    const eligibilityRequirements = member.data?.profile && definitionActivity.eligibilityRequirements && utils.gameVersion(member.data.profile.profile.data.versionsOwned, definitionActivity.eligibilityRequirements.gameVersion);

    const rosterProfile = membershipid && groupMembers?.members?.find((m) => m.destinyUserInfo?.membershipId === membershipid);

    // console.log(rosterProfile?.profile.profileTransitoryData.data);

    const joinabilityString = rosterProfile && rosterProfile.profile.profileTransitoryData.data?.joinability && joinability(rosterProfile.profile.profileTransitoryData.data.joinability, matchmakingProperties?.maxParty);

    return (
      <>
        <div className='acrylic' />
        <div className={cx('frame', 'activity', properties.className)}>
          <div className='header'>
            <div className='icon'>{properties.icon}</div>
            <div className='text'>
              <div className='name'>{properties.name}</div>
              <div>
                <div className='kind'>{properties.mode}</div>
              </div>
            </div>
          </div>
          {eligibilityRequirements && !eligibilityRequirements.eligible ? <div className='highlight major'>{eligibilityRequirements.unlock.text}</div> : null}
          <div className='black'>
            {properties.pgcrImage && properties.pgcrImage !== '/img/theme/destiny/bgs/pgcrs/placeholder.jpg' ? (
              <div className='screenshot'>
                <ObservedImage className='image' src={`https://www.bungie.net${properties.pgcrImage}`} />
              </div>
            ) : null}
            {properties.destination || properties.description ? (
              <div className='description'>
                {properties.destination ? <div className='destination'>{properties.destination}</div> : null}
                <BungieText value={properties.description} />
              </div>
            ) : null}
            {matchmakingProperties && definitionActivity.placeHash !== 2961497387 ? (
              <div className='matchmaking'>
                <ul>
                  {matchmakingProperties.maxParty > 1 ? (
                    <li>
                      {t('Fireteam')}: {t('{{players}} players', { players: matchmakingProperties.minParty < matchmakingProperties.maxParty ? `${matchmakingProperties.minParty}-${matchmakingProperties.maxParty}` : matchmakingProperties.maxParty })}
                    </li>
                  ) : (
                    <>
                      <li>{t('Free for all')}</li>
                      <li>{t('Single player')}</li>
                    </>
                  )}
                  {matchmakingProperties.isMatchmade ? <li>{t('Matchmaking')}</li> : null}
                  {properties.isCrucible ? (
                    <>
                      <li>{t('Player versus player')}</li>
                      {definitionActivityPlaylist && enums.levelAdvantagesEnabled.includes(definitionActivityPlaylist.hash) ? <li>{t('Level advantages enabled')}</li> : <li>{t('Level advantages disabled')}</li>}
                    </>
                  ) : (
                    <li>{t('Cooperative')}</li>
                  )}
                </ul>
              </div>
            ) : null}
            {properties.suggestion ? <div className='highlight'>{properties.suggestion}</div> : null}
            {definitionActivity.timeToComplete ? (
              <div className='highlight'>
                {t('Approximate length')}: <span>{t('{{minutes}} Minutes', { minutes: definitionActivity.timeToComplete || 0 })}</span>
              </div>
            ) : null}
            {properties.activityLightLevel ? (
              <div className='highlight recommended-light'>
                {t('Recommended light')}: <span>{properties.activityLightLevel}</span>
              </div>
            ) : null}
            {context === 'roster' && rosterProfile && rosterProfile.profile?.profileTransitoryData?.data?.currentActivity?.numberOfOpponents > 0 && properties.hasScore ? (
              <div className='score'>
                <div className='team'>
                  <div className={cx('value', { winning: rosterProfile.profile.profileTransitoryData.data.currentActivity.score > rosterProfile.profile.profileTransitoryData.data.currentActivity.highestOpposingFactionScore })}>{rosterProfile.profile.profileTransitoryData.data.currentActivity.score}</div>
                  <div className='name'>{t('Their team')}</div>
                </div>
                <div className='team enemy'>
                  <div className={cx('value', { winning: rosterProfile.profile.profileTransitoryData.data.currentActivity.score < rosterProfile.profile.profileTransitoryData.data.currentActivity.highestOpposingFactionScore })}>{rosterProfile.profile.profileTransitoryData.data.currentActivity.highestOpposingFactionScore}</div>
                  <div className='name'>{t('Enemy team')}</div>
                </div>
              </div>
            ) : null}
            {context === 'roster' && joinabilityString ? <div className='joinability'>{joinabilityString}</div> : null}
            {context === 'maps' && properties?.completed ? <div className='completed'>{t('Completed')}</div> : null}
          </div>
        </div>
      </>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    groupMembers: state.groupMembers,
    viewport: state.viewport,
    tooltips: state.tooltips,
  };
}

export default connect(mapStateToProps)(Activity);
