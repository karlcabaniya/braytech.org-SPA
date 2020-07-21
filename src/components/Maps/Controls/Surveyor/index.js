import React, { useState, useEffect } from 'react';
import cx from 'classnames';

import { checklists } from '../../../../utils/checklists';
import { cartographer } from '../../../../utils/maps';

import './styles.css';

const manifestLists = [365218222, 1297424116, 1697465175, 1912364094, 2360931290, 2609997025, 2726513366, 2955980198, 3142056444, 4178338182, 2137293116, 530600409];
const recordLists = [1420597821, 3305936921, 655926402, 4285512244, 2474271317];

function generateLists(lists = [...manifestLists, ...recordLists]) {
  return lists.map((checklistId, l) => {
    const checklist = checklists[checklistId]();

    const useRecordHash = recordLists.includes(checklistId);

    return {
      ...checklist,
      tooltipType: checklistId === 4178338182 ? 'activity' : useRecordHash ? 'record' : 'checklist',
      items: checklist.items
        .filter((i) => !i.map.points.length)
        .map((i) => {
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

function Surveyor({ clicked, ...props }) {
  const lists = generateLists([2137293116]);
  const [state, setState] = useState({
    checklistHash: false,
    associations: {},
  });

  // console.log(clicked);
  // console.log(lists);

  const handler_click = (checklistHash) => (e) => {
    if (!state.checklistHash || checklistHash !== state.checklistHash) {
      setState((state) => ({
        ...state,
        checklistHash,
      }));
    }
  };

  useEffect(() => {
    if (state.checklistHash) {
      setState((state) => ({
        checklistHash: false,
        associations: {
          ...state.associations,
          [state.checklistHash]: clicked,
        },
      }));
    }

    return () => {};
  }, [clicked]);

  const lol = Object.keys(state.associations).length;
  useEffect(() => {
    
    console.log(JSON.stringify(state.associations));
    
    return () => {};
  }, [lol])

  return (
    <div className='control surveyor acrylic'>
      <div className='wrapper'>
        {lists.map((list, l) => {
          return (
            <div key={l}>
              <h4>{list.checklistName}</h4>
              <ul className='list'>
                {list.items.map((item, i) => {
                  return (
                    <li key={i} className='linked' onClick={handler_click(item.checklistHash)}>
                      <div className='text'>
                        {item.displayProperties.name}
                        {item.displayProperties.suffix ? ` ${item.displayProperties.suffix}` : null}
                        {state.checklistHash === item.checklistHash ? ` / active` : ''}
                        {state.associations[item.checklistHash] ? ` / ${JSON.stringify(state.associations[item.checklistHash])}` : ''}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Surveyor;
