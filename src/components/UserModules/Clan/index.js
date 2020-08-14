import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { orderBy } from 'lodash';

import { t, BraytechText } from '../../../utils/i18n';
import manifest from '../../../utils/manifest';
import * as utils from '../../../utils/destinyUtils';
import getGroupMembers from '../../../utils/getGroupMembers';

import Spinner from '../../UI/Spinner';

import './styles.css';

function processMember(member) {
  const isPrivate = !member.profile || !member.profile.characterActivities.data || !member.profile.characters.data.length;

  const lastActivities = utils.lastPlayerActivity(member);
  const { lastPlayed } = orderBy(lastActivities, [(a) => a.lastPlayed], ['desc'])[0];

  const preferredClass = !isPrivate ? member.profile.characters.data[0].classType : null;

  return {
    private: isPrivate,
    isOnline: member.isOnline,
    lastPlayed,
    preferredClass,
  };
}

async function callGetGroupMembers(clan, groupMembers) {
  const now = new Date();

  if (clan && (now - groupMembers.lastUpdated > 30000 || clan.groupId !== groupMembers.groupId)) {
    await getGroupMembers(clan);
  }
}

export default function Clan() {
  const member = useSelector((state) => state.member);
  const groupMembers = useSelector((state) => state.groupMembers);

  useEffect(() => {
    if (member.data.groups.clan) {
      callGetGroupMembers(member.data.groups.clan, groupMembers);
    }
  }, []);

  useEffect(() => {
    callGetGroupMembers(member.data.groups.clan, groupMembers);
  }, [member.updated]);

  const group = member.data.groups.clan;

  if (!group) {
    return (
      <div className='user-module clan'>
        <div className='sub-header'>
          <div>{t('Clan')}</div>
        </div>
        <div className='info'>{t('Clan.NoClan.Name')}</div>
      </div>
    );
  } else if (group && groupMembers.loading && !groupMembers.members.length) {
    return (
      <div className='user-module clan'>
        <div className='sub-header'>
          <div>{t('Clan')}</div>
        </div>
        <Spinner />
      </div>
    );
  }

  const roster = groupMembers.members.map((member) => processMember(member));

  const _now = new Date().getTime();
  const _online = roster.filter((m) => m.isOnline).length;
  const _24h = roster.filter((m) => m.isOnline || new Date(m.lastPlayed).getTime() >= _now - 86400000).length;
  const _7d = roster.filter((m) => m.isOnline || new Date(m.lastPlayed).getTime() >= _now - 86400000 * 7).length;
  const _1m = roster.filter((m) => m.isOnline || new Date(m.lastPlayed).getTime() >= _now - 86400000 * 31).length;

  const _titans = (roster.filter((m) => m.preferredClass === 0).length / roster.length) * 100 || 0;
  const _hunters = (roster.filter((m) => m.preferredClass === 1).length / roster.length) * 100 || 0;
  const _warlocks = (roster.filter((m) => m.preferredClass === 2).length / roster.length) * 100 || 0;

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
          {group.motto ? <BraytechText className='motto' escapeHtml disallowedTypes={['image', 'imageReference']} source={group.motto} /> : null}
        </div>
      </div>
      <div className='breakdown'>
        <h4>{t('Activity')}</h4>
        <div className='earlier'>
          <ul>
            <li>
              <ul>
                <li>{t('Language.Time.Hours.Plural', { hours: 24 })}</li>
                <li>{_24h}</li>
              </ul>
            </li>
            <li>
              <ul>
                <li>{t('Language.Time.Days.Plural', { days: 7 })}</li>
                <li>{_7d}</li>
              </ul>
            </li>
            <li>
              <ul>
                <li>{t('Language.Time.Days.Plural', { days: 30 })}</li>
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
