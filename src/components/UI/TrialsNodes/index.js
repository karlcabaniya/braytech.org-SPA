import React from 'react';

import manifest from '../../../utils/manifest';

import './styles.css';

export default function TrialsNodes(props) {
  const definitionWins = manifest.DestinyProgressionDefinition[1062449239];
  const definitionLosses = manifest.DestinyProgressionDefinition[2093709363];

  if (props.losses) {
    return (
      <div className='trials-nodes'>
        {definitionLosses.steps.map((step, s) => {
          if (props.value > s) {
            return (
              <div key={s} className='game loss'>
                <div />
              </div>
            );
          } else {
            return (
              <div key={s} className='game'>
                <div />
              </div>
            );
          }
        })}
      </div>
    );
  } else {
    return (
      <div className='trials-nodes'>
        {definitionWins.steps.map((step, s) => {
          if (props.value > s) {
            return (
              <div key={s} className='game win'>
                <div />
              </div>
            );
          } else {
            return (
              <div key={s} className='game'>
                <div />
              </div>
            );
          }
        })}
      </div>
    );
  }
}
