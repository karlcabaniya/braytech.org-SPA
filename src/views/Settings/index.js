import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import { getLanguageInfo } from '../../utils/languageInfo';
import * as ls from '../../utils/localStorage';
import { BungieAuth } from '../../components/BungieAuth';
import Checkbox from '../../components/UI/Checkbox';
import Button from '../../components/UI/Button';

import translationStats from '../../data/translationStats';

import './styles.css';

class Settings extends React.Component {
  constructor(props) {
    super(props);

    const initLanguage = this.props.i18n.getCurrentLanguage();

    this.state = {
      language: {
        current: initLanguage,
        selected: initLanguage,
      },
      swInstalled: false,
      swUpdateAttempt: false,
      swUnregisterAttempt: false,
    };
  }

  selectLanguage = (lang) => {
    this.setState((p) => ({ ...p, language: { ...p.language, selected: lang } }));
  };

  saveAndRestart = () => {
    const { i18n } = this.props;

    i18n.setCurrentLanguage(this.state.language.selected);

    setTimeout(() => {
      window.location.reload();
    }, 50);
  };

  handler_swUpdate = () => {
    if (this.mounted) this.setState({ swUpdateAttempt: true });

    navigator.serviceWorker.getRegistration('/').then(function (registration) {
      registration.update();
    });
  };

  handler_swDump = () => {
    if (this.mounted) this.setState({ swUnregisterAttempt: true });

    navigator.serviceWorker.getRegistration('/').then(function (registration) {
      registration.unregister();
      console.log(registration);
    });
  };

  async componentDidMount() {
    this.mounted = true;

    window.scrollTo(0, 0);

    const swInstalled = await this.swInstalled();

    if (this.mounted && swInstalled) this.setState({ swInstalled: true });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  swAvailable = process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator;

  swInstalled = async () => {
    if (this.swAvailable) {
      const registration = await navigator.serviceWorker.getRegistration('/');

      if (registration) return true;
    }

    return false;
  };

  handler_setTheme = (theme) => (e) => {
    this.props.setTheme(theme);
  };

  handler_toggle = (key) => (e) => {
    const path = key.split('.');

    this.props.set({
      [path[0]]: {
        [path[1]]: !this.props.settings[path[0]][path[1]],
      },
    });
  };

  handler_resetLayouts = (e) => {
    this.props.resetLayouts({ target: false });
  };

  handler_resetTrackedTriumphs = (e) => {
    this.props.setTrackedTriumphs([]);
  };

  handler_resetTipsState = (e) => {
    this.props.setTips([]);
  };

  handler_resetProfileHistory = (e) => {
    ls.set('history.profiles', []);
  };

  handler_resetNotificationsState = (e) => {
    ls.set('history.notifications', []);
  };

  handler_reloadApp = (e) => {
    setTimeout(() => {
      window.location.reload();
    }, 50);
  };

  render() {
    const { t, availableLanguages, location } = this.props;

    const languageButtons = availableLanguages.map((code) => {
      const langInfo = getLanguageInfo(code);

      return (
        <li
          key={code}
          onClick={() => {
            this.selectLanguage(code);
          }}
        >
          <Checkbox linked checked={this.state.language.selected === code}>
            <div className='text'>
              <div className='name'>{langInfo.name || langInfo.code}</div>
              <div className='coverage tooltip' data-hash='coverage' data-type='braytech'>
                {translationStats[langInfo.code] && Math.floor(((translationStats['en'].translated - translationStats[langInfo.code].notTranslated) / translationStats['en'].translated) * 100)}%
              </div>
            </div>
          </Checkbox>
        </li>
      );
    });

    return (
      <div className='view' id='settings'>
        <div className='module head'>
          <div className='page-header'>
            <div className='name'>{t('Settings')}</div>
          </div>
        </div>
        <div className='buff'>
          <div className='module'>
            <div className='sub-header sub'>
              <div>{t('Bungie.net profile')}</div>
            </div>
            <BungieAuth location={location} />
          </div>
          <div className='module'>
            <div className='sub-header sub'>
              <div>{t('Theme')}</div>
            </div>
            <ul className='list settings'>
              <li onClick={this.handler_setTheme('light')}>
                <Checkbox linked checked={this.props.theme.user === 'light'} text={t('Light')} />
              </li>
              <li onClick={this.handler_setTheme('dark')}>
                <Checkbox linked checked={this.props.theme.user === 'dark'} text={t('Dark')} />
              </li>
              <li onClick={this.handler_setTheme('system')}>
                <Checkbox linked checked={!this.props.theme.user} text={t('Match system')} />
              </li>
            </ul>
            <div className='sub-header sub'>
              <div>{t('Local data')}</div>
            </div>
            <div className='buttons'>
              <Button text={t('Reset profile history')} action={this.handler_resetProfileHistory} />
              <div className='info'>
                <p>{t('Deletes the stored list of previously loaded member profiles (character select)')}</p>
              </div>
              <Button text={t('Reset tracked triumphs')} action={this.handler_resetTrackedTriumphs} />
              <div className='info'>
                <p>{t('Untrack all user-tracked triumphs. Will not affect the state of in-game triumphs.')}</p>
              </div>
              <Button text={t('Reset tips')} action={this.handler_resetTipsState} />
              <div className='info'>
                <p>{t('Restore informational tips to their default state')}</p>
              </div>
              <Button text={t('Reset notifications')} action={this.handler_resetNotificationsState} />
              <div className='info'>
                <p>{t('Reset dismissed notifications to their default state')}</p>
              </div>
              <Button text={t('Reset customisable layouts')} action={this.handler_resetLayouts} />
              <div className='info'>
                <p>{t('Reset customisable layouts to their default arrangements')}</p>
              </div>
            </div>
          </div>
          <div className='module'>
            <div className='sub-header sub'>
              <div>{t('Visual fidelity')}</div>
            </div>
            <ul className='list settings'>
              <li onClick={this.handler_toggle('visual.passiveAnimations')}>
                <Checkbox linked checked={this.props.settings.visual.passiveAnimations} text={t('Enable passive animations')} />
                <div className='info'>
                  <p>{t('Controls most animations. Disabling passive animations may improve performance on low power devices.')}</p>
                </div>
              </li>
              <li onClick={this.handler_toggle('visual.three')}>
                <Checkbox linked checked={this.props.settings.visual.three} text={t('Enable 3D models')} />
                <div className='info'>
                  <p>{t('Where applicable, use 3D models. Not recommended for phones or low power devices.')}</p>
                </div>
              </li>
              {this.props.settings.visual.three && 2 === 3 ? (
                <>
                  <li onClick={this.handler_toggle('visual.threeShadows')}>
                    <Checkbox linked checked={this.props.settings.visual.threeShadows} text={t('Enable 3D model shadows')} />
                    <div className='info'>
                      <p>{t('3D models will cast shadows upon themselves for a more realistic and true representation. Affects performance. Experimental.')}</p>
                    </div>
                  </li>
                </>
              ) : null}
            </ul>
            <div className='sub-header sub'>
              <div>{t('Item visibility')}</div>
            </div>
            <ul className='list settings'>
              <li onClick={this.handler_toggle('itemVisibility.hideCompletedChecklistItems')}>
                <Checkbox linked checked={this.props.settings.itemVisibility.hideCompletedChecklistItems} text={t('Hide completed checklist items')} />
                <div className='info'>
                  <p>{t('If a checklist item is completed, it will be hidden under Checklist view.')}</p>
                </div>
              </li>
              <li onClick={this.handler_toggle('itemVisibility.hideCompletedRecords')}>
                <Checkbox linked checked={this.props.settings.itemVisibility.hideCompletedRecords} text={t('Hide completed triumphs')} />
                <div className='info'>
                  <p>{t('If a triumph record is completed and redeemed, it will be hidden under Triumphs views.')}</p>
                </div>
              </li>
              <li onClick={this.handler_toggle('itemVisibility.hideInvisibleRecords')}>
                <Checkbox linked checked={this.props.settings.itemVisibility.hideInvisibleRecords} text={t('Hide invisible triumph records')} />
                <div className='info'>
                  <p>{t('If the game specifies that you are unable to see a particular triumph record, it will be hidden under Triumphs views.')}</p>
                </div>
              </li>
              <li onClick={this.handler_toggle('itemVisibility.hideUnobtainableRecords')}>
                <Checkbox linked checked={this.props.settings.itemVisibility.hideUnobtainableRecords} text={t('Hide unobtainable triumph records')} />
                <div className='info'>
                  <p>{t('Hides unobtainable records from view')}</p>
                </div>
              </li>
              <li onClick={this.handler_toggle('itemVisibility.hideDudRecords')}>
                <Checkbox linked checked={this.props.settings.itemVisibility.hideDudRecords} text={t('Hide dud triumph records')} />
                <div className='info'>
                  <p>{t('Hides dud (empty or unused) records from view')}</p>
                </div>
              </li>
              <li onClick={this.handler_toggle('itemVisibility.hideCompletedCollectibles')}>
                <Checkbox linked checked={this.props.settings.itemVisibility.hideCompletedCollectibles} text={t('Hide acquired collection items')} />
                <div className='info'>
                  <p>{t('If a collectible has been acquired, it will be hidden under Collections views.')}</p>
                </div>
              </li>
              <li onClick={this.handler_toggle('itemVisibility.hideInvisibleCollectibles')}>
                <Checkbox linked checked={this.props.settings.itemVisibility.hideInvisibleCollectibles} text={t('Hide invisible collection items')} />
                <div className='info'>
                  <p>{t('If the game specifies that you are unable to see a particular collectible, it will be hidden under Collections views.')}</p>
                </div>
              </li>
            </ul>
          </div>
          <div className='module'>
            <div className='sub-header sub'>
              <div>{t('Language')}</div>
            </div>
            <ul className='list settings'>{languageButtons}</ul>
            <Button text={t('Save and restart')} disabled={this.state.language.current === this.state.language.selected} action={this.saveAndRestart} />
          </div>
          <div className='module'>
            <div className='sub-header sub'>
              <div>{t('Developer')}</div>
            </div>
            <ul className='list settings'>
              <li onClick={this.handler_toggle('visual.threeDebug')}>
                <Checkbox linked checked={this.props.settings.visual.threeDebug} text={t('3D model debug mode')} />
                <div className='info'>
                  <p>{t('Displays extra information for debugging 3D models')}</p>
                </div>
              </li>
              <li onClick={this.handler_toggle('maps.debug')}>
                <Checkbox linked checked={this.props.settings.maps.debug} text={t('Maps debug mode')} />
                <div className='info'>
                  <p>{t('Enable Maps debugging settings')}</p>
                </div>
              </li>
              {this.props.settings.maps.debug ? (
                <>
                  <li onClick={this.handler_toggle('maps.noScreenshotHighlight')}>
                    <Checkbox linked checked={this.props.settings.maps.noScreenshotHighlight} text={t('Highlight nodes without screenshots')} />
                    <div className='info'>
                      <p>{t('Map nodes, such as region chests, which do not have an associated screenshot will be highlighted in order to assist users with contributing to maps data.')}</p>
                    </div>
                  </li>
                  <li onClick={this.handler_toggle('maps.logDetails')}>
                    <Checkbox linked checked={this.props.settings.maps.logDetails} text={t('Log node details')} />
                    <div className='info'>
                      <p>{t('Console.log details for the mouse-invoked node.')}</p>
                    </div>
                  </li>
                </>
              ) : null}
              <li onClick={this.handler_toggle('developer.lists')}>
                <Checkbox linked checked={this.props.settings.developer.lists} text={t('Enable lists')} />
                <div className='info'>
                  <p>{t('Enable developer lists by overriding links')}</p>
                </div>
              </li>
            </ul>
            <div className='sub-header sub'>
              <div>{t('Troubleshooting')}</div>
            </div>
            <div className='buttons'>
              <Button text={t('Reload')} action={this.handler_reloadApp} />
              <div className='info'>
                <p>{t('Reload the app')}</p>
              </div>
              {this.swAvailable && this.state.swInstalled ? (
                <>
                  <Button text={t('Update service worker')} disabled={!this.state.swInstalled || this.state.swUpdateAttempt || this.state.swUnregisterAttempt} action={this.handler_swUpdate} />
                  <div className='info'>
                    <p>{t('Attempt to update the service worker immediately. This function will disable the button temporarily. You may continue to use Braytech while it attempts to update in the background. If successful, you will be prompted to restart the app.')}</p>
                  </div>
                  <Button text={t('Dump service worker')} disabled={!this.state.swInstalled || this.state.swUnregisterAttempt} action={this.handler_swDump} />
                  <div className='info'>
                    <p>{t('Attempt to unregister the installed service worker. If successful, reloading the app will allow a new service worker to take its place.')}</p>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    settings: state.settings,
    theme: state.theme,
    member: state.member,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    set: (payload) => {
      dispatch({ type: 'SET_SETTING', payload });
    },
    setTheme: (value) => {
      dispatch({ type: 'SET_THEME', payload: value });
    },
    setTrackedTriumphs: (value) => {
      dispatch({ type: 'SET_TRACKED_TRIUMPHS', payload: value });
    },
    setTips: (value) => {
      dispatch({ type: 'SET_TIPS', payload: value });
    },
    resetLayouts: (value) => {
      dispatch({ type: 'RESET_LAYOUTS', payload: value });
    },
  };
}

export default compose(connect(mapStateToProps, mapDispatchToProps), withTranslation())(Settings);
