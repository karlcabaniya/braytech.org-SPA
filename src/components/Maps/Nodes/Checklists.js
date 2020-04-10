import React from 'react';
import { connect } from 'react-redux';
import { Marker } from 'react-leaflet';

import checklists from '../../../utils/checklists';
import { cartographer } from '../../../utils/maps';
import maps from '../../../data/maps';

import * as marker from '../markers';

class Checklists extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      checklists: {
        1697465175: {
          // region chests
          visible: true
        },
        3142056444: {
          // lost sectors
          visible: true
        },
        4178338182: {
          // adventures
          visible: true
        },
        2360931290: {
          // ghost scans
          visible: true
        },
        365218222: {
          // sleeper nodes
          visible: true
        },
        2955980198: {
          // latent memories
          visible: true
        },
        1297424116: {
          // ahamkara bones
          visible: true
        },
        2609997025: {
          // corrupted eggs
          visible: true
        },
        2726513366: {
          // cat statues
          visible: true
        },
        1912364094: {
          // jade rabbits
          visible: true
        },
        1420597821: {
          // lore: ghost stories
          visible: true
        },
        3305936921: {
          // lore: awoken of the reef
          visible: true
        },
        655926402: {
          // lore: forsaken prince
          visible: true
        },
        4285512244: {
          // lore: lunas lost
          visible: true
        },
        2474271317: {
          // lore: inquisition of the damned
          visible: true
        }
      }
    };
  }

  componentDidMount() {
    this.mounted = true;

    this.generateChecklists(this.id);
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentDidUpdate(p, s) {
    if (this.mounted && (p.member.updated !== this.props.member.updated || p.member.characterId !== this.props.member.characterId)) {
      this.generateChecklists(this.state.id);
    }

    if (this.mounted && s.checklists !== this.state.checklists) {
      this.props.rebindTooltips();
    }
  }

  generateChecklists = destination => {
    const lists = {
      1697465175: {
        // region chests
        ...checklists[1697465175]()
      },
      3142056444: {
        // lost sectors
        ...checklists[3142056444]()
      },
      4178338182: {
        // adventures
        ...checklists[4178338182]()
      },
      2360931290: {
        // ghost scans
        ...checklists[2360931290]()
      },
      365218222: {
        // sleeper nodes
        ...checklists[365218222]()
      },
      2955980198: {
        // latent memories
        ...checklists[2955980198]()
      },
      1297424116: {
        // ahamkara bones
        ...checklists[1297424116]()
      },
      2609997025: {
        // corrupted eggs
        ...checklists[2609997025]()
      },
      2726513366: {
        // cat statues
        ...checklists[2726513366]()
      },
      1912364094: {
        // jade rabbits
        ...checklists[1912364094]()
      },
      1420597821: {
        // lore: ghost stories
        ...checklists[1420597821]()
      },
      3305936921: {
        // lore: awoken of the reef
        ...checklists[3305936921]()
      },
      655926402: {
        // lore: forsaken prince
        ...checklists[655926402]()
      },
      4285512244: {
        // lore: lunas lost
        ...checklists[4285512244]()
      },
      2474271317: {
        // lore: inquisition of the damned
        ...checklists[2474271317]()
      }
    };

    const recordLists = [1420597821, 3305936921, 655926402, 4285512244, 2474271317];

    Object.keys(lists).forEach(key => {
      const checklistId = +key;
      const list = lists[checklistId];

      const useRecordHash = recordLists.indexOf(checklistId) > -1;

      const adjusted = {
        ...list,
        visible: this.state.checklists[checklistId].visible,
        tooltipType: checklistId === 4178338182 ? 'activity' : useRecordHash ? 'record' : 'checklist',
        items: list.items.map(i => {
          const node = useRecordHash ? cartographer({ key: 'recordHash', value: i.recordHash }) : cartographer({ key: 'checklistHash', value: i.checklistHash });

          return {
            ...i,
            tooltipHash: checklistId === 4178338182 ? i.activityHash : useRecordHash ? i.recordHash : i.checklistHash,
            screenshot: Boolean(node?.screenshot)
          };
        })
      };

      lists[key] = adjusted;
    });

    console.log(lists);

    this.setState({
      checklists: lists
    });
  };

  handler_markerMouseOver = e => {
    if (!this.props.settings.debug || !this.props.settings.logDetails) return;

    const dataset = e.target?._icon?.children?.[0]?.children?.[0]?.dataset;

    const node = dataset.hash && cartographer({ key: dataset.type === 'activity' ? 'activityHash' : dataset.type === 'record' ? 'recordHash' : 'checklistHash', value: dataset.hash })

    console.log(node);
  };

  render() {
    const map = maps[this.props.id].map;
    const highlight = this.props.highlight && +this.props.highlight;

    const viewWidth = 1920;
    const viewHeight = 1080;

    const mapYOffset = -(map.height - viewHeight) / 2;
    const mapXOffset = (map.width - viewWidth) / 2;

    return Object.keys(this.state.checklists).map((key, k) => {
      const checklist = this.state.checklists[key];

      if (!checklist.visible || !checklist.items) return null;

      return checklist.items
        .filter(node => node.destinationHash === maps[this.props.id].destination.hash)
        .filter(node => node.invisible && !this.props.settings.debug ? false : true)
        .map((node, i) => {
          if (node.points.length) {
            return node.points.map(point => {
              const markerOffsetY = mapYOffset + map.height + -viewHeight / 2;
              const markerOffsetX = mapXOffset + viewWidth / 2;

              if (!point.x || !point.y) {
                console.warn(node);

                return null;
              }

              const offsetY = markerOffsetY + point.y;
              const offsetX = markerOffsetX + point.x;

              // const text = checklist.checklistId === 3142056444 ? node.formatted.name : false;

              const icon = marker.icon({ hash: node.tooltipHash, type: checklist.tooltipType }, [node.completed ? 'completed' : '', `checklistId-${checklist.checklistId}`, node.screenshot ? `has-screenshot` : '', highlight === (node.checklistHash || node.recordHash) ? 'highlight' : ''], { icon: checklist.checklistIcon, url: checklist.checklistImage });
              // const icon = marker.text(['debug'], `${checklist.name}: ${node.name}`);

              return <Marker key={`${node.checklistHash || node.recordHash}-${i}`} position={[offsetY, offsetX]} icon={icon} onMouseOver={(this.props.settings.debug && this.handler_markerMouseOver) || null} onClick={this.props.handler({ checklistId: checklist.checklistId, checklistHash: node.checklistHash, recordHash: node.recordHash })} />;
            });
          } else if (this.props.settings.debug) {
            const markerOffsetY = mapYOffset + map.height + -viewHeight / 2;
            const markerOffsetX = mapXOffset + viewWidth / 2;

            const offsetY = markerOffsetY + (k + 1) * 30 - 1250;
            const offsetX = markerOffsetX + (i + 1) * 50 - 0;

            // const text = checklist.checklistId === 3142056444 ? node.formatted.name : false;

            const icon = marker.icon({ hash: node.tooltipHash, type: checklist.tooltipType }, [node.completed ? 'completed' : '', `checklistId-${checklist.checklistId}`, node.screenshot ? `has-screenshot` : ''], { icon: checklist.checklistIcon, url: checklist.checklistImage });
            // const icon = marker.text(['debug'], `${checklist.name}: ${node.name}`);

            return <Marker key={`${node.checklistHash}-${i}`} position={[offsetY, offsetX]} icon={icon} onMouseOver={(this.props.settings.debug && this.handler_markerMouseOver) || null} />;
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
    settings: state.maps
  };
}

function mapDispatchToProps(dispatch) {
  return {
    rebindTooltips: value => {
      dispatch({ type: 'REBIND_TOOLTIPS', payload: new Date().getTime() });
    }
  };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(Checklists);
