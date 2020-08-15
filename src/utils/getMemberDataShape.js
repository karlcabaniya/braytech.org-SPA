function combineCharacterInventories(items) {
  if (typeof items === 'object') {
    return Object.keys(items).reduce((array, key) => [...array, ...items[key].items.map((item) => ({ ...item, characterId: key }))], []);
  }

  return [];
}

export default function getMemberDataShape(data) {
  if (process.env.NODE_ENV === 'development') console.time('getMemberDataShape');

  const inventory = [
    ...(data.profile.Response?.profileInventory.data?.items || []), // non-instanced quest items, materials, etc.
    ...combineCharacterInventories(data.profile.Response?.characterEquipment.data), // equipped weapons etc
    ...combineCharacterInventories(data.profile.Response?.characterInventories.data), // non-equipped weapons etc
  ];
  const profileCurrencies = data.profile.Response?.profileCurrencies?.data?.items || [];

  const currencies = {
    ...inventory
      .filter((item) => item.bucketHash === 1469714392)
      .reduce(
        (consumables, consumable) => ({
          ...consumables,
          [consumable.itemHash]: consumable,
        }),
        {}
      ),
    ...profileCurrencies.reduce(
      (currencies, currency) => ({
        ...currencies,
        [currency.itemHash]: currency,
      }),
      {}
    ),
  }

  if (process.env.NODE_ENV === 'development') console.timeEnd('getMemberDataShape');

  return {
    profile: data.profile.Response,
    groups: {
      // deliver the groups response unprepared
      ...data.groups.Response,
      // mold the group data into something more appealing
      clan: data.groups.Response?.results?.[0] && {
        // adjust the shape
        ...data.groups.Response.results[0].group,
        self: data.groups.Response.results[0].member,
      },
    },
    milestones: data.milestones.Response,
    inventory,
    currencies,
  };
}
