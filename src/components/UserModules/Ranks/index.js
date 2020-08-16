import React from 'react';
import { useSelector } from 'react-redux';

import Ranks from '../../Ranks';

export default function Module({ progressionHash }) {
  const member = useSelector((state) => state.member);

  const characterProgressions = member.data.profile.characterProgressions.data;
  const characterRecords = member.data.profile.characterRecords.data;
  const profileRecords = member.data.profile.profileRecords.data.records;

  return (
    <div className='user-module ranks'>
      <Ranks hash={progressionHash || 2772425241} data={{ membershipType: member.membershipType, membershipId: member.membershipId, characterId: member.characterId, characters: member.data.profile.characters.data, characterProgressions, characterRecords, profileRecords }} />
    </div>
  );
}
