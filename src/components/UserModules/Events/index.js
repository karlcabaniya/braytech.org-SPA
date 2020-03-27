import React from 'react';
import { connect } from 'react-redux';

import { t } from '../../../utils/i18n';
import manifest from '../../../utils/manifest';
import * as SVG from '../../../svg';
import Items from '../../../components/Items';
// import Collectibles from '../../../components/Collectibles';
import Records from '../../../components/Records';

import './styles.css';

const eventsCalendar = [
  {
    activityHash: 3753505781
  }
]

class Events extends React.Component {
  render() {
    const member = this.props.member;
    const characters = member.data.profile.characters.data;
    const character = characters.find(c => c.characterId === member.characterId);
    const characterActivities = member.data.profile.characterActivities.data;

    const activeEvents = eventsCalendar.filter(e => characterActivities[this.props.member.characterId].availableActivities.filter(a => a.activityHash === e.activityHash).length);

    // console.log(activeEvents)

    if (activeEvents.length < 1) {
      return null;
    } else if (activeEvents.length === 1) {
      const event = activeEvents[0];
      const definitionActivity = manifest.DestinyActivityDefinition[event.activityHash];

      const season10items = [
        {
          itemHash: 1882457108
        },
        {
          itemHash: 713182381
        },
        {
          itemHash: 63725907
        },
        {
          itemHash: 1425558127
        },
        {
          itemHash: 2310625418
        },
        {
          itemHash: 2845071512
        },
        {
          itemHash: 3308875113
        },
        {
          itemHash: 92135663
        },
        {
          itemHash: 3600816955
        },
        {
          itemHash: 1339294334
        },
        {
          itemHash: 2758933481
        },
        {
          itemHash: 167461728
        },
        {
          itemHash: 2614190248
        },
        {
          itemHash: 3115791898
        },
        {
          itemHash: 21320325
        }
      ];

      return (
        <div className='group iron-banner'>
          <div className='module event'>
            <div className='icon'>
              <SVG.Events.IronBanner />
            </div>
            <div className='text'>
              <div className='sub-header'>
                <div>{t('Active event')}</div>
              </div>
              <h3>{definitionActivity.displayProperties?.name}</h3>
              <div className='description'>
                <p>A special week-long Crucible event that challenges teams of 6 to go head-to-head in the most competitive form of Control. Light level advantages enabled.</p>
                <p>The Lords of Iron, ancient warriors from the City's founding, have no time for mollycoddling. The City remembers Felwinter and Jolder, Skorri and Timur, Radegast and Gheleon and the others, for their invincible patrols during Six Fronts and the Wall-building. The Iron Banner asks Guardians to live up to that legend.</p>
              </div>
            </div>
          </div>
          <div className='module'>
            <h4>{t('Collectibles')}</h4>
            <ul className='list inventory-items'>
              <Items items={season10items.filter(i => {
                const definitionItem = manifest.DestinyInventoryItemDefinition[i.itemHash];

                if (definitionItem.classType > -1 && definitionItem.classType < 3 && definitionItem.classType === character.classType) {
                  return true;
                } else {
                  return false;
                }
              })} />
            </ul>
          </div>
          <div className='module'>
            <h4>{t('Records')}</h4>
            <ul className='list record-items'>
              <Records selfLinkFrom='/this-week' hashes={[945314810]} ordered />
            </ul>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member
  };
}

Events = connect(mapStateToProps)(Events);

export { Events, eventsCalendar };
