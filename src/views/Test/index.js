import React from 'react';
import { connect } from 'react-redux';

import manifest from '../../utils/manifest';

import { stringToIcons } from '../../utils/destinyUtils';
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
    const hashes = Object.values(manifest.DestinyCollectibleDefinition)
      .filter((def) => def.sourceString?.includes('Titan'))
      .map((def) => def.hash);

    const reducedCollectibles = [...this.props.list.nodes.reduce((a, v) => [...a, manifest.DestinyPresentationNodeDefinition[v].children.collectibles.map((c) => c.collectibleHash)], []).flat(), ...this.props.list.collectibles];

    const reducedRecords = [...this.props.list.nodes.reduce((a, v) => [...a, manifest.DestinyPresentationNodeDefinition[v].children.records.map((c) => c.recordHash)], []).flat(), ...this.props.list.records];

    const dcv = [
      {
        placeHash: 4251857532, // Io
        artifacts: {
          nodes: [4139791846, 3476818387, 3952745167, 3457070432],
          collectibles: [3647875337, 3858283821, 3946669544, 2239241196, 2982198547, 273762351, 2963869879, 2963869878, 1551165468, 2287445847, 1088431376, 2202434428, 1058083666, 1169536399, 1169536389, 1152758802, 259147460, 3642181656, 3642181657, 3642181658, 3642181659, 3773976314, 259147462, 259147463, 1176046836, 1176046837, 2219212014, 2716100025, 3895764279],
          records: [1289798960],
        },
      },
      {
        placeHash: 386951460, // Titan, Moon of Saturn
        artifacts: {
          nodes: [4139791844, 3476818385, 3952745165, 3252380766],
          collectibles: [1073998665, 942424421, 2754601998, 1058083665, 273762349, 1184968901, 1551165466, 1088431381, 1169536385, 1088431379, 1116762620, 2202434430, 3788698913, 2283993085, 2982198549, 1333654061, 2239241194, 259147458, 2532590120, 2532590121, 2532590122, 2532590123, 3773976304, 3773976311, 3773976310, 1176046832, 1176046833],
          records: [2808299284, 2442138301],
        },
      },
      {
        placeHash: 1259908504, // Mercury
        artifacts: {
          nodes: [4139791842, 3476818391, 3952745163, 2904849017],
          collectibles: [256984756, 1105208971, 1041306084, 1116543653, 1279318109, 1116762615, 2606709043, 3788698917, 4257745796, 2998976136, 2219212009, 1718922262, 225592290, 2034908838, 225592289, 225592291, 225592292, 225592293, 259147459, 4068960693, 4068960695, 4068960694, 4068960692, 1282368185, 1282368187, 1282368186, 1282368184, 1152758801, 1168191342, 1200315410, 1534387878, 2653720568],
          records: [1590210414, 2765010546],
        },
      },
      {
        placeHash: 2426873752, // Mars
        artifacts: {
          nodes: [4139791843, 4139791840, 3476818390, 3476818389, 3952745162, 3952745161, 3570368582],
          collectibles: [1041306082, 1203091693, 2998976141, 3805476501, 256984754, 1168191343, 1105208973, 1099984909, 1152758813, 1099984910, 1350431644, 1350431647, 1534387876, 1945987450, 2589931337, 2219212008, 2130750728, 2691646945, 4259147767, 4259147765, 4259147766, 4259147764, 2691646949, 2691646946, 2691646947, 2589931338, 2300770642, 2130750731, 2691646950, 2691646948, 2770012880, 2998976138, 1282368177, 1232035296, 1282368176, 259147457, 1199798688, 1945987448, 1945987451, 1945987454, 3368709535, 3816666661, 2770012883, 2691646944],
          records: [709188219, 435060157],
        },
      },
    ];

    // console.log(
    //   dcv
    //     .map((place) => {
    //       return `{
    //         placeHash: ${place.placeHash}, // ${manifest.DestinyPlaceDefinition[place.placeHash].displayProperties.name}\nartifacts: {
    //         nodes: [
    //           ${place.artifacts.nodes.map((hash) => `${hash}, // ${manifest.DestinyPresentationNodeDefinition[hash].displayProperties.name}`).join('\n')}
    //         ],
    //         collectibles: [
    //           ${place.artifacts.collectibles.map((hash) => `${hash}, // ${manifest.DestinyCollectibleDefinition[hash].displayProperties.name}`).join('\n')}
    //         ],
    //         records: [
    //           ${place.artifacts.records.map((hash) => `${hash}, // ${manifest.DestinyRecordDefinition[hash].displayProperties.name}`).join('\n')}
    //         ],
    //       }
    //     },`;
    //     })
    //     .join('\n')
    // );

    return (
      <div className='view' id='test'>
        <ul className='list collection-items'>
          <Collectibles hashes={reducedCollectibles} />
        </ul>
        <ul className='list record-items'>
          <Records hashes={reducedRecords} />
        </ul>
        <ul className='list collection-items'>
          <Collectibles hashes={hashes} />
        </ul>
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
    list: state.list,
  };
}

export default connect(mapStateToProps)(Test);
