import React from 'react';
import { connect } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import cx from 'classnames';

import { t } from '../../../utils/i18n';
import * as utils from '../../../utils/destinyUtils';
import { classHashToString } from '../../../utils/destinyConverters';
import { ProfileNavLink } from '../../ProfileLink';
import ProgressBar from '../../UI/ProgressBar';
import Footer from '../Footer';
import { EmblemIcon, EmblemBackground } from '../Emblem/';
import Spinner from '../Spinner';

import './styles.css';

class Header extends React.Component {
  state = {
    navOpen: false,
    updated: false,
    flash: false,
  };

  ref_navEl = React.createRef();

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentDidUpdate(p) {
    if (p.member.updated !== this.props.member.updated && this.state.updated !== this.props.member.updated && !this.state.flash && this.mounted) {
      this.setState({ updated: this.props.member.updated, flash: true });
    }

    if (this.state.flash) {
      window.setTimeout(() => {
        if (this.mounted) {
          this.setState({ flash: false });
        }
      }, 4000);
    }

    if (this.state.navOpen) {
      this.ref_navEl.current.addEventListener('touchmove', this.nav_touchMove, true);
    }
  }

  handler_toggleNav = () => {
    if (!this.state.navOpen) {
      this.setState({ navOpen: true });
    } else {
      this.setState({ navOpen: false });
    }
  };

  handler_closeNav = (e) => {
    if (this.state.navOpen) {
      this.setState({ navOpen: false });
    }
  };

  handler_openNav = (e) => {
    e.preventDefault();
    this.setState({ navOpen: true });
  };

  navOverlayLink = (state) => {
    if (state) {
      return (
        <div className='trigger' onClick={this.handler_toggleNav}>
          <i className='segoe-uniE106' />
          {t('Exit')}
        </div>
      );
    } else {
      return (
        <div className='trigger' onClick={this.handler_toggleNav}>
          <i className='segoe-uniEA55' />
          {t('Views')}
        </div>
      );
    }
  };

  render() {
    const { location, viewport, member, refresh } = this.props;

    const isProfileRoute = utils.isProfileRoute(location) && member.data;

    const views = [
      {
        name: t('Clan'),
        desc: t('About your clan, its roster, summative historical stats for all members, and admin mode'),
        path: '/clan',
        exact: false,
        profile: true,
        inline: true,
        group: 0,
      },
      {
        name: t('Collections'),
        desc: t('Items your Guardian has acquired over their lifetime'),
        path: '/collections',
        exact: false,
        profile: true,
        inline: true,
        group: 0,
      },
      {
        name: t('Triumphs'),
        desc: t('Records your Guardian has achieved through their trials'),
        path: '/triumphs',
        exact: false,
        profile: true,
        inline: true,
        group: 0,
      },
      {
        name: t('Trackers'),
        desc: t('Stat trackers for bragging rights and gilding memories'),
        path: '/trackers',
        exact: false,
        profile: true,
        inline: !isProfileRoute || viewport.width >= 1600,
        group: 0,
      },
      {
        name: t('Checklists'),
        desc: t('Ghost scans and item checklists spanning the Sol system'),
        path: '/checklists',
        exact: true,
        profile: true,
        inline: true,
        group: 0,
      },
      {
        name: t('Maps'),
        desc: t('Interactive maps charting checklists and other notable destinations'),
        path: '/maps',
        exact: false,
        profile: false,
        inline: !isProfileRoute || viewport.width >= 1400,
        group: 0,
      },
      {
        name: t('This Week'),
        desc: t('Noteworthy records and collectibles which are available at a weekly cadence'),
        path: '/this-week',
        exact: false,
        profile: true,
        inline: true,
        group: 0,
      },
      {
        name: t('Now'),
        desc: t('The state of your Guardian, artifact, ranks, season pass, daily activities, and more'),
        path: '/now',
        exact: false,
        profile: true,
        inline: true,
        group: 0,
      },
      {
        name: t('Quests'),
        desc: t('Track your pursuits, including quests and bounties'),
        path: '/quests',
        exact: false,
        profile: true,
        inline: !isProfileRoute || viewport.width >= 1320,
        group: 0,
      },
      {
        name: t('Reports'),
        desc: t('Explore and filter your Post Game Carnage Reports in detail'),
        path: '/reports',
        exact: false,
        profile: true,
        inline: !isProfileRoute || viewport.width >= 1500,
        group: 0,
      },
      {
        name: t('More'),
        exact: true,
        profile: false,
        inline: true,
        hidden: true,
      },
      {
        name: '',
        desc: t('Account, theme, local data, item visibility, language, developer, troubleshooting'),
        path: '/settings',
        exact: true,
        inline: true,
        group: 0,
      },
      {
        name: t('Compare'),
        desc: t('Find your fastest completions for Nightfalls and Nightmare Hunts'),
        path: '/compare',
        exact: false,
        profile: false,
        group: 1,
      },
      {
        name: t('Commonality'),
        desc: t("A summary of Destiny's most rare records and collectibles"),
        path: '/commonality',
        exact: false,
        profile: false,
        group: 1,
      },
      {
        name: t('Archives'),
        desc: t('Interactive tools, manuals, legends, and other content preserved'),
        path: '/archives',
        exact: false,
        profile: false,
        group: 1,
      },
      {
        group: 1,
        type: 'separator',
      },
      {
        name: t('FAQ'),
        desc: t("Some of Tom's favourite frequently asked questions"),
        path: '/faq',
        exact: false,
        profile: false,
        group: 1,
      },
    ];

    const viewsInline = viewport.width >= 1280;

    const isActive = (match, location) => {
      if (match) {
        return true;
      } else {
        return false;
      }
    };

    const profile = member.data?.profile?.profile.data;
    const characters = member.data?.profile?.characters.data;
    const character = characters?.find((character) => character.characterId === member.characterId);

    const progressSeasonalRank = member?.data && utils.progressionSeasonRank(member);

    return (
      <div id='header' className={cx(this.props.theme.active, { 'profile-header': isProfileRoute, navOpen: this.state.navOpen })}>
        <div className='braytech'>
          <div className='wrapper'>
            <div className='logo'>
              <Link to='/' onClick={this.handler_closeNav}>
                <span className='destiny-clovis_bray_device' />
                {process.env.REACT_APP_BETA === 'true' ? 'Braytech Beta' : 'Braytech'}
              </Link>
            </div>
            {!viewsInline || this.state.navOpen ? this.navOverlayLink(this.state.navOpen) : null}
            {!isProfileRoute && viewsInline && !this.state.navOpen ? (
              <div className='ui'>
                <div className='views'>
                  <ul>
                    {views
                      .filter((v) => v.inline)
                      .map((view) => {
                        if (view.profile) {
                          return (
                            <li key={view.path}>
                              <ProfileNavLink to={view.path} isActive={isActive} exact={view.exact}>
                                {view.name}
                              </ProfileNavLink>
                            </li>
                          );
                        } else if (view.hidden) {
                          return (
                            <li key='more'>
                              <a href='/' onClick={this.handler_openNav}>
                                {view.name}
                              </a>
                            </li>
                          );
                        } else {
                          return (
                            <li key={view.path}>
                              <NavLink to={view.path} exact={view.exact}>
                                {view.name}
                              </NavLink>
                            </li>
                          );
                        }
                      })}
                  </ul>
                </div>
              </div>
            ) : null}
          </div>
        </div>
        {isProfileRoute && character ? (
          <div className='profile'>
            <div className={cx('background', { 'update-flash': this.state.flash })}>
              <EmblemBackground hash={character.emblemHash} />
            </div>
            <div className='ui'>
              <div className='characters'>
                <ul className='list'>
                  <li>
                    <div className='icon'>
                      <EmblemIcon hash={character.emblemHash} />
                    </div>
                    <div className='displayName'>{profile.userInfo.displayName}</div>
                    <div className='basics'>
                      <span>
                        {progressSeasonalRank.level} / {classHashToString(character.classHash, character.genderHash)} /
                      </span>
                      <span className='light'>{character.light}</span>
                    </div>
                    <ProgressBar hideCheck {...progressSeasonalRank} />
                    <div className='refresh'>
                      <Spinner className={refresh.loading ? 'visible' : undefined} mini />
                      <div className={cx('stale', { visible: refresh.stale && !refresh.loading })}>{t('Stale')}</div>
                    </div>
                    <Link
                      to={{
                        pathname: '/character-select',
                        state: { from: this.props.location },
                      }}
                    />
                  </li>
                </ul>
              </div>
              {viewsInline ? (
                <div className='views'>
                  <ul>
                    {views
                      .filter((v) => v.inline)
                      .map((view) => {
                        if (view.profile) {
                          return (
                            <li key={view.path}>
                              <ProfileNavLink to={view.path} isActive={isActive} exact={view.exact}>
                                {view.name}
                              </ProfileNavLink>
                            </li>
                          );
                        } else if (view.hidden) {
                          return (
                            <li key='more'>
                              <a href='/' onClick={this.handler_openNav}>
                                {view.name}
                              </a>
                            </li>
                          );
                        } else {
                          return (
                            <li key={view.path}>
                              <NavLink to={view.path} exact={view.exact}>
                                {view.name}
                              </NavLink>
                            </li>
                          );
                        }
                      })}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
        {this.state.navOpen ? (
          <div className='nav' ref={this.ref_navEl}>
            <div className='wrap'>
              <div className='types'>
                <div className='type progression'>
                  <ul>
                    {views
                      .filter((v) => v.group === 0 && !v.hidden)
                      .map((view) => {
                        if (view.profile) {
                          return (
                            <li key={view.path}>
                              <div className='name'>{view.name}</div>
                              <div className='description'>{view.desc}</div>
                              <ProfileNavLink to={view.path} isActive={isActive} exact={view.exact} onClick={this.handler_closeNav} />
                            </li>
                          );
                        } else {
                          return (
                            <li key={view.path}>
                              <div className='name'>{view.name}</div>
                              <div className='description'>{view.desc}</div>
                              <NavLink to={view.path} exact={view.exact} onClick={this.handler_closeNav} />
                            </li>
                          );
                        }
                      })}
                  </ul>
                </div>
                <div className='type ancillary'>
                  <ul>
                    {views
                      .filter((v) => v.group === 1 && !v.hidden)
                      .map((view, i) => {
                        if (view.type === 'separator') {
                          return <li key={i} className='separator' />;
                        } else if (view.profile) {
                          return (
                            <li key={view.path}>
                              <div className='name'>{view.name}</div>
                              <div className='description'>{view.desc}</div>
                              <ProfileNavLink to={view.path} isActive={isActive} exact={view.exact} onClick={this.handler_closeNav} />
                            </li>
                          );
                        } else {
                          return (
                            <li key={view.path}>
                              <div className='name'>{view.name}</div>
                              <div className='description'>{view.desc}</div>
                              <NavLink to={view.path} exact={view.exact} onClick={this.handler_closeNav} />
                            </li>
                          );
                        }
                      })}
                  </ul>
                </div>
                {/* <div className='type external'>
                  DIM
                  <br />
                  Ishtar Collective
                </div> */}
              </div>
              <Footer handler={this.handler_closeNav} />
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    refresh: state.refresh,
    theme: state.theme,
    viewport: state.viewport,
  };
}

export default connect(mapStateToProps)(Header);
