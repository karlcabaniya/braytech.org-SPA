export default function getMemberDataShape(characterId, data) {
  const inventory = [
    ...(data.profile.Response?.characterEquipment.data?.[characterId]?.items || []), // equipped weapons etc
    ...(data.profile.Response?.profileInventory.data?.items || []), // non-instanced quest items, materials, etc.
    ...(data.profile.Response?.characterInventories.data?.[characterId]?.items || []), // non-equipped weapons etc
  ];
  const profileCurrencies = data.profile.Response?.profileCurrencies?.data?.items || [];

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
    currencies: {
      ...inventory.reduce(
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
    },
  };
}