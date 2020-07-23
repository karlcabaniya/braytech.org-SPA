import React, { useState, useEffect } from 'react';

import './styles.css';

const resources = ['/static/images/extracts/maps/the-farm/01E3-01F8.png'];

export default function TheFarm() {
  const [resourcesStore, setResources] = useState(resources.map((path) => ({ resourceUrl: path, blobUrl: null, loading: false, error: false })));

  useEffect(() => {
    console.log('hello')
    resourcesStore
      // only map unattempted resources
      .filter((resource) => !resource.blobUrl && !resource.loading && !resource.error)
      .map(async (resource) => {
        // set resource loading state
        setResources([
          ...resourcesStore.filter((r) => r.resourceUrl !== resource.resourceUrl),
          {
            ...resource,
            loading: true,
          },
        ]);

        return await fetch(resource.resourceUrl)
          .then((response) => {
            return response.blob();
          })
          .then((blob) => {
            const blobUrl = URL.createObjectURL(blob);

            //            console.log('%c ', `font-size:200px; background:url(${blobUrl}) no-repeat;background-size:contain`);

            // set resource
            setResources([
              ...resourcesStore.filter((r) => r.resourceUrl !== resource.resourceUrl),
              {
                ...resource,
                blobUrl,
                loading: false,
              },
            ]);
          });
      });

    return () => {};
  }, [resourcesStore]);

  console.log(resourcesStore);

  return <div className='wrapper'>lol</div>;
}
