import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import Maps from '../../components/Maps';

import './styles.css';

function MapsView() {
  const params = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);

    return () => {};
  }, []);

  return (
    <div className='view' id='maps'>
      <Maps params={params} />
    </div>
  );
}

export default MapsView;
