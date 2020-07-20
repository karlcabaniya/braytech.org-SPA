import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Marker } from 'react-leaflet';

import actions from '../../../store/actions';
import checklists from '../../../utils/checklists';
import { cartographer } from '../../../utils/maps';
import maps from '../../../data/maps';

import * as marker from '../markers';

function generateLists(visibility) {
  const manifestLists = [365218222, 1297424116, 1697465175, 1912364094, 2360931290, 2609997025, 2726513366, 2955980198, 3142056444, 4178338182, 2137293116, 530600409];
  const recordLists = [1420597821, 3305936921, 655926402, 4285512244, 2474271317];

  return [...manifestLists, ...recordLists].filter(checklistId => visibility[checklistId]).map((checklistId, l) => {
    const checklist = checklists[checklistId]();

    const useRecordHash = recordLists.includes(checklistId);

    return {
      ...checklist,
      tooltipType: checklistId === 4178338182 ? 'activity' : useRecordHash ? 'record' : 'checklist',
      items: checklist.items.map((i) => {
        const node = useRecordHash ? cartographer({ key: 'recordHash', value: i.recordHash }) : cartographer({ key: 'checklistHash', value: i.checklistHash });

        return {
          ...i,
          tooltipHash: checklistId === 4178338182 ? i.activityHash : useRecordHash ? i.recordHash : i.checklistHash,
          screenshot: checklistId === 2955980198 || Boolean(node?.screenshot),
        };
      }),
    };
  });
}

export default function Checklists(props) {
  const settings = useSelector(state => state.settings);
  const member = useSelector(state => state.member);
  const dispatch = useDispatch();
  const [lists, setLists] = useState([]);

  const checklistsVisibilityChange = Object.values(settings.maps.checklists).filter(checklistId => checklistId).length;

  useEffect(() => {
    setLists(generateLists(settings.maps.checklists));

    dispatch(actions.tooltips.rebind());

    return () => {};
  }, [checklistsVisibilityChange, member.updated, member.characterId])



  


  if (maps[props.destinationId].type !== 'map') return null;

  const map = maps[props.destinationId].map;

  const viewWidth = 1920;
  const viewHeight = 1080;

  const mapXOffset = (map.width - viewWidth) / 2;
  const mapYOffset = -(map.height - viewHeight) / 2;

  return lists.map((list, l) => {
    // const visible = props.lists.find((l) => l.checklistId === list.checklistId);
    const visible = true;

    if (!visible || !list.items) return null;

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

            // const text = checklist.checklistId === 3142056444 ? node.displayProperties.name : false;

            const icon = marker.icon({ hash: node.tooltipHash, type: list.tooltipType, bubbleHash: point.bubbleHash }, [`checklistId-${list.checklistId}`, node.completed ? 'completed' : '', node.bubbleHash && !Number.isInteger(node.bubbleHash) ? `error` : '', node.screenshot ? 'has-screenshot' : '', highlight ? 'highlight' : ''], { icon: list.checklistIcon, url: list.checklistImage, selected });
            // const icon = marker.text(['debug'], `${checklist.name}: ${node.name}`);

            return <Marker key={p} position={[offsetY, offsetX]} icon={icon} onClick={props.handler({ checklistHash: node.checklistHash, recordHash: node.recordHash, bubbleHash: point.bubbleHash })} />;
          });
        } else if (settings.maps.debug) {
          const markerOffsetX = mapXOffset + viewWidth / 2;
          const markerOffsetY = mapYOffset + map.height + -viewHeight / 2;

          const offsetX = markerOffsetX + (n + 1) * 50 - map.width / 2;
          const offsetY = markerOffsetY + (l + 1) * 30 - map.height / 3;

          // const text = checklist.checklistId === 3142056444 ? node.displayProperties.name : false;

          const icon = marker.icon({ hash: node.tooltipHash, type: list.tooltipType }, ['error', node.completed ? 'completed' : '', `checklistId-${list.checklistId}`, node.screenshot ? 'has-screenshot' : '', highlight ? 'highlight' : ''], { icon: list.checklistIcon, url: list.checklistImage, selected });

          return <Marker key={n} position={[offsetY, offsetX]} icon={icon} onClick={props.handler({ checklistHash: node.checklistHash, recordHash: node.recordHash })} />;
        } else {
          return null;
        }
      });
  });
}
