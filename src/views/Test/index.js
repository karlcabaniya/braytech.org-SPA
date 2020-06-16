import React from 'react';
import { connect } from 'react-redux';

import manifest from '../../utils/manifest';

import { stringToIcons } from '../../utils/destinyUtils';
import { DestinyContentVault } from '../../utils/destinyEnums';
import { sockets } from '../../utils/destinyItems/sockets';
import { stats } from '../../utils/destinyItems/stats';

import Item from '../../components/Tooltip/Item';

import './styles.css';
import Collectibles from '../../components/Collectibles';
import Records from '../../components/Records';

class Test extends React.Component {
  constructor() {
    super();

    this.state = {};
  }

  componentDidMount() {
    this.mounted = true;

    window.scrollTo(0, 0);

    // const oof = [];

    // Object.values(manifest.DestinyObjectiveDefinition).forEach((definition) => {
    //   if (definition.progressDescription.indexOf('[') > -1) {
    //     const lol = stringToIcons(definition.progressDescription);

    //     if (lol[0].indexOf('[') > -1) console.log(definition.hash, lol);
    //     if (lol[0].indexOf('[') > -1) oof.push({ objectiveHash: definition.hash, unicode: 'lol', substring: definition.progressDescription });
    //   }
    // });

    // console.log(JSON.stringify(oof));
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    // const hashes = Object.values(manifest.DestinyCollectibleDefinition)
    //   .filter((def) => def.sourceString?.includes('Titan'))
    //   .map((def) => def.hash);

    // const reducedCollectibles = [...this.props.lists.nodes.reduce((a, v) => [...a, manifest.DestinyPresentationNodeDefinition[v].children.collectibles.map((c) => c.collectibleHash)], []).flat(), ...this.props.list.collectibles];

    // const reducedRecords = [...this.props.lists.nodes.reduce((a, v) => [...a, manifest.DestinyPresentationNodeDefinition[v].children.records.map((c) => c.recordHash)], []).flat(), ...this.props.list.records];
    console.log(DestinyContentVault[0])
    //selectedVault.bucketHash || selectedVault.placeHash || selectedVault.activityHash || selectedVault.activityModeHash
    console.log(
      DestinyContentVault[0].vault.map((place) => {
          return `{${place.placeHash ? `placeHash: ${place.placeHash}, // ${manifest.DestinyPlaceDefinition[place.placeHash].displayProperties.name}\n` : ``}
          ${place.bucketHash ? `bucketHash: ${place.bucketHash}, // ${manifest.DestinyInventoryBucketDefinition[place.bucketHash].displayProperties.name}\n` : ``}
          ${place.activityHash ? `activityHash: ${place.activityHash}, // ${manifest.DestinyActivityDefinition[place.activityHash].originalDisplayProperties.name}\n` : ``}
          ${place.activityModeHash ? `activityModeHash: ${place.activityModeHash}, // ${manifest.DestinyActivityModeDefinition[place.activityModeHash].displayProperties.name}\n` : ``}
  buckets: {
    nodes: [
      ${place.buckets.nodes.map((hash) => `${hash}, // ${manifest.DestinyPresentationNodeDefinition[hash].displayProperties.name}`).join('\n')}
    ],
    collectibles: [
      ${place.buckets.collectibles.map((hash) => `${hash}, // ${manifest.DestinyCollectibleDefinition[hash].displayProperties.name}`).join('\n')}
    ],
    records: [
      ${place.buckets.records.map((hash) => `${hash}, // ${manifest.DestinyRecordDefinition[hash].displayProperties.name}`).join('\n')}
    ],
  }
},`;
        })
        
        .join('\n')
    );

    return (
      <div className='view' id='test'>
        {/* <ul className='list collection-items'>
          <Collectibles hashes={reducedCollectibles} />
        </ul>
        <ul className='list record-items'>
          <Records hashes={reducedRecords} />
        </ul>
        <ul className='list collection-items'>
          <Collectibles hashes={hashes} />
        </ul> */}
        {/* <div id='tooltip' className='visible'>
          <Item hash='2408405461' />
        </div>
        <div id='tooltip' className='visible'>
          <Item hash='1600633250' />
        </div>
        <div id='tooltip' className='visible'>
          <Item hash='572122304' />
        </div>
        <div id='tooltip' className='visible'>
          <Item hash='1498852482' instanceid='6917529116167757369' />
        </div>
        <div id='tooltip' className='visible'>
          <Item hash='3524313097' />
        </div>
        <div id='tooltip' className='visible'>
          <Item hash='2591746970' />
        </div>
        <div id='tooltip' className='visible'>
          <Item hash='4103414242' />
        </div>
        <div id='tooltip' className='visible'>
          <Item hash='1864563948' />
        </div> */}
        {/* <div id='tooltip' className='visible'>
          <Item hash='3899270607' />
        </div>
        <div id='tooltip' className='visible'>
          <Item hash='1852863732' />
        </div> */}
        {/* <div id='tooltip' className='visible'>
          <Item hash='3948284065' />
        </div> */}
        {/* <div id='tooltip' className='visible'>
          <Item hash='3887892656' instanceid='6917529029394206558' />
        </div> */}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    lists: state.lists,
  };
}

export default connect(mapStateToProps)(Test);
