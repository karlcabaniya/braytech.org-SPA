import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';

import { set } from '../../../../utils/localStorage';
import CharacterEmblem from '../../../../components/UI/CharacterEmblem';

class Characters extends React.Component {
  state = {
    expanded: false,
  };

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handler_onClick = (characterId) => (e) => {
    if (this.props.member.characterId === characterId) {
      if (this.state.expanded) {
        this.setState({ expanded: false });
      } else {
        this.setState({ expanded: true });
      }
    } else {
      this.setState({ expanded: false });

      this.props.changeCharacterId({ membershipType: this.props.member.membershipType, membershipId: this.props.member.membershipId, characterId });

      set('setting.profile', { membershipType: this.props.member.membershipType, membershipId: this.props.member.membershipId, characterId });
    }
  };

  render() {
    return (
      <div className={cx('control', 'characters', { visible: this.state.expanded })}>
        <ul className='list'>
          {this.props.member?.data ? (
            <>
              {this.props.member.data.profile.profile.data.characterIds.map((characterId, c) => (
                <li key={c} className={cx('linked', { active: characterId === this.props.member.characterId })} onClick={this.handler_onClick(characterId)}>
                  <CharacterEmblem characterId={characterId} />
                </li>
              ))}
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
    member: state.member,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    changeCharacterId: (payload) => {
      dispatch({ type: 'MEMBER_CHARACTER_SELECT', payload });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Characters);
