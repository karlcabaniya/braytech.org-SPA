import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import actions from '../../store/actions';
import { useIsMounted } from '../../utils/hooks';
import { BungieAuth } from '../../utils/bungie';
import { GetMemberSettings, PostMemberSettings } from '../../utils/voluspa';

export default function SyncService() {
  const dispatch = useDispatch();
  const sync = useSelector(state => state.sync);
  const settings = useSelector(state => state.settings);
  const member = useSelector(state => state.member);
  const isMounted = useIsMounted();

  const [isSetup, setIsSetup] = useState(false);

  // setup
  useEffect(() => {
    if (isMounted.current && !isSetup) {
      setIsSetup(true);
    }
  }, []);

  // download state
  useEffect(() => {
    async function download() {
      const response = await GetMemberSettings({
        params: {
          membershipId: member.membershipId,
        }
      });

      console.log(response);

      if (response?.ErrorCodee === 1) {
        const settings = JSON.parse(response.Response);

        if (settings) {
          dispatch(actions.settings.set(settings));
        }
      }
    }

    if (isMounted.current && sync.enabled) {
      console.log('downloading');
      download();
    }
  }, []);

  // sync changes
  useEffect(() => {
    async function distribute() {
      const auth = await BungieAuth();
      const response = await PostMemberSettings({
        bnetMembershipId: auth.bnetMembershipId,
        membershipId: member.membershipId,
        settings,
      });

      console.log(response);
    }

    if (isMounted.current && isSetup && sync.enabled) {
      console.log('syncing');
      distribute();
    }
  }, [settings]);
  
  return null;
}
