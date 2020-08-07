import React from 'react';

import './styles.css';

export default function TimeTilRefresh({ isLoading, duration }) {
  return (
    <div className='ttr' style={{ '--duration': duration }}>
      {!isLoading ? <div className='bar' /> : null}
    </div>
  );
}
