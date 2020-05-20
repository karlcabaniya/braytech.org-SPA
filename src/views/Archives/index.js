import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

import { t, BraytechText } from '../../utils/i18n';
import manifest from '../../utils/manifest';
import { Views } from '../../svg';

import './styles.css';

export function NavLinks() {
  return (
    <div className='module views'>
      <ul className='list'>
        <li className='linked'>
          <div className='icon'>
            <Views.Archives.Overview />
          </div>
          <NavLink to='/archives' exact />
        </li>
        <li className='linked'>
          <div className='icon'>
            <Views.Archives.Grimoire />
          </div>
          <NavLink to='/archives/grimoire' />
        </li>
        <li className='linked'>
          <div className='icon'>
            <Views.Archives.Tricorn />
          </div>
          <NavLink to='/archives/legend' />
        </li>
        <li className='linked'>
          <div className='icon'>
            <Views.Archives.ChaliceOfOpulence />
          </div>
          <NavLink to='/archives/chalice-of-opulence' />
        </li>
      </ul>
    </div>
  );
}

function Archives() {
  const entries = [
    {
      name: t('Grimoire'),
      description: t("The lore of old, Destiny 1's Grimoire cards are backed up, archived, and preserved here."),
      deployed: "2020-04-03T04:19:34.356Z",
      link: '/archives/grimoire'
    },
    // {
    //   name: t('Eververse Season Overview'),
    //   description: t("Details each of the current season's weekly Eververse store stock to allow the viewer assistance in maximising their Silver efficieny."),
    //   deployed: "2020-01-10T00:00:00.000Z",
    //   link: '/archives/eververse'
    // },
    {
      name: t('Legend'),
      description: t("Generate an infographic that details your Destiny legend. Customise colours and export to PNG format for sharing purposes."),
      deployed: "2019-11-21T08:40:33.882Z",
      link: '/archives/legend'
    },
    {
      name: manifest.DestinyInventoryItemDefinition[1115550924].displayProperties.name,
      description: t("A tool that enables users to rapidly discover required combinations for specific rewards from _The Menagerie_."),
      deployed: "2019-06-10T00:00:00.000Z",
      link: '/archives/chalice-of-opulence'
    }
  ];
  
  return (
    <div className='view index' id='archives'>
      <div className='module head'>
        <div className='page-header'>
          <div className='name'>{t('Archives')}</div>
        </div>
      </div>
      <div className='buff'>
        <NavLinks />
        <div className='content'>
          {entries.map((entry, i) => (
            <div key={i} className='module'>
              <h3>{entry.name}</h3>
              <BraytechText className='text' value={entry.description} />
              <Link className='button' to={entry.link}>
                <div className='text'>{entry.wip ? 'WIP' : t('Launch')}</div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function mapStateToProps(state, ownProps) {
  return {
    viewport: state.viewport
  };
}

export default connect(mapStateToProps)(Archives);
