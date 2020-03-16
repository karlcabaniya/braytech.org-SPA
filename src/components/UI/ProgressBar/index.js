import React from 'react';
import cx from 'classnames';

import manifest from '../../../utils/manifest';
import { stringToIcons } from '../../../utils/destinyUtils';
import { displayValue } from '../../../utils/destinyConverters';

import './styles.css';

class ProgressBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { classNames, hideCheck, hideFraction, hideFractionDenominator, hideDescription, chunky, progressionHash, objectiveHash } = this.props;

    let progress = this.props.progress || 0;
    let completionValue = this.props.completionValue || 0;
    let description = '';

    const definitionObjective = objectiveHash && manifest.DestinyObjectiveDefinition[objectiveHash];
    const definitionProgression = progressionHash && manifest.DestinyProgressionDefinition[progressionHash];

    if (definitionObjective) {

      description = definitionObjective.progressDescription;
      
    } else if (definitionProgression) {

      progress = this.props.progressToNextLevel;
      completionValue = this.props.nextLevelAt;
      description = (definitionProgression.displayProperties?.displayUnitsName !== '' && definitionProgression.displayProperties?.displayUnitsName )|| definitionProgression?.displayProperties?.name
      
    }

    if (this.props.description) {
      description = this.props.description;
    }

    description = stringToIcons(description);

    const complete = progress >= completionValue;
    const fractionFloat = definitionObjective?.isCountingDownward ? progress === 0 ? 0 : completionValue / progress : progress / completionValue;

    return (
      <div key={objectiveHash || progressionHash} className={cx('progress-bar', classNames, { complete: completionValue && complete, chunky: chunky })}>
        {!hideCheck ? <div className={cx('check', { ed: completionValue && complete })} /> : null}
        <div className={cx('bar', { full: hideCheck })}>
          <div className='text'>
            {!hideDescription ? <div className='description'>{description}</div> : <div />}
            {completionValue && !hideFraction ? (
              <div className='fraction'>
                {hideFractionDenominator ? displayValue(progress) : `${displayValue(progress)}/${displayValue(completionValue)}`}
              </div>
            ) : null}
          </div>
          {completionValue ? <div className='fill' style={{ width: `${Math.min(fractionFloat * 100, 100)}%` }} /> : null}
        </div>
      </div>
    );
  }
}

export default ProgressBar;
