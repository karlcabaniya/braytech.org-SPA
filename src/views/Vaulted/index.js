import React from 'react';
import { connect } from 'react-redux';

import { t, BraytechText } from '../../utils/i18n';
import manifest from '../../utils/manifest';
import { dcv } from '../../utils/destinyEnums';

import './styles.css';
import Collectibles from '../../components/Collectibles';
import Records from '../../components/Records';

export function NavLinks() {
  return (
    <div className='module views'>
      <ul className='list'>
        <li className='linked disabled'>
          <div className='icon'></div>
          {/* <NavLink to='/' exact /> */}
        </li>
      </ul>
    </div>
  );
}

class Vaulted extends React.Component {
  componentDidMount() {
    this.mounted = true;

    window.scrollTo(0, 0);
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const data = dcv[0];

    console.log(data);

    return (
      <div className='view' id='vaulted'>
        <div className='module head'>
          <div className='page-header'>
            <div className='sub-name'>{t('The Vault')}</div>
            <div className='name'>{t('Pending')}</div>
          </div>
        </div>
        <div className='buff'>
          <NavLinks />
          <div className='content'>
            <div className='module season'>
              <h3>{t('Season {{season}}', { season: data.season })}</h3>
              <BraytechText className='text' value={data.aside} />
            </div>
            {data.activities.map((activity, a) => {
              const collectibles = [
                ...activity.artifacts.collectibles, // static collectibles
                ...activity.artifacts.nodes
                  .reduce(
                    (array, presentationNodeHash) => [
                      // derived from presentation nodes
                      ...array,
                      manifest.DestinyPresentationNodeDefinition[presentationNodeHash].children.collectibles.map((collectible) => collectible.collectibleHash),
                    ],
                    []
                  )
                  .flat(),
              ].sort((a, b) => manifest.DestinyInventoryItemDefinition[manifest.DestinyCollectibleDefinition[a]?.itemHash]?.itemType - manifest.DestinyInventoryItemDefinition[manifest.DestinyCollectibleDefinition[b]?.itemHash]?.itemType);
              const records = [
                ...activity.artifacts.records, // static records
                ...activity.artifacts.nodes
                  .reduce(
                    (array, presentationNodeHash) => [
                      // derived from presentation nodes
                      ...array,
                      manifest.DestinyPresentationNodeDefinition[presentationNodeHash].children.records.map((record) => record.recordHash),
                    ],
                    []
                  )
                  .flat(),
              ];

              return (
                <div key={a} className='module activity'>
                  <div className='sub-header'>{(activity.placeHash && manifest.DestinyPlaceDefinition[activity.placeHash].displayProperties.name) || (activity.activityHash && manifest.DestinyActivityDefinition[activity.activityHash].originalDisplayProperties.name)}</div>
                  <div className='artifacts'>
                    <h4>{t('Collectibles')}</h4>
                    <ul className='list collection-items'>
                      <Collectibles hashes={collectibles} supressHighlights selfLinkFrom='/vaulted' />
                    </ul>
                    <h4>{t('Records')}</h4>
                    <ul className='list record-items'>
                      <Records hashes={records} supressHighlights selfLinkFrom='/vaulted' />
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    lists: state.lists,
  };
}

export default connect(mapStateToProps)(Vaulted);
