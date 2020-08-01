import React from 'react';

export default function Zoom(props) {
  return (
    <div className='control zoom'>
      <ul className='list'>
        <li className='linked acrylic' onClick={props.increase}>
          <i className='segoe-uniE1091' />
        </li>
        <li className='linked acrylic' onClick={props.decrease}>
          <i className='segoe-uniE1081' />
        </li>
      </ul>
    </div>
  );
}
