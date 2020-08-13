import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import actions from '../../../store/actions';
import { t } from '../../../utils/i18n';

export default function PostmasterCapacity() {
  const member = useSelector((state) => state.member);
  const dispatch = useDispatch();

  const parcels = member.data.inventory?.filter((i) => i.bucketHash === 215593132).length;

  const skipDispatch = useSelector((state) => state.notifications.objects.filter((notification) => notification.hash === 'PostmasterCapacityWarning')).length;

  useEffect(() => {
    if (parcels > 17 && !skipDispatch) {
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
