import { ReactComponent as CampaignRedWar } from './miscellaneous/campaign_red-war.svg';
import { ReactComponent as CampaignCurseOfOsiris } from './miscellaneous/campaign_curse-of-osiris.svg';
import { ReactComponent as CampaignWarmind } from './miscellaneous/campaign_warmind.svg';
import { ReactComponent as CampaignForsaken } from './miscellaneous/campaign_forsaken.svg';
import { ReactComponent as CampaignShadowkeep } from './miscellaneous/campaign_shadowkeep.svg';

import { ReactComponent as TooltipFastTravel } from './tooltips/fast-travel.svg';
import { ReactComponent as TooltipAdventure } from './tooltips/adventure.svg';
import { ReactComponent as TooltipStory } from './tooltips/story.svg';
import { ReactComponent as TooltipCrucible } from './tooltips/crucible.svg';
import { ReactComponent as TooltipStrike } from './tooltips/strike.svg';
import { ReactComponent as TooltipDungeon } from './tooltips/dungeon.svg';
import { ReactComponent as TooltipForgeIgnition } from './tooltips/forge-ignition.svg';
import { ReactComponent as TooltipShadowkeep } from './tooltips/shadowkeep.svg';
import { ReactComponent as TooltipGambit } from './tooltips/gambit.svg';
import { ReactComponent as TooltipGambitPrime } from './tooltips/gambit-prime.svg';
import { ReactComponent as TooltipReckoning } from './tooltips/reckoning.svg';
import { ReactComponent as TooltipMenagerie } from './tooltips/menagerie.svg';
import { ReactComponent as TooltipRaid } from './tooltips/raid.svg';
import { ReactComponent as TooltipSeasonalArena } from './tooltips/seasonal-arena.svg';
import { ReactComponent as TooltipTrialsOfOsiris } from './tooltips/trials-of-osiris.svg';

import { ReactComponent as MapsFastTravel } from './maps/fast-travel.svg';
import { ReactComponent as MapsRegionChest } from './maps/region-chest.svg';
import { ReactComponent as MapsLostSector } from './maps/lost-sector.svg';
import { ReactComponent as MapsGhostScan } from './maps/ghost-scan.svg';
import { ReactComponent as MapsSleperNode } from './maps/sleeper-node.svg';
import { ReactComponent as MapsLostMemoryFragment } from './maps/lost-memory-fragment.svg';
import { ReactComponent as MapsCorruptedEgg } from './maps/corrupted-egg.svg';
import { ReactComponent as MapsAhamkaraBones } from './maps/ahamkara-bones.svg';
import { ReactComponent as MapsFelineFriend } from './maps/feline-friend.svg';
import { ReactComponent as MapsJadeRabbit } from './maps/jade-rabbit.svg';
import { ReactComponent as MapsRecord } from './maps/record.svg';

import { ReactComponent as HighlightClan } from './miscellaneous/highlight-clan.svg';
import { ReactComponent as HighlightCollections } from './miscellaneous/highlight-collections.svg';
import { ReactComponent as HighlightTriumphs } from './miscellaneous/highlight-triumphs.svg';
import { ReactComponent as HighlightChecklists } from './miscellaneous/highlight-checklists.svg';
import { ReactComponent as HighlightMaps } from './miscellaneous/highlight-maps.svg';
import { ReactComponent as HighlightThisWeek } from './miscellaneous/highlight-this-week.svg';
import { ReactComponent as HighlightQuests } from './miscellaneous/highlight-quests.svg';
import { ReactComponent as HighlightReports } from './miscellaneous/highlight-reports.svg';
import { ReactComponent as Eververse } from './miscellaneous/eververse.svg';
import { ReactComponent as ChaliceOfOpulence } from './miscellaneous/chalice-of-opulence.svg';
import { ReactComponent as Patreon } from './miscellaneous/patreon-device.svg';

const Common = {
  Patreon
}

const Campaign = {
  RedWar: CampaignRedWar,
  CurseOfOsiris: CampaignCurseOfOsiris,
  Warmind: CampaignWarmind,
  Forsaken: CampaignForsaken,
  Shadowkeep: CampaignShadowkeep
}

const Tooltips = {
  FastTravel: TooltipFastTravel,
  Adventure: TooltipAdventure,
  Story: TooltipStory,
  Crucible: TooltipCrucible,
  Strike: TooltipStrike,
  Dungeon: TooltipDungeon,
  ForgeIgnition: TooltipForgeIgnition,
  Shadowkeep: TooltipShadowkeep,
  Gambit: TooltipGambit,
  GambitPrime: TooltipGambitPrime,
  Reckoning: TooltipReckoning,
  Menagerie: TooltipMenagerie,
  Raid: TooltipRaid,
  SeasonalArena: TooltipSeasonalArena,
  TrialsOfOsiris: TooltipTrialsOfOsiris
}

const Maps = {
  FastTravel: MapsFastTravel,
  RegionChest: MapsRegionChest,
  LostSector: MapsLostSector,
  Adventure: TooltipAdventure,
  GhostScan: MapsGhostScan,
  SleperNode: MapsSleperNode,
  LostMemoryFragment: MapsLostMemoryFragment,
  CorruptedEgg: MapsCorruptedEgg,
  AhamkaraBones: MapsAhamkaraBones,
  FelineFriend: MapsFelineFriend,
  JadeRabbit: MapsJadeRabbit,
  Record: MapsRecord
}

const Views = {
  Index: {
    Clan: HighlightClan,
    Collections: HighlightCollections,
    Triumphs: HighlightTriumphs,
    Checklists: HighlightChecklists,
    Maps: HighlightMaps,
    ThisWeek: HighlightThisWeek,
    Quests: HighlightQuests,
    Reports: HighlightReports
  },
  Clan: {
    About: HighlightClan,
    Stats: HighlightClan,
    Roster: HighlightClan,
    RosterAdmin: HighlightClan
  },
  Reports: {
    Explore: HighlightMaps,
    Crucible: TooltipCrucible,
    Gambit: TooltipGambit,
    Strikes: TooltipStrike,
    Raids: TooltipRaid
  },
  Archives: {
    Overview: HighlightThisWeek,
    Eververse,
    ChaliceOfOpulence
  }
}

export { Common, Campaign, Tooltips, Maps, Views };