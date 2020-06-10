import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import cx from 'classnames';

import manifest from '../../../utils/manifest';
import * as enums from '../../../utils/destinyEnums';
import ObservedImage from '../../../components/ObservedImage';
import { ProfileNavLink } from '../../../components/ProfileLink';

import Collectibles from '../../../components/Collectibles';

const classNodes = {
  0: [811225638, 2598675734],
  1: [3745240322, 2765771634],
  2: [1269917845, 1573256543],
};

class PresentationNode extends React.Component {
  render() {
    const { member, collectibles } = this.props;
    const characterCollectibles = member.data.profile.characterCollectibles.data;
    const profileCollectibles = member.data.profile.profileCollectibles.data;
    const characters = member.data.profile.characters.data;
    const character = characters.find((character) => character.characterId === member.characterId);

    const primaryHash = this.props.match.params.primary;
    const definitionPrimary = manifest.DestinyPresentationNodeDefinition[primaryHash] || manifest.DestinyPresentationNodeDefinition[1068557105]; // defaults to exotics

    const secondaryHash =
      !this.props.match.params.secondary && definitionPrimary?.children.presentationNodes.find((child) => classNodes[character.classType].includes(child.presentationNodeHash))
        ? // no node specified but found a class-specific node to default to
          definitionPrimary.children.presentationNodes.find((child) => classNodes[character.classType].includes(child.presentationNodeHash)).presentationNodeHash
        : !this.props.match.params.secondary || !manifest.DestinyPresentationNodeDefinition[this.props.match.params.secondary]
        ? // default to first node is no hash or can't find hash
          definitionPrimary?.children.presentationNodes[0].presentationNodeHash
        : this.props.match.params.secondary;

    const definitionSecondary = manifest.DestinyPresentationNodeDefinition[secondaryHash];

    const tertiaryHash =
      !this.props.match.params.tertiary && definitionSecondary?.children.presentationNodes.find((child) => classNodes[character.classType].includes(child.presentationNodeHash))
        ? // no node specified but found a class-specific node to default to
          definitionSecondary.children.presentationNodes.find((child) => classNodes[character.classType].includes(child.presentationNodeHash)).presentationNodeHash
        : !this.props.match.params.tertiary || !manifest.DestinyPresentationNodeDefinition[this.props.match.params.tertiary]
        ? // default to first node is no hash or can't find hash
          definitionSecondary?.children.presentationNodes[0].presentationNodeHash
        : this.props.match.params.tertiary;

    const definitionTertiary = manifest.DestinyPresentationNodeDefinition[tertiaryHash];

    const quaternaryHash = this.props.match.params.quaternary ? this.props.match.params.quaternary : false;

    const primaryChildren = definitionPrimary.children.presentationNodes.map((node, n) => {
      const definitionNode = manifest.DestinyPresentationNodeDefinition[node.presentationNodeHash];

      const isActive = (match, location) => {
        if (definitionSecondary.hash === node.presentationNodeHash) {
          return true;
        } else {
          return false;
        }
      };

      return (
        <li key={n} className='linked'>
          <ProfileNavLink isActive={isActive} to={`/collections/${primaryHash}/${definitionNode.hash}`}>
            <ObservedImage className='image icon' src={`${!definitionNode.displayProperties.localIcon ? 'https://www.bungie.net' : ''}${definitionNode.displayProperties.icon}`} />
          </ProfileNavLink>
        </li>
      );
    });

    const secondaryChildren = definitionSecondary.children.presentationNodes
      .filter((child) => !manifest.DestinyPresentationNodeDefinition[child.presentationNodeHash].redacted)
      .map((child) => {
        const definitionNode = manifest.DestinyPresentationNodeDefinition[child.presentationNodeHash];

        const states = [];

        // armour sets
        if (definitionNode.children.collectibles.length === 0 && definitionNode.children.presentationNodes.length) {
          definitionNode.children.presentationNodes.forEach((n) => {
            const definitionArmourNode = manifest.DestinyPresentationNodeDefinition[n.presentationNodeHash];

            let state = 0;
            definitionArmourNode.children.collectibles.forEach((c) => {
              const definitionCollectible = manifest.DestinyCollectibleDefinition[c.collectibleHash];

              let scope = profileCollectibles.collectibles[definitionCollectible.hash] ? profileCollectibles.collectibles[definitionCollectible.hash] : characterCollectibles[member.characterId].collectibles[definitionCollectible.hash];
              if (scope) {
                state = scope.state;
              }

              states.push(state);
            });
          });
        } else {
          let state = 0;
          definitionNode.children.collectibles.forEach((c) => {
            const definitionCollectible = manifest.DestinyCollectibleDefinition[c.collectibleHash];

            let scope = profileCollectibles.collectibles[definitionCollectible.hash] ? profileCollectibles.collectibles[definitionCollectible.hash] : characterCollectibles[member.characterId].collectibles[definitionCollectible.hash];
            if (scope) {
              state = scope.state;
            }

            states.push(state);
          });
        }

        const isActive = (match, location) => {
          if (definitionTertiary.hash === child.presentationNodeHash) {
            return true;
          } else {
            return false;
          }
        };

        const secondaryProgress = states.filter((state) => !enums.enumerateCollectibleState(state).NotAcquired).length;
        const secondaryTotal = collectibles && collectibles.hideInvisibleCollectibles ? states.filter((state) => !enums.enumerateCollectibleState(state).Invisible).length : states.length;

        return (
          <li key={definitionNode.hash} className={cx('linked', { completed: secondaryProgress === secondaryTotal && secondaryTotal !== 0, active: definitionTertiary.hash === child.presentationNodeHash })}>
            <div className='text'>
              <div className='name'>{definitionNode.displayProperties.name}</div>
              <div className='progress'>
                <span>{secondaryProgress}</span> / {secondaryTotal}
              </div>
            </div>
            <ProfileNavLink isActive={isActive} to={`/collections/${primaryHash}/${secondaryHash}/${definitionNode.hash}`} />
          </li>
        );
      });

    return (
      <div className='node'>
        <div className='header'>
          <div className='name'>
            {definitionPrimary.displayProperties.name}
            {definitionPrimary.children.presentationNodes.length > 1 ? <span>{definitionSecondary.displayProperties.name}</span> : null}
          </div>
        </div>
        <div className='children'>
          <ul
            className={cx('list', 'primary', {
              'single-primary': definitionPrimary.children.presentationNodes.length === 1,
            })}
          >
            {primaryChildren}
          </ul>
          <ul className='list secondary'>{secondaryChildren}</ul>
        </div>
        <div className='collectibles'>
          <ul className={cx('list', 'tertiary', 'collection-items', { sets: primaryHash === '1605042242' })}>
            <Collectibles node={definitionTertiary.hash} highlight={quaternaryHash} inspect selfLinkFrom={this.props.location.pathname} />
          </ul>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    member: state.member,
    collectibles: state.collectibles,
  };
}

export default compose(withRouter, connect(mapStateToProps))(PresentationNode);
