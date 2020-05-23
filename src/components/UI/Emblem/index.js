import React from 'react';
import cx from 'classnames';

import manifest from '../../../utils/manifest';
import ObservedImage from '../../ObservedImage';

export function EmblemIcon({ hash }) {
  const definitionEmblem = manifest.DestinyInventoryItemDefinition[hash];

  return (
    <ObservedImage
      className={cx('image', 'secondaryOverlay', {
        missing: definitionEmblem.redacted,
      })}
      src={`https://www.bungie.net${!definitionEmblem.redacted ? definitionEmblem.secondaryOverlay : `/img/misc/missing_icon_d2.png`}`}
    />
  );
}

const veryLightEmblems = [4182480236, 3961503937, 2526736321, 2071635914, 1983519831];

export function EmblemBackground({ hash }) {
  const definitionEmblem = manifest.DestinyInventoryItemDefinition[hash];

  return (
    <ObservedImage
      className={cx('image', 'emblem', {
        missing: definitionEmblem.redacted,
        'very-light': veryLightEmblems.includes(definitionEmblem.hash),
      })}
      src={`https://www.bungie.net${definitionEmblem.secondarySpecial ? definitionEmblem.secondarySpecial : `/img/misc/missing_icon_d2.png`}`}
    />
  );
}
