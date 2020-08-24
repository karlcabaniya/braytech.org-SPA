import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import cx from 'classnames';
import queryString from 'query-string';

import * as enums from '../../../utils/destinyEnums';
import manifest from '../../../utils/manifest';

import './styles.css';
import ObservedImage from '../../../components/ObservedImage';

function talentGrid(itemHash, selectedNodes) {
  const definitionInventoryItem = manifest.DestinyInventoryItemDefinition[itemHash];
  const definitionTalentGrid = manifest.DestinyTalentGridDefinition[definitionInventoryItem?.talentGrid?.talentGridHash];

  if (!definitionTalentGrid) return {};

  const talentGridHash = definitionTalentGrid.hash;
  const nodes = definitionTalentGrid.nodes.filter((node, n) => definitionTalentGrid.independentNodeIndexes.includes(n));

  return {
    talentGridHash,
    nodes: nodes.map((node) => {
      const talentNodeGroup = definitionTalentGrid.nodes[node.nodeIndex];
      const step = talentNodeGroup.steps[0];

      if (!step) {
        return undefined;
      }

      // Filter out some weird bogus nodes
      if (!step.displayProperties.name || talentNodeGroup.column < 0) {
        return undefined;
      }

      // Only one node in this column can be selected (scopes, etc)
      const exclusiveInColumn = Boolean(talentNodeGroup.exclusiveWithNodeHashes && talentNodeGroup.exclusiveWithNodeHashes.length > 0);

      const activatedAtGridLevel = step.activationRequirement.gridLevel;

      // There's a lot more here, but we're taking just what we need
      return {
        hash: step.nodeStepHash,
        groupHash: talentNodeGroup.groupHash,
        displayProperties: step.displayProperties,
        // Position in the grid
        column: talentNodeGroup.column,
        row: talentNodeGroup.row,
        // Is the node selected (lit up in the grid)
        isActivated: selectedNodes.includes(step.nodeStepHash),
        // The item level at which this node can be unlocked
        activatedAtGridLevel,
        // Only one node in this column can be selected (scopes, etc)
        exclusiveInColumn,
        // Some nodes don't show up in the grid, like purchased ascend nodes
        hidden: node.hidden,
        layoutIdentifier: talentNodeGroup.layoutIdentifier,
      };
    }),
  };
}

export default function Talents() {
  // const member = useSelector((state) => state.member);

  const location = useLocation();
  const params = useParams();
  const itemHash = params.itemHash && +params.itemHash;

  // const { itemInstanceId } = member.data.inventory?.find((item) => item.itemHash === itemHash) || {};
  
  const query = queryString.parse(location.search);
  const urlNodes = query.nodes?.split('/').map(node => +node || false);

  const { talentGridHash, nodes } = talentGrid(itemHash, urlNodes);

  console.log(talentGridHash, nodes);

  const nodeSize = 40;
  const nodePadding = 4;
  const totalNodeSize = nodeSize + nodePadding;

  const maxColumns = nodes
    .filter((node) => !node.hidden)
    .reduce((max, node) => {
      return Math.max(max, node.column);
    }, 0);

  // console.log(maxColumns)

  const groups = nodes.reduce((groups, node) => {
    const group = groups.find((group) => group.groupHash === node.groupHash);

    if (group) {
      const nodes = [...group.nodes, node];

      return [
        ...groups.filter((g) => g.groupHash !== group.groupHash),
        {
          groupHash: group.groupHash,
          nodes,
          column: nodes.reduce((sum, node) => sum + node.column, 0) / nodes.length,
          row: nodes.reduce((sum, node) => sum + node.row, 0) / nodes.length,
        },
      ];
    } else {
      return [
        ...groups,
        {
          groupHash: node.groupHash,
          nodes: [node],
          column: node.column,
          row: node.row,
        },
      ];
    }
  }, []);

  console.log(groups);

  return (
    <div className='view' id='inspect'>
      <div className='talent-grid'>
        {groups.map((group, g) =>
          group.nodes.length > 1 ? (
            <div key={g} className='group'>
              <div className='border' style={{ left: `${group.column}%`, top: `${group.row + 10}%` }} />
              {group.nodes.map((node, n) => (
                <TalentGridNode key={n} node={node} />
              ))}
            </div>
          ) : (
            group.nodes.map((node, n) => <TalentGridNode key={n} node={node} />)
          )
        )}
      </div>
    </div>
  );
}

function TalentGridNode({ node }) {
  return (
    <div
      className={cx('node', {
        selected: node.isActivated,
        default: node.isActivated && !node.exclusiveInColumn && node.column < 1,
        super: node.layoutIdentifier === 'super',
      })}
      style={{ left: `${node.column}%`, top: `${node.row + 10}%` }}
    >
      <div className='border' />
      <div className='button' />
      <ObservedImage src={`https://www.bungie.net${node.displayProperties.icon}`} />
    </div>
  );
}
