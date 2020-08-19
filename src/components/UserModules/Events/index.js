import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import cx from 'classnames';

import { t, BraytechText, BungieText } from '../../../utils/i18n';
import manifest from '../../../utils/manifest';

// import OberservedImage from '../../../components/ObservedImage';
// import Collectibles from '../../../components/Collectibles';
import Records from '../../../components/Records';
import Button from '../../../components/UI/Button';
import * as SVG from '../../../svg';

import './styles.css';

const eventsCalendar = [
  {
    hashes: [
      1309646866, // The Farm - just in case
      158022875,
      3840133183,
      770505917,
      1199493030,
      2429391832,
    ],
    component: SolsticeOfHeroes,
  },
  {
    hashes: [3753505781],
    component: IronBanner,
  },
];

function Events(props) {
  const member = useSelector((state) => state.member);
  const characterActivities = member.data.profile.characterActivities.data;

  const activeEvents = eventsCalendar.filter((event) => characterActivities[member.characterId].availableActivities.filter((activity) => event.hashes.filter((hash) => activity.activityHash === hash).length).length);

  return activeEvents.map((event, e) => {
    const Component = event.component;

    return <Component key={e} />;
  });
}

export { Events, eventsCalendar };

function IronBanner() {
  const member = useSelector((state) => state.member);
  const characters = member.data.profile.characters.data;
  const character = characters.find((character) => character.characterId === member.characterId);

  const definitionActivity = manifest.DestinyActivityDefinition[3753505781];

  const season10items = [
    {
      itemHash: 1882457108,
    },
    {
      itemHash: 713182381,
    },
    {
      itemHash: 63725907,
    },
    {
      itemHash: 1425558127,
    },
    {
      itemHash: 2310625418,
    },
    {
      itemHash: 2845071512,
    },
    {
      itemHash: 3308875113,
    },
    {
      itemHash: 92135663,
    },
    {
      itemHash: 3600816955,
    },
    {
      itemHash: 1339294334,
    },
    {
      itemHash: 2758933481,
    },
    {
      itemHash: 167461728,
    },
    {
      itemHash: 2614190248,
    },
    {
      itemHash: 3115791898,
    },
    {
      itemHash: 21320325,
    },
  ];

  return (
    <div className='group iron-banner'>
      <div className='icon'>
        <SVG.Events.IronBanner />
      </div>
      <div className='module event'>
        <div className='text'>
          <div className='sub-header'>
            <div>{t('Active event')}</div>
          </div>
          <h3>{definitionActivity.displayProperties?.name}</h3>
          <div className='description'>
            <p>{t('Event.IronBanner.Description')}</p>
            <p>{t('Destiny1.Grimoire.IronBanner')}</p>
          </div>
        </div>
      </div>
      {/* <div className='module'>
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
        </div> */}
      <div className='module'>
        <h4>{t('Records')}</h4>
        <ul className='list record-items'>
          <Records selfLinkFrom='/this-week' hashes={[1430747933]} ordered />
        </ul>
      </div>
    </div>
  );
}

const SOLSTICE_OF_HEROES_SINGE_MAP = {
  2429391832: {
    className: 'void',
    svg: SVG.Common.Void,
  },
  1199493030: {
    className: 'arc',
    svg: SVG.Common.Arc,
  },
  770505917: {
    className: 'solar',
    svg: SVG.Common.Solar,
  },
};

function SolsticeOfHeroes() {
  const member = useSelector((state) => state.member);

  const characterActivities = member.data.profile.characterActivities.data;
  const activity = characterActivities[member.characterId].availableActivities.find((activity) => [770505917, 1199493030, 2429391832].includes(activity.activityHash));

  const location = useLocation();

  // const SingeIcon = SOLSTICE_OF_HEROES_SINGE_MAP[activity.activityHash].svg;

  return (
    <div className='group solstice-of-heroes'>
      {/* <div className='background'>
        <OberservedImage src='/static/images/events/soh2020.jpg' />
      </div> */}
      <div className='icon'>
        <SVG.Events.SolsticeOfHeroes />
      </div>
      <div className='module event'>
        <div className='text'>
          <div className='sub-header'>
            <div>{t('Active event')}</div>
          </div>
          <h3>{t('Event.SolsticeOfHeroes.Name')}</h3>
          <BraytechText className='description' value={t('Event.SolsticeOfHeroes.Description.Extended')} />
          <Button
            anchor
            to={{
              pathname: '/solstice-of-heroes',
              state: {
                from: location.pathname,
              },
            }}
            cta
          >
            <div className='text'>{t('Event.SolsticeOfHeroes.CTA')}</div>
            <i className='segoe-mdl-arrow-right' />
          </Button>
        </div>
      </div>
      {/* <div className='module modifier'>
        <div className='sub-header'>
          <div>{t('Event.SolsticeOfHeroes.ActivityModifier')}</div>
        </div>
        <div className='icon'>
          <div className='background'>
            <svg viewBox='0 0 250.6 221.8'>
              <path
                d="M141,212.7c-7,12.1-24.4,12.1-31.4,0L56,120L2.5,27.2C-4.5,15.1,4.2,0,18.1,0h107.1h107.1
                c13.9,0,22.7,15.1,15.7,27.2L194.5,120L141,212.7z"
              />
            </svg>
          </div>
          <div className={cx('element', SOLSTICE_OF_HEROES_SINGE_MAP[activity.activityHash].className)}>
            <SingeIcon />
          </div>
        </div>
        <BungieText className='text' value={manifest.DestinyActivityDefinition[activity.activityHash].displayProperties.description} />
      </div> */}
    </div>
  );
}
