import React from 'react';

import { t } from '../../utils/i18n';
import { progressionSeasonRank, collectionTotal } from '../../utils/destinyUtils';
import Characters from '../../components/UI/Characters';
import Flair from '../../components/UI/Flair';

function Profile(props) {
  const timePlayed = Math.floor(
    Object.keys(props.member.data.profile.characters.data).reduce((sum, key) => {
      return sum + parseInt(props.member.data.profile.characters.data[key].minutesPlayedTotal, 10);
    }, 0) / 1440
  );

  return (
    <div className='user'>
      <div className='summary'>
        <div className='displayName'>{props.member.data.profile.profile.data.userInfo.displayName}</div>
        {props.member.data.groups.clan && <div className='clan'>{props.member.data.groups.clan.name}</div>}
        <Flair type={props.member.membershipType} id={props.member.membershipId} />
        <div className='basics'>
          <div>
            <div className='name'>{t('Season rank')}</div>
            <div className='value'>{progressionSeasonRank(props.member).level}</div>
          </div>
          <div>
            <div className='name'>{t('Time played across characters')}</div>
            <div className='value'>{timePlayed === 1 ? t('1 day played') : t('{{timePlayed}} days played', { timePlayed })}</div>
          </div>
          <div>
            <div className='name'>{t('Triumph score')}</div>
            <div className='value'>{props.member.data.profile.profileRecords.data.score.toLocaleString()}</div>
          </div>
          <div>
            <div className='name'>{t('Collection total')}</div>
            <div className='value'>{collectionTotal(props.member.data.profile).toLocaleString()}</div>
          </div>
        </div>
      </div>
      <Characters member={props.member} location={props.location} onClickCharacter={props.onClickCharacter} />
    </div>
  );
}

export default Profile;
