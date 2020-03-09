import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';

import CharacterEmblem from '../../../../components/UI/CharacterEmblem';

class Characters extends React.Component {
  state = {};

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentDidUpdate(p, s) {}

  render() {
    const { visible, member } = this.props;

    return (
      <div className={cx('control', 'characters', { visible })}>
        <ul className='list'>
          {member && member.data ? (
            <>
              {member.data.profile.profile.data.characterIds.map(characterId => {
                return (
                  <li key={characterId} className={cx('linked', { active: characterId === member.characterId })} data-characterid={characterId} onClick={this.props.handler}>
                    <CharacterEmblem characterId={characterId} />
                  </li>
                );
              })}
              <li className='linked'>
                <CharacterEmblem characterSelect />
              </li>
            </>
          ) : (
            <li className='linked active'>
              <CharacterEmblem onboarding />
            </li>
          )}
        </ul>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member
  };
}

export default connect(mapStateToProps)(Characters);
