import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Redirect, Link, withRouter } from 'react-router-dom';
import { debounce } from 'lodash';
import cx from 'classnames';
import Moment from 'react-moment';
import Markdown from 'react-markdown';
import queryString from 'query-string';

import store from '../../store';
import { t } from '../../utils/i18n';
import * as bungie from '../../utils/bungie';
import * as voluspa from '../../utils/voluspa';
import * as enums from '../../utils/destinyEnums';
import * as paths from '../../utils/paths';
import Button from '../UI/Button';
import Spinner from '../UI/Spinner';
import ObservedImage from '../ObservedImage';
import { ReactComponent as CrossSaveIcon } from '../../svg/miscellaneous/cross-save.svg';

import './styles.css';

const RegExpEmail = new RegExp(/^\S+@\S+\.\S+$/);

class PatreonAssociation extends React.Component {
  state = {
    loading: false,
    error: false,
    value: '',
    valid: false
  };

  componentDidMount() {
    this.mounted = true;

    window.scrollTo(0, 0);
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handler_onSearchChange = e => {
    this.setState({
      value: e.target.value,
      valid: RegExpEmail.test(e.target.value)
    });
  };

  handler_onSearchKeyPress = e => {
    // If they pressed enter, ignore the debounce and search right meow. MEOW, SON.
    if (e.key === 'Enter') this.setAssociation.flush();
  };

  handler_onSubmit = e => {
    e.preventDefault();

    this.setAssociation();
  }

  setAssociation = debounce(async () => {
    const membershipIds = this.props.destinyMemberships.map(m => m.membershipId);
    const email = this.state.value;

    if (!membershipIds.length || email === '') return;

    this.setState({
      loading: true
    });

    await voluspa.PostPatreon({ membershipIds, email });

    this.setState({
      loading: false
    });
  });

  render() {
    const { loading, error, value, valid } = this.state;

    return (
      <div className='bungie-auth'>
        <h4>{t('Patreon association')}</h4>
        <div className='patreon'>
          <Markdown className='text' source={`Some Patreon tiers include rewards in the form of _flair_ which is displayed at the side of your player name.\nEnable display of relevant flair by entering the same email associated with your Patreon account.`} />
          <form onSubmit={this.handler_onSubmit}>
            <div className='form'>
              <div className='field'>
                <input onChange={this.handler_onSearchChange} type='email' required placeholder={t('chonky_zuzuvala69@hotmail.reef')} pattern='^\S+@\S+\.\S+$' spellCheck='false' value={value} onKeyPress={this.handler_onSearchKeyPress} />
              </div>
            </div>
            <div className='actions'>
              <Button text={t('Cancel')} action={this.props.handler} />
              {loading ? <Spinner mini /> : <Button text={t('Set')} action={this.handler_onSubmit} type='submit' disabled={!valid} />}
            </div>
          </form>
        </div>
      </div>
    );
  }
}

class BungieAuth extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      memberships: false,
      error: false,
      patreon: false
    };
  }

  getAccessTokens = async code => {
    await bungie.GetOAuthAccessToken(`client_id=${process.env.REACT_APP_BUNGIE_CLIENT_ID}&grant_type=authorization_code&code=${code}`);

    if (this.mounted) {
      this.getMemberships();
    }
  };

  handleErrors = response => {
    if (response.error && response.error === 'invalid_grant') {
      this.props.resetAuth();
    }
  };

  getMemberships = async () => {
    const response = await bungie.GetMembershipDataForCurrentUser();

    if (this.mounted) {
      if (response && response.ErrorCode && response.ErrorCode === 1) {
        this.setState(p => ({
          ...p,
          loading: false,
          memberships: response.Response
        }));
      } else if ((response && response.ErrorCode && response.ErrorCode !== 1) || (response && response.error)) {
        this.handleErrors(response);

        this.setState(p => ({
          ...p,
          loading: false,
          error: {
            ErrorCode: response.ErrorCode || response.error,
            ErrorStatus: response.ErrorStatus || response.error_description
          }
        }));
      } else {
        this.setState(p => ({
          ...p,
          loading: false,
          error: true
        }));
      }
    }
  };

  handler_goToBungie = e => {
    window.location = authUrl;
  };

  handler_forget = e => {
    this.props.resetAuth();

    this.setState({
      memberships: false
    });
  };

  handler_patreon = e => {
    this.setState(p => ({
      patreon: !p.patreon
    }));
  };

  componentDidMount() {
    this.mounted = true;

    const { location, auth } = this.props;

    const code = queryString.parse(location.search) && queryString.parse(location.search).code;

    if (code) {
      this.getAccessTokens(code);
    } else if (auth) {
      this.getMemberships();
    } else if (this.mounted) {
      this.setState(p => ({
        ...p,
        loading: false
      }));
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const { location } = this.props;
    const { loading, memberships, error, patreon } = this.state;

    const code = queryString.parse(location.search) && queryString.parse(location.search).code;

    if (code) {
      return <Redirect to='/settings' />;
    }

    if (patreon) {
      return <PatreonAssociation {...memberships} handler={this.handler_patreon} />;
    }

    if (loading) {
      return <Spinner mini />;
    } else {
      if (memberships && !error) {
        return (
          <div className='bungie-auth'>
            <div className='member'>
              <ObservedImage className='image background' src={`https://www.bungie.net/img/UserThemes/${memberships.bungieNetUser.profileThemeName}/header.jpg`} />
              <div className='details'>
                <div className={cx('icon', { shadow: !/.gif/.test(memberships.bungieNetUser.profilePicturePath) })}>
                  <ObservedImage className='image' src={`https://www.bungie.net${memberships.bungieNetUser.profilePicturePath}`} />
                </div>
                <div className='text'>
                  <div className='displayName'>{memberships.bungieNetUser.displayName}</div>
                  <div className='firstAccess'>
                    <Moment format='DD/MM/YYYY'>{memberships.bungieNetUser.firstAccess}</Moment>
                  </div>
                </div>
              </div>
            </div>
            <div className='memberships'>
              <h4>{t('Associated memberships')}</h4>
              <ul className='list'>
                {memberships.destinyMemberships.map(m => {
                  return (
                    <li key={m.membershipId} className='linked'>
                      <div className='icon'>
                        <span className={`destiny-platform_${enums.platforms[m.membershipType]}`} />
                      </div>
                      <div className='displayName'>{memberships.bungieNetUser.blizzardDisplayName && m.membershipType === 4 ? memberships.bungieNetUser.blizzardDisplayName : m.displayName}</div>
                      {m.crossSaveOverride === m.membershipType ? (
                        <div className='cross-save'>
                          <CrossSaveIcon />
                        </div>
                      ) : null}
                      <Link
                        to='/character-select'
                        onClick={e => {
                          store.dispatch({ type: 'MEMBER_LOAD_MEMBERSHIP', payload: { membershipType: m.membershipType, membershipId: m.membershipId } });
                        }}
                      />
                    </li>
                  );
                })}
              </ul>
              <div className='info'>
                <p>{t('These are the memberships that are currenty associated with your Bungie.net profile.')}</p>
              </div>
            </div>
            <h4>{t('Authentication data')}</h4>
            <Button text={t('Forget me')} action={this.handler_forget} />
            <div className='info'>
              <p>{t('Delete the authentication data stored on your device. While unnecessary, this function is provided for your peace of mind.')}</p>
            </div>
            <Button text={t('Patreon association')} action={this.handler_patreon} />
            <div className='info'>
              <p>{t('Associate this Bungie.net profile with a Patreon account')}</p>
            </div>
          </div>
        );
      } else {
        if (error) {
          return (
            <div className='bungie-auth'>
              <div className='text'>
                {error.ErrorCode ? (
                  <>
                    <p>
                      {error.ErrorCode} {error.ErrorStatus}
                    </p>
                    <p>{error.Message}</p>
                  </>
                ) : (
                  t('Unknown error')
                )}
              </div>
              <Button cta action={this.handler_goToBungie}>
                <div className='text'>{t('Authenticate')}</div>
                <i className='segoe-uniE0AB' />
              </Button>
            </div>
          );
        } else {
          return (
            <div className='bungie-auth'>
              <Button cta action={this.handler_goToBungie}>
                <div className='text'>{t('Authenticate')}</div>
                <i className='segoe-uniE0AB' />
              </Button>
            </div>
          );
        }
      }
    }
  }
}

class BungieAuthMini extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      memberships: false,
      error: false
    };
  }

  handleErrors = response => {
    if (response.error && response.error === 'invalid_grant') {
      this.props.resetAuth();
    }
  };

  handler_goToBungie = e => {
    window.location = authUrl;
  };

  getMemberships = async () => {
    const response = await bungie.GetMembershipDataForCurrentUser();

    if (this.mounted) {
      if (response && response.ErrorCode === 1) {
        this.setState(p => ({
          ...p,
          loading: false,
          memberships: response.Response
        }));
      } else if ((response && response.ErrorCode && response.ErrorCode !== 1) || (response && response.error)) {
        this.handleErrors(response);

        this.setState(p => ({
          ...p,
          loading: false,
          error: {
            ErrorCode: response.ErrorCode || response.error,
            ErrorStatus: response.ErrorStatus || response.error_description
          }
        }));
      } else {
        this.setState(p => ({
          ...p,
          loading: false,
          error: true
        }));
      }
    }
  };

  componentDidMount() {
    this.mounted = true;

    const { auth } = this.props;

    if (auth) {
      this.getMemberships();
    } else if (this.mounted) {
      this.setState(p => ({
        ...p,
        loading: false
      }));
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const { loading, memberships, error } = this.state;

    if (loading) {
      return <Spinner mini />;
    } else {
      if (memberships && !error) {
        return (
          <div className='bungie-auth'>
            <div className='memberships'>
              <ul className='list'>
                {memberships.destinyMemberships.map(m => {
                  return (
                    <li key={m.membershipId} className='linked'>
                      <div className='icon'>
                        <span className={`destiny-platform_${enums.platforms[m.membershipType]}`} />
                      </div>
                      <div className='displayName'>{memberships.bungieNetUser.blizzardDisplayName && m.membershipType === 4 ? memberships.bungieNetUser.blizzardDisplayName : m.displayName}</div>
                      {m.crossSaveOverride === m.membershipType ? (
                        <div className='cross-save'>
                          <CrossSaveIcon />
                        </div>
                      ) : null}
                      <Link
                        to='/character-select'
                        onClick={e => {
                          store.dispatch({ type: 'MEMBER_LOAD_MEMBERSHIP', payload: { membershipType: m.membershipType, membershipId: m.membershipId } });
                        }}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        );
      } else {
        if (error) {
          return (
            <div className='bungie-auth'>
              <div className='text'>
                {error.ErrorCode ? (
                  <>
                    <p>
                      {error.ErrorCode} {error.ErrorStatus}
                    </p>
                    <p>{error.Message}</p>
                  </>
                ) : (
                  t('Unknown error')
                )}
              </div>
              <Button cta action={this.handler_goToBungie}>
                <div className='text'>{t('Authenticate')}</div>
                <i className='segoe-uniE0AB' />
              </Button>
            </div>
          );
        } else {
          return (
            <div className='bungie-auth'>
              <Button cta action={this.handler_goToBungie}>
                <div className='text'>{t('Authenticate')}</div>
                <i className='segoe-uniE0AB' />
              </Button>
            </div>
          );
        }
      }
    }
  }
}

const authUrl = `https://www.bungie.net/en/OAuth/Authorize?client_id=${process.env.REACT_APP_BUNGIE_CLIENT_ID}&response_type=code`;

class BungieAuthButton extends React.Component {
  handler_goToBungie = e => {
    window.location = authUrl;
  };

  render() {
    return (
      <div className='bungie-auth'>
        <Button cta action={this.handler_goToBungie}>
          <div className='text'>{t('Login with Bungie.net')}</div>
          <i className='segoe-uniE0AB' />
        </Button>
      </div>
    );
  }
}

class NoAuth extends React.Component {
  handler_goToBungie = e => {
    window.location = authUrl;
  };

  render() {
    const { inline } = this.props;

    return (
      <div className={cx('bungie-auth', 'no-auth', { inline })}>
        <div className='module'>
          <div className='properties'>
            <div className='name'>{t('Authentication required')}</div>
            <div className='description'>
              <p>{t('Some features of Braytech require your written permission to activate, generally to protect your privacy.')}</p>
              <p>{t('To use this feature, please tell Bungie that you approve. No personal information is shared by doing so—only an authentication code with which you may interact with more API endpoints.')}</p>
            </div>
            <Button cta action={this.handler_goToBungie}>
              <div className='text'>{t('Authenticate')}</div>
              <i className='segoe-uniE0AB' />
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

class DiffProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      memberships: false,
      error: false
    };
  }

  getMemberships = async () => {
    const response = await bungie.GetMembershipDataForCurrentUser();

    if (this.mounted) {
      if (response && response.ErrorCode === 1) {
        this.setState(p => ({
          ...p,
          loading: false,
          memberships: response.Response
        }));
      } else if (response && response.ErrorCode !== 1) {
        this.setState(p => ({
          ...p,
          loading: false,
          error: response
        }));
      } else {
        this.setState(p => ({
          ...p,
          loading: false,
          error: true
        }));
      }
    }
  };

  handler_goToBungie = e => {
    window.location = authUrl;
  };

  componentDidMount() {
    this.mounted = true;

    if (this.props.auth) {
      console.log(this.props.auth);

      this.getMemberships();
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const { inline, location } = this.props;
    const { loading, memberships, error } = this.state;
    const pathname = paths.removeMemberIds(location.pathname);

    let properties;
    if (pathname === '/clan/admin') {
      properties = (
        <>
          <div className='name'>{t("OI, ge'outofit")}</div>
          <div className='description'>
            <p>{t("This doesn't appear to be your clan and so you may not will any actions upon it. You may use these helpful links to jump to your own or you may find more information regarding your current authorization in the Settings view.")}</p>
          </div>
        </>
      );
    } else {
      properties = (
        <>
          <div className='name'>{t('Oh, honey')}</div>
          <div className='description'>
            <p>{t("You are not authorised to access a different user's profile data, but you may use these helpful links to return to your own.")}</p>
            <p>{t('You can find more information regarding your authentication in the Settings view.')}</p>
          </div>
        </>
      );
    }

    if (error) {
      return (
        <div className='bungie-auth'>
          <div className='text'>
            {error.ErrorCode ? (
              <>
                <p>
                  {error.ErrorCode} {error.ErrorStatus}
                </p>
                <p>{error.Message}</p>
              </>
            ) : (
              t('Unknown error')
            )}
          </div>
          <Button cta action={this.handler_goToBungie}>
            <div className='text'>{t('Authenticate')}</div>
            <i className='segoe-uniE0AB' />
          </Button>
        </div>
      );
    } else {
      return (
        <div className={cx('bungie-auth', 'no-auth', { inline })}>
          <div className='module'>
            <div className='properties'>
              {properties}
              {loading ? (
                <Spinner mini />
              ) : (
                <div className='memberships'>
                  <ul className='list'>
                    {memberships.destinyMemberships.map(m => {
                      return (
                        <li key={m.membershipId} className='linked'>
                          <div className='icon'>
                            <span className={`destiny-platform_${enums.platforms[m.membershipType]}`} />
                          </div>
                          <div className='displayName'>{memberships.bungieNetUser.blizzardDisplayName && m.membershipType === 4 ? memberships.bungieNetUser.blizzardDisplayName : m.displayName}</div>
                          {m.crossSaveOverride === m.membershipType ? (
                            <div className='cross-save'>
                              <CrossSaveIcon />
                            </div>
                          ) : null}
                          <Link
                            to='/character-select'
                            onClick={e => {
                              store.dispatch({ type: 'MEMBER_LOAD_MEMBERSHIP', payload: { membershipType: m.membershipType, membershipId: m.membershipId } });
                            }}
                          />
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    auth: state.auth
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setAuth: value => {
      dispatch({ type: 'SET_AUTH', payload: value });
    },
    resetAuth: () => {
      dispatch({ type: 'RESET_AUTH' });
    }
  };
}

BungieAuth = connect(mapStateToProps, mapDispatchToProps)(BungieAuth);

BungieAuthMini = connect(mapStateToProps, mapDispatchToProps)(BungieAuthMini);

BungieAuthButton = connect(mapStateToProps, mapDispatchToProps)(BungieAuthButton);

DiffProfile = compose(connect(mapStateToProps, mapDispatchToProps), withRouter)(DiffProfile);

export { BungieAuth, BungieAuthMini, BungieAuthButton, NoAuth, DiffProfile };
