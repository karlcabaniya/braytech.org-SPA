import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { orderBy } from 'lodash';
import Markdown from 'react-markdown';

import manifest from '../../../utils/manifest';
import * as utils from '../../../utils/destinyUtils';
import getGroupMembers from '../../../utils/getGroupMembers';
import Spinner from '../../UI/Spinner';

import './styles.css';

class Clan extends React.Component {
  componentDidMount() {
    this.mounted = true;

    const { member } = this.props;
    const group = member.data.groups?.results?.[0].group;

    if (group) {
      this.callGetGroupMembers(group);
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentDidUpdate(p) {
    if (this.props.member.updated !== p.member?.updated) {
      this.callGetGroupMembers();
    }
  }

  callGetGroupMembers = async () => {
    const { member, auth, groupMembers } = this.props;
    const result = member.data.groups?.results?.[0];

    const isAuthed = auth && auth.destinyMemberships && auth.destinyMemberships.find(m => m.membershipId === member.membershipId);

    let now = new Date();

    if (result && (now - groupMembers.lastUpdated > 30000 || result.group.groupId !== groupMembers.groupId)) {
      await getGroupMembers(result.group, result.member.memberType > 2 && isAuthed);
    }
  };

  createRow = m => {
    const isPrivate = !m.profile || !m.profile.characterActivities.data || !m.profile.characters.data.length;

    const lastActivities = utils.lastPlayerActivity(m);
    const { lastPlayed } = orderBy(lastActivities, [a => a.lastPlayed], ['desc'])[0];

    const preferredClass = !isPrivate ? m.profile.characters.data[0].classType : null;

    return {
      private: isPrivate,
      isOnline: m.isOnline,
      lastPlayed,
      preferredClass
    };
  };

  render() {
    const { t, member, groupMembers } = this.props;
    const group = member.data.groups?.results?.[0].group;

    if (!group) {
      return (
        <div className='user-module clan'>
          <div className='sub-header'>
            <div>{t('Clan')}</div>
          </div>
          <div className='info'>{t('No clan affiliation')}</div>
        </div>
      );
    }
    else if (group && groupMembers.loading && !groupMembers.members.length) {
      return (
        <div className='user-module clan'>
          <div className='sub-header'>
            <div>{t('Clan')}</div>
          </div>
          <Spinner />
        </div>
      );
    }

    const roster = groupMembers.members.map(m => this.createRow(m));
    
    const _now = new Date().getTime();
    const _online = roster.filter(m => m.isOnline).length;
    const _24h = roster.filter(m => m.isOnline || new Date(m.lastPlayed).getTime() >= (_now - 86400000)).length;
    const _7d = roster.filter(m => m.isOnline || new Date(m.lastPlayed).getTime() >= (_now - 86400000 * 7)).length;
    const _1m = roster.filter(m => m.isOnline || new Date(m.lastPlayed).getTime() >= (_now - 86400000 * 31)).length;

    const _titans = roster.filter(m => m.preferredClass === 0).length / roster.length * 100 || 0;
    const _hunters = roster.filter(m => m.preferredClass === 1).length / roster.length * 100 || 0;
    const _warlocks = roster.filter(m => m.preferredClass === 2).length / roster.length * 100 || 0;

    return (
      <div className='user-module clan'>
        <div className='sub-header'>
          <div>{t('Clan')}</div>
          <div>{groupMembers.loading ? <Spinner mini /> : null}</div>
        </div>
        <div className='about'>
          <div className='now'>
            <div className='value'>{_online}</div>
            <div className='name'>{t('Online')}</div>
          </div>
          <div className='text'>
            <div className='name'>{group.name}</div>
            {group.motto ? <Markdown className='motto' escapeHtml disallowedTypes={['image', 'imageReference']} source={group.motto} /> : null}
          </div>
        </div>
        <div className='breakdown'>
          <h4>{t('Activity')}</h4>
          <div className='earlier'>
            <ul>
              <li>
                <ul>
                  <li>{t('{{hours}} Hours', { hours: 24 })}</li>
                  <li>{_24h}</li>
                </ul>
              </li>
              <li>
                <ul>
                  <li>{t('{{days}} Days', { days: 7 })}</li>
                  <li>{_7d}</li>
                </ul>
              </li>
              <li>
                <ul>
                  <li>{t('{{month}} Month', { month: 1 })}</li>
                  <li>{_1m}</li>
                </ul>
              </li>
            </ul>
          </div>
          <h4>{t('Distribution')}</h4>
          <div className='diversity'>
            <ul>
              <li>
                <ul>
                  <li>{manifest.DestinyClassDefinition[3655393761].displayProperties.name}</li>
                  <li>{_titans.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}%</li>
                </ul>
              </li>
              <li>
                <ul>
                  <li>{manifest.DestinyClassDefinition[671679327].displayProperties.name}</li>
                  <li>{_hunters.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}%</li>
                </ul>
              </li>
              <li>
                <ul>
                  <li>{manifest.DestinyClassDefinition[2271682572].displayProperties.name}</li>
                  <li>{_warlocks.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}%</li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    auth: state.auth,
    groupMembers: state.groupMembers
  };
}

export default compose(connect(mapStateToProps), withTranslation())(Clan);
