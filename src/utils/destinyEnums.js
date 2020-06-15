export const manifestTableNames = [
  'DestinyPlaceDefinition',
  'DestinyActivityDefinition',
  'DestinyActivityTypeDefinition',
  'DestinyClassDefinition',
  'DestinyGenderDefinition',
  'DestinyInventoryBucketDefinition',
  'DestinyRaceDefinition',
  'DestinyTalentGridDefinition',
  'DestinySandboxPerkDefinition',
  'DestinyStatGroupDefinition',
  'DestinyFactionDefinition',
  'DestinyItemCategoryDefinition',
  'DestinyDamageTypeDefinition',
  'DestinyActivityModeDefinition',
  'DestinyCollectibleDefinition',
  'DestinyStatDefinition',
  'DestinyItemTierTypeDefinition',
  'DestinyMetricDefinition',
  'DestinyPlugSetDefinition',
  'DestinyPresentationNodeDefinition',
  'DestinyRecordDefinition',
  'DestinyDestinationDefinition',
  'DestinyEquipmentSlotDefinition',
  'DestinyInventoryItemDefinition',
  'DestinyLocationDefinition',
  'DestinyLoreDefinition',
  'DestinyObjectiveDefinition',
  'DestinyProgressionDefinition',
  'DestinySeasonDefinition',
  'DestinySeasonPassDefinition',
  'DestinySocketCategoryDefinition',
  'DestinySocketTypeDefinition',
  'DestinyTraitDefinition',
  'DestinyVendorDefinition',
  'DestinyMilestoneDefinition',
  'DestinyActivityModifierDefinition',
  'DestinyReportReasonCategoryDefinition',
  'DestinyArtifactDefinition',
  'DestinyBreakerTypeDefinition',
  'DestinyChecklistDefinition',
  'DestinyEnergyTypeDefinition',
  'DestinyPowerCapDefinition',
];

export const platforms = {
  1: 'xbox',
  2: 'playstation',
  3: 'steam',
  4: 'battlenet',
  5: 'stadia',
  6: 'nintendo',
};

export const classStrings = {
  0: 'titan',
  1: 'hunter',
  2: 'warlock',
};

export const DestinyTierType = {
  Unknown: 0,
  Currency: 1,
  Basic: 2,
  Common: 3,
  Rare: 4,
  Superior: 5,
  Exotic: 6,
};

export const DestinyItemType = {
  None: 0,
  Currency: 1,
  Armor: 2,
  Weapon: 3,
  Message: 7,
  Engram: 8,
  Consumable: 9,
  ExchangeMaterial: 10,
  MissionReward: 11,
  QuestStep: 12,
  QuestStepComplete: 13,
  Emblem: 14,
  Quest: 15,
  Subclass: 16,
  ClanBanner: 17,
  Aura: 18,
  Mod: 19,
  Dummy: 20,
  Ship: 21,
  Vehicle: 22,
  Emote: 23,
  Ghost: 24,
  Package: 25,
  Bounty: 26,
  Wrapper: 27,
  SeasonArtifact: 28,
  Finisher: 29,
};

export const DestinyItemSubType = {
  None: 0,
  AutoRifle: 6,
  Shotgun: 7,
  Machinegun: 8,
  HandCannon: 9,
  RocketLauncher: 10,
  FusionRifle: 11,
  SniperRifle: 12,
  PulseRifle: 13,
  ScoutRifle: 14,
  Sidearm: 17,
  Sword: 18,
  Mask: 19,
  Shader: 20,
  Ornament: 21,
  FusionRifleLine: 22,
  GrenadeLauncher: 23,
  SubmachineGun: 24,
  TraceRifle: 25,
  HelmetArmor: 26,
  GauntletsArmor: 27,
  ChestArmor: 28,
  LegArmor: 29,
  ClassArmor: 30,
  Bow: 31,
};

export const DestinyInventoryBucket = {
  ChestArmor: 14239492,
  LegArmor: 20886954,
  General: 138197802,
  LostItems: 215593132,
  Ships: 284967655,
  Engrams: 375726501,
  PowerWeapons: 953998645,
  Auras: 1269569095,
  Quests: 1345459588,
  SpecialOrders: 1367666825,
  Consumables: 1469714392,
  KineticWeapons: 1498876634,
  SeasonalArtifact: 1506418338,
  ClassArmor: 1585787867,
  Vehicle: 2025709351,
  EnergyWeapons: 2465295065,
  UpgradePoint: 2689798304,
  StrangeCoin: 2689798305,
  Glimmer: 2689798308,
  LegendaryShards: 2689798309,
  Silver: 2689798310,
  BrightDust: 2689798311,
  Shaders: 2973005342,
  Emotes: 3054419239,
  Messages: 3161908920,
  Subclass: 3284755031,
  Modifications: 3313201758,
  WrappedItems: 3350918817,
  Helmet: 3448274439,
  Gauntlets: 3551918588,
  Finishers: 3683254069,
  Materials: 3865314626,
  Ghost: 4023194814,
  Emblems: 4274335291,
  ClanBanners: 4292445962,
};

export const energyStats = {
  solar: [
    2018193158, // capacity
    3344745325, // cost
  ],
  arc: [
    3625423501, // capacity
    3779394102, // cost
  ],
  void: [
    16120457, // capacity
    2399985800, // cost
  ],
  any: [
    3578062600, // cost
  ],
};

export const DestinySocketCategoryStyle = {
  Unknown: 0,
  Reusable: 1,
  Consumable: 2,
  Unlockable: 3,
  Intrinsic: 4,
  EnergyMeter: 5,
  LargePerk: 6,
};

export const DestinyStatAggregationType = {
  CharacterAverage: 0,
  Character: 1,
  Item: 2,
};

export const DestinyStatCategory = {
  Gameplay: 0,
  Weapon: 1,
  Defense: 2,
  Primary: 3,
};

const flagEnum = (state, value) => !!(state & value);

export const enumerateDestinyGameVersions = (state) => ({
  None: flagEnum(state, 0),
  Base: flagEnum(state, 1),
  Osiris: flagEnum(state, 2),
  Warmind: flagEnum(state, 4),
  Forsaken: flagEnum(state, 8),
  ForsakenAnnualPass: flagEnum(state, 16),
  Shadowkeep: flagEnum(state, 32),
});

export const enumeratePresentationNodeState = (state) => ({
  None: flagEnum(state, 0),
  Invisible: flagEnum(state, 1),
  Obscured: flagEnum(state, 2),
});

export const enumerateRecordState = (state) => ({
  None: flagEnum(state, 0),
  RecordRedeemed: flagEnum(state, 1),
  RewardUnavailable: flagEnum(state, 2),
  ObjectiveNotCompleted: flagEnum(state, 4),
  Obscured: flagEnum(state, 8),
  Invisible: flagEnum(state, 16),
  EntitlementUnowned: flagEnum(state, 32),
  CanEquipTitle: flagEnum(state, 64),
});

export const enumerateCollectibleState = (state) => ({
  None: flagEnum(state, 0),
  NotAcquired: flagEnum(state, 1),
  Obscured: flagEnum(state, 2),
  Invisible: flagEnum(state, 4),
  CannotAffordMaterialRequirements: flagEnum(state, 8),
  InventorySpaceUnavailable: flagEnum(state, 16),
  UniquenessViolation: flagEnum(state, 32),
  PurchaseDisabled: flagEnum(state, 64),
});

export const enumerateItemState = (state) => ({
  None: flagEnum(state, 0),
  Locked: flagEnum(state, 1),
  Tracked: flagEnum(state, 2),
  Masterworked: flagEnum(state, 4),
});

export const enumerateTransferStatus = (state) => ({
  CanTransfer: flagEnum(state, 0),
  ItemIsEquipped: flagEnum(state, 1),
  NotTransferrable: flagEnum(state, 2),
  NoRoomInDestination: flagEnum(state, 4),
});

export const enumeratePartyMemberState = (state) => ({
  None: flagEnum(state, 0),
  FireteamMember: flagEnum(state, 1),
  PosseMember: flagEnum(state, 2),
  GroupMember: flagEnum(state, 4),
  PartyLeader: flagEnum(state, 8),
});

export const DestinyGamePrivacySetting = {
  Open: 0,
  ClanAndFriendsOnly: 1,
  FriendsOnly: 2,
  InvitationOnly: 3,
  Closed: 4,
};

export const enumerateJoinClosedReasons = (state) => ({
  None: flagEnum(state, 0),
  InMatchmaking: flagEnum(state, 1),
  Loading: flagEnum(state, 2),
  SoloMode: flagEnum(state, 4),
  InternalReasons: flagEnum(state, 8),
  DisallowedByGameState: flagEnum(state, 16),
  Offline: flagEnum(state, 32768),
});

export const enumerateProgressionRewardItemState = (state) => ({
  None: flagEnum(state, 0),
  Invisible: flagEnum(state, 1),
  Earned: flagEnum(state, 2),
  Claimed: flagEnum(state, 4),
  ClaimAllowed: flagEnum(state, 8),
});

export const enumerateVendorItemStatus = (state) => ({
  Success: flagEnum(state, 0),
  NoInventorySpace: flagEnum(state, 1),
  NoFunds: flagEnum(state, 2),
  NoProgression: flagEnum(state, 4),
  NoUnlock: flagEnum(state, 8),
  NoQuantity: flagEnum(state, 16),
  OutsidePurchaseWindow: flagEnum(state, 32),
  NotAvailable: flagEnum(state, 64),
  UniquenessViolation: flagEnum(state, 128),
  UnknownError: flagEnum(state, 256),
  AlreadySelling: flagEnum(state, 512),
  Unsellable: flagEnum(state, 1024),
  SellingInhibited: flagEnum(state, 2048),
  AlreadyOwned: flagEnum(state, 4096),
  DisplayOnly: flagEnum(state, 8192),
});

export const enumerateUnlockValueUIStyle = (state) => ({
  Automatic: state === 0,
  Fraction: state === 1,
  Checkbox: state === 2,
  Percentage: state === 3,
  Datetime: state === 4,
  FractionFloat: state === 5,
  Integer: state === 6,
  TimeDuration: state === 7,
  Hidden: state === 8,
  Multiplier: state === 9,
  GreenPips: state === 10,
  RedPips: state === 11,
  ExplicitPercentage: state === 12,
  RawFloat: state === 13,
});

export const bookCovers = {
  2447807737: '037E-0000131E.png',
  396866327: '01A3-0000132F.png',
  1420597821: '037E-00001308.png',
  648415847: '037E-00001311.png',
  335014236: '037E-00001BE0.png',
  3472295814: '0560-000000D4.png',
  3239864233: '01A3-00001330.png',
  2541573665: '01A3-00001336.png',
  3305936921: '037E-0000130D.png',
  2077211754: '0560-000000C5.png',
  655926402: '01A3-000012F4.png',
  2026987060: '037E-00001328.png',
  2325462143: '037E-00001323.png',
  2203266100: '0560-000000CF.png',
  756584948: '0560-000000CA.png',
  3148269494: '0560-00001070.png',
  2741070862: '0560-00001065.png',
  3758802814: '0560-00001060.png',
  139066480: '0560-0000105C.png',
  3762408250: '0560-00001074.png',
  289742222: '0560-0000106A.png',
  1070500232: '0560-00006553.png',
  2721577348: '0560-00006558.png',
  2761772090: '0560-00006547.png',
  4285512244: '0597_02D2_00.png',
  1510571147: '0597_02DA_00.png',
  2399850548: '0597_02C4_00.png',
  628625882: '0597_02BD_00.png',
  2474271317: '0597_02CC_00.png',
  2341654316: '0597_02AF_00.png',
  1596399902: '0597_02B6_00.png',
  2487458163: '0709-00003972.png',
  2090388805: '0709-00003964.png',
  2454250131: '0912-0FBF.png',
  2410366478: '0912-0FC6.png',
  1460852227: '0966-10A1.png',
  1096842912: '0966-1099.png',
};

export const sealImages = {
  2588182977: '037E-00001367.png',
  3481101973: '037E-00001343.png',
  147928983: '037E-0000134A.png',
  2693736750: '037E-0000133C.png',
  2516503814: '037E-00001351.png',
  1162218545: '037E-00001358.png',
  2039028930: '0560-000000EB.png',
  991908404: '0560-0000107E.png',
  3170835069: '0560-00006583.png',
  1002334440: '0560-00007495.png', // Moments of Triumph: MMXIX
  3303651244: '0597_057C_00.png',
  4097789885: '0597_0573_00.png',
  2209950401: '0597_056A_00.png',
  3303651245: '0709-00003850.png',
  2699827343: '0912-0F5F.png',
  2418157809: '0912-0F4C.png', // Flawless
  1473677990: '0912-0CDD.png', // Conqueror
  1617497214: '0912-0F4C.png', // Flawless
  1673689807: '0912-0CDD.png', // Conqueror
  952001576: '0560-00007495.png', // Moments of Triumph 2020
  2699827342: '0966-105D.png', // Arrivals
};

export const badgeImages = {
  3241617029: '01E3-00000278.png',
  1419883649: '01E3-00000280.png',
  3333531796: '01E3-0000027C.png',
  2904806741: '01E3-00000244.png',
  1331476689: '01E3-0000024C.png',
  2881240068: '01E3-00000248.png',
  3642989833: '01E3-00000266.png',
  2399267278: '037E-00001D4C.png',
  701100740: '01A3-0000189C.png',
  1420354007: '01E3-0000032C.png',
  1086048586: '01E3-00000377.png',
  2503214417: '0560-00000D7D.png',
  2759158924: '0560-00006562.png',
  2388540594: '0597_045D_00.png',
  3267852685: '0597_0464_00.png',
  223465203: '0597_048E_00.png',
  4257248973: '0709-00003436.png',
  564984975: '0912-0E95.png',
  3459575786: '0966-0FF6.png',
};

export const associationsCollectionsBadgesClasses = {
  5678666: 2271682572,
  7761993: 2271682572,
  24162924: 2271682572,
  51250598: 2271682572,
  272447096: 3655393761,
  278453589: 671679327,
  282080253: 2271682572,
  308119616: 671679327,
  397176300: 671679327,
  437406379: 2271682572,
  454888209: 3655393761,
  543101070: 671679327,
  555927954: 2271682572,
  558738844: 3655393761,
  582419680: 671679327,
  587677888: 2271682572,
  604768449: 3655393761,
  605410965: 3655393761,
  805054563: 671679327,
  811225638: 3655393761,
  907398217: 671679327,
  964388375: 671679327,
  1003644562: 3655393761,
  1040898483: 2271682572,
  1080375723: 671679327,
  1115203081: 3655393761,
  1127243461: 2271682572,
  1172293868: 2271682572,
  1187972104: 2271682572,
  1234074769: 671679327,
  1269917845: 2271682572,
  1367826044: 2271682572,
  1481732726: 671679327,
  1521772351: 671679327,
  1573256543: 2271682572,
  1584294968: 2271682572,
  1802049362: 3655393761,
  1813275880: 671679327,
  1840210717: 2271682572,
  1860141931: 2271682572,
  1875194813: 3655393761,
  1893032045: 3655393761,
  1996848060: 3655393761,
  2084683608: 2271682572,
  2180056767: 671679327,
  2283697615: 671679327,
  2314553307: 671679327,
  2516153921: 3655393761,
  2591952283: 2271682572,
  2598675734: 3655393761,
  2607543675: 671679327,
  2623445341: 671679327,
  2652561747: 3655393761,
  2721277575: 3655393761,
  2761465119: 3655393761,
  2765771634: 671679327,
  3029703837: 3655393761,
  3083337344: 2271682572,
  3149147086: 671679327,
  3233768126: 671679327,
  3252380766: 3655393761,
  3304578900: 3655393761,
  3566355363: 671679327,
  3632206043: 3655393761,
  3711698756: 2271682572,
  3745240322: 671679327,
  3784478466: 3655393761,
  3809174270: 2271682572,
  4107433557: 3655393761,
  4108787242: 3655393761,
};

export const associationsCollectionsBadges = [
  {
    recordHash: 3488769908, // Destinations: Red War
    badgeHash: 2904806741,
  },
  {
    recordHash: 3327085974, // Exotics: Red War (Warlock)
    badgeHash: 3241617029,
  },
  {
    recordHash: 1372723679, // Exotics: Red War (Titan)
    badgeHash: 3241617029,
  },
  {
    recordHash: 2109838578, // Exotics: Red War (Hunter)
    badgeHash: 3241617029,
  },
  {
    recordHash: 913036541, // Exotics: Curse of Osiris and Warmind (Warlock)
    badgeHash: 1419883649,
  },
  {
    recordHash: 2500732572, // Exotics: Curse of Osiris and Warmind (Titan)
    badgeHash: 1419883649,
  },
  {
    recordHash: 1247544128, // Exotics: Curse of Osiris and Warmind (Hunter)
    badgeHash: 1419883649,
  },
  {
    recordHash: 3016588454, // Exotics: Forsaken (Warlock)
    badgeHash: 3333531796,
  },
  {
    recordHash: 898220115, // Exotics: Forsaken (Titan)
    badgeHash: 3333531796,
  },
  {
    recordHash: 2904000913, // Exotics: Forsaken (Hunter)
    badgeHash: 3333531796,
  },
  {
    recordHash: 2676320666, // Destinations: Curse of Osiris and Warmind
    badgeHash: 1331476689,
  },
  {
    recordHash: 4269157841, // Destinations: Forsaken
    badgeHash: 2881240068,
  },
  {
    recordHash: 751035753, // Raid: Last Wish
    badgeHash: 1086048586,
  },
  {
    recordHash: 1522035006, // Destinations: Dreaming City
    badgeHash: 3642989833,
  },
  {
    recordHash: 1975718024, // Playing for Keeps
    badgeHash: 1420354007,
  },
  {
    recordHash: 4160670554, // Annual Pass: Black Armory
    badgeHash: 2399267278,
  },
  {
    recordHash: 2794426212, // Annual Pass: Jokers Wild
    badgeHash: 2503214417,
  },
  {
    recordHash: 52802522, // Mint in Box
    badgeHash: 2759158924,
  },
  {
    recordHash: 96478725, // Lunar Rover
    badgeHash: 2388540594,
  },
  {
    recordHash: 3737200951, // Sacred Duty (Raid)
    badgeHash: 223465203,
  },
  {
    recordHash: 697150349, // Season of the Undying
    badgeHash: 3267852685,
  },
  {
    recordHash: 1087859470, // Season of Dawn
    badgeHash: 4257248973,
  },
  {
    recordHash: 4214917806, // Flawless
    badgeHash: 564984975,
  },
];

export const nightfalls = {
  3145298904: {
    // Nightfall: The Arms Dealer
    sort: 1,
    triumphs: [3340846443, 4267516859],
    items: [],
    collectibles: [3036030066, 1463718189],
    ordealHashes: [1358381368, 1358381370, 1358381371, 1358381372, 1358381373],
    grandmasterHash: 3726640183,
    affectsSpeedEmblemObjective: true,
  },
  1391780798: {
    // Nightfall: Broodhold
    sort: 2,
    triumphs: [3042714868, 4156350130],
    items: [],
    collectibles: [],
    ordealHashes: [135872552, 135872553, 135872554, 135872558, 135872559],
    grandmasterHash: 3879949581,
    affectsSpeedEmblemObjective: false,
  },
  3034843176: {
    // Nightfall: The Corrupted
    sort: 3,
    triumphs: [3951275509, 3641166665],
    items: [],
    collectibles: [1099984904, 1194959231],
    ordealHashes: [245243704, 245243705, 245243706, 245243710, 245243711],
    grandmasterHash: 3354105309,
    affectsSpeedEmblemObjective: true,
  },
  1282886582: {
    // Nightfall: Exodus Crash
    sort: 4,
    triumphs: [1526865549, 2140068897],
    items: [],
    collectibles: [3036030067, 1463718187],
    ordealHashes: [68611392, 68611393, 68611394, 68611398, 68611399],
    grandmasterHash: 54961125,
    affectsSpeedEmblemObjective: true,
  },
  629542775: {
    // Nightfall: The Festering Core
    sort: 5,
    triumphs: [],
    items: [],
    collectibles: [],
    ordealHashes: [766116576, 766116577, 766116580, 766116582, 766116583],
    grandmasterHash: 3455414851,
    affectsSpeedEmblemObjective: false,
  },
  936308438: {
    // Nightfall: A Garden World
    sort: 6,
    triumphs: [2692332187, 1398454187],
    items: [],
    collectibles: [2448009818, 2206107773],
    ordealHashes: [1002842615, 2533203704, 2533203706, 2533203707, 2533203708, 2533203709],
    grandmasterHash: 1002842615,
    affectsSpeedEmblemObjective: true,
  },
  3701132453: {
    // Nightfall: The Hollowed Lair
    sort: 7,
    triumphs: [3450793480, 3847579126],
    items: [],
    collectibles: [1074861258, 943388586],
    ordealHashes: [],
    grandmasterHash: false,
    affectsSpeedEmblemObjective: true,
  },
  1034003646: {
    // Nightfall: The Insight Terminus
    sort: 8,
    triumphs: [599303591, 3399168111],
    items: [],
    collectibles: [1186314105, 2132755465],
    ordealHashes: [3200108048, 3200108049, 3200108052, 3200108054, 3200108055],
    grandmasterHash: 2694576755,
    affectsSpeedEmblemObjective: true,
  },
  4259769141: {
    // Nightfall: The Inverted Spire
    sort: 9,
    triumphs: [3973165904, 1498229894],
    items: [],
    collectibles: [1718922261, 1463718185],
    ordealHashes: [1801803624, 1801803625, 1801803627, 1801803630],
    grandmasterHash: false,
    affectsSpeedEmblemObjective: true,
  },
  3372160277: {
    // Nightfall: Lake of Shadows
    sort: 10,
    triumphs: [1329556468, 413743786],
    items: [],
    collectibles: [1602518767, 3046699982],
    ordealHashes: [1302909042, 1302909043, 1302909044, 1302909045, 1302909047],
    grandmasterHash: 3919254032,
    affectsSpeedEmblemObjective: true,
  },
  3289589202: {
    // Nightfall: The Pyramidion
    sort: 11,
    triumphs: [1060780635, 1142177491],
    items: [],
    collectibles: [1152758802, 1463718182],
    ordealHashes: [3265488360, 3265488362, 3265488363, 3265488365],
    grandmasterHash: false,
    affectsSpeedEmblemObjective: true,
  },
  3280234344: {
    // Nightfall: Savathûn's Song
    sort: 12,
    triumphs: [2099501667, 1442950315],
    items: [],
    collectibles: [1333654061, 1463718186],
    ordealHashes: [3849697856, 3849697858, 3849697859, 3849697860, 3849697861],
    grandmasterHash: 2168858559,
    affectsSpeedEmblemObjective: true,
  },
  3856436847: {
    // Nightfall: The Scarlet Keep
    sort: 13,
    triumphs: [],
    items: [],
    collectibles: [],
    ordealHashes: [887176537, 887176540, 887176542, 887176543],
    grandmasterHash: false,
    affectsSpeedEmblemObjective: false,
  },
  522318687: {
    // Nightfall: Strange Terrain
    sort: 14,
    triumphs: [165166474, 1871570556],
    items: [],
    collectibles: [1534387877, 2256440525],
    ordealHashes: [13813394, 3883876600, 3883876601, 3883876605, 3883876606, 3883876607],
    grandmasterHash: 13813394,
    affectsSpeedEmblemObjective: true,
  },
  3718330161: {
    // Nightfall: Tree of Probabilities    sort: 15,
    triumphs: [2282894388, 3636866482],
    items: [],
    collectibles: [1279318110, 1463718184],
    ordealHashes: [2660931442, 2660931443, 2660931444, 2660931445, 2660931447],
    grandmasterHash: 2023667984,
    affectsSpeedEmblemObjective: true,
  },
  3108813009: {
    // Nightfall: Warden of Nothing
    sort: 16,
    triumphs: [2836924866, 1469598452],
    items: [],
    collectibles: [1279318101, 3525223396],
    ordealHashes: [380956400, 380956401, 380956405, 380956406, 380956407],
    grandmasterHash: 3597372938,
    affectsSpeedEmblemObjective: true,
  },
  272852450: {
    // Nightfall: Will of the Thousands
    sort: 17,
    triumphs: [1039797865, 3013611925],
    items: [],
    collectibles: [2466440635, 2256440524],
    ordealHashes: [],
    grandmasterHash: false,
    affectsSpeedEmblemObjective: true,
  },
};

export const ordealHashes = Object.values(nightfalls).reduce((a, h) => {
  return [...a, ...h.ordealHashes];
}, []);

export const nightmareHunts = [
  {
    storyHash: 1060539534, // Despair
    activities: [2450170730, 2450170731, 2450170732, 2450170733],
    triumphs: [3541581269],
  },
  {
    storyHash: 2279262916, // Rage
    activities: [4098556690, 4098556691, 4098556692, 4098556693],
    triumphs: [3138467749],
  },
  {
    storyHash: 2508299477, // Servitude
    activities: [1188363426, 1188363427, 1188363428, 1188363429],
    triumphs: [819869942],
  },
  {
    storyHash: 2622431190, // Fear
    activities: [1342492674, 1342492675, 1342492676, 1342492677],
    triumphs: [1420663287],
  },
  {
    storyHash: 2918838311, // Anguish
    activities: [571058904, 571058905, 571058910, 571058911],
    triumphs: [382777394],
  },
  {
    storyHash: 3459379696, // Isolation
    activities: [3205253944, 3205253945, 3205253950, 3205253951],
    triumphs: [3755663441],
  },
  {
    storyHash: 3655015216, // Pride
    activities: [1907493624, 1907493625, 1907493630, 1907493631],
    triumphs: [2638892835],
  },
  {
    storyHash: 4003594394, // Insanity
    activities: [2639701096, 2639701097, 2639701102, 2639701103],
    triumphs: [1757149139],
  },
];

export const seasonalMods = {
  1387688628: {
    // Dark Glimmer
    4088080601: {
      hash: 4088080601,
      perkHash: 758376759,
      active: '/static/images/extracts/ui/artifact/1387688628/0593_0376_00.png',
      inactive: '/static/images/extracts/ui/artifact/1387688628/0593_0378_00.png',
    },
    // Labyrinth Miner
    4088080602: {
      hash: 4088080602,
      active: '/static/images/extracts/ui/artifact/1387688628/0593_0383_00.png',
      inactive: '/static/images/extracts/ui/artifact/1387688628/0593_0385_00.png',
    },
    // Biomonetizer
    4088080603: {
      hash: 4088080603,
      active: '/static/images/extracts/ui/artifact/1387688628/0593_038D_00.png',
      inactive: '/static/images/extracts/ui/artifact/1387688628/0593_038F_00.png',
    },
    // Circuit Scavenger
    4088080604: {
      hash: 4088080604,
      active: '/static/images/extracts/ui/artifact/1387688628/0593_0397_00.png',
      inactive: '/static/images/extracts/ui/artifact/1387688628/0593_0399_00.png',
    },
    // Dissection Matrix
    4088080605: {
      hash: 4088080605,
      active: '/static/images/extracts/ui/artifact/1387688628/0593_03A1_00.png',
      inactive: '/static/images/extracts/ui/artifact/1387688628/0593_03A3_00.png',
    },
    // Anti-Barrier Rounds
    2102702010: {
      hash: 2102702010,
      active: '/static/images/extracts/ui/artifact/1387688628/0593_0460_00.png',
      inactive: '/static/images/extracts/ui/artifact/1387688628/0593_0462_00.png',
    },
    // Anti-Barrier Hand Cannon
    2102702009: {
      hash: 2102702009,
      active: '/static/images/extracts/ui/artifact/1387688628/0593_046A_00.png',
      inactive: '/static/images/extracts/ui/artifact/1387688628/0593_046B_00.png',
    },
    // Overload Rounds
    2102702008: {
      hash: 2102702008,
      active: '/static/images/extracts/ui/artifact/1387688628/0593_0473_00.png',
      inactive: '/static/images/extracts/ui/artifact/1387688628/0593_0476_00.png',
    },
    // Overload Arrowheads
    2102702015: {
      hash: 2102702015,
      active: '/static/images/extracts/ui/artifact/1387688628/0593_047D_00.png',
      inactive: '/static/images/extracts/ui/artifact/1387688628/0593_0480_00.png',
    },
    // Unstoppable Hand Cannon
    2102702014: {
      hash: 2102702014,
      active: '/static/images/extracts/ui/artifact/1387688628/0593_0488_00.png',
      inactive: '/static/images/extracts/ui/artifact/1387688628/0593_048A_00.png',
    },
    // Enhanced Hand Cannon Loader
    3333771943: {
      hash: 3333771943,
      active: '/static/images/extracts/ui/artifact/1387688628/0593_03AB_00.png',
      inactive: '/static/images/extracts/ui/artifact/1387688628/0593_03AC_00.png',
    },
    // Enhanced Submachine Gun Loader
    3333771940: {
      hash: 3333771940,
      active: '/static/images/extracts/ui/artifact/1387688628/0593_03B5_00.png',
      inactive: '/static/images/extracts/ui/artifact/1387688628/0593_03B6_00.png',
    },
    // Enhanced Bow Loader
    3333771941: {
      hash: 3333771941,
      active: '/static/images/extracts/ui/artifact/1387688628/0593_03BE_00.png',
      inactive: '/static/images/extracts/ui/artifact/1387688628/0593_03C1_00.png',
    },
    // Enhanced Fusion Rifle Loader
    3333771938: {
      hash: 3333771938,
      active: '/static/images/extracts/ui/artifact/1387688628/0593_03C9_00.png',
      inactive: '/static/images/extracts/ui/artifact/1387688628/0593_03CA_00.png',
    },
    // Enhanced Auto Rifle Loader
    3333771939: {
      hash: 3333771939,
      active: '/static/images/extracts/ui/artifact/1387688628/0593_03D3_00.png',
      inactive: '/static/images/extracts/ui/artifact/1387688628/0593_03D4_00.png',
    },
    // Breach Refractor
    2402696710: {
      hash: 2402696710,
      active: '/static/images/extracts/ui/artifact/1387688628/0593_03DD_00.png',
      inactive: '/static/images/extracts/ui/artifact/1387688628/0593_03DF_00.png',
    },
    // Ballistic Combo
    2402696706: {
      hash: 2402696706,
      active: '/static/images/extracts/ui/artifact/1387688628/0593_0405_00.png',
      inactive: '/static/images/extracts/ui/artifact/1387688628/0593_0406_00.png',
    },
    // Overload Grenades
    2402696709: {
      hash: 2402696709,
      active: '/static/images/extracts/ui/artifact/1387688628/0593_03E7_00.png',
      inactive: '/static/images/extracts/ui/artifact/1387688628/0593_03E9_00.png',
    },
    // Disruptor Spike
    2402696708: {
      hash: 2402696708,
      active: '/static/images/extracts/ui/artifact/1387688628/0593_03F1_00.png',
      inactive: '/static/images/extracts/ui/artifact/1387688628/0593_03F3_00.png',
    },
    // Unstoppable Melee
    2402696707: {
      hash: 2402696707,
      active: '/static/images/extracts/ui/artifact/1387688628/0593_03FB_00.png',
      inactive: '/static/images/extracts/ui/artifact/1387688628/0593_03FD_00.png',
    },
    // Heavy Finisher
    2612707365: {
      hash: 2612707365,
      active: '/static/images/extracts/ui/artifact/1387688628/0593_040F_00.png',
      inactive: '/static/images/extracts/ui/artifact/1387688628/0593_0411_00.png',
    },
    // Oppressive Darkness
    2612707366: {
      hash: 2612707366,
      active: '/static/images/extracts/ui/artifact/1387688628/0593_0419_00.png',
      inactive: '/static/images/extracts/ui/artifact/1387688628/0593_041A_00.png',
    },
    // Arc Battery
    2612707367: {
      hash: 2612707367,
      active: '/static/images/extracts/ui/artifact/1387688628/0593_0423_00.png',
      inactive: '/static/images/extracts/ui/artifact/1387688628/0593_0424_00.png',
    },
    // Thunder Coil
    2612707360: {
      hash: 2612707360,
      active: '/static/images/extracts/ui/artifact/1387688628/0593_042D_00.png',
      inactive: '/static/images/extracts/ui/artifact/1387688628/0593_042F_00.png',
    },
    // From the Depths
    2612707361: {
      hash: 2612707361,
      active: '/static/images/extracts/ui/artifact/1387688628/0593_0437_00.png',
      inactive: '/static/images/extracts/ui/artifact/1387688628/0593_0439_00.png',
    },
  },
  3360014173: {
    // Anti-Barrier Ranger
    2055287902: {
      hash: 2055287902,
      active: '/static/images/extracts/ui/artifact/3360014173/0708-00001978.png',
      inactive: '/static/images/extracts/ui/artifact/3360014173/0708-00001980.png',
    },
    // Unstoppable Shot
    2055287901: {
      hash: 2055287901,
      active: '/static/images/extracts/ui/artifact/3360014173/0708-00001987.png',
      inactive: '/static/images/extracts/ui/artifact/3360014173/0708-00001989.png',
    },
    // Unstoppable Burst
    2055287900: {
      hash: 2055287900,
      active: '/static/images/extracts/ui/artifact/3360014173/0708-00001996.png',
      inactive: '/static/images/extracts/ui/artifact/3360014173/0708-00001998.png',
    },
    // Unstoppable Arrows
    2055287899: {
      hash: 2055287899,
      active: '/static/images/extracts/ui/artifact/3360014173/0708-00002005.png',
      inactive: '/static/images/extracts/ui/artifact/3360014173/0708-00002008.png',
    },
    // Overload Rounds
    2055287898: {
      hash: 2055287898,
      active: '/static/images/extracts/ui/artifact/3360014173/0593_0473_00.png',
      inactive: '/static/images/extracts/ui/artifact/3360014173/0593_0476_00.png',
    },
    // Enhanced Rifle Loader
    3102998661: {
      hash: 3102998661,
      active: '/static/images/extracts/ui/artifact/3360014173/0708-00001849.png',
      inactive: '/static/images/extracts/ui/artifact/3360014173/0708-00001851.png',
    },
    // Enhanced Unflinching Rifle Aim
    3102998662: {
      hash: 3102998662,
      active: '/static/images/extracts/ui/artifact/3360014173/0708-00001858.png',
      inactive: '/static/images/extracts/ui/artifact/3360014173/0708-00001860.png',
    },
    // Enhanced Bow Loader
    3102998663: {
      hash: 3102998663,
      active: '/static/images/extracts/ui/artifact/3360014173/0593_03BE_00.png',
      inactive: '/static/images/extracts/ui/artifact/3360014173/0593_03C1_00.png',
    },
    // Enhanced Sniper Rifle Loader
    3102998656: {
      hash: 3102998656,
      active: '/static/images/extracts/ui/artifact/3360014173/0708-00001867.png',
      inactive: '/static/images/extracts/ui/artifact/3360014173/0708-00001870.png',
    },
    // Enhanced Linear Fusion Targeting
    3102998657: {
      hash: 3102998657,
      active: '/static/images/extracts/ui/artifact/3360014173/0708-00001876.png',
      inactive: '/static/images/extracts/ui/artifact/3360014173/0708-00001878.png',
    },
    // Solidus Strike
    3264050278: {
      hash: 3264050278,
      active: '/static/images/extracts/ui/artifact/3360014173/0593_0376_00.png',
      inactive: '/static/images/extracts/ui/artifact/3360014173/0593_0378_00.png',
    },
    // Splintered Gladius
    3264050277: {
      hash: 3264050277,
      active: '/static/images/extracts/ui/artifact/3360014173/0708-00001889.png',
      inactive: '/static/images/extracts/ui/artifact/3360014173/0708-00001891.png',
    },
    // Biomonetizer
    3264050276: {
      hash: 3264050276,
      active: '/static/images/extracts/ui/artifact/3360014173/0593_038D_00.png',
      inactive: '/static/images/extracts/ui/artifact/3360014173/0593_038F_00.png',
    },
    // Tithe Collector's Sigil
    3264050275: {
      hash: 3264050275,
      active: '/static/images/extracts/ui/artifact/3360014173/0708-00001899.png',
      inactive: '/static/images/extracts/ui/artifact/3360014173/0708-00001900.png',
    },
    // Knight Errant
    3264050274: {
      hash: 3264050274,
      active: '/static/images/extracts/ui/artifact/3360014173/0708-00001907.png',
      inactive: '/static/images/extracts/ui/artifact/3360014173/0708-00001909.png',
    },
    // Breach Resonator
    4195125383: {
      hash: 4195125383,
      active: '/static/images/extracts/ui/artifact/3360014173/0708-00001917.png',
      inactive: '/static/images/extracts/ui/artifact/3360014173/0708-00001919.png',
    },
    // Molten Overload
    4195125380: {
      hash: 4195125380,
      active: '/static/images/extracts/ui/artifact/3360014173/0708-00001925.png',
      inactive: '/static/images/extracts/ui/artifact/3360014173/0708-00001927.png',
    },
    // Disruptor Spike
    4195125381: {
      hash: 4195125381,
      active: '/static/images/extracts/ui/artifact/3360014173/0593_03F1_00.png',
      inactive: '/static/images/extracts/ui/artifact/3360014173/0593_03F3_00.png',
    },
    // Unstoppable Schwarzschild Condensor
    4195125378: {
      hash: 4195125378,
      active: '/static/images/extracts/ui/artifact/3360014173/0593_03FB_00.png',
      inactive: '/static/images/extracts/ui/artifact/3360014173/0593_03FD_00.png',
    },
    // Tenderizer
    4195125379: {
      hash: 4195125379,
      active: '/static/images/extracts/ui/artifact/3360014173/0708-00001942.png',
      inactive: '/static/images/extracts/ui/artifact/3360014173/0708-00001944.png',
    },
    // Guardian Angel
    3979891912: {
      hash: 3979891912,
      active: '/static/images/extracts/ui/artifact/3360014173/0708-00001952.png',
      inactive: '/static/images/extracts/ui/artifact/3360014173/0708-00001953.png',
    },
    // Void Battery
    3979891915: {
      hash: 3979891915,
      active: '/static/images/extracts/ui/artifact/3360014173/0708-00001961.png',
      inactive: '/static/images/extracts/ui/artifact/3360014173/0708-00001963.png',
    },
    // Heavy Finisher
    3979891914: {
      hash: 3979891914,
      active: '/static/images/extracts/ui/artifact/3360014173/0593_040F_00.png',
      inactive: '/static/images/extracts/ui/artifact/3360014173/0593_0411_00.png',
    },
    // Solar Plexus
    3979891917: {
      hash: 3979891917,
      active: '/static/images/extracts/ui/artifact/3360014173/0708-00001969.png',
      inactive: '/static/images/extracts/ui/artifact/3360014173/0708-00001971.png',
    },
    // From the Depths
    3979891916: {
      hash: 3979891916,
      active: '/static/images/extracts/ui/artifact/3360014173/0593_0437_00.png',
      inactive: '/static/images/extracts/ui/artifact/3360014173/0593_0439_00.png',
    },
  },
  2200172911: {
    // Anti-Barrier SMG
    2504808124: {
      hash: 2504808124,
      active: '/static/images/extracts/ui/artifact/2200172911/0912-012C.png',
      inactive: '/static/images/extracts/ui/artifact/2200172911/0912-012D.png',
    },
    // Anti-Barrier Sidearm
    2504808127: {
      hash: 2504808127,
      active: '/static/images/extracts/ui/artifact/2200172911/0912-0135.png',
      inactive: '/static/images/extracts/ui/artifact/2200172911/0912-0137.png',
    },
    // Overload Rounds
    2504808126: {
      hash: 2504808126,
      active: '/static/images/extracts/ui/artifact/2200172911/0593-0473.png',
      inactive: '/static/images/extracts/ui/artifact/2200172911/0593-0476.png',
    },
    // Unstoppable Hand Cannon
    2504808121: {
      hash: 2504808121,
      active: '/static/images/extracts/ui/artifact/2200172911/0593-0488.png',
      inactive: '/static/images/extracts/ui/artifact/2200172911/0593-048A.png',
    },
    // Overload Rounds (Sidearms and Hand Cannons)
    2504808120: {
      hash: 2504808120,
      active: '/static/images/extracts/ui/artifact/2200172911/0912-013E.png',
      inactive: '/static/images/extracts/ui/artifact/2200172911/0912-0140.png',
    },
    // Enhanced Unflinching Auto Rifle Aim
    739803547: {
      hash: 739803547,
      active: '/static/images/extracts/ui/artifact/2200172911/0912-0093.png',
      inactive: '/static/images/extracts/ui/artifact/2200172911/0912-0095.png',
    },
    // Enhanced Scatter Projectile Targeting
    739803544: {
      hash: 739803544,
      active: '/static/images/extracts/ui/artifact/2200172911/0912-009C.png',
      inactive: '/static/images/extracts/ui/artifact/2200172911/0912-009E.png',
    },
    // Enhanced Auto Rifle Loader
    739803545: {
      hash: 739803545,
      active: '/static/images/extracts/ui/artifact/2200172911/0593-03D3.png',
      inactive: '/static/images/extracts/ui/artifact/2200172911/0593-03D4.png',
    },
    // Enhanced Small Arms Loader
    739803550: {
      hash: 739803550,
      active: '/static/images/extracts/ui/artifact/2200172911/0912-00A5.png',
      inactive: '/static/images/extracts/ui/artifact/2200172911/0912-00A7.png',
    },
    // Enhanced Sword Scavenger
    739803551: {
      hash: 739803551,
      active: '/static/images/extracts/ui/artifact/2200172911/0912-00AE.png',
      inactive: '/static/images/extracts/ui/artifact/2200172911/0912-00B0.png',
    },
    // Flourishing Blade
    1974622780: {
      hash: 1974622780,
      active: '/static/images/extracts/ui/artifact/2200172911/0912-00B6.png',
      inactive: '/static/images/extracts/ui/artifact/2200172911/0912-00B9.png',
    },
    // Splintered Gladius
    1974622783: {
      hash: 1974622783,
      active: '/static/images/extracts/ui/artifact/2200172911/0708-0762.png',
      inactive: '/static/images/extracts/ui/artifact/2200172911/0708-0764.png',
    },
    // While Ye May
    1974622782: {
      hash: 1974622782,
      active: '/static/images/extracts/ui/artifact/2200172911/0912-00C0.png',
      inactive: '/static/images/extracts/ui/artifact/2200172911/0912-00C2.png',
    },
    // Prized Shooting
    1974622777: {
      hash: 1974622777,
      active: '/static/images/extracts/ui/artifact/2200172911/0912-00C9.png',
      inactive: '/static/images/extracts/ui/artifact/2200172911/0912-00CB.png',
    },
    // Automatic Prize
    1974622776: {
      hash: 1974622776,
      active: '/static/images/extracts/ui/artifact/2200172911/0912-00D2.png',
      inactive: '/static/images/extracts/ui/artifact/2200172911/0912-00D4.png',
    },
    // Disrupting Blade
    820036193: {
      hash: 820036193,
      active: '/static/images/extracts/ui/artifact/2200172911/0912-00DB.png',
      inactive: '/static/images/extracts/ui/artifact/2200172911/0912-00DD.png',
    },
    // Surge Detonators
    820036194: {
      hash: 820036194,
      active: '/static/images/extracts/ui/artifact/2200172911/0912-00E3.png',
      inactive: '/static/images/extracts/ui/artifact/2200172911/0912-00E6.png',
    },
    // Hammer of the Warmind
    820036195: {
      hash: 820036195,
      active: '/static/images/extracts/ui/artifact/2200172911/0912-00ED.png',
      inactive: '/static/images/extracts/ui/artifact/2200172911/0912-00EF.png',
    },
    // Inferno Whip
    820036196: {
      hash: 820036196,
      active: '/static/images/extracts/ui/artifact/2200172911/0912-00F6.png',
      inactive: '/static/images/extracts/ui/artifact/2200172911/0912-00F7.png',
    },
    // Flare-Up
    820036197: {
      hash: 820036197,
      active: '/static/images/extracts/ui/artifact/2200172911/0912-00FF.png',
      inactive: '/static/images/extracts/ui/artifact/2200172911/0912-0100.png',
    },
    // Passive Guard
    3235387874: {
      hash: 3235387874,
      active: '/static/images/extracts/ui/artifact/2200172911/0912-0108.png',
      inactive: '/static/images/extracts/ui/artifact/2200172911/0912-010A.png',
    },
    // Soul of the Praxic Fire
    3235387873: {
      hash: 3235387873,
      active: '/static/images/extracts/ui/artifact/2200172911/0912-0111.png',
      inactive: '/static/images/extracts/ui/artifact/2200172911/0912-0113.png',
    },
    // Tyrant's Surge
    3235387872: {
      hash: 3235387872,
      active: '/static/images/extracts/ui/artifact/2200172911/0912-0119.png',
      inactive: '/static/images/extracts/ui/artifact/2200172911/0912-011C.png',
    },
    // Thunder Coil
    3235387879: {
      hash: 3235387879,
      active: '/static/images/extracts/ui/artifact/2200172911/0593-042D.png',
      inactive: '/static/images/extracts/ui/artifact/2200172911/0593-042F.png',
    },
    // Lightning Strikes Twice
    3235387878: {
      hash: 3235387878,
      active: '/static/images/extracts/ui/artifact/2200172911/0912-0123.png',
      inactive: '/static/images/extracts/ui/artifact/2200172911/0912-0125.png',
    },
  },
};

export const trialsPassages = [
  1600065451, // Passage of Mercy
  7665310, // Passage of Ferocity
  1181381245, // Passage of Confidence
  2001563200, // Passage of Wisdom
  2879309661, // Passage of Wealth
];

export const trialsPerkIcons = {
  989028955: '0912-0DF0.png',
  1909797390: '0912-0DE1.png',
  713209933: '0912-0DF7.png',
  628076592: '0912-0DFE.png',
  1551708877: '0912-0DE8.png',
};

export const chaliceRunes = {
  slot1: ['braytech_remove_rune', 2149082453, 2149082452, 2149082455, 2149082454, 2149082449, 2149082448, 2149082451, 2149082450, 2149082461, 2149082460, 4201087756, 4201087757],
  slot2: ['braytech_remove_rune', 3216785208, 3216785209, 3216785210, 3216785211, 3216785212, 3216785213, 3216785214, 3216785215, 3216785200, 3216785201, 240617099, 240617098],
  slot3: ['braytech_remove_rune', 3019704439, 3019704438, 3019704437, 3019704436, 3019704435, 3019704434, 3019704433, 3019704432, 3019704447, 3019704446, 3444855282, 3444855283],
  purple: [2149082453, 2149082452, 2149082455, 3216785208, 3216785209, 3216785210, 3019704439, 3019704438, 3019704437],
  red: [2149082454, 2149082449, 2149082448, 3216785211, 3216785212, 3216785213, 3019704436, 3019704435, 3019704434],
  green: [2149082451, 2149082450, 2149082461, 3216785214, 3216785215, 3216785200, 3019704433, 3019704432, 3019704447],
  blue: [2149082460, 4201087756, 4201087757, 3216785201, 240617099, 240617098, 3019704446, 3444855282, 3444855283],
};

export const simplifiedAcivityModes = [
  {
    name: 'crucible',
    modes: [69, 70, 71, 72, 74, 73, 81, 50, 15, 43, 44, 48, 60, 65, 59, 31, 37, 38, 37, 25, 51, 52, 53, 54, 55, 56, 57, 80],
  },
  {
    name: 'trials',
    modes: [84],
  },
  {
    name: 'gambit',
    modes: [
      63, // Gambit
      75, // Gambit Prime
    ],
  },
  {
    name: 'strikes',
    modes: [
      46, // scoredNightfalls
      79, // nightmare hunts
    ],
  },
];

export const levelAdvantagesEnabled = [3753505781, 1166905690];

export const adventures = [
  53954174,
  78673128,
  96442917,
  122988657,
  185515551,
  319240296,
  320680002,
  340004423,
  359488722,
  449926115,
  539897061,
  622895925,
  625165976,
  632790902,
  723733266,
  785871069,
  789332628,
  801458995,
  808931822,
  856342832,
  919252154,
  963938931,
  993905880,
  999972877,
  1018040791,
  1018385878,
  1063969232,
  1107208644,
  1159314159,
  1225970098,
  1228327586,
  1254990192,
  1265390366,
  1275562432,
  1279862229,
  1289867188,
  1294490226,
  1302437673,
  1333621919,
  1416597166,
  1418217191,
  1466550401,
  1491022087,
  1503376677,
  1570598249,
  1643069750,
  1651979106,
  1657356109,
  1671235700,
  1682036469,
  1725302079,
  1740310101,
  1773400654,
  1783922093,
  1800749202,
  1811228210,
  1823921651,
  1824067376,
  1829866365,
  1874578888,
  1956541147,
  1969800443,
  1971154629,
  1981289329,
  1987624188,
  2067233851,
  2069143995,
  2174556965,
  2219006909,
  2231840083,
  2245202378,
  2250935166,
  2258680077,
  2302677459,
  2307090074,
  2310677039,
  2340776707,
  2517540332,
  2574607799,
  2665134323,
  2675435236,
  2737739053,
  2752743635,
  2831644165,
  2949941834,
  2966841322,
  3002511278,
  3015346707,
  3033151437,
  3042112297,
  3069330044,
  3140524926,
  3148431353,
  3211568383,
  3248193378,
  3255524827,
  3277510674,
  3283790633,
  3289681664,
  3304835347,
  3370527053,
  3384410381,
  3485876484,
  3500791146,
  3601218952,
  3644215993,
  3645117987,
  3664729722,
  3664915501,
  3691789482,
  3700722865,
  3752039537,
  3780356141,
  3836086286,
  3872525353,
  3909841711,
  3920569453,
  4094398454,
  4238309598,
];

export const dcv = [
  {
    season: 12,
    folders: [
      {
        placeHash: 4251857532, // Io
        artifacts: {
          nodes: [
            4139791846, // Gensym Knight Suit
            3476818387, // Gensym Knight Suit
            3952745167, // Gensym Knight Suit
            3457070432, // Io
          ],
          collectibles: [
            3647875337, // Mindbreaker Boots
            3858283821, // Mindbreaker Boots
            3946669544, // Mindbreaker Boots
            2239241196, // Io Shell
            2982198547, // Death Adder
            273762351, // Valakadyn
            2963869879, // Tarantula
            2963869878, // Man o' War
            1551165468, // Blue Shift
            2287445847, // Berenger's Memory
            1088431376, // Unspoken Promise
            2202434428, // The Rattler
            1058083666, // Baligant
            1169536399, // Widow's Bite
            1169536389, // Elegy-49
            1152758802, // Silicon Neuroma
            259147460, // Echo Mesa
            3642181656, // Traveler's Departure
            3642181657, // Asher's Asylum
            3642181658, // Taken Resurgence
            3642181659, // Ignition Unsparked
            3773976314, // Traveler's Flight
            259147462, // Ballet Lover
            259147463, // Holy Ground
            1176046836, // Echoes of Io
            1176046837, // Flowers of Io
            2219212014, // Eulogy SI4
            2716100025, // Sonata-48
            3895764279, // Guseva-C
          ],
          records: [
            1289798960, // The Tortured Scientist
          ],
        },
      },
      {
        placeHash: 386951460, // Titan, Moon of Saturn
        artifacts: {
          nodes: [
            4139791844, // Lost Pacific Suit
            3476818385, // Lost Pacific Suit
            3952745165, // Lost Pacific Suit
            3252380766, // Titan
          ],
          collectibles: [
            1073998665, // Songbreaker Gauntlets
            942424421, // Songbreaker Grips
            2754601998, // Songbreaker Gloves
            1058083665, // First In, Last Out
            273762349, // Solemn Hymn
            1184968901, // Nox Echo III
            1551165466, // Hoosegow
            1088431381, // Crown-Splitter
            1169536385, // A Single Clap
            1088431379, // Negative Space
            1116762620, // Swift Ride
            2202434430, // Dead Man Walking
            3788698913, // Annual Skate
            2283993085, // Tone Patrol
            2982198549, // Foggy Notion
            1333654061, // Duty Bound
            2239241194, // Moon of Saturn Shell
            259147458, // New Pacific Arcology
            2532590120, // Utopia Lost
            2532590121, // Sloane's Watchtower
            2532590122, // Hive Infestation
            2532590123, // Golden Age Tarnished
            3773976304, // New Pacific Access
            3773976311, // Solarium Yellow
            3773976310, // Cargo Bay Cross
            1176046832, // New Pacific Rush
            1176046833, // New Pacific Sink
          ],
          records: [
            2808299284, // The Titan on Titan
            2442138301, // Steadfast
          ],
        },
      },
      {
        placeHash: 1259908504, // Mercury
        artifacts: {
          nodes: [
            4139791842, // Kairos Function Suit
            3476818391, // Kairos Function Suit
            3952745163, // Kairos Function Suit
            2904849017, // Mercury
          ],
          collectibles: [
            256984756, // Null Calamity 9
            1105208971, // Future Safe 10
            1041306084, // Perfect Paradox
            1116543653, // The Conqueror 2
            1279318109, // West of Sunfall 7
            1116762615, // Infinite Paths 8
            2606709043, // Garden Progeny 1
            3788698917, // Jack Queen King 3
            4257745796, // Machina Dei 4
            2998976136, // Sol Pariah 6
            2219212009, // Traveler's Judgment 5
            1718922262, // Sagira's Shell
            225592290, // Legend of Saint-14
            2034908838, // Prophetic Arsenal
            225592289, // Crossroads Emblem
            225592291, // Secrets of the Vex
            225592292, // Vex Destroyer
            225592293, // Vex Scholar
            259147459, // Fields of Glass
            4068960693, // Burning Silicon
            4068960695, // Vex Convergence
            4068960694, // Infinite Possibilities
            4068960692, // Vance's Temple
            1282368185, // Kairos Gold
            1282368187, // Kairos Black
            1282368186, // Mercury Prophetic
            1282368184, // Kairos Bronze
            1152758801, // Maestro-46
            1168191342, // Elatha FR4
            1200315410, // Vertical Orbit QSm
            1534387878, // Countess SA/2
            2653720568, // Hero of the Infinite
          ],
          records: [
            1590210414, // Cursed with Prophecy
            2765010546, // The Lighthouse Keeper
          ],
        },
      },
      {
        placeHash: 2426873752, // Mars
        artifacts: {
          nodes: [
            4139791843, // BrayTech Suit
            4139791840, // Yuga Sundown Suit
            3476818390, // BrayTech Suit
            3476818389, // Abhorrent Imperative Suit
            3952745162, // BrayTech Suit
            3952745161, // Midnight Exigent Suit
            3570368582, // Mars
          ],
          collectibles: [
            1041306082, // IKELOS_SG_v1.0.1
            1203091693, // IKELOS_SR_v1.0.1
            2998976141, // IKELOS_SMG_v1.0.1
            3805476501, // IKELOS_HC_v1.0.1
            256984754, // Kibou AR3
            1168191343, // Proelium FR3
            1105208973, // Hagakure
            1099984909, // Requiem-45
            1152758813, // The Frigid Jackal
            1099984910, // Agrona PR4
            1350431644, // Foregone Conclusion
            1350431647, // BrayTech Winter Wolf
            1534387876, // Scipio-D
            1945987450, // G-72 Classical Sepheid
            2589931337, // Telemachus-C
            2219212008, // 18 Kelvins
            2130750728, // Polestar II Shell
            2691646945, // Data Mine
            4259147767, // Warmind's Fortress
            4259147765, // Wormslayer
            4259147766, // Cradle of Invention
            4259147764, // Relic of the Golden Age
            2691646949, // IKELOS Imperative
            2691646946, // Warminded
            2691646947, // Cold Comfort
            2589931338, // Niflheim Frost
            2300770642, // Vacuna SR4
            2130750731, // Polestar I Shell
            2691646950, // Apparatus Belli
            2691646948, // Arctic Arsenalist
            2770012880, // Alpha Umi
            2998976138, // The Quickstep
            1282368177, // Arctic Dreamscape
            1232035296, // The Mad Monk
            1282368176, // Bray Innovation
            259147457, // Hellas Basin
            1199798688, // Block-Z Shell
            1945987448, // G-335 Anseris Overdrive
            1945987451, // G-693 Orchestral Maneuver
            1945987454, // Pacific Deception
            3368709535, // GENOTYPENULL-ZERO
            3816666661, // Activate ESCALATION
            2770012883, // Groundswell Nullifier99
            2691646944, // Specter of the Gun
          ],
          records: [
            709188219, // The Tyrant
            435060157, // The Last Bray
          ],
        },
      },
    ],
  },
];
