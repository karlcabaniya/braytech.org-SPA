import React from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';

class DataLayers extends React.Component {
  render() {
    return null;
    return (
      <div className='control data-layers'>
        <ul className='list'>
          {this.props.lists.map((list, l) => {
            

            return (
              <li key={l} className={cx('linked', { active: list.visible })}>
                {list.checklistId}
              </li>
            );
            
          })}
        </ul>
      </div>
    );
  }
}

export default DataLayers;
