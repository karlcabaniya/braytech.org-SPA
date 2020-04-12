import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import cx from 'classnames';

import { BungieText } from '../../../utils/i18n';
import manifest from '../../../utils/manifest';
import * as enums from '../../../utils/destinyEnums';
import * as utils from '../../../utils/destinyUtils';
import ObservedImage from '../../ObservedImage';
import { checklists, lookup } from '../../../utils/checklists';
import { cartographer } from '../../../utils/maps';

import { Tooltips } from '../../../svg';

import './styles.css';

class Activity extends React.Component {
  render() {
    const { t, member, context, hash, mode, playlist, lastorbiteddestination } = this.props;

    const definitionActivity = manifest.DestinyActivityDefinition[hash];
    const definitionActivityMode = manifest.DestinyActivityModeDefinition[mode];
    const definitionActivityModeParent = definitionActivityMode && definitionActivityMode.parentHashes && definitionActivityMode.parentHashes.length && manifest.DestinyActivityModeDefinition[definitionActivityMode.parentHashes[0]];
    const definitionActivityPlaylist = manifest.DestinyActivityDefinition[playlist];
    const definitionActivityType = definitionActivityPlaylist?.activityTypeHash && manifest.DestinyActivityTypeDefinition[definitionActivityPlaylist.activityTypeHash];
    const definitionDestination = manifest.DestinyDestinationDefinition[definitionActivity?.destinationHash];
    const definitionPlace = manifest.DestinyPlaceDefinition[definitionActivity?.placeHash];

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
      const activityType = (hash, activityTypeHash, activityModeHashes = []) => {
        if (enums.adventures.includes(hash)) {
          return 'adventure';
        } else if (enums.ordealHashes.includes(hash)) {
          return 'nightfall-ordeal';
        } else if (activityTypeHash === 838603889) {
          // Forge Ignition
          return 'forge';
        } else if (activityTypeHash === 400075666) {
          // The Menagerie
          return 'menagerie';
        } else if (activityModeHashes.includes(608898761) || definitionActivityPlaylist?.hash === 2032534090) {
          // catches dungeon types and Story: The Shattered Throne
          return 'dungeon';
        } else if (activityModeHashes.includes(1686739444)) {
          return 'story';
        } else if (activityModeHashes.includes(2394616003)) {
          return 'strike';
        } else if (activityModeHashes.includes(3497767639)) {
          return 'patrol';
        } else if (activityModeHashes.includes(1164760504)) {
          return 'crucible';
        } else if (activityTypeHash === 2043403989) {
          return 'raid';
        } else if (activityModeHashes.includes(3894474826)) {
          return 'reckoning';
        } else if (activityModeHashes.includes(1418469392)) {
          // Gambit Prime
          return 'gambit';
        } else if (activityModeHashes.includes(1848252830)) {
          // Gambit
          return 'gambit';
        } else if (activityTypeHash === 332181804) {
          return 'nightmare-hunt';
        } else if (activityModeHashes.includes(2319502047)) {
          return 'seasonal-arena';
        }
      };

      const modeFiltered = activityType(definitionActivity.hash, definitionActivity.activityTypeHash, definitionActivity.activityModeHashes ? definitionActivity.activityModeHashes.concat([mode]) : [mode]);

      const node = cartographer({ key: 'activityHash', value: definitionActivity.hash }, this.props.member);

      const definitionBubble = node.bubbleHash && definitionDestination?.bubbles?.find((bubble) => bubble.hash === node.bubbleHash);

      const activityTypeDisplay = {
        name: definitionActivity.selectionScreenDisplayProperties && definitionActivity.selectionScreenDisplayProperties.name ? definitionActivity.selectionScreenDisplayProperties.name : definitionActivity.displayProperties && definitionActivity.displayProperties.name ? definitionActivity.displayProperties.name : t('Unknown'),

        mode: definitionActivityMode && definitionActivityMode.displayProperties && definitionActivityMode.displayProperties.name,

        description: definitionActivity.selectionScreenDisplayProperties && definitionActivity.selectionScreenDisplayProperties.description ? definitionActivity.selectionScreenDisplayProperties.description : definitionActivity.displayProperties && definitionActivity.displayProperties.description ? definitionActivity.displayProperties.description : t('Unknown'),

        destination: [definitionBubble?.displayProperties.name, definitionDestination?.displayProperties.name, definitionPlace?.displayProperties.name].filter((a, b, self) => self.indexOf(a) === b),

        activityLightLevel: definitionActivity.activityLightLevel && definitionActivity.activityLightLevel !== 10 && definitionActivity.activityLightLevel,

        pgcrImage: definitionActivity.pgcrImage,

        icon: <Tooltips.FastTravel />,
      };

      // console.log(activityTypeDisplay, definitionActivity, mode, definitionActivityPlaylist)

      if (definitionActivity.placeHash === 2961497387) {
        activityTypeDisplay.name = manifest.DestinyPlaceDefinition[2961497387].displayProperties.name;
        activityTypeDisplay.mode = undefined;
        activityTypeDisplay.destination = [];
        activityTypeDisplay.description = t('In orbit, planning something terribly heroic.');
        activityTypeDisplay.activityLightLevel = false;
      }

      if (modeFiltered === 'patrol') {
        activityTypeDisplay.destination = [definitionPlace?.displayProperties.name];
        activityTypeDisplay.description = manifest.DestinyActivityTypeDefinition[3497767639].displayProperties.description;
        activityTypeDisplay.activityLightLevel = false;
        activityTypeDisplay.mode = definitionActivityMode && definitionActivityMode.displayProperties && definitionActivityMode.displayProperties.name;
      }

      if (modeFiltered === 'story') {
        activityTypeDisplay.mode = manifest.DestinyActivityTypeDefinition[1686739444].displayProperties.name;
        activityTypeDisplay.className = 'story';
        activityTypeDisplay.icon = <Tooltips.Story />;
      }

      if (modeFiltered === 'crucible') {
        activityTypeDisplay.name = definitionActivityPlaylist?.displayProperties?.name || t('Unknown');
        activityTypeDisplay.mode = manifest.DestinyActivityModeDefinition[1164760504].displayProperties.name;
        activityTypeDisplay.description = definitionActivityPlaylist?.displayProperties?.description || t('Unknown');
        activityTypeDisplay.destination = [definitionActivity.displayProperties.name, definitionActivity.displayProperties.description];
        activityTypeDisplay.className = 'crucible';
        activityTypeDisplay.activityLightLevel = false;
        activityTypeDisplay.isCrucible = true;
        activityTypeDisplay.icon = <Tooltips.Crucible />;

        // Survival, Survival: Freelance
        if (definitionActivityPlaylist && [135537449, 740891329].includes(definitionActivityPlaylist.hash)) {
          activityTypeDisplay.name = definitionActivityPlaylist.displayProperties.name;
        }

        // Trials of Osiris
        if (definitionActivityPlaylist && definitionActivityPlaylist.hash === 1166905690) {
          activityTypeDisplay.icon = <Tooltips.TrialsOfOsiris />;
          activityTypeDisplay.className = 'crucible trials-of-osiris';
        }

        // Iron Banner
        if (definitionActivityPlaylist && definitionActivityPlaylist.hash === 3753505781) {
          activityTypeDisplay.icon = <Tooltips.IronBanner />;
          activityTypeDisplay.className = 'crucible iron-banner';
        }
      }

      if (modeFiltered === 'raid') {
        activityTypeDisplay.name = definitionActivity.displayProperties.name;
        activityTypeDisplay.description = definitionActivity.displayProperties.description;
        activityTypeDisplay.mode = definitionActivityMode?.displayProperties.name || manifest.DestinyActivityModeDefinition[2043403989]?.displayProperties.name;
        activityTypeDisplay.className = 'raid';
        activityTypeDisplay.icon = <Tooltips.Raid />;
      }

      if (modeFiltered === 'forge') {
        activityTypeDisplay.name = definitionActivityPlaylist?.displayProperties.name || definitionActivity.displayProperties.name || t('Unknown');
        activityTypeDisplay.description = definitionActivityPlaylist?.displayProperties.description || definitionActivity.displayProperties.description || t('Unknown');
        activityTypeDisplay.mode = definitionActivityType?.displayProperties.name || manifest.DestinyActivityTypeDefinition[definitionActivity.activityTypeHash].displayProperties.name;
        activityTypeDisplay.activityLightLevel = definitionActivityPlaylist?.activityLightLevel || definitionActivity.activityLightLevel;
        activityTypeDisplay.className = 'forge';
        activityTypeDisplay.pgcrImage = definitionActivityPlaylist?.pgcrImage || definitionActivity.pgcrImage;
        activityTypeDisplay.icon = <Tooltips.ForgeIgnition />;
      }

      if (modeFiltered === 'menagerie') {
        activityTypeDisplay.destination = [definitionDestination?.displayProperties.name];
        activityTypeDisplay.mode = false;
        activityTypeDisplay.activityLightLevel = definitionActivityPlaylist?.activityLightLevel;
        activityTypeDisplay.className = 'menagerie';
        activityTypeDisplay.icon = <Tooltips.Menagerie />;
      }

      if (modeFiltered === 'reckoning') {
        activityTypeDisplay.mode = definitionActivity.originalDisplayProperties?.name;
        activityTypeDisplay.description = definitionActivityPlaylist?.displayProperties?.description || t('Unknown');
        activityTypeDisplay.className = 'reckoning';
        activityTypeDisplay.icon = <Tooltips.Reckoning />;
      }

      if (modeFiltered === 'gambit') {
        activityTypeDisplay.name = definitionActivityMode.displayProperties.name;
        activityTypeDisplay.mode = definitionActivityModeParent.displayProperties.name;
        activityTypeDisplay.description = definitionActivityMode.displayProperties.description;
        activityTypeDisplay.destination = [definitionActivity.displayProperties.name, definitionActivity.displayProperties.description];
        activityTypeDisplay.className = 'gambit';
        activityTypeDisplay.activityLightLevel = false;
        activityTypeDisplay.icon = definitionActivityMode.hash === 1418469392 ? <Tooltips.GambitPrime /> : <Tooltips.Gambit />;
      }

      if (modeFiltered === 'strike') {
        activityTypeDisplay.mode = manifest.DestinyActivityTypeDefinition[2884569138].displayProperties.name;
        activityTypeDisplay.className = 'strike';
        activityTypeDisplay.icon = <Tooltips.Strike />;
      }

      if (modeFiltered === 'nightfall-ordeal') {
        const strikeHash = Object.keys(enums.nightfalls).find((k) => enums.nightfalls[k].ordealHashes.includes(definitionActivity.hash));
        const definitionStrke = manifest.DestinyActivityDefinition[strikeHash];

        // activityTypeDisplay.name= definitionActivity.displayProperties.name;
        // activityTypeDisplay.mode= manifest.DestinyActivityTypeDefinition[2884569138].displayProperties.name;
        activityTypeDisplay.name = definitionStrke.selectionScreenDisplayProperties.name;
        activityTypeDisplay.mode = definitionActivity.displayProperties.name;
        activityTypeDisplay.description = definitionStrke.displayProperties.description;
        activityTypeDisplay.className = 'strike';
        activityTypeDisplay.icon = <Tooltips.Strike />;
      }

      if (modeFiltered === 'adventure') {
        activityTypeDisplay.mode = t('Adventure');
        activityTypeDisplay.className = 'adventure';
        activityTypeDisplay.icon = <Tooltips.Adventure />;
      }

      if (modeFiltered === 'nightmare-hunt') {
        activityTypeDisplay.name = definitionActivity.displayProperties.name;
        activityTypeDisplay.mode = manifest.DestinyActivityTypeDefinition[definitionActivity.activityTypeHash].displayProperties.name;
        activityTypeDisplay.description = definitionActivity.displayProperties.description;
        activityTypeDisplay.suggestion = t('Equip Dreambane armor mods to enhance your light within this activity.');
        activityTypeDisplay.className = 'shadowkeep nightmare-hunt';
        activityTypeDisplay.icon = <Tooltips.Shadowkeep />;
      }

      if (modeFiltered === 'dungeon') {
        activityTypeDisplay.name = definitionActivityPlaylist?.displayProperties.name || definitionActivity.displayProperties.name;
        activityTypeDisplay.mode = manifest.DestinyActivityTypeDefinition[608898761].displayProperties.name;
        activityTypeDisplay.className = 'dungeon';
        activityTypeDisplay.icon = <Tooltips.Dungeon />;
      }

      if (modeFiltered === 'seasonal-arena') {
        activityTypeDisplay.name = definitionActivityPlaylist?.displayProperties.name;
        activityTypeDisplay.description = definitionActivityPlaylist?.displayProperties.description;
        activityTypeDisplay.mode = manifest.DestinyActivityTypeDefinition[263019149].displayProperties.name;
        activityTypeDisplay.className = 'seasonal-arena';
        activityTypeDisplay.icon = <Tooltips.SeasonalArena />;
      }

      const matchmakingProperties = definitionActivityPlaylist?.matchmaking || definitionActivity.matchmaking;

      const checklistEntry = lookup({ key: 'activityHash', value: hash });

      const checklist = checklistEntry.checklistId && checklists[checklistEntry.checklistId]({ requested: [checklistEntry.checklistHash] });
      const checklistItem = checklist && checklist.items && checklist.items.length && checklist.items[0];
      // if (checklist) console.log('// do something with me plz', checklist);

      const eligibilityRequirements = member.data?.profile && definitionActivity.eligibilityRequirements && utils.gameVersion(member.data.profile.profile.data.versionsOwned, definitionActivity.eligibilityRequirements.gameVersion);

      return (
        <>
          <div className='acrylic' />
          <div className={cx('frame', 'activity', activityTypeDisplay.className)}>
            <div className='header'>
              <div className='icon'>{activityTypeDisplay.icon}</div>
              <div className='text'>
                <div className='name'>{activityTypeDisplay.name}</div>
                <div>
                  <div className='kind'>{activityTypeDisplay.mode}</div>
                </div>
              </div>
            </div>
            {eligibilityRequirements && !eligibilityRequirements.eligible ? <div className='highlight major'>{eligibilityRequirements.unlock.text}</div> : null}
            <div className='black'>
              {activityTypeDisplay.pgcrImage && activityTypeDisplay.pgcrImage !== '/img/theme/destiny/bgs/pgcrs/placeholder.jpg' ? (
                <div className='screenshot'>
                  <ObservedImage className='image' src={`https://www.bungie.net${activityTypeDisplay.pgcrImage}`} />
                </div>
              ) : null}
              {activityTypeDisplay.destination.length || activityTypeDisplay.description ? (
                <div className='description'>
                  {activityTypeDisplay.destination.length ? <div className='destination'>{activityTypeDisplay.destination.filter((s) => s).join(', ')}</div> : null}
                  <BungieText value={activityTypeDisplay.description} />
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
                    {activityTypeDisplay.isCrucible ? (
                      <>
                        <li>{t('Player versus player')}</li>
                        {definitionActivityPlaylist && enums.levelAdvantagesEnabled.indexOf(definitionActivityPlaylist.hash) > -1 ? <li>{t('Level advantages enabled')}</li> : <li>{t('Level advantages disabled')}</li>}
                      </>
                    ) : (
                      <li>{t('Cooperative')}</li>
                    )}
                  </ul>
                </div>
              ) : null}
              {activityTypeDisplay.suggestion ? <div className='highlight'>{activityTypeDisplay.suggestion}</div> : null}
              {definitionActivity.timeToComplete ? (
                <div className='highlight'>
                  {t('Approximate length')}: <span>{t('{{minutes}} Minutes', { minutes: definitionActivity.timeToComplete || 0 })}</span>
                </div>
              ) : null}
              {activityTypeDisplay.activityLightLevel ? (
                <div className='highlight recommended-light'>
                  {t('Recommended light')}: <span>{activityTypeDisplay.activityLightLevel}</span>
                </div>
              ) : null}
              {/* {context === 'maps' && checklistItem && checklistItem.completed ? <div className='completed'>{t('Completed')}</div> : null} */}
            </div>
          </div>
        </>
      );
    }
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    viewport: state.viewport,
    tooltips: state.tooltips,
  };
}

export default compose(connect(mapStateToProps), withTranslation())(Activity);
