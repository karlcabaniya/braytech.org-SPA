import React from 'react';
import { connect } from 'react-redux';
import { Marker } from 'react-leaflet';

import checklists from '../../../utils/checklists';
import { cartographer } from '../../../utils/maps';
import maps from '../../../data/maps';

import * as marker from '../markers';

function generateLists() {
  const manifestLists = [365218222, 1297424116, 1697465175, 1912364094, 2360931290, 2609997025, 2726513366, 2955980198, 3142056444, 4178338182];
  const recordLists = [1420597821, 3305936921, 655926402, 4285512244, 2474271317];

  return [...manifestLists, ...recordLists].map((checklistId, l) => {
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

class Checklists extends React.Component {
  state = {
    lists: [],
  };

  static getDerivedStateFromProps(p, s) {
    if (s.lists.length) {
      return null;
    }

    return {
      lists: generateLists(),
    };
  }

  componentDidMount() {
    this.mounted = true;

    this.props.rebindTooltips();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentDidUpdate(p) {
    if (this.mounted && (p.member.updated !== this.props.member.updated || p.member.characterId !== this.props.member.characterId)) {
      this.setLists();
    }
    
    this.props.rebindTooltips();
  }

  setLists = () => {
    this.setState({
      lists: generateLists(),
    });
  };

  handler_markerMouseOver = (e) => {
    return;

    if (!this.props.settings.maps.debug || !this.props.settings.maps.logDetails) return;

    const dataset = e.target?._icon?.children?.[0]?.children?.[0]?.dataset;

    const node = dataset.hash && cartographer({ key: dataset.type === 'activity' ? 'activityHash' : dataset.type === 'record' ? 'recordHash' : 'checklistHash', value: dataset.hash });

    console.log(node);
  };

  render() {
    if (maps[this.props.destinationId].type !== 'map') return null;

    const map = maps[this.props.destinationId].map;

    const viewWidth = 1920;
    const viewHeight = 1080;

    const mapXOffset = (map.width - viewWidth) / 2;
    const mapYOffset = -(map.height - viewHeight) / 2;

    return this.state.lists.map((list, l) => {
      // const visible = this.props.lists.find((l) => l.checklistId === list.checklistId);
      const visible = true;

      if (!visible || !list.items) return null;

      return list.items
        .filter((node) => node.destinationHash === maps[this.props.destinationId].destination.hash)
        .filter((node) => (node.invisible && !this.props.settings.maps.debug ? false : true))
        .map((node, i) => {
          const highlight = this.props.highlight && +this.props.highlight === (node.checklistHash || node.recordHash);
          const selected =
            highlight ||
            (this.props.selected.checklistHash // check if checklistHash item is selected
              ? this.props.selected.checklistHash === node.checklistHash
                ? true
                : false
              : // check if recordHash item is selected
              this.props.selected.recordHash !== undefined && this.props.selected.recordHash === node.recordHash
              ? true
              : false);

          if (node.map.points.length) {
            return node.map.points.map((point) => {
              const markerOffsetX = mapXOffset + viewWidth / 2;
              const markerOffsetY = mapYOffset + map.height + -viewHeight / 2;

              if (!point.x || !point.y) {
                console.warn(node);

                return null;
              }

              const offsetX = markerOffsetX + point.x;
              const offsetY = markerOffsetY + point.y;

              // const text = checklist.checklistId === 3142056444 ? node.displayProperties.name : false;

              const icon = marker.icon({ hash: node.tooltipHash, type: list.tooltipType }, [`checklistId-${list.checklistId}`, node.completed ? 'completed' : '', node.bubbleHash && !Number.isInteger(node.bubbleHash) ? `error` : '', node.screenshot ? 'has-screenshot' : '', highlight ? 'highlight' : ''], { icon: list.checklistIcon, url: list.checklistImage, selected });
              // const icon = marker.text(['debug'], `${checklist.name}: ${node.name}`);

              return <Marker key={`${node.checklistHash || node.recordHash}-${i}`} position={[offsetY, offsetX]} icon={icon} onMouseOver={(this.props.settings.maps.debug && this.handler_markerMouseOver) || null} onClick={this.props.handler({ checklistHash: node.checklistHash, recordHash: node.recordHash })} />;
            });
          } else if (this.props.settings.maps.debug) {
            const markerOffsetX = mapXOffset + viewWidth / 2;
            const markerOffsetY = mapYOffset + map.height + -viewHeight / 2;

            const offsetX = markerOffsetX + (i + 1) * 50 - map.width / 2;
            const offsetY = markerOffsetY + (l + 1) * 30 - map.height / 3;

            // const text = checklist.checklistId === 3142056444 ? node.displayProperties.name : false;

            const icon = marker.icon({ hash: node.tooltipHash, type: list.tooltipType }, ['error', node.completed ? 'completed' : '', `checklistId-${list.checklistId}`, node.screenshot ? 'has-screenshot' : '', highlight ? 'highlight' : ''], { icon: list.checklistIcon, url: list.checklistImage, selected });

            return <Marker key={`${node.checklistHash || node.recordHash}-${i}`} position={[offsetY, offsetX]} icon={icon} onMouseOver={(this.props.settings.maps.debug && this.handler_markerMouseOver) || null} onClick={this.props.handler({ checklistHash: node.checklistHash, recordHash: node.recordHash })} />;
          } else {
            return null;
          }
        });
    });
  }
}

function mapStateToProps(state) {
  return {
    settings: state.settings,
    member: state.member,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    rebindTooltips: () => {
      dispatch({ type: 'REBIND_TOOLTIPS' });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Checklists);
