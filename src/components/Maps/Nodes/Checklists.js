import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Marker } from 'react-leaflet';

import actions from '../../../store/actions';
import checklists from '../../../utils/checklists';
import { cartographer } from '../../../utils/maps';
import maps from '../../../data/maps';

import * as marker from '../markers';

function generateLists({ checklists: visibility, noScreenshotHighlight }) {
  const manifestLists = [
    1697465175, // Region Chests
    3142056444, // Lost Sectors
    4178338182, // Adventures
    2360931290, // Ghost Scans
    365218222, // Sleeper Nodes
    2955980198, // Latent Memory Fragments
    2609997025, // Corrupted Eggs
    1297424116, // Ahamkara Bones
    2726513366, // Cat Statues
    1912364094, // Jade Rabbits
    2137293116, // Savathûn's Eyes
    530600409, // Calcified fragments
  ];
  const recordLists = [
    1420597821, // Lore: Ghost Stories
    3305936921, // Lore: The Awoken of the Reef
    655926402, // Lore: The Forsaken Prince
    4285512244, // Lore: Luna's Lost
    2474271317, // Lore: Inquisition of the Damned
  ];

  return [...manifestLists, ...recordLists]
    .filter((checklistId) => visibility[checklistId])
    .map((checklistId, l) => {
      const checklist = checklists[checklistId]();

      const useRecordHash = recordLists.includes(checklistId);

      return {
        ...checklist,
        tooltipType: checklistId === 4178338182 ? 'activity' : useRecordHash ? 'record' : 'checklist',
        items: checklist.items.map((i) => {
          const node = noScreenshotHighlight ? useRecordHash ? cartographer({ key: 'recordHash', value: i.recordHash }) : cartographer({ key: 'checklistHash', value: i.checklistHash }) : undefined;

          return {
            ...i,
            tooltipHash: checklistId === 4178338182 ? i.activityHash : useRecordHash ? i.recordHash : i.checklistHash,
            screenshot: noScreenshotHighlight ? checklistId === 2955980198 || Boolean(node?.screenshot) : undefined,
          };
        }),
      };
    });
}

export default function Checklists(props) {
  const settings = useSelector((state) => state.settings);
  const member = useSelector((state) => state.member);
  const dispatch = useDispatch();
  const [lists, setLists] = useState([]);

  const checklistsVisibilityChange = Object.values(settings.maps.checklists).filter((checklistId) => checklistId).length;

  useEffect(() => {
    setLists(generateLists(settings.maps));

    // console.log('useEffect, setLists');

    return () => {};
  }, [checklistsVisibilityChange, member.updated, member.characterId]);

  useEffect(() => {
    dispatch(actions.tooltips.rebind());

    // console.log('useEffect, tooltips rebind');

    return () => {};
  }, [lists]);


  



  if (maps[props.destinationId].type !== 'map') return null;

  const map = maps[props.destinationId].map;

  const viewWidth = 1920;
  const viewHeight = 1080;

  const mapXOffset = (map.width - viewWidth) / 2;
  const mapYOffset = -(map.height - viewHeight) / 2;

  return lists.map((list, l) => {
    if (!list.items) return null;

    return list.items
      .filter((node) => node.destinationHash === maps[props.destinationId].destination.hash)
      .filter((node) => (node.invisible && !settings.maps.debug ? false : true))
      .map((node, n) => {
        const highlight = props.highlight && +props.highlight === (node.checklistHash || node.recordHash);
        const selected =
          highlight ||
          (props.selected.checklistHash // check if checklistHash item is selected
            ? props.selected.checklistHash === node.checklistHash
              ? true
              : false
            : // check if recordHash item is selected
            props.selected.recordHash !== undefined && props.selected.recordHash === node.recordHash
            ? true
            : false);

        if (node.map.points.length) {
          return node.map.points.map((point, p) => {
            const markerOffsetX = mapXOffset + viewWidth / 2;
            const markerOffsetY = mapYOffset + map.height + -viewHeight / 2;

            if (!point.x || !point.y) {
              console.warn(node);

              return null;
            }

            const offsetX = markerOffsetX + point.x;
            const offsetY = markerOffsetY + point.y;

            const icon = marker.icon(
              // tooltip
              { hash: node.tooltipHash, type: list.tooltipType, bubbleHash: point.bubbleHash },
              // classnames
              [`checklistId-${list.checklistId}`, node.completed ? 'completed' : '', node.bubbleHash && !Number.isInteger(node.bubbleHash) ? `error` : '', node.screenshot ? 'has-screenshot' : '', highlight ? 'highlight' : ''],
              // marker
              { icon: list.checklistIcon, url: list.checklistImage, selected }
            );

            return <Marker key={p} position={[offsetY, offsetX]} icon={icon} onClick={props.handler({ checklistHash: node.checklistHash, recordHash: node.recordHash, bubbleHash: point.bubbleHash })} />;
          });
        } else if (settings.maps.debug) {
          const markerOffsetX = mapXOffset + viewWidth / 2;
          const markerOffsetY = mapYOffset + map.height + -viewHeight / 2;

          const offsetX = markerOffsetX + (n + 1) * 50 - map.width / 2;
          const offsetY = markerOffsetY + (l + 1) * 30 - map.height / 3;

          const icon = marker.icon(
            // tooltip
            { hash: node.tooltipHash, type: list.tooltipType },
            // classnames
            ['error', node.completed ? 'completed' : '', `checklistId-${list.checklistId}`, node.screenshot ? 'has-screenshot' : '', highlight ? 'highlight' : ''],
            // marker
            { icon: list.checklistIcon, url: list.checklistImage, selected }
          );

          return <Marker key={n} position={[offsetY, offsetX]} icon={icon} onClick={props.handler({ checklistHash: node.checklistHash, recordHash: node.recordHash })} />;
        } else {
          return null;
        }
      });
  });
}
