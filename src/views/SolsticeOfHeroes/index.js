import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useParams, Link, NavLink } from 'react-router-dom';

import { t, BungieText, BraytechText } from '../../utils/i18n';
import manifest from '../../utils/manifest';
import { classTypeToString } from '../../utils/destinyConverters';

import { BungieAuthButton } from '../../components/BungieAuth';
import Items from '../../components/Items';
import { DestinyKey } from '../../components/UI/Button';
import ProgressBar from '../../components/UI/ProgressBar';
import { Common, Views } from '../../svg';

import './styles.css';
import Records from '../../components/Records';

const RENEWED_HUNTER = 2574248771;
const RENEWED_TITAN = 2963102071;
const RENEWED_WARLOCK = 1482613376;

const MAJESTIC_HUNTER = 2574248768;
const MAJESTIC_TITAN = 2963102068;
const MAJESTIC_WARLOCK = 1482613379;

const MAGNIFICENT_HUNTER = 2574248769;
const MAGNIFICENT_TITAN = 2963102069;
const MAGNIFICENT_WARLOCK = 1482613378;

const RENEWED = [RENEWED_WARLOCK, RENEWED_TITAN, RENEWED_HUNTER];
const MAJESTIC = [MAJESTIC_WARLOCK, MAJESTIC_TITAN, MAJESTIC_HUNTER];
const MAGNIFICENT = [MAGNIFICENT_WARLOCK, MAGNIFICENT_TITAN, MAGNIFICENT_HUNTER];

const CLASS_MAP = {
  [RENEWED_TITAN]: 0,
  [RENEWED_HUNTER]: 1,
  [RENEWED_WARLOCK]: 2,
  [MAJESTIC_TITAN]: 0,
  [MAJESTIC_HUNTER]: 1,
  [MAJESTIC_WARLOCK]: 2,
  [MAGNIFICENT_TITAN]: 0,
  [MAGNIFICENT_HUNTER]: 1,
  [MAGNIFICENT_WARLOCK]: 2,
};

const ALL_SETS = [RENEWED, MAJESTIC, MAGNIFICENT];

function Objectives({ itemHash }) {
  const definitionItem = manifest.DestinyInventoryItemDefinition[itemHash];

  const member = useSelector((state) => state.member);

  const inventory = member.data?.profile?.profileInventory?.data?.items && [
    ...member.data.profile.profileInventory.data.items, // non-instanced quest items, materials, etc.
    ...member.data.profile?.characterInventories?.data?.[member.characterId].items, // non-equipped weapons etc
    ...member.data.profile?.characterEquipment?.data?.[member.characterId].items, // equipped weapons etc
  ];

  const item = inventory?.find((item) => item.itemHash === itemHash);

  return (
    <div className='objectives'>
      {definitionItem.objectives?.objectiveHashes.map((hash, h) => {
        const definitionObjective = manifest.DestinyObjectiveDefinition[hash];

        const itemComponents = member.data?.profile?.itemComponents.objectives.data[item?.itemInstanceId]?.objectives || {};

        const playerProgress = {
          complete: false,
          progress: 0,
          completionValue: definitionObjective.completionValue,
          objectiveHash: definitionObjective.hash,
          ...itemComponents,
        };

        return <ProgressBar key={h} objectiveHash={definitionObjective.hash} {...playerProgress} />;
      })}
    </div>
  );
}

function Set({ presentationNodeHash }) {
  const definitionSet = manifest.DestinyPresentationNodeDefinition[presentationNodeHash];

  return (
    <ul>
      {definitionSet.children.collectibles.map((collectible, c) => {
        const definitionCollectible = manifest.DestinyCollectibleDefinition[collectible.collectibleHash];

        return (
          <li key={c}>
            <ul className='list inventory-items'>
              <Items items={[{ itemHash: definitionCollectible.itemHash, state: MAGNIFICENT.includes(presentationNodeHash) && 4 }]} tooltips={null} />
            </ul>
            <div className='text'>
              <div className='name'>{definitionCollectible.displayProperties.name}</div>
              <BungieText className='description' value={definitionCollectible.displayProperties.description} />
              <Objectives itemHash={definitionCollectible.itemHash} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function NavLinks() {
  return (
    <div className='module views'>
      <ul className='list'>
        <li className='linked'>
          <div className='icon'>
            <Views.Index.Collections />
          </div>
          <NavLink to='/solstice-of-heroes' exact />
        </li>
        <li className='linked'>
          <div className='icon'>
            <Views.Index.Triumphs />
          </div>
          <NavLink to='/solstice-of-heroes/records' exact />
        </li>
      </ul>
    </div>
  );
}

export default function SolsticeOfHeroes() {
  const member = useSelector((state) => state.member);

  const auth = useSelector((state) => state.auth);
  const authed = auth.destinyMemberships?.find((authMember) => authMember.membershipId === member.membershipId);

  const location = useLocation();
  const backLinkPath = location.state?.from || '/this-week';

  useEffect(() => {
    window.scrollTo(0, 0);
    
  }, [location.pathname])

  const SET_TIER_NAME = {
    0: t('Event.SolsticeOfHeroes.ArmorTier.Renewed'),
    1: t('Event.SolsticeOfHeroes.ArmorTier.Majestic'),
    2: t('Event.SolsticeOfHeroes.ArmorTier.Magnificent'),
  };

  const params = useParams();
  const view = params?.type === 'records' ? 'records' : 'gear-sets';

  return (
    <>
      <div className='view' id='solstice-of-heroes'>
        <div className='module head'>
          <div className='page-header'>
            <div className='sub-name'>{t('Event')}</div>
            <div className='name'>{t('Event.SolsticeOfHeroes.Name')}</div>
          </div>
          <div className='text'>
            <BraytechText className='description' value={t('Event.SolsticeOfHeroes.Description')} />
          </div>
        </div>
        {!authed ? (
          <div className='auth-upsell'>
            <div className='wrap'>
              <div className='icon'>
                <Common.SeventhColumn />
              </div>
              <BraytechText className='text' value={t('Bungie.Auth.Upsell.Description')} />
              <BungieAuthButton />
            </div>
          </div>
        ) : null}
        <div className='buff'>
          <NavLinks />
          <div className='content'>
            {view === 'records' ? (
              <div className='module'>
                <ul className='list record-items'>
                  <Records hashes={[857016983, 1008946187, 2357163007, 518035568, 3882301596, 52390681]} selfLinkFrom={`/solstice-of-heroes/records`} showInvisible />
                </ul>
              </div>
            ) : (
              ALL_SETS.map((tiers, t) => (
                <div key={t} className='module'>
                  <h3>{SET_TIER_NAME[t]}</h3>
                  <div className='sets'>
                    {tiers.map((presentationNodeHash, s) => (
                      <div key={s} className='set'>
                        <h4>{classTypeToString(CLASS_MAP[presentationNodeHash])}</h4>
                        <Set presentationNodeHash={presentationNodeHash} />
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <div className='sticky-nav'>
        <div className='wrapper'>
          <div />
          <ul>
            <li>
              <Link className='button' to={backLinkPath}>
                <DestinyKey type='dismiss' />
                {t('Back')}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
