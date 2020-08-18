import React from 'react';
import cx from 'classnames';

export default function Zoom(props) {
  return (
    <div className='control zoom'>
      <ul className='list'>
        <li className={cx('linked', 'acrylic', { disabled: props.now > 1 })} onClick={props.increase}>
          <i className='segoe-mdl-add' />
        </li>
        <li className={cx('linked', 'acrylic', { disabled: props.now < -1 })} onClick={props.decrease}>
          <i className='segoe-mdl-subtract' />
        </li>
      </ul>
    </div>
  );
}
