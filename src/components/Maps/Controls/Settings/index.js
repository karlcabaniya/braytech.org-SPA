import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import actions from '../../../../store/actions';
import { t, BraytechText } from '../../../../utils/i18n';
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

    if (path.length > 2) {
      dispatch(
        actions.settings.set({
          [path[0]]: {
            [path[1]]: {
              [path[2]]: !settings[path[0]][path[1]]?.[path[2]],
            },
          },
        })
      );
    } else {
      dispatch(
        actions.settings.set({
          [path[0]]: {
            [path[1]]: !settings[path[0]][path[1]],
          },
        })
      );
    }
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
          <div className='groups'>
            <div>
              <h4>{t('Checklists')}</h4>
              <BraytechText className='info' value={t('Settings.Maps.Checklists.Info')} />
              <ul className='list settings'>
                {lists.map(({ checklistId, checklistItemName_plural, totalItems, completedItems }, c) => (
                  <li key={c}>
                    <Checkbox linked checked={settings.maps.checklists?.[checklistId]} text={checklistItemName_plural} action={handler_toggle(`maps.checklists.${checklistId}`)} />
                    {/* <div className='info'>{completedItems}/{totalItems}</div> */}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4>{t('Developer')}</h4>
              <BraytechText className='info' value={t('Settings.Maps.Developer.Info')} />
              <ul className='list settings'>
                <li>
                  <Checkbox linked checked={settings.maps.debug} text={t('Settings.Maps.Debug.Name')} action={this.handler_toggle('maps.debug')} />
                  <BraytechText className='info' value={t('Settings.Maps.Debug.Description')} />
                </li>
                <li>
                  <Checkbox linked checked={settings.maps.noScreenshotHighlight} text={t('Settings.Maps.NoScreenshotHighlight.Name')} disabled={!settings.maps.debug} action={this.handler_toggle('maps.noScreenshotHighlight')} />
                  <BraytechText className='info' value={t('Settings.Maps.NoScreenshotHighlight.Description')} />
                </li>
                <li>
                  <Checkbox linked checked={settings.maps.logDetails} text={t('Settings.Maps.LogDetails.Name')} disabled={!settings.maps.debug} action={this.handler_toggle('maps.logDetails')} />
                  <BraytechText className='info' value={t('Settings.Maps.LogDetails.Description')} />
                </li>
              </ul>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}
