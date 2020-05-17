import React from 'react';
import cx from 'classnames';

import './styles.css';

function Checkbox(props) {
  const { classNames, checked, text, children, linked, action, disabled = false } = props;

  return (
    <div
      className={cx('check-box', classNames, { checked: checked, linked: linked, disabled: disabled })}
      onClick={(e) => {
        if (action && !disabled) {
          action(e);
        }
      }}
    >
      <div className={cx('check', { ed: checked })} />
      {!children ? <div className='text'>{text}</div> : children}
    </div>
  );
}

export default Checkbox;
