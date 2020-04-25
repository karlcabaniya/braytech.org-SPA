import React from 'react';
import { connect } from 'react-redux';
import { Marker } from 'react-leaflet';

import checklists from '../../../utils/checklists';
import { cartographer } from '../../../utils/maps';
import maps from '../../../data/maps';

import * as marker from '../markers';

class Checklists extends React.Component {
  state = {};

  static getDerivedStateFromProps(p, s) {
    if (!s.lists) {
      return {
        lists: p.lists,
      };
    }

    return null;
  }

  componentDidMount() {
    this.mounted = true;

    this.generateChecklists();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentDidUpdate(p, s) {
    if (this.mounted && (p.member.updated !== this.props.member.updated || p.member.characterId !== this.props.member.characterId)) {
      this.generateChecklists();
    }

    if (this.mounted && s.lists !== this.state.lists) {
      this.props.rebindTooltips();
    }
  }

  generateChecklists = () => {
    const recordLists = [1420597821, 3305936921, 655926402, 4285512244, 2474271317];

    const lists = this.state.lists.map((list, l) => {
      const checklist = checklists[list.checklistId]();

      const useRecordHash = recordLists.indexOf(list.checklistId) > -1;

      return {
        ...checklist,
        tooltipType: list.checklistId === 4178338182 ? 'activity' : useRecordHash ? 'record' : 'checklist',
        items: checklist.items.map((i) => {
          const node = useRecordHash ? cartographer({ key: 'recordHash', value: i.recordHash }) : cartographer({ key: 'checklistHash', value: i.checklistHash });

          return {
            ...i,
            tooltipHash: list.checklistId === 4178338182 ? i.activityHash : useRecordHash ? i.recordHash : i.checklistHash,
            screenshot: Boolean(node?.screenshot),
          };
        }),
      };
    });

    // console.log(lists);

    this.setState({
      lists,
    });
  };

  handler_markerMouseOver = (e) => {
    if (!this.props.settings.debug || !this.props.settings.logDetails) return;

    const dataset = e.target?._icon?.children?.[0]?.children?.[0]?.dataset;

    const node = dataset.hash && cartographer({ key: dataset.type === 'activity' ? 'activityHash' : dataset.type === 'record' ? 'recordHash' : 'checklistHash', value: dataset.hash });

    // console.log(node);
  };

  render() {
    const map = maps[this.props.id].map;
    const highlight = this.props.highlight && +this.props.highlight;

    const viewWidth = 1920;
    const viewHeight = 1080;

    const mapYOffset = -(map.height - viewHeight) / 2;
    const mapXOffset = (map.width - viewWidth) / 2;

    return this.state.lists.map((list, l) => {
      const visible = this.props.lists.find((l) => l.checklistId === list.checklistId);

      if (!visible || !list.items) return null;

      return list.items
        .filter((node) => node.destinationHash === maps[this.props.id].destination.hash)
        .filter((node) => (node.invisible && !this.props.settings.debug ? false : true))
        .map((node, i) => {
          const selected = this.props.selected.checklistHash ?
            this.props.selected.checklistHash === node.checklistHash ? true : false :
              this.props.selected.recordHash !== undefined && this.props.selected.recordHash === node.recordHash ? true : false;

          if (node.map.points.length) {
            return node.map.points.map((point) => {
              const markerOffsetY = mapYOffset + map.height + -viewHeight / 2;
              const markerOffsetX = mapXOffset + viewWidth / 2;

              if (!point.x || !point.y) {
                console.warn(node);

                return null;
              }

              const offsetY = markerOffsetY + point.y;
              const offsetX = markerOffsetX + point.x;

              // const text = checklist.checklistId === 3142056444 ? node.displayProperties.name : false;

              const icon = marker.icon({ hash: node.tooltipHash, type: list.tooltipType }, [
                `checklistId-${list.checklistId}`,
                node.completed ? 'completed' : '',
                node.bubbleHash && !Number.isInteger(node.bubbleHash) ? `error` : '',
                node.screenshot ? `has-screenshot` : '',
                highlight === (node.checklistHash || node.recordHash) ? 'highlight' : '',
              ], { icon: list.checklistIcon, url: list.checklistImage, selected });
              // const icon = marker.text(['debug'], `${checklist.name}: ${node.name}`);

              return <Marker key={`${node.checklistHash || node.recordHash}-${i}`} position={[offsetY, offsetX]} icon={icon} onMouseOver={(this.props.settings.debug && this.handler_markerMouseOver) || null} onClick={this.props.handler({ checklistHash: node.checklistHash, recordHash: node.recordHash })} />;
            });
          } else if (this.props.settings.debug) {
            const markerOffsetY = mapYOffset + map.height + -viewHeight / 2;
            const markerOffsetX = mapXOffset + viewWidth / 2;

            const offsetY = markerOffsetY + (l + 1) * 30 - map.height / 3;
            const offsetX = markerOffsetX + (i + 1) * 50 - map.width / 2;

            // const text = checklist.checklistId === 3142056444 ? node.displayProperties.name : false;

            const icon = marker.icon({ hash: node.tooltipHash, type: list.tooltipType }, [
              'error',
              node.completed ? 'completed' : '',
              `checklistId-${list.checklistId}`,
              node.screenshot ? `has-screenshot` : '',
              highlight === (node.checklistHash || node.recordHash) ? 'highlight' : '',
            ], { icon: list.checklistIcon, url: list.checklistImage, selected });

            return <Marker key={`${node.checklistHash || node.recordHash}-${i}`} position={[offsetY, offsetX]} icon={icon} onMouseOver={(this.props.settings.debug && this.handler_markerMouseOver) || null} onClick={this.props.handler({ checklistHash: node.checklistHash, recordHash: node.recordHash })} />;
          } else {
            return null;
          }
        });
    });
  }
}

function mapStateToProps(state) {
  return {
    member: state.member,
    collectibles: state.collectibles,
    viewport: state.viewport,
    settings: state.maps,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    rebindTooltips: (value) => {
      dispatch({ type: 'REBIND_TOOLTIPS', payload: new Date().getTime() });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Checklists);
