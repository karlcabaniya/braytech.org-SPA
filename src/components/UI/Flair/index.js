import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import cx from 'classnames';

import * as enums from '../../../utils/destinyEnums';
import * as flair from '../../../utils/flair';

import './styles.css';

class Flair extends React.Component {
  componentDidMount() {
    this.props.rebindTooltips();
  }

  render() {
    const { type, id } = this.props;
    
    return (
      <div className='stamps'>
        <div className='tooltip' data-hash={`platform_${enums.platforms[type]}`} data-type='braytech'>
          <i className={`destiny-platform_${enums.platforms[type]}`} />
        </div>
        {flair.stamps.map((stamp, s) => {
          if (stamp.condition(id)) {
            return (
              <div key={s} className='tooltip' data-hash={stamp.hash} data-type='braytech'>
                <i className={cx(stamp.icon, stamp.classnames)} />
              </div>
            );
          } else {
            return null;
          }
        })}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member
  };
}

function mapDispatchToProps(dispatch) {
  return {
    rebindTooltips: value => {
      dispatch({ type: 'REBIND_TOOLTIPS', payload: new Date().getTime() });
    }
  };
}

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withTranslation()
)(Flair);
