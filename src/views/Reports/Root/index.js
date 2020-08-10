import React from 'react';

import Matches from '../../../components/Reports/Matches';

function All(props) {
  return (
    <div className='type'>
      <div className='modes' />
      <Matches mode={false} limit='40' offset={props.offset} root='/reports/all' />
    </div>
  );
}

export default All;
