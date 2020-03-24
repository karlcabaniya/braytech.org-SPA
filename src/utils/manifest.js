import { merge } from 'lodash';

import Braytech_EN from '../data/manifest/en/Braytech/';
import Braytech_ES from '../data/manifest/es/Braytech/';
import Braytech_ESMX from '../data/manifest/es/Braytech/';
import Braytech_IT from '../data/manifest/it/Braytech/';
import Braytech_RU from '../data/manifest/ru/Braytech/';
import DestinyClanBannerDefinition from '../data/manifest/en/DestinyClanBannerDefinition/';
import DestinyActivityDefinition from '../data/manifest/en/DestinyActivityDefinition/';
import DestinyHistoricalStatsDefinition from '../data/manifest/en/DestinyHistoricalStatsDefinition/';

import DestinyActivityModifierDefinition_EN from '../data/manifest/en/DestinyActivityModifierDefinition/';
import DestinyInventoryItemDefinition_EN from '../data/manifest/en/DestinyInventoryItemDefinition/';
// import DestinyPresentationNodeDefinition_EN from '../data/manifest/en/DestinyPresentationNodeDefinition/';

import DestinyActivityModifierDefinition_ES from '../data/manifest/es/DestinyActivityModifierDefinition/';
import DestinyActivityModifierDefinition_ESMX from '../data/manifest/es-mx/DestinyActivityModifierDefinition/';
import DestinyActivityModifierDefinition_RU from '../data/manifest/ru/DestinyActivityModifierDefinition/';

const customs = {
  de: {
    Braytech: Braytech_EN,
    DestinyActivityModifierDefinition: DestinyActivityModifierDefinition_EN
  },
  en: {
    Braytech: Braytech_EN,
    DestinyClanBannerDefinition,
    DestinyActivityDefinition,
    DestinyHistoricalStatsDefinition,
    DestinyActivityModifierDefinition: DestinyActivityModifierDefinition_EN,
    DestinyInventoryItemDefinition: DestinyInventoryItemDefinition_EN,
    // DestinyPresentationNodeDefinition: DestinyPresentationNodeDefinition_EN
  },
  es: {
    Braytech: Braytech_ES,
    DestinyActivityModifierDefinition: DestinyActivityModifierDefinition_ES
  },
  'es-mx': {
    Braytech: Braytech_ESMX,
    DestinyActivityModifierDefinition: DestinyActivityModifierDefinition_ESMX
  },
  fr: {
    Braytech: Braytech_EN,
    DestinyActivityModifierDefinition: DestinyActivityModifierDefinition_EN
  },
  it: {
    Braytech: Braytech_IT,
    DestinyActivityModifierDefinition: DestinyActivityModifierDefinition_EN
  },
  ja: {
    Braytech: Braytech_EN,
    DestinyActivityModifierDefinition: DestinyActivityModifierDefinition_EN
  },
  ko: {
    Braytech: Braytech_EN,
    DestinyActivityModifierDefinition: DestinyActivityModifierDefinition_EN
  },
  pl: {
    Braytech: Braytech_EN,
    DestinyActivityModifierDefinition: DestinyActivityModifierDefinition_EN
  },
  'pt-br': {
    Braytech: Braytech_EN,
    DestinyActivityModifierDefinition: DestinyActivityModifierDefinition_EN
  },
  ru: {
    Braytech: Braytech_RU,
    DestinyActivityModifierDefinition: DestinyActivityModifierDefinition_RU
  },
  'zh-chs': {
    Braytech: Braytech_EN,
    DestinyActivityModifierDefinition: DestinyActivityModifierDefinition_EN
  },
  'zh-cht': {
    Braytech: Braytech_EN,
    DestinyActivityModifierDefinition: DestinyActivityModifierDefinition_EN
  }
};

const customsMerge = (bungie, customs) => {
  for (const key in customs) {
    if (customs.hasOwnProperty(key) && bungie.hasOwnProperty(key)) {
      bungie[key] = merge(bungie[key], customs[key]);
    }
  }

  return bungie;
};

const manifest = {
  set: (newManifest, lang) => {
    newManifest.BraytechDefinition = customs[lang].Braytech;
    newManifest.DestinyClanBannerDefinition = customs.en.DestinyClanBannerDefinition;

    // Object.assign(newManifest.DestinyActivityDefinition, customs.en.DestinyActivityDefinition);

    customsMerge(newManifest.DestinyActivityDefinition, customs.en.DestinyActivityDefinition);
    customsMerge(newManifest.DestinyHistoricalStatsDefinition, customs.en.DestinyHistoricalStatsDefinition);
    customsMerge(newManifest.DestinyInventoryItemDefinition, customs[lang].DestinyInventoryItemDefinition);

    // Object.assign(newManifest.DestinyPresentationNodeDefinition, customs.en.DestinyPresentationNodeDefinition);
    Object.assign(newManifest.DestinyActivityModifierDefinition, customs[lang].DestinyActivityModifierDefinition);


    // add emotes to flair presentation node
    // if (newManifest.DestinyPresentationNodeDefinition[3066887728] && newManifest.DestinyPresentationNodeDefinition[3066887728].children && newManifest.DestinyPresentationNodeDefinition[3066887728].children.presentationNodes) {
    //   newManifest.DestinyPresentationNodeDefinition[3066887728].children.presentationNodes.push({
    //     presentationNodeHash: 'emotes'
    //   });
    // }

    // build Enigmatic Blueprint quest line
    if (newManifest.DestinyInventoryItemDefinition[2412366792]) {
      newManifest.DestinyInventoryItemDefinition['2412366792_enigmatic_blueprint'] = {
        displayProperties: {
          description: newManifest.DestinyInventoryItemDefinition[2412366792].displayProperties && newManifest.DestinyInventoryItemDefinition[2412366792].displayProperties.description,
          name: newManifest.DestinyInventoryItemDefinition[2412366792].displayProperties && newManifest.DestinyInventoryItemDefinition[2412366792].displayProperties.name,
        },
        objectives: {
          objectiveHashes: newManifest.DestinyInventoryItemDefinition[2412366792].objectives && newManifest.DestinyInventoryItemDefinition[2412366792].objectives.objectiveHashes
        },
        hash: '2412366792_enigmatic_blueprint'
      };
    }

    // override brother vance's destinationHash
    if (newManifest.DestinyVendorDefinition[2398407866].locations && newManifest.DestinyVendorDefinition[2398407866].locations.length && newManifest.DestinyVendorDefinition[2398407866].locations[0]) newManifest.DestinyVendorDefinition[2398407866].locations[0].destinationHash = 1993421442;

    // adjusted Mercury destinstion name to Fields of Glass because it's cute
    if (newManifest.DestinyDestinationDefinition[1993421442] && newManifest.DestinyDestinationDefinition[1993421442].displayProperties && newManifest.DestinyCollectibleDefinition[259147459] && newManifest.DestinyCollectibleDefinition[259147459].displayProperties && newManifest.DestinyCollectibleDefinition[259147459].displayProperties.name && newManifest.DestinyCollectibleDefinition[259147459].displayProperties.name !== '') newManifest.DestinyDestinationDefinition[1993421442].displayProperties.name = newManifest.DestinyCollectibleDefinition[259147459].displayProperties.name;

    Object.assign(manifest, newManifest);
  }
};

export default manifest;
