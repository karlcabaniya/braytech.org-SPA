import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import actions from '../../../../store/actions';
import { t } from '../../../../utils/i18n';
import { info } from '../../../../utils/checklists';

import Button from '../../../UI/Button';
import Checkbox from '../../../UI/Checkbox';
import Dialog from '../../../UI/Dialog';

import './styles.css';

export default function Settings() {
  const [isVisible, setVisible] = useState(true);

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
console.log(path)
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

  const checklists = info();

  console.log(settings);

  return (
    <div className='control settings'>
      <Button action={handler_toggleVisibility}></Button>
      {isVisible && (
        <Dialog type='full' actions={dialogActions}>
          <div className='page-header'>
            <div className='sub-name'>{t('Maps')}</div>
            <div className='name'>{t('Settings')}</div>
          </div>
          <h4>{t('Checklists')}</h4>
          <ul className='list settings'>
            {checklists.map(({ checklistId, checklistItemName_plural }, c) => (
              <li key={c} onClick={handler_toggle(`maps.checklists.${checklistId}`)}>
                <Checkbox linked checked={settings.maps.checklists?.[checklistId]} text={checklistItemName_plural} />
              </li>
            ))}
          </ul>
        </Dialog>
      )}
    </div>
  );
}
