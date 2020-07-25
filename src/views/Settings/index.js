import React from 'react';
import { connect } from 'react-redux';

import i18n, { t, BraytechText, getLanguageInfo } from '../../utils/i18n';
import ls from '../../utils/localStorage';
import { BungieAuth } from '../../components/BungieAuth';
import Checkbox from '../../components/UI/Checkbox';
import Button from '../../components/UI/Button';

import translationStats from '../../data/translationStats';

import './styles.css';

class Settings extends React.Component {
  constructor(props) {
    super(props);

    const initLanguage = i18n.getCurrentLanguage();

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

  selectLanguage = (lang) => (e) => {
    this.setState((state) => ({
      language: {
        ...state.language,
        selected: lang,
      },
    }));
  };

  saveAndRestart = () => {
    i18n.setCurrentLanguage(this.state.language.selected);

    setTimeout(() => {
      window.location.reload();
    }, 50);
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

  handler_swUpdate = () => {
    if (this.mounted) this.setState({ swUpdateAttempt: true });

    navigator.serviceWorker.getRegistration('/').then((registration) => {
      registration
        .update()
        .catch((error) => {
          console.error('Service Worker: unable to update service worker', error);
        })
        .then(() => {
          if (registration.waiting) {
            console.log('Service Worker: updated, but is "waiting"');
          } else {
            console.log('Service Worker: updated');
          }

          if (this.mounted) this.setState({ swUpdateAttempt: false });
        });
    });
  };

  handler_swDump = () => {
    if (this.mounted) this.setState({ swUnregisterAttempt: true });

    navigator.serviceWorker.getRegistration('/').then((registration) => {
      registration.unregister();

      console.log(registration);
    });
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

  handler_resetEverything = (e) => {
    window.localStorage.clear();

    setTimeout(() => {
      window.location.reload();
    }, 50);
  };

  handler_resetProfileHistory = (e) => {
    ls.set('history.profiles', []);
  };

  handler_resetNotificationsState = (e) => {
    this.props.resetNotifications();
  };

  handler_reloadApp = (e) => {
    setTimeout(() => {
      window.location.reload();
    }, 50);
  };

  render() {
    const { settings, location } = this.props;

    const languageButtons = this.props.availableLanguages.map((code) => {
      const langInfo = getLanguageInfo(code);

      return (
        <li key={code}>
          <Checkbox linked checked={this.state.language.selected === code} action={this.selectLanguage(code)}>
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
              <div>{t('Item visibility')}</div>
            </div>
            <ul className='list settings'>
              <li>
                <Checkbox linked checked={settings.itemVisibility.hideCompletedChecklistItems} text={t('Hide completed checklist items')} action={this.handler_toggle('itemVisibility.hideCompletedChecklistItems')} />
                <BraytechText className='info' value={t('If a checklist item is completed, it will be hidden under Checklist view.')} />
              </li>
              <li>
                <Checkbox linked checked={settings.itemVisibility.hideCompletedRecords} text={t('Hide completed triumphs')} action={this.handler_toggle('itemVisibility.hideCompletedRecords')} />
                <BraytechText className='info' value={t('If a triumph record is completed and redeemed, it will be hidden under Triumphs views.')} />
              </li>
              <li>
                <Checkbox linked checked={settings.itemVisibility.hideInvisibleRecords} text={t('Hide invisible triumph records')} action={this.handler_toggle('itemVisibility.hideInvisibleRecords')} />
                <BraytechText className='info' value={t('If the game specifies that you are unable to see a particular triumph record, it will be hidden under Triumphs views.')} />
              </li>
              <li>
                <Checkbox linked checked={settings.itemVisibility.hideUnobtainableRecords} text={t('Hide unobtainable triumph records')} action={this.handler_toggle('itemVisibility.hideUnobtainableRecords')} />
                <BraytechText className='info' value={t('Hides unobtainable records from view')} />
              </li>
              <li>
                <Checkbox linked checked={settings.itemVisibility.hideDudRecords} text={t('Hide dud triumph records')} action={this.handler_toggle('itemVisibility.hideDudRecords')} />
                <BraytechText className='info' value={t('Hides dud (empty or unused) records from view')} />
              </li>
              <li>
                <Checkbox linked checked={settings.itemVisibility.hideCompletedCollectibles} text={t('Hide acquired collection items')} action={this.handler_toggle('itemVisibility.hideCompletedCollectibles')} />
                <BraytechText className='info' value={t('If a collectible has been acquired, it will be hidden under Collections views.')} />
              </li>
              <li>
                <Checkbox linked checked={settings.itemVisibility.hideInvisibleCollectibles} text={t('Hide invisible collection items')} action={this.handler_toggle('itemVisibility.hideInvisibleCollectibles')} />
                <BraytechText className='info' value={t('If the game specifies that you are unable to see a particular collectible, it will be hidden under Collections views.')} />
              </li>
              <li>
                <Checkbox linked checked={settings.itemVisibility.suppressVaultWarnings} text={t('Suppress Vault Warnings')} action={this.handler_toggle('itemVisibility.suppressVaultWarnings')} />
                <BraytechText className='info' value={t('Hide any warnings of whether a collectible or record is heading to the _Destiny Content Vault_.')} />
              </li>
            </ul>
          </div>
          <div className='module'>
            <div className='sub-header sub'>
              <div>{t('Theme')}</div>
            </div>
            <ul className='list settings'>
              <li>
                <Checkbox linked checked={this.props.theme.user === 'light'} text={t('Light')} action={this.handler_setTheme('light')} />
              </li>
              <li>
                <Checkbox linked checked={this.props.theme.user === 'dark'} text={t('Dark')} action={this.handler_setTheme('dark')} />
              </li>
              <li>
                <Checkbox linked checked={!this.props.theme.user} text={t('Match system')} action={this.handler_setTheme('system')} />
              </li>
            </ul>
            <div className='sub-header sub'>
              <div>{t('Visual fidelity')}</div>
            </div>
            <ul className='list settings'>
              <li>
                <Checkbox linked checked={settings.visual.passiveAnimations} text={t('Enable passive animations')} action={this.handler_toggle('visual.passiveAnimations')} />
                <BraytechText className='info' value={t('Controls most animations. Disabling passive animations may improve performance on low power devices.')} />
              </li>
              <li>
                <Checkbox linked checked={settings.visual.three} text={t('Enable 3D models')} action={this.handler_toggle('visual.three')} />
                <BraytechText className='info' value={t('Where applicable, use 3D models. Not recommended for phones or low power devices.')} />
              </li>

              <li>
                <Checkbox linked checked={settings.visual.threeShadows} text={t('Enable 3D model shadows')} disabled={!settings.visual.three || 3 === 3} action={this.handler_toggle('visual.threeShadows')} />
                <div className='info'>
                  <p>{t('3D models will cast shadows upon themselves for a more realistic and true representation. Affects performance. Experimental.')}</p>
                </div>
              </li>
              <li>
                <Checkbox linked checked={settings.visual.gay} text={t('Enable ✨')} action={this.handler_toggle('visual.gay')} />
                <BraytechText className='info' value={t('Gay it up, bitch. Light up your life with fabulous, limited edition, ground-shattering, Braytech® exclusive! technological innovation.')} />
              </li>
            </ul>
            <div className='sub-header sub'>
              <div>{t('Developer')}</div>
            </div>
            <ul className='list settings'>
              <li>
                <Checkbox linked checked={settings.visual.threeDebug} text={t('3D model debug mode')} action={this.handler_toggle('visual.threeDebug')} />
                <BraytechText className='info' value={t('Displays extra information for debugging 3D models')} />
              </li>
              <li>
                <Checkbox linked checked={settings.maps.debug} text={t('Maps debug mode')} action={this.handler_toggle('maps.debug')} />
                <BraytechText className='info' value={t('Enable Maps debugging settings')} />
              </li>
              <li>
                <Checkbox linked checked={settings.maps.noScreenshotHighlight} text={t('Highlight nodes without screenshots')} disabled={!settings.maps.debug} action={this.handler_toggle('maps.noScreenshotHighlight')} />
                <BraytechText className='info' value={t('Map nodes, such as region chests, which do not have an associated screenshot will be highlighted in order to assist users with contributing to maps data.')} />
              </li>
              <li>
                <Checkbox linked checked={settings.maps.logDetails} text={t('Log node details')} disabled={!settings.maps.debug} action={this.handler_toggle('maps.logDetails')} />
                <BraytechText className='info' value={t('Console.log details for the mouse-invoked node.')} />
              </li>
              <li>
                <Checkbox linked checked={settings.developer.lists} text={t('Enable lists')} action={this.handler_toggle('developer.lists')} />
                <BraytechText className='info' value={t('Enable developer lists by overriding links')} />
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
              <div>{t('Local data')}</div>
            </div>
            <div className='buttons'>
              <Button text={t('Reset profile history')} action={this.handler_resetProfileHistory} />
              <BraytechText className='info' value={t('Deletes the stored list of previously loaded member profiles (character select)')} />
              <Button text={t('Reset tracked triumphs')} action={this.handler_resetTrackedTriumphs} />
              <BraytechText className='info' value={t('Untrack all user-tracked triumphs. Will not affect the state of in-game triumphs.')} />
              <Button text={t('Reset tips')} action={this.handler_resetTipsState} />
              <BraytechText className='info' value={t('Restore informational tips to their default state')} />
              <Button text={t('Reset notifications')} action={this.handler_resetNotificationsState} />
              <BraytechText className='info' value={t('Reset dismissed notifications to their default state')} />
              <Button text={t('Reset customisable layouts')} action={this.handler_resetLayouts} />
              <BraytechText className='info' value={t('Reset customisable layouts to their default arrangements')} />
              <Button text={t('Reset everything')} action={this.handler_resetEverything} />
              <BraytechText className='info' value={t('Reset all user settings, saved data, and history.')} />
            </div>
            <div className='sub-header sub'>
              <div>{t('Troubleshooting')}</div>
            </div>
            <div className='buttons'>
              <Button text={t('Reload')} action={this.handler_reloadApp} />
              <BraytechText className='info' value={t('Reload the app')} />
              {this.swAvailable && this.state.swInstalled ? (
                <>
                  <Button text={t('Update service worker')} disabled={!this.state.swInstalled || this.state.swUpdateAttempt || this.state.swUnregisterAttempt} action={this.handler_swUpdate} />
                  <BraytechText className='info' value={t('Attempt to update the service worker immediately. This function will disable the button temporarily. You may continue to use Braytech while it attempts to update in the background. If successful, you will be prompted to restart the app.')} />
                  <Button text={t('Dump service worker')} disabled={!this.state.swInstalled || this.state.swUnregisterAttempt} action={this.handler_swDump} />
                  <BraytechText className='info' value={t('Attempt to unregister the installed service worker. If successful, reloading the app will allow a new service worker to take its place.')} />
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
    resetNotifications: () => {
      dispatch({ type: 'RESET_NOTIFICATIONS' });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
