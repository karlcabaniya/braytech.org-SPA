import { t, unixTimestampToDuration } from './i18n';
import manifest from './manifest';
import * as enums from './destinyEnums';
import * as SVG from '../svg';

export function ammoTypeToAsset(type) {
  let string;
  let icon;

  switch (type) {
    case 1:
      string = manifest.DestinyPresentationNodeDefinition[1731162900]?.displayProperties?.name;
      break;
    case 2:
      string = manifest.DestinyPresentationNodeDefinition[638914517]?.displayProperties?.name;
      break;
    case 3:
      string = manifest.DestinyPresentationNodeDefinition[3686962409]?.displayProperties?.name;
      break;
    default:
      string = '';
  }

  return {
    string,
    icon
  };
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
  const classHash = Object.keys(manifest.DestinyClassDefinition).find(key => manifest.DestinyClassDefinition[key].classType === type);

  return classHashToString(classHash, gender);
}

export function damageTypeToAsset(type) {
  let string;
  let char;

  switch (type) {
    case 3373582085:
      string = 'kinetic';
      char = '';
      break;
    case 1847026933:
      string = 'solar';
      char = '';
      break;
    case 2303181850:
      string = 'arc';
      char = '';
      break;
    case 3454344768:
      string = 'void';
      char = '';
      break;
    default:
      string = '';
      char = '';
  }

  return {
    string,
    char
  };
}

export function displayValue(value, objectiveHash, styleOverride = 0) {
  const enumerated = manifest.DestinyObjectiveDefinition[objectiveHash]?.inProgressValueStyle ? enums.enumerateUnlockValueUIStyle(manifest.DestinyObjectiveDefinition[objectiveHash].inProgressValueStyle) : enums.enumerateUnlockValueUIStyle(styleOverride);

  console.log(manifest.DestinyObjectiveDefinition[objectiveHash]?.inProgressValueStyle, enumerated)

  if (enumerated.percentage || enumerated.explicitPercentage) {
    return `${value}%`;
  }

  if (enumerated.rawFloat) {
    return (value / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  if (enumerated.timeDuration) {
    const duration = unixTimestampToDuration(value);

    return `${duration.hours}:${duration.minutes.toString().padStart(2, '0')}:${duration.seconds.toString().padStart(2, '0')}`;
  }

  return value.toLocaleString();
}

export function energyStatToType(statHash) {
  let typeHash;

  switch (statHash) {
    case 3625423501:
      typeHash = 728351493; // arc
      break;
    case 16120457:
      typeHash = 4069572561; // void
      break;
    default:
      typeHash = 591714140; // solar
  }

  return typeHash;
}

export function energyTypeToAsset(type) {
  let string;
  let char;

  switch (type) {
    case 591714140:
      string = 'solar';
      char = '';
      break;
    case 728351493:
      string = 'arc';
      char = '';
      break;
    case 4069572561:
      string = 'void';
      char = '';
      break;
    case 1198124803:
      string = 'any';
      char = '';
      break;
    default:
      string = '';
      char = '';
  }

  return {
    string,
    char
  };
}

/**
 * Convert a gender type to english string
 * @param type Destiny gender type
 * @return english string representation of type
 */
export function genderTypeToString(type) {
  let string;

  switch (type) {
    case 0:
      string = 'Male';
      break;
    case 1:
      string = 'Female';
      break;
    default:
      string = 'uh oh';
  }

  return string;
}

export function groupMemberTypeToString(str) {
  let string;

  switch (str) {
    case 1:
      string = 'Beginner';
      break;
    case 2:
      string = 'Member';
      break;
    case 3:
      string = 'Admin';
      break;
    case 4:
      string = 'Acting Founder';
      break;
    case 5:
      string = 'Founder';
      break;
    default:
      string = 'None';
  }

  return string;
}

export function itemRarityToString(tierType) {
  let string;

  switch (tierType) {
    case 6:
      string = 'exotic';
      break;
    case 5:
      string = 'legendary';
      break;
    case 4:
      string = 'rare';
      break;
    case 3:
      string = 'uncommon';
      break;
    case 2:
      string = 'common';
      break;
    default:
      string = 'common';
  }

  return string;
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
  let string;

  switch (str) {
    case 0:
      string = 'Human';
      break;
    case 1:
      string = 'Awoken';
      break;
    case 2:
      string = 'Exo';
      break;
    default:
      string = 'uh oh';
  }

  return string;
}