import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { t } from '../../../utils/i18n';

import Roster from '../../../components/Roster';
import TimeTilRefresh from '../../../components/UI/TimeTilRefresh';
import Spinner from '../../../components/UI/Spinner';

import './styles.css';

export default function RosterView() {
  const groupMembers = useSelector((state) => state.groupMembers);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className='module header'>
        <div className='text'>{t('Roster')}</div>
        {groupMembers.members.length > 0 ? (
          <>
            <TimeTilRefresh isLoading={groupMembers.loading} />
            {groupMembers.loading ? (
              <div className='state'>
                <Spinner mini />
              </div>
            ) : (
              <div className='state'>{t('{{online}} online', { online: groupMembers.online })}</div>
            )}
          </>
        ) : null}
      </div>
      <div className='module'>
        {groupMembers.loading && groupMembers.members.length < 1 ? <Spinner /> : null}
        {!groupMembers.loading && groupMembers.error && groupMembers.members.length < 1 ? <div className='info'>{t('There was a network error')}</div> : null}
        <Roster />
      </div>
    </>
  );
}
