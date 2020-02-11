import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { orderBy } from 'lodash';
import cx from 'classnames';
import moment from 'moment';

import * as enums from '../../../utils/destinyEnums';
import * as utils from '../../../utils/destinyUtils';
import getGroupMembers from '../../../utils/getGroupMembers';

import './styles.css';

class Clan extends React.Component {
  componentDidMount() {
    const { member } = this.props;
    const group = member.data.groups.results.length > 0 ? member.data.groups.results[0].group : false;

    if (group) {
      this.callGetGroupMembers(group);
      this.startInterval();
    }
  }

  componentWillUnmount() {
    this.clearInterval();
  }

  callGetGroupMembers = async () => {
    const { member, auth, groupMembers } = this.props;
    const result = member.data.groups.results.length > 0 ? member.data.groups.results[0] : false;

    const isAuthed = auth && auth.destinyMemberships && auth.destinyMemberships.find(m => m.membershipId === member.membershipId);

    let now = new Date();

    if (result && (now - groupMembers.lastUpdated > 30000 || result.group.groupId !== groupMembers.groupId)) {
      await getGroupMembers(result.group, result.member.memberType > 2 && isAuthed);

      this.props.rebindTooltips();
    }
  };

  startInterval() {
    this.refreshClanDataInterval = window.setInterval(this.callGetGroupMembers, 60000);
  }

  clearInterval() {
    window.clearInterval(this.refreshClanDataInterval);
  }

  createRow = m => {
    const { member } = this.props;

    const isPrivate = !m.profile || !m.profile.characterActivities.data || !m.profile.characters.data.length;
    const isSelf = !isPrivate ? m.profile.profile.data.userInfo.membershipType.toString() === member.membershipType && m.profile.profile.data.userInfo.membershipId === member.membershipId : false;

    const characterIds = !isPrivate ? m.profile.characters.data.map(c => c.characterId) : [];

    const lastActivities = utils.lastPlayerActivity(m);
    const { characterId: lastCharacterId, lastPlayed, lastActivity, lastActivityString, lastMode } = orderBy(lastActivities, [a => a.lastPlayed], ['desc'])[0];

    const lastCharacter = !isPrivate ? m.profile.characters.data.find(c => c.characterId === lastCharacterId) : false;

    const weeklyXp = !isPrivate
      ? characterIds.reduce((currentValue, characterId) => {
          let characterProgress = m.profile.characterProgressions.data[characterId].progressions[540048094].weeklyProgress || 0;
          return characterProgress + currentValue;
        }, 0)
      : 0;

    const seasonRank = !isPrivate ? utils.progressionSeasonRank({ characterId: m.profile.characters.data[0].characterId, data: m }).level : 0;

    const triumphScore = !isPrivate ? m.profile.profileRecords.data.score : 0;

    let valorPoints = !isPrivate ? m.profile.characterProgressions.data[m.profile.characters.data[0].characterId].progressions[2626549951].currentProgress : 0;
    let valorResets = !isPrivate ? utils.calculateResets(3882308435, m.profile.characters.data[0].characterId, m.profile.characterProgressions.data, m.profile.characterRecords.data, m.profile.profileRecords.data.records).total : 0;
    let gloryPoints = !isPrivate ? m.profile.characterProgressions.data[m.profile.characters.data[0].characterId].progressions[2000925172].currentProgress : 0;
    let infamyPoints = !isPrivate ? m.profile.characterProgressions.data[m.profile.characters.data[0].characterId].progressions[2772425241].currentProgress : 0;
    let infamyResets = !isPrivate ? utils.calculateResets(2772425241, m.profile.characters.data[0].characterId, m.profile.characterProgressions.data, m.profile.characterRecords.data, m.profile.profileRecords.data.records).total : 0;

    const preferredClass = !isPrivate ? m.profile.characters.data[0].classType : null;

    const totalValor = utils.totalValor();
    const totalInfamy = utils.totalInfamy();

    valorPoints = valorResets * totalValor + valorPoints;
    infamyPoints = infamyResets * totalInfamy + infamyPoints;

    if (m.isOnline) {
      // console.log(m)
      // console.log(lastCharacterId, lastPlayed, lastActivity, lastActivityString, lastMode);
    }

    return {
      private: isPrivate,
      isOnline: m.isOnline,
      fireteamId: m.fireteamId,
      lastPlayed,
      lastCharacter,
      preferredClass,
      triumphScore,
      gloryPoints,
      valorPoints,
      infamyPoints,
      weeklyXp: (weeklyXp / characterIds.length) * 5000,
      rank: m.memberType
    };
  };

  render() {
    const { t, groupMembers } = this.props;

    let results = [...groupMembers.members];

    const fireteams = [];
    let roster = [];

    results
      .filter(r => r.profile && r.profile.profileTransitoryData && r.profile.profileTransitoryData.data)
      .forEach((m, i) => {
        const membershipId = m.profile.profile.data.userInfo.membershipId;
        const transitory = m.profile.profileTransitoryData.data;

        const index = fireteams.findIndex(f => f.members.find(m => m.membershipId === membershipId));

        if (index < 0 && transitory.partyMembers.length > 1) {
          fireteams.push({
            id: i,
            currentActivity: transitory.currentActivity,
            members: transitory.partyMembers
          });
        }
      });

    fireteams.forEach(f => {
      const members = [];

      f.members.forEach(n => {
        const m = results.find(m => m.destinyUserInfo.membershipId === n.membershipId);

        if (!m) return;
        // they're not a clan member

        const isPrivate = !m.profile || !m.profile.characterActivities.data || !m.profile.characters.data.length;

        const fireteam = !isPrivate ? fireteams.find(f => f.members.find(n => n.membershipId === m.profile.profile.data.userInfo.membershipId)) : false;
        m.fireteamId = fireteam && fireteam.id;

        const row = this.createRow(m);

        members.push(row);
      });

      roster.push({
        isFireteam: true,
        private: false,
        isOnline: true,
        fireteamId: f.id + 10,
        lastPlayed: f.currentActivity.startTime,
        members
      });
    });

    results
      .filter(r => !fireteams.find(f => f.members.find(n => n.membershipId === r.destinyUserInfo.membershipId)))
      .forEach(m => {
        const fireteam = fireteams.find(f => f.members.find(n => n.membershipId === m.destinyUserInfo.membershipId));
        m.fireteamId = fireteam && fireteam.id;

        const row = this.createRow(m);

        roster.push(row);
      });

    console.log(fireteams, roster);

    return (
      <div className='user-module clan'>
        <div className='sub-header'>
          <div>{t('Clan')}</div>
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

function mapDispatchToProps(dispatch) {
  return {
    rebindTooltips: value => {
      dispatch({ type: 'REBIND_TOOLTIPS', payload: new Date().getTime() });
    }
  };
}

export default compose(connect(mapStateToProps, mapDispatchToProps), withTranslation())(Clan);
