import { mergeWith } from 'lodash';

import Braytech_EN from '../data/manifest/en/Braytech/';
import Braytech_ES from '../data/manifest/es/Braytech/';
import Braytech_ESMX from '../data/manifest/es-MX/Braytech/';
import Braytech_IT from '../data/manifest/it/Braytech/';
import Braytech_RU from '../data/manifest/ru/Braytech/';

import BraytechMaps_EN from '../data/manifest/en/BraytechMaps/';
import BraytechMaps_ES from '../data/manifest/es/BraytechMaps/';
import BraytechMaps_ESMX from '../data/manifest/es-MX/BraytechMaps/';
import BraytechMaps_IT from '../data/manifest/it/BraytechMaps/';
import BraytechMaps_RU from '../data/manifest/ru/BraytechMaps/';

import DestinyActivityDefinition_EN from '../data/manifest/en/DestinyActivityDefinition/';

import DestinyActivityModifierDefinition_EN from '../data/manifest/en/DestinyActivityModifierDefinition/';
import DestinyActivityModifierDefinition_ES from '../data/manifest/es/DestinyActivityModifierDefinition/';
import DestinyActivityModifierDefinition_ESMX from '../data/manifest/es-MX/DestinyActivityModifierDefinition/';
import DestinyActivityModifierDefinition_IT from '../data/manifest/it/DestinyActivityModifierDefinition/';
import DestinyActivityModifierDefinition_RU from '../data/manifest/ru/DestinyActivityModifierDefinition/';

import DestinyClanBannerDefinition_EN from '../data/manifest/en/DestinyClanBannerDefinition/';

import DestinyDestinationDefinition_EN from '../data/manifest/en/DestinyDestinationDefinition/';
import DestinyDestinationDefinition_ES from '../data/manifest/es/DestinyDestinationDefinition/';
import DestinyDestinationDefinition_ESMX from '../data/manifest/es-MX/DestinyDestinationDefinition/';
import DestinyDestinationDefinition_IT from '../data/manifest/it/DestinyDestinationDefinition/';
import DestinyDestinationDefinition_RU from '../data/manifest/ru/DestinyDestinationDefinition/';

import DestinyHistoricalStatsDefinition_EN from '../data/manifest/en/DestinyHistoricalStatsDefinition/';

import DestinyInventoryItemDefinition_EN from '../data/manifest/en/DestinyInventoryItemDefinition/';
import DestinyInventoryItemDefinition_IT from '../data/manifest/it/DestinyInventoryItemDefinition/';
import DestinyInventoryItemDefinition_RU from '../data/manifest/ru/DestinyInventoryItemDefinition/';

const customs = {
  de: {},
  en: {
    Braytech: Braytech_EN,
    BraytechMaps: BraytechMaps_EN,
    DestinyActivityDefinition: DestinyActivityDefinition_EN,
    DestinyActivityModifierDefinition: DestinyActivityModifierDefinition_EN,
    DestinyDestinationDefinition: DestinyDestinationDefinition_EN,
    DestinyClanBannerDefinition: DestinyClanBannerDefinition_EN,
    DestinyHistoricalStatsDefinition: DestinyHistoricalStatsDefinition_EN,
    DestinyInventoryItemDefinition: DestinyInventoryItemDefinition_EN,
  },
  es: {
    Braytech: Braytech_ES,
    BraytechMaps: BraytechMaps_ES,
    DestinyActivityModifierDefinition: DestinyActivityModifierDefinition_ES,
    DestinyDestinationDefinition: DestinyDestinationDefinition_ES,
  },
  'es-mx': {
    Braytech: Braytech_ESMX,
    BraytechMaps: BraytechMaps_ESMX,
    DestinyActivityModifierDefinition: DestinyActivityModifierDefinition_ESMX,
    DestinyDestinationDefinition: DestinyDestinationDefinition_ESMX,
  },
  fr: {},
  it: {
    Braytech: Braytech_IT,
    BraytechMaps: BraytechMaps_IT,
    DestinyActivityModifierDefinition: DestinyActivityModifierDefinition_IT,
    DestinyDestinationDefinition: DestinyDestinationDefinition_IT,
    DestinyInventoryItemDefinition: DestinyInventoryItemDefinition_IT,
  },
  ja: {},
  ko: {},
  pl: {},
  'pt-br': {},
  ru: {
    Braytech: Braytech_RU,
    BraytechMaps: BraytechMaps_RU,
    DestinyActivityModifierDefinition: DestinyActivityModifierDefinition_RU,
    DestinyDestinationDefinition: DestinyDestinationDefinition_RU,
    DestinyInventoryItemDefinition: DestinyInventoryItemDefinition_RU,
  },
  'zh-chs': {},
  'zh-cht': {},
};

function mergeWithCustomizer(a, b) {
  if (Array.isArray(a) && b && Array.isArray(b)) {
    return b.concat(a);
  } else if (typeof a === 'string' && b && typeof b === 'string') {
    return b;
  } else if (typeof a === 'number' && b && typeof b === 'number') {
    return b;
  } else if (typeof a === 'object') {
    return mergeWith(a, b, mergeWithCustomizer);
  }

  return a;
}

const customsMerge = (a, b) => {
  return mergeWith(a, b, mergeWithCustomizer);
};

const manifest = {
  set: (newManifest, lang) => {
    newManifest.BraytechDefinition = customsMerge(customs.en.Braytech, customs[lang].Braytech);
    newManifest.BraytechMapsDefinition = customsMerge(customs.en.BraytechMaps, customs[lang].BraytechMaps);
    newManifest.DestinyClanBannerDefinition = customs.en.DestinyClanBannerDefinition;

    customsMerge(newManifest.DestinyActivityDefinition, customsMerge(customs.en.DestinyActivityDefinition, customs[lang].DestinyActivityDefinition));
    customsMerge(newManifest.DestinyDestinationDefinition, customsMerge(customs.en.DestinyDestinationDefinition, customs[lang].DestinyDestinationDefinition));
    customsMerge(newManifest.DestinyHistoricalStatsDefinition, customsMerge(customs.en.DestinyHistoricalStatsDefinition, customs[lang].DestinyHistoricalStatsDefinition));
    customsMerge(newManifest.DestinyInventoryItemDefinition, customsMerge(customs.en.DestinyInventoryItemDefinition, customs[lang].DestinyInventoryItemDefinition));

    Object.assign(newManifest.DestinyActivityModifierDefinition, customs[lang].DestinyActivityModifierDefinition);

    // build Enigmatic Blueprint quest line
    if (newManifest.DestinyInventoryItemDefinition[2412366792]) {
      newManifest.DestinyInventoryItemDefinition['2412366792_enigmatic_blueprint'] = {
        displayProperties: {
          ...(newManifest.DestinyInventoryItemDefinition[2412366792].displayProperties || {}),
        },
        objectives: {
          objectiveHashes: newManifest.DestinyInventoryItemDefinition[2412366792].objectives?.objectiveHashes,
        },
        hash: '2412366792_enigmatic_blueprint',
      };
    }

    // override brother vance's destinationHash
    if (newManifest.DestinyVendorDefinition[2398407866].locations && newManifest.DestinyVendorDefinition[2398407866].locations.length && newManifest.DestinyVendorDefinition[2398407866].locations[0]) newManifest.DestinyVendorDefinition[2398407866].locations[0].destinationHash = 1993421442;

    // adjusted Mercury destinstion name to Fields of Glass because it's cute
    if (newManifest.DestinyDestinationDefinition[1993421442] && newManifest.DestinyDestinationDefinition[1993421442].displayProperties && newManifest.DestinyCollectibleDefinition[259147459] && newManifest.DestinyCollectibleDefinition[259147459].displayProperties && newManifest.DestinyCollectibleDefinition[259147459].displayProperties.name && newManifest.DestinyCollectibleDefinition[259147459].displayProperties.name !== '') newManifest.DestinyDestinationDefinition[1993421442].displayProperties.name = newManifest.DestinyCollectibleDefinition[259147459].displayProperties.name;

    Object.assign(manifest, newManifest);
  },
};

export default manifest;
