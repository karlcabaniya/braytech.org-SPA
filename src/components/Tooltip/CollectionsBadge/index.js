import React from 'react';
import { useSelector } from 'react-redux';
import cx from 'classnames';

import { t } from '../../../utils/i18n';
import manifest from '../../../utils/manifest';
import * as enums from '../../../utils/destinyEnums';
import { classHashToIcon } from '../../../utils/destinyConverters';

import './styles.css';

function CollectionsBadge({ hash, ...props }) {
  const member = useSelector((state) => state.member);
  const characterCollectibles = member.data.profile.characterCollectibles.data;
  const profileCollectibles = member.data.profile.profileCollectibles.data;

  const definitionBadge = manifest.DestinyPresentationNodeDefinition[hash];

  if (!definitionBadge) {
    console.warn('Hash not found');
    
    return null;
  }

  if (definitionBadge.redacted) {
    return (
      <>
        <div className='acrylic' />
        <div className={cx('frame', 'common')}>
          <div className='header'>
            <div className='name'>{t('Classified')}</div>
            <div>
              <div className='kind'>{t('Insufficient clearance')}</div>
            </div>
          </div>
          <div className='black'>
            <div className='description'>
              <pre>{t('Keep it clean.')}</pre>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    const classStates = definitionBadge.children.presentationNodes.map((node) => {
      let definitionNode = manifest.DestinyPresentationNodeDefinition[node.presentationNodeHash];

      const classState = definitionNode.children.collectibles.map((child) => {
        return profileCollectibles.collectibles[child.collectibleHash]?.state || characterCollectibles[member.characterId].collectibles[child.collectibleHash]?.state || 0;
      });

      return {
        classHash: enums.associationsCollectionsBadgesClasses[definitionNode.hash],
        name: definitionNode.displayProperties.name,
        states: classState,
      };
    });

    let completed = 0;
    const classTotal = classStates.reduce((a, obj) => {
      return Math.max(a, obj.states.filter((collectible) => !enums.enumerateCollectibleState(collectible).Invisible).length);
    }, 0);

    const progress = classStates.map((obj, i) => {
      if (obj.states.filter((collectible) => !enums.enumerateCollectibleState(collectible).NotAcquired).length === classTotal) {
        completed++;
      }

      const Icon = classHashToIcon(obj.classHash);

      return (
        <div key={i} className='progress'>
          <div className='class-icon'>
            <Icon />
          </div>
          <div className='text'>
            <div className='title'>{obj.name}</div>
            <div className='fraction'>
              {obj.states.filter((collectible) => !enums.enumerateCollectibleState(collectible).NotAcquired).length}/{classTotal}
            </div>
          </div>
          <div
            className={cx('bar', {
              completed: obj.states.filter((collectible) => !enums.enumerateCollectibleState(collectible).NotAcquired).length === classTotal,
            })}
          >
            <div
              className='fill'
              style={{
                width: `${(obj.states.filter((collectible) => !enums.enumerateCollectibleState(collectible).NotAcquired).length / classTotal) * 100}%`,
              }}
            />
          </div>
        </div>
      );
    });

    return (
      <>
        <div className='acrylic' />
        <div className={cx('frame', 'ui', 'collections-badge')}>
          <div className='header'>
            <div className='name'>{definitionBadge.displayProperties.name}</div>
            <div>
              <div className='kind'>{t('Badge')}</div>
            </div>
          </div>
          <div className='black'>
            <div className='flair'>
              <p>{definitionBadge.displayProperties.description}</p>
            </div>
            <div className='line' />
            <div className={cx('state', { completed })}>
              <div className='text'>{completed > 0 ? t('Badge completed') : t('Badge progress')}</div>
              {progress}
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default CollectionsBadge;
