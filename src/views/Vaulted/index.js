import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import cx from 'classnames';

import actions from '../../store/actions';
import { t, BraytechText } from '../../utils/i18n';
import manifest from '../../utils/manifest';
import { DestinyContentVault } from '../../utils/destinyEnums';

import Collectibles from '../../components/Collectibles';
import Records from '../../components/Records';
import Button from '../../components/UI/Button';

import { Common } from '../../svg';

import './styles.css';

export function NavLinks() {
  return (
    <div className='module views'>
      <ul className='list'>
        <li className='linked'>
          <div className='icon'>
            <Common.Seasons />
          </div>
          <NavLink to='/vaulted' exact />
        </li>
      </ul>
    </div>
  );
}

function ToggleCompletedLink() {
  const settings = useSelector(state => state.settings);
  const dispatch = useDispatch();

  const visible = settings.itemVisibility.hideCompletedRecords || settings.itemVisibility.hideCompletedCollectibles;

  function handler() {
    const state = {
      itemVisibility: {
        hideCompletedRecords: !visible,
        hideCompletedCollectibles: !visible,
      },
    };

    dispatch(actions.settings.set(state));
  }

  return (
    <Button action={handler}>
      {visible ? (
        <>
          <i className='segoe-uniF16E' />
          {t('Show all')}
        </>
      ) : (
        <>
          <i className='segoe-uniF16B' />
          {t('Hide redeemed')}
        </>
      )}
    </Button>
  )
}

export default function Vaulted(props) {
  const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(actions.tooltips.rebind());

    return () => { };
  }, []);

  const season = +props.match.params.season;
  const hash = +props.match.params.hash;
  const data = DestinyContentVault[0];

  const selectedVault = (hash && data.vault.find((selectedVault) => hash === (selectedVault.bucketHash || selectedVault.placeHash || selectedVault.activityHash || selectedVault.activityModeHash))) || data.vault[0];
  const selectedHash = selectedVault.bucketHash || selectedVault.placeHash || selectedVault.activityHash || selectedVault.activityModeHash;

  const collectibles =
    selectedVault &&
    [
      ...selectedVault.buckets.collectibles, // static collectibles
      ...selectedVault.buckets.nodes
        .reduce(
          (array, presentationNodeHash) => [
            // derived from presentation nodes
            ...array,
            manifest.DestinyPresentationNodeDefinition[presentationNodeHash].children.collectibles.map((collectible) => collectible.collectibleHash),
          ],
          []
        )
        .flat(),
    ].sort((a, b) => manifest.DestinyInventoryItemDefinition[manifest.DestinyCollectibleDefinition[a]?.itemHash]?.itemType - manifest.DestinyInventoryItemDefinition[manifest.DestinyCollectibleDefinition[b]?.itemHash]?.itemType);
  const records = selectedVault && [
    ...selectedVault.buckets.records, // static records
    ...selectedVault.buckets.nodes
      .reduce(
        (array, presentationNodeHash) => [
          // derived from presentation nodes
          ...array,
          manifest.DestinyPresentationNodeDefinition[presentationNodeHash].children.records.map((record) => record.recordHash),
        ],
        []
      )
      .flat(),
  ];

  return (
    <>
    <div className='view' id='vaulted'>
      <div className='module head'>
        <div className='page-header'>
          <div className='sub-name'>{t('Content Vault')}</div>
          <div className='name'>{t('Season {{season}}', { season: data.season })}</div>
        </div>
        <BraytechText className='text' value={t('For more information on the _Destiny Content Vault_, please visit [Bungie.net](https://www.bungie.net/en/Help/Article/49167)')} />
      </div>
      <div className='buff'>
        <NavLinks />
        <div className='presentation-node'>
          <div className='node'>
            <div className='children'>
              <h4>{t('Areas')}</h4>
              <ul className='list secondary'>
                {data.vault.map((vault, v) => {
                  const vaultHash = vault.bucketHash || vault.placeHash || vault.activityHash || vault.activityModeHash;

                  const isActive = (match, location) => {
                    if (selectedHash === vaultHash || hash === vaultHash) {
                      return true;
                    } else if (match) {
                      return true;
                    } else {
                      return false;
                    }
                  };

                  const name =
                    // bucketHash
                    (vault.bucketHash && manifest.DestinyInventoryBucketDefinition[vault.bucketHash].displayProperties.name) ||
                    // placeHash
                    (vault.placeHash && manifest.DestinyPlaceDefinition[vault.placeHash].displayProperties.name) ||
                    // activityHash
                    (vault.activityHash && manifest.DestinyActivityDefinition[vault.activityHash].originalDisplayProperties.name) ||
                    // activityModeHash
                    (vault.activityModeHash && manifest.DestinyActivityModeDefinition[vault.activityModeHash].displayProperties.name);
                  const prefix = vault.placeHash ? `${manifest.DestinyActivityModeDefinition[3497767639].displayProperties.name}: ` : '';

                  return (
                    <li key={v} className={cx('linked', { active: isActive })}>
                      <div className='text'>
                        <div className='name'>{prefix + name}</div>
                      </div>
                      <NavLink isActive={isActive} to={`/vaulted/${data.season}/${vaultHash}`} />
                    </li>
                  );
                })}
              </ul>
              <BraytechText className='info' value={t('For convenience, only significant collectibles and records have been marked and sorted.')} />
            </div>
            <div className='entries'>
              {collectibles.length ? (
                <>
                  <h4>{t('Collectibles')}</h4>
                  <ul className='list collection-items'>
                    <Collectibles hashes={collectibles} suppressVaultWarning selfLinkFrom={`/vaulted/${data.season}/${selectedHash}`} showInvisible />
                  </ul>
                </>
              ) : null}
              {records.length ? (
                <>
                  <h4>{t('Records')}</h4>
                  <ul className='list record-items'>
                    <Records hashes={records} suppressVaultWarning selfLinkFrom={`/vaulted/${data.season}/${selectedHash}`} showInvisible />
                  </ul>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      </div>
      <div className='sticky-nav'>
            <div className='wrapper'>
              <div />
              <ul>
                <li><ToggleCompletedLink /></li>
              </ul>
            </div>
      </div>
      </>
  );
}
