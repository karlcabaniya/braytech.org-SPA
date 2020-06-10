import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import cx from 'classnames';

import manifest from '../../../utils/manifest';
import { commonality } from '../../../utils/destinyUtils';
import { classHashToIcon } from '../../../utils/destinyConverters';
import * as enums from '../../../utils/destinyEnums';
import { ProfileNavLink } from '../../../components/ProfileLink';
import ObservedImage from '../../../components/ObservedImage';
import Collectibles from '../../../components/Collectibles';

class BadgeNode extends React.Component {
  entries = React.createRef();

  hanlder__goToEntriesTop = e => {
    const element = this.entries.current;
    window.scrollTo(0, (element.offsetTop - element.scrollTop + element.clientTop - 34));
  }

  render() {
    const { t, member } = this.props;
    const characterCollectibles = member.data.profile.characterCollectibles.data;
    const profileCollectibles = member.data.profile.profileCollectibles.data;
    const characters = member.data.profile.characters.data;
    const character = characters.find(c => c.characterId === member.characterId);

    // associates class with hash
    
    // let obj = {}
    // for (const n of Object.values(manifest.DestinyPresentationNodeDefinition)) {
    //   n.children && n.children.presentationNodes && n.children.presentationNodes.length && n.children.presentationNodes.forEach(p => {
    //     let def = manifest.DestinyPresentationNodeDefinition[p.presentationNodeHash];
    //     if (def && def.displayProperties && def.displayProperties.name && def.displayProperties.name.toLowerCase() === 'titan') {
    //       obj[def.hash] = 3655393761
    //     } else if (def && def.displayProperties && def.displayProperties.name && def.displayProperties.name.toLowerCase() === 'hunter') {
    //       obj[def.hash] = 671679327
    //     } else if (def && def.displayProperties && def.displayProperties.name && def.displayProperties.name.toLowerCase() === 'warlock') {
    //       obj[def.hash] = 2271682572
    //     }
    //   })
    // }
    // console.log(JSON.stringify(obj))

    const definitionBadge = manifest.DestinyPresentationNodeDefinition[this.props.match.params.secondary];

    let classNode = this.props.match.params.tertiary ? parseInt(this.props.match.params.tertiary, 10) : false;

    let children;

    let classStates = [];
    definitionBadge.children.presentationNodes.forEach(node => {
      let definitionNode = manifest.DestinyPresentationNodeDefinition[node.presentationNodeHash];

      let classState = [];
      definitionNode.children.collectibles.forEach(child => {
        let scope = profileCollectibles.collectibles[child.collectibleHash] ? profileCollectibles.collectibles[child.collectibleHash] : characterCollectibles[member.characterId].collectibles[child.collectibleHash];
        if (scope) {
          classState.push(scope.state);
        } else {
          console.log(`34 Undefined state for ${child.collectibleHash}`);
        }
      });

      if (!classNode && enums.associationsCollectionsBadgesClasses[definitionNode.hash] === character.classHash) {
        classNode = definitionNode.hash;
      }

      if (classNode === definitionNode.hash) {
        
        children = (
          <ul className='list tertiary collection-items'>
            <Collectibles node={node.presentationNodeHash} inspect selfLinkFrom={this.props.location.pathname} />
          </ul>
        );
      }

      classStates.push({
        classHash: enums.associationsCollectionsBadgesClasses[definitionNode.hash],
        name: definitionNode.displayProperties.name,
        states: classState
      });
    });

    let completed = 0;
    const classTotal = classStates.reduce((a, obj) => {
      return Math.max(a, obj.states.filter(collectible => !enums.enumerateCollectibleState(collectible).Invisible).length);
    }, 0);
    
    const progress = classStates.map((obj, i) => {
      if (obj.states.filter(collectible => !enums.enumerateCollectibleState(collectible).NotAcquired).length === classTotal) {
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
              {obj.states.filter(collectible => !enums.enumerateCollectibleState(collectible).NotAcquired).length}/{classTotal}
            </div>
          </div>
          <div
            className={cx('bar', {
              completed: obj.states.filter(collectible => !enums.enumerateCollectibleState(collectible).NotAcquired).length === classTotal
            })}
          >
            <div
              className='fill'
              style={{
                width: `${(obj.states.filter(collectible => !enums.enumerateCollectibleState(collectible).NotAcquired).length / classTotal) * 100}%`
              }}
            />
          </div>
        </div>
      );
    });

    return (
      <div className='node badge'>
        <div className='children'>
          <div className={cx('icon', { 'badge-completed': completed > 2})}>
            <ObservedImage className='image badge' src={enums.badgeImages[definitionBadge.hash] ? `/static/images/extracts/badges/${enums.badgeImages[definitionBadge.hash]}` : `https://www.bungie.net${definitionBadge.displayProperties.icon}`} />
            {completed > 2 ? <ObservedImage className='image gilded' src={`/static/images/extracts/ui/0560-00001498.png`} /> : null}
          </div>
          <div className='text'>
            <div className='name'>{definitionBadge.displayProperties.name}</div>
            <div className='description'>{definitionBadge.displayProperties.description}</div>
          </div>
          <div className='until'>
            {completed > 0 ? <h4 className='completed'>{t('Badge completed')}</h4> : <h4>{t('Badge progress')}</h4>}
            {progress}
          </div>
          {manifest.statistics.triumphs?.[definitionBadge.completionRecordHash] ? (
            <div className='commonality'>
              <h4>{t('Badge commonality')}</h4>
              <div className='value tooltip' data-hash='commonality' data-type='braytech' data-related={definitionBadge.completionRecordHash}>{commonality(manifest.statistics.triumphs?.[definitionBadge.completionRecordHash]).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%</div>
              <div className='description'>
                {t("The badge's rarity represented as a percentage of players who are indexed by VOLUSPA.")}
              </div>
            </div>
          ) : null}
        </div>
        <div className='entries' ref={this.entries}>
          <div className='filters'>
            <ul className='list'>
              {definitionBadge.children.presentationNodes.map(p => {
                const isActive = (match, location) => {
                  if (p.presentationNodeHash === classNode) {
                    return true;
                  } else {
                    return false;
                  }
                };

                const Icon = classHashToIcon(enums.associationsCollectionsBadgesClasses[p.presentationNodeHash]);

                return (
                  <li key={p.presentationNodeHash} className='linked'>
                    <Icon />
                    <ProfileNavLink isActive={isActive} to={`/collections/badge/${definitionBadge.hash}/${p.presentationNodeHash}`} onClick={this.hanlder__goToEntriesTop} />
                  </li>
                )
              })}
            </ul>
          </div>
          {children}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member
  };
}

export default compose(
  withRouter,
  connect(
    mapStateToProps
  ),
  withTranslation()
)(BadgeNode);
