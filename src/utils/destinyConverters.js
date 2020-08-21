import React from 'react';

import { t, unixTimestampToDuration, duration } from './i18n';
import manifest from './manifest';
import * as enums from './destinyEnums';
import * as SVG from '../svg';

export function ammoTypeToAsset(type) {
  switch (type) {
    case 1:
      return {
        string: manifest.DestinyPresentationNodeDefinition[1731162900]?.displayProperties?.name,
        icon: <SVG.Common.Ammo.Primary />,
      };
    case 2:
      return {
        string: manifest.DestinyPresentationNodeDefinition[638914517]?.displayProperties?.name,
        icon: <SVG.Common.Ammo.Special />,
      };
    case 3:
      return {
        string: manifest.DestinyPresentationNodeDefinition[3686962409]?.displayProperties?.name,
        icon: <SVG.Common.Ammo.Heavy />,
      };
    default:
      return {};
  }
}

export function breakerTypeToIcon(type) {
  let icon;

  switch (type) {
    case 3178805705:
      icon = '';
      break;
    case 485622768:
      icon = '';
      break;
    case 2611060930:
      icon = '';
      break;
    default:
      icon = '';
  }

  return icon;
}

export function classHashToIcon(classHash) {
  if (classHash === 3655393761) return SVG.Common.Titan;
  if (classHash === 671679327) return SVG.Common.Hunter;

  return SVG.Common.Warlock;
}

export function classHashToString(classHash, genderHash) {
  const definitionClass = manifest.DestinyClassDefinition[classHash];

  if (!definitionClass) return t('Unknown');

  if (definitionClass.genderedClassNames && genderHash) {
    return definitionClass.genderedClassNamesByGenderHash[genderHash];
  }

  return definitionClass.displayProperties.name;
}

export function classTypeToString(type, gender) {
  const classHash = Object.keys(manifest.DestinyClassDefinition).find((key) => manifest.DestinyClassDefinition[key].classType === type);

  return classHashToString(classHash, gender);
}

export function damageTypeToAsset(damageTypeHash) {
  switch (damageTypeHash) {
    case 3373582085:
      return {
        string: 'kinetic',
        char: '',
      };
    case 1847026933:
      return {
        string: 'solar',
        char: '',
      };
    case 2303181850:
      return {
        string: 'arc',
        char: '',
      };
    case 3454344768:
      return {
        string: 'void',
        char: '',
      };
    default:
      return {
        string: '',
        char: '',
      };
  }
}

// https://bungie-net.github.io/multi/schema_Destiny-DestinyUnlockValueUIStyle.html#schema_Destiny-DestinyUnlockValueUIStyle
export function displayValue(value = '', objectiveHash, styleOverride = 0) {
  const enumerated = manifest.DestinyObjectiveDefinition[objectiveHash]?.inProgressValueStyle ? enums.enumerateUnlockValueUIStyle(manifest.DestinyObjectiveDefinition[objectiveHash].inProgressValueStyle) : enums.enumerateUnlockValueUIStyle(styleOverride);

  // console.log(manifest.DestinyObjectiveDefinition[objectiveHash]?.inProgressValueStyle, enumerated)

  if (enumerated.Percentage || enumerated.ExplicitPercentage) {
    return `${value}%`;
  }

  if (enumerated.RawFloat) {
    return (value / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  if (enumerated.TimeDuration) {
    const duration = unixTimestampToDuration(value);

    return `${duration.hours}:${duration.minutes.toString().padStart(2, '0')}:${duration.seconds.toString().padStart(2, '0')}`;
  }

  return value.toLocaleString();
}

export function formatHistoricalStatValue(statHash, value) {
  if (!manifest.DestinyHistoricalStatsDefinition[statHash]) {
    return value;
  }

  if (enums.DestinyHistoricalStatsUnitType.Count === manifest.DestinyHistoricalStatsDefinition[statHash].unitType) {
    return value.toLocaleString();
  } else if (enums.DestinyHistoricalStatsUnitType.Seconds === manifest.DestinyHistoricalStatsDefinition[statHash].unitType) {
    return duration(unixTimestampToDuration(value * 1000), { abbreviated: true });
  } else if (enums.DestinyHistoricalStatsUnitType.Distance === manifest.DestinyHistoricalStatsDefinition[statHash].unitType) {
    return t('Language.Distance.Metres.Plural.Abbr', { metres: Number.parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) });
  } else if (enums.DestinyHistoricalStatsUnitType.Percent === manifest.DestinyHistoricalStatsDefinition[statHash].unitType) {
    return `${value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}%`;
  } else if (enums.DestinyHistoricalStatsUnitType.Ratio === manifest.DestinyHistoricalStatsDefinition[statHash].unitType) {
    return Number.parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  } else {
    return value;
  }
}

export function energyStatToType(statHash) {
  if (enums.energyStats.solar.indexOf(statHash) > -1) {
    return 591714140; // solar
  } else if (enums.energyStats.arc.indexOf(statHash) > -1) {
    return 728351493; // void
  } else if (enums.energyStats.void.indexOf(statHash) > -1) {
    return 4069572561; // void
  } else {
    return 1198124803; // any
  }
}

export function energyTypeToAsset(energyTypeHash) {
  switch (energyTypeHash) {
    case 591714140:
      return { string: 'solar', char: '' };
    case 728351493:
      return { string: 'arc', char: '' };
    case 4069572561:
      return { string: 'void', char: '' };
    case 1198124803:
      return { string: 'any', char: '' };
    default:
      return { string: '', char: '' };
  }
}

/**
 * Convert a gender type to english string
 * @param type Destiny gender type
 * @return english string representation of type
 */
export function genderTypeToString(type) {
  switch (type) {
    case 0:
      return 'Male';
    case 1:
      return 'Female';
    default:
      return 'uh oh';
  }
}

export function groupMemberTypeToString(str) {
  switch (str) {
    case 1:
      return 'Beginner';
    case 2:
      return 'Member';
    case 3:
      return 'Admin';
    case 4:
      return 'Acting Founder';
    case 5:
      return 'Founder';
    default:
      return 'None';
  }
}

export function itemRarityToString(tierType) {
  switch (tierType) {
    case 6:
      return 'exotic';
    case 5:
      return 'legendary';
    case 4:
      return 'rare';
    case 3:
      return 'uncommon';
    case 2:
      return 'common';
    default:
      return 'common';
  }
}

export function raceHashToString(raceHash, genderHash, nonGendered = false) {
  const definitionRace = manifest.DestinyRaceDefinition[raceHash];

  if (!definitionRace) return '';

  if (definitionRace.genderedRaceNamesByGenderHash && genderHash) {
    return definitionRace.genderedRaceNamesByGenderHash[genderHash];
  }

  return definitionRace.displayProperties.name;
}

export function raceTypeToString(str) {
  switch (str) {
    case 0:
      return 'Human';
    case 1:
      return 'Awoken';
    case 2:
      return 'Exo';
    default:
      return 'uh oh';
  }
}
