import React from 'react';
import { connect } from 'react-redux';

import { t } from '../../../utils/i18n';
import manifest from '../../../utils/manifest';
import * as SVG from '../../../svg';
import Items from '../../../components/Items';
import Collectibles from '../../../components/Collectibles';
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
    const characterActivities = member.data.profile.characterActivities.data;

    const activeEvents = eventsCalendar.filter(e => characterActivities[this.props.member.characterId].availableActivities.filter(a => a.activityHash === e.activityHash).length);
    const inventory = member.data.profile.profileInventory.data?.items
      ?.slice()
      .concat(member.data.profile.characterInventories.data?.[member.characterId]?.items);

    console.log(activeEvents, inventory)

    if (activeEvents.length < 1) {
      return null;
    } else if (activeEvents.length === 1) {
      const event = activeEvents[0];
      const definitionActivity = manifest.DestinyActivityDefinition[event.activityHash];

      const tokens = [{ bucketHash: 1469714392, itemHash: 1873857625, quantity: 0, ...inventory.filter(i => i.itemHash === 1873857625)?.[0] }];

      return (
        <div className='group iron-banner'>
          <div className='module event'>
            <div className='icon'>
              <SVG.Events.IronBanner />
            </div>
            <div className='text'>
              <div className='sub-header'>
                <div>{t('Event')}</div>
              </div>
              <h3>{definitionActivity.displayProperties?.name}</h3>
              <div className='description'>
                <p>The Lords of Iron, ancient warriors from the City's founding, have no time for mollycoddling. The City remembers Felwinter and Jolder, Skorri and Timur, Radegast and Gheleon and the others, for their invincible patrols during Six Fronts and the Wall-building. The Iron Banner asks Guardians to live up to that legend.</p>
              </div>
            </div>
          </div>
          <div className='module'>
            <div className='sub-header'>
              <div>{t('Bounties')}</div>
            </div>
            <ul className='list inventory-items'>
              <Items items={tokens} />
            </ul>
            <div className='sub-header'>
              <div>{t('Rewards')}</div>
            </div>
            <ul className='list inventory-items'>
              <Items items={tokens} />
            </ul>
          </div>
          <div className='module'>
            <div className='sub-header'>
              <div>{t('Collectibles')}</div>
            </div>
            <ul className='list inventory-items'>
              <Items items={[{ itemHash: 2758933481 }]} hideQuantity />
            </ul>
            <div className='sub-header'>
              <div>{t('Records')}</div>
            </div>
            <ul className='list record-items'>
              <Records sselfLinkFrom='/this-week' hashes={[945314810]} ordered />
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
