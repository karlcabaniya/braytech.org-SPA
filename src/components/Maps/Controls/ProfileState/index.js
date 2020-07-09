import React from 'react';
import { useSelector } from 'react-redux';
import cx from 'classnames';

import Spinner from '../../../UI/Spinner';

import './styles.css';

function ProfileState(props) {
  const member = useSelector((state) => state.member.loading);
  const refresh = useSelector((state) => state.refresh.loading);

  return (
    <div className='control profile-state'>
      <div className={cx('wrapper', { spin: member || refresh })}>
        <Spinner mini />
      </div>
    </div>
  );
}

export default ProfileState;
