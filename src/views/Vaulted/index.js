import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import cx from 'classnames';

import { t, BraytechText } from '../../utils/i18n';
import manifest from '../../utils/manifest';
import { DestinyContentVault } from '../../utils/destinyEnums';

import './styles.css';
import Collectibles from '../../components/Collectibles';
import Records from '../../components/Records';

export function NavLinks() {
  return (
    <div className='module views'>
      <ul className='list'>
        <li className='linked disabled'>
          <div className='icon'></div>
          {/* <NavLink to='/' exact /> */}
        </li>
      </ul>
    </div>
  );
}

class Vaulted extends React.Component {
  componentDidMount() {
    this.mounted = true;

    window.scrollTo(0, 0);
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const season = +this.props.match.params.season;
    const hash = +this.props.match.params.hash;
    const data = DestinyContentVault[0];

    const selectedVault = (hash && data.vault.find((activity) => hash === (activity.placeHash || activity.activityHash))) || data.vault[0];
    const selectedHash = selectedVault.bucketHash || selectedVault.placeHash || selectedVault.activityHash;

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
      <div className='view' id='vaulted'>
        <div className='module head'>
          <div className='page-header'>
            <div className='sub-name'>{t('The Vault')}</div>
            <div className='name'>{t('Pending')}</div>
          </div>
        </div>
        <div className='buff'>
          <NavLinks />
          <div className='content presentation-node'>
            <div className='module season'>
              <h3>{t('Season {{season}}', { season: data.season })}</h3>
              <BraytechText className='text' value={data.aside} />
            </div>
            <div className='node'>
              <div className='children'>
                <ul className='list secondary'>
                  {data.vault.map((vault, v) => {
                    const vaultHash = vault.bucketHash || vault.placeHash || vault.activityHash;

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
                      (vault.activityHash && manifest.DestinyActivityDefinition[vault.activityHash].originalDisplayProperties.name);
                    const prefix = vault.placeHash ? `${manifest.DestinyActivityModeDefinition[3497767639].displayProperties.name}: ` : '';

                    return (
                      <li key={v} className={cx('linked', { active: isActive })}>
                        <div className='text'>
                          <div className='name'>
                            {prefix + name}
                          </div>
                        </div>
                        <NavLink isActive={isActive} to={`/vaulted/${data.season}/${vaultHash}`} />
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className='entries'>
                {collectibles.length ? (
                  <>
                    <h4>{t('Collectibles')}</h4>
                    <ul className='list collection-items'>
                      <Collectibles hashes={collectibles} supressVaultWarning selfLinkFrom='/vaulted' showCompleted showInvisible />
                    </ul>
                  </>
                ) : null}
                {records.length ? (
                  <>
                    <h4>{t('Records')}</h4>
                    <ul className='list record-items'>
                      <Records hashes={records} supressVaultWarning selfLinkFrom='/vaulted' showCompleted showInvisible />
                    </ul>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    lists: state.lists,
  };
}

export default connect(mapStateToProps)(Vaulted);
