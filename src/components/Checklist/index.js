import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import cx from 'classnames';

import { t } from '../../utils/i18n';
import ProgressBar from '../UI/ProgressBar';
import Checkbox from '../UI/Checkbox';

import './styles.css';

const ChecklistItem = ({ completed, suffix, name, location, destinationHash, mapHash }) => {

  return (
    <li className={cx({ completed })}>
      <Checkbox checked={completed} children={<div className='name'>{name + (suffix ? ` ${suffix}` : '')}</div>} />
      <div className='location'>{location}</div>
      {destinationHash && (
        <Link className='button' to={`/maps/${destinationHash}/${mapHash}`}>
          <i className='segoe-uniE0AB' />
        </Link>
      )}
    </li>
  );
};

const Checklist = ({ settings, headless, completedItems, checklistCharacterBound, checklistName, checklistProgressDescription, ...props }) => {
  const items = settings.itemVisibility.hideCompletedChecklistItems ? props.items.filter((item) => !item.completed).filter((item) => !item.extended?.unavailable) : props.items.filter((item) => item.completed || (!item.completed && !item.extended?.unavailable));
  const totalItems = props.items.filter((item) => item.completed || (!item.completed && !item.extended?.unavailable)).length;

  if (headless) {
    return (
      <>
        {items.length > 0 ? (
          <ul className='list checklist-items'>
            {items.map((entry, i) => (
              <ChecklistItem key={i} completed={entry.completed} {...entry.displayProperties} destinationHash={entry.destinationHash} mapHash={entry.checklistHash || entry.recordHash} />
            ))}
          </ul>
        ) : (
          <div className='info'>
            <div className='text'>{t('All complete')}</div>
          </div>
        )}
      </>
    );
  } else {
    return (
      <>
        <div className='module-header'>
          <div className='sub-name'>{checklistName}</div>
          {checklistCharacterBound ? (
            <div className='tooltip' data-hash='character_bound' data-type='braytech'>
              <i className='segoe-uniE902' />
            </div>
          ) : null}
        </div>
        <ProgressBar description={checklistProgressDescription} completionValue={totalItems} progress={completedItems} hideCheck chunky />
        {items.length > 0 ? (
          <ul className='list checklist-items'>
            {items.map((entry, i) => (
              <ChecklistItem key={i} completed={entry.completed} {...entry.displayProperties} destinationHash={entry.destinationHash} mapHash={entry.checklistHash || entry.recordHash} />
            ))}
          </ul>
        ) : (
          <div className='info'>
            <div className='text'>{t('All complete')}</div>
          </div>
        )}
      </>
    );
  }
};

function mapStateToProps(state) {
  return {
    settings: state.settings,
  };
}

export default connect(mapStateToProps)(Checklist);
