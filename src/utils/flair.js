import manifest from './manifest.js';

export const stamps = [
  {
    hash: 'warmind',
    primary: true,
    icon: 'superintendent',
    classNames: 'opacity-50 superintendent static-loop',
    condition: membershipId => ['4611686018449662397'].indexOf(membershipId) > -1
  },
  {
    hash: 'patron-veteran',
    primary: true,
    icon: 'veteran',
    classNames: 'opacity-75 patron veteran',
    condition: membershipId => manifest.statistics.patrons.alpha.indexOf(membershipId) > -1 || membershipId === '4611686018449662397'
  },
  {
    hash: 'patron',
    primary: true,
    icon: 'braytech',
    classNames: 'opacity-50 patron',
    condition: membershipId => manifest.statistics.patrons.beta.indexOf(membershipId) > -1 || manifest.statistics.patrons.alpha.indexOf(membershipId) > -1
  }
];

export const primaryFlair = membershipId => stamps.find(stamp => stamp.condition(membershipId));