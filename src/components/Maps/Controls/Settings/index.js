import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import actions from '../../../../store/actions';
import { t } from '../../../../utils/i18n';
import checklists from '../../../../utils/checklists';

import Button from '../../../UI/Button';
import Checkbox from '../../../UI/Checkbox';
import Dialog from '../../../UI/Dialog';

import './styles.css';

export default function Settings() {
  const [isVisible, setVisible] = useState(false);

  const handler_toggleVisibility = () => {
    if (isVisible) {
      setVisible(false);
    } else {
      setVisible(true);
    }
  };

  const dialogActions = [
    {
      type: 'dismiss',
      text: t('Dismiss'),
      handler: handler_toggleVisibility,
    },
  ];

  const settings = useSelector((state) => state.settings);
  const dispatch = useDispatch();

  const handler_toggle = (key) => (e) => {
    const path = key.split('.');

    dispatch(
      actions.settings.set({
        [path[0]]: {
          [path[1]]: {
            [path[2]]: !settings[path[0]][path[1]]?.[path[2]],
          },
        },
      })
    );
  };

  const lists = isVisible && checklists();

  return (
    <div className='control settings'>
      <Button action={handler_toggleVisibility}></Button>
      {isVisible && (
        <Dialog type='full' actions={dialogActions}>
          <div className='header'>
            <div className='sub-name'>{t('Maps')}</div>
            <div className='name'>{t('Settings')}</div>
          </div>
          <h4>{t('Checklists')}</h4>
          <div className='info'>
            <p>{t('Settings.Maps.Checklists.Info')}</p>
          </div>
          <ul className='list settings'>
            {lists.map(({ checklistId, checklistItemName_plural, totalItems, completedItems }, c) => (
              <li key={c} onClick={handler_toggle(`maps.checklists.${checklistId}`)}>
                <Checkbox linked checked={settings.maps.checklists?.[checklistId]} text={checklistItemName_plural} />
                {/* <div className='info'>{completedItems}/{totalItems}</div> */}
              </li>
            ))}
          </ul>
        </Dialog>
      )}
    </div>
  );
}
