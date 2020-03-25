import React from 'react';
import { connect } from 'react-redux';

import { Records, unredeemedRecords } from '../Records';

class RecordsUnredeemed extends React.Component {
  render() {
    const { member, limit, selfLinkFrom = false } = this.props;

    const hashes = unredeemedRecords(member);

    return (
      <>
        <ul className='list record-items'>
          <Records selfLink hashes={hashes} ordered='rarity' limit={limit} selfLinkFrom={selfLinkFrom} />
        </ul>
      </>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    triumphs: state.triumphs
  };
}

export default connect(mapStateToProps)(RecordsUnredeemed);
