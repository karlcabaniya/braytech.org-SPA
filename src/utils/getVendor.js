import * as bungie from './bungie';

async function getVendor(membershipType, membershipId, characterId, vendorHash) {

  // https://bungie-net.github.io/multi/schema_Destiny-DestinyComponentType.html
  
  const components = [
    300,  // ItemInstances
    301,  // ItemObjectives
    // 302,  // ItemPerks
    // 303,  // ItemRenderData
    304,  // ItemStats
    305,  // ItemSockets
    306,  // ItemTalentGrids
    307,  // ItemCommonData
    308,  // ItemPlugStates
    // 309,  // ItemPlugObjectives
    310,  // ItemReusablePlugs
    400,  // Vendors
    // 401,  // VendorCategories
    402,  // VendorSales
    // 600,  // CurrencyLookups
  ];
  
  try {
    const response = await bungie.GetVendor(membershipType, membershipId, characterId, vendorHash, components.join(','));

    if (response && response.ErrorCode === 1 && response.Response) {
      return response.Response;
    }
    
    throw new Error(response);
  } catch(e) {
    console.log(e);

    return false;
  }
    
}

export default getVendor;
