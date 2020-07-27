import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import actions from '../../../store/actions';
import { t } from '../../../utils/i18n';

export default function PostmasterCapacity() {
  const member = useSelector((state) => state.member);
  const dispatch = useDispatch();

  const inventory = [
    ...(member.data.profile?.profileInventory.data?.items || []),
    ...(member.data.profile?.characterInventories.data[member.characterId]?.items || [])
  ];
  const parcels = inventory.filter((i) => i.bucketHash === 215593132).length;

  useEffect(() => {
    if (parcels > 17) {
      dispatch(
        actions.notifications.push({
          hash: 'PostmasterCapacityWarning',
          date: new Date().toISOString(),
          expiry: 86400 * 1000,
          error: true,
          analytics: {
            label: 'Postmaster Capacity Warning',
          },
          displayProperties: {
            name: t('Notifications.PostmasterCapacityWarning.Name'),
            description: parcels === 21 ? t('Notifications.PostmasterCapacityWarning.DescriptionFull') : t('Notifications.PostmasterCapacityWarning.DescriptionAlmostFull'),
          },
        })
      );
    }

    return () => {};
  }, [parcels]);

  return null;
}
