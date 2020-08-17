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
          if (2 > s) {
            return (
              <div key={s} className='game loss'>
                <div>
                  <svg viewBox='0 0 1024 1024'>
                    <polygon points="883.9,988.6 512,616.7 140.1,988.6 35.4,883.9 407.3,512 35.4,140.1 140.1,35.4 512,407.3 883.9,35.4 988.6,140.1 
	616.7,512 988.6,883.9" />
                  </svg>
                </div>
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
