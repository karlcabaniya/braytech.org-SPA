import React from 'react';

import duds from '../../../data/records/duds';
import Records from '../../../components/Records';

class DudDebug extends React.Component {
  render() {
    return (
      <>
        <div className='dud-debug'>
          <ul className='list record-items'>
            <Records hashes={duds} forceDisplay />
          </ul>
        </div>
      </>
    );
  }
}

export default DudDebug;
