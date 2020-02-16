import manifest from './manifest.js';

export const stamps = [
  {
    hash: 'warmind',
    primary: true,
    icon: 'destiny-uniF129',
    classnames: 'me',
    condition: membershipId => ['4611686018449662397'].indexOf(membershipId) > -1
  },
  {
    hash: 'patron-vip',
    primary: true,
    icon: 'destiny-clovis_bray_device',
    classnames: 'patron one-hundo',
    condition: membershipId => manifest.statistics.patrons.alpha.indexOf(membershipId) > -1
  },
  {
    hash: 'patron',
    primary: true,
    icon: 'destiny-clovis_bray_device',
    classnames: 'patron',
    condition: membershipId => manifest.statistics.patrons.beta.indexOf(membershipId) > -1
  }
];

export const primaryFlair = membershipId => stamps.find(stamp => stamp.condition(membershipId));