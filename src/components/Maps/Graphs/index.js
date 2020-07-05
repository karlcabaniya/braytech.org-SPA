import React from 'react';

import Director from './Director';

export default function Graphs({ destinationId, ...props }) {

  if (destinationId === 'director') return <Director />;

  return null;
}
