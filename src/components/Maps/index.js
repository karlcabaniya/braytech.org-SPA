import React from 'react';
import { connect } from 'react-redux';
import { debounce } from 'lodash';
import cx from 'classnames';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Map } from 'react-leaflet';

import maps from '../../data/maps';

import * as ls from '../../utils/localStorage';
import { resolveDestination, getMapCenter } from '../../utils/maps';
import { checklists, lookup } from '../../utils/checklists';

import { Layers, BackgroundLayer } from './Layers';
import Loading from './Loading';
import Static from './Nodes/Static';
import Checklists from './Nodes/Checklists';
import Runtime from './Nodes/Runtime';

import Characters from './Controls/Characters';
import Destinations from './Controls/Destinations';
import Inspect from './Controls/Inspect';
import DataLayers from './Controls/DataLayers';

import './styles.css';

class Maps extends React.Component {
  state = {
    loading: true,
    loaded: [],
    error: false,
    viewport: undefined,
    ui: {
      destinations: false,
      characters: false,
      layers: {
        checklists: [
          {
            checklistId: 365218222,
            visible: true,
          },
          {
            checklistId: 655926402,
            visible: true,
          },
          {
            checklistId: 1297424116,
            visible: true,
          },
          {
            checklistId: 1420597821,
            visible: true,
          },
          {
            checklistId: 1697465175,
            visible: true,
          },
          {
            checklistId: 1912364094,
            visible: true,
          },
          {
            checklistId: 2360931290,
            visible: true,
          },
          {
            checklistId: 2474271317,
            visible: true,
          },
          {
            checklistId: 2609997025,
            visible: true,
          },
          {
            checklistId: 2726513366,
            visible: true,
          },
          {
            checklistId: 2955980198,
            visible: true,
          },
          {
            checklistId: 3142056444,
            visible: true,
          },
          {
            checklistId: 3305936921,
            visible: true,
          },
          {
            checklistId: 4178338182,
            visible: true,
          },
          {
            checklistId: 4285512244,
            visible: true,
          },
        ],
      },
      inspect: {
        activityHash: 1375089621
      },
      //inspect: false,
    },
  };

  static getDerivedStateFromProps(p, s) {
    // If viewport defined, skip.
    if (s.viewport) {
      return null;
    }

    // Prepare to define viewport based on props i.e. route params
    const resolved = resolveDestination(p.params.map).id;

    let center = getMapCenter(resolved);
    let zoom = 0;

    if (p.params.highlight) {
      const map = maps[resolved].map;
      const hash = parseInt(p.params.highlight, 10);

      const checklistLookup = lookup({ key: 'checklistHash', value: hash });
      const recordLookup = lookup({ key: 'recordHash', value: hash });

      const entry = (checklistLookup && checklistLookup.checklistId && checklistLookup) || (recordLookup && recordLookup.checklistId && recordLookup);

      const checklist = entry && entry.checklistId && checklists[entry.checklistId]({ requested: entry.recordHash ? { key: 'recordHash', array: [entry.recordHash] } : { key: 'checklistHash', array: [entry.checklistHash] } });
      const checklistItem = checklist && checklist.items && checklist.items.length && checklist.items[0];

      if (checklistItem && checklistItem.points && checklistItem.points.length && checklistItem.points[0]) {
        const markerY = checklistItem.points[0].y || 0;
        const markerX = checklistItem.points[0].x || 0;

        center = [map.height / 2 + markerY, map.width / 2 + markerX];
      }
    }

    // Initially display more on high DPI mobile devices
    if (p.viewport.width <= 600) {
      zoom = -1;
    }

    return {
      viewport: {
        center,
        zoom,
      },
    };
  }

  componentDidMount() {
    this.mounted = true;

    window.scrollTo(0, 0);
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentDidUpdate(p, s) {
    if (p.params.map !== this.props.params.map) {
      this.setDestination(this.props.params.map);
    }

    if (s.ui.inspect !== this.state.ui.inspect) {
      this.props.rebindTooltips();
    }
  }

  setDestination = (destination) => {
    const resolved = resolveDestination(destination);

    if (this.mounted) {
      this.setState((p) => ({
        viewport: {
          ...p.viewport,
          center: getMapCenter(resolved.id),
        },
      }));
    }
  };

  handler_hideInspect = (e) => {
    this.setState((p) => ({
      ui: {
        ...p.ui,
        inspect: false,
      },
    }));
  };

  handler_showInspect = (props) => (e) => {
    this.setState((p) => ({
      ui: {
        ...p.ui,
        inspect: {
          ...props,
        },
      },
    }));
  };

  handler_zoomIncrease = (e) => {
    this.setState((p) => ({
      viewport: {
        ...p.viewport,
        zoom: p.viewport.zoom + 1,
      },
    }));
  };

  handler_zoomDecrease = (e) => {
    this.setState((p) => ({
      viewport: {
        ...p.viewport,
        zoom: p.viewport.zoom - 1,
      },
    }));
  };

  handler_toggleDestinationsList = (e) => {
    const href = e.target.href;
    const id = resolveDestination(this.props.params.map).id;

    if (href.includes(id)) {
      this.setState((p) => {
        if (p.ui.destinations) {
          return {
            ...p,
            ui: {
              ...p.ui,
              destinations: false,
            },
          };
        } else {
          return {
            ...p,
            ui: {
              ...p.ui,
              destinations: true,
            },
          };
        }
      });
    } else {
      this.setState((p) => {
        return {
          ...p,
          ui: {
            ...p.ui,
            destinations: false,
          },
        };
      });
    }
  };

  handler_toggleLayer = (layer) => (e) => {
    this.setState((p) => ({
      ui: {
        ...p.ui,
        layers: {
          ...p.ui.layers,
          ...layer,
        },
      },
    }));
  };

  handler_changeCharacterId = (e) => {
    const characterId = e.currentTarget.dataset.characterid;

    const { member } = this.props;

    if (member.characterId === characterId) {
      this.setState((p) => {
        if (p.ui.characters) {
          return {
            ...p,
            ui: {
              ...p.ui,
              characters: false,
            },
          };
        } else {
          return {
            ...p,
            ui: {
              ...p.ui,
              characters: true,
            },
          };
        }
      });
    } else {
      this.setState((p) => {
        return {
          ...p,
          ui: {
            ...p.ui,
            characters: false,
          },
        };
      });
      this.props.changeCharacterId({ membershipType: member.membershipType, membershipId: member.membershipId, characterId });
      ls.set('setting.profile', { membershipType: member.membershipType, membershipId: member.membershipId, characterId });
    }
  };

  handler_map_layersReady = () => {
    this.setState({ loading: false });
  };

  handler_map_layersPartial = (loaded) => {
    this.setState({ loaded });
  };

  handler_map_layerAdd = debounce((e) => {
    if (this.mounted) this.props.rebindTooltips();
  }, 200);

  handler_map_moveEnd = (e) => {
    if (this.mounted) this.props.rebindTooltips();
  };

  handler_map_zoomEnd = (e) => {
    if (this.mounted) this.props.rebindTooltips();
  };

  handler_map_mouseDown = (e) => {
    if (!this.props.settings.debug || !this.props.settings.logDetails) return;

    const destination = resolveDestination(this.props.params.map).id;

    const map = maps[destination].map;

    let originalX, originalY;

    let offsetX = e.latlng.lng;
    let offsetY = e.latlng.lat;

    let midpointX = map.width / 2;
    let midpointY = map.height / 2;

    if (offsetX > midpointX) {
      originalX = -(midpointX - offsetX);
    } else {
      originalX = offsetX - midpointX;
    }

    if (offsetY > midpointY) {
      originalY = -(midpointY - offsetY);
    } else {
      originalY = offsetY - midpointY;
    }

    console.log(JSON.stringify({ map: { x: originalX, y: originalY } }));
    console.log(JSON.stringify({ x: originalX, y: originalY }));
  };

  handler_map_viewportChanged = (viewport) => {
    if (typeof viewport.zoom === 'number' && viewport.center && viewport.center.length === 2) this.setState({ viewport });
  };

  handler_map_viewportChange = (e) => {
    if (!this.props.settings.debug || !this.props.settings.logDetails) return;

    console.log(e);
  };

  render() {
    const { member, viewport, settings, params } = this.props;

    const destination = resolveDestination(params.map);
    const map = maps[destination.id].map;
    const bounds = [
      [0, 0],
      [map.height, map.width],
    ];

    return (
      <div className={cx('map-omega', `zoom-${this.state.viewport.zoom}`, { loading: this.state.loading, debug: settings.debug, 'highlight-no-screenshot': settings.noScreenshotHighlight })}>
        <div className='leaflet-pane leaflet-background-pane tinted'>
          <BackgroundLayer {...destination} />
        </div>
        <Map viewport={this.state.viewport} minZoom='-2' maxZoom='2' maxBounds={bounds} crs={L.CRS.Simple} attributionControl={false} zoomControl={false} zoomAnimation={false} onViewportChange={this.handler_map_viewportChange} onViewportChanged={this.handler_map_viewportChanged} onLayerAdd={this.handler_map_layerAdd} onMove={this.handler_map_move} onMoveEnd={this.handler_map_moveEnd} onZoomEnd={this.handler_map_zoomEnd} onMouseDown={this.handler_map_mouseDown}>
          <Layers {...destination} ready={this.handler_map_layersReady} partial={this.handler_map_layersPartial} />
          <Static {...destination} handler={this.handler_showInspect} />
          <Checklists {...destination} lists={this.state.ui.layers.checklists} highlight={params.highlight} handler={this.handler_showInspect} />
          <Runtime {...destination} handler={this.handler_showInspect} />
          {/* <CharacterActivities {...destination} /> */}
        </Map>
        <Loading loaded={this.state.loaded} />
        <div className='controls left'>
          <Characters visible={this.state.ui.characters} handler={this.handler_changeCharacterId} />
          <Destinations {...destination} visible={this.state.ui.destinations} handler={this.handler_toggleDestinationsList} />
          <DataLayers {...destination} lists={this.state.ui.layers.checklists} handler={this.handler_toggleLayer} />
        </div>
        {/* {viewport.width > 6000 ? (
          <div className='control zoom visible'>
            <ul className='list'>
              <li className={cx('linked', { disabled: this.state.zoom === 2 })} onClick={this.handler_zoomIncrease}>
                <div className='text'>
                  <i className='segoe-uniE1091' />
                </div>
              </li>
              <li className={cx('linked', { disabled: this.state.zoom === -2 })} onClick={this.handler_zoomDecrease}>
                <div className='text'>
                  <i className='segoe-uniE1081' />
                </div>
              </li>
            </ul>
          </div>
        ) : null} */}
        {viewport.width > 600 && this.state.ui.inspect ? <Inspect {...this.state.ui.inspect} handler={this.handler_hideInspect} /> : null}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
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
    changeCharacterId: (value) => {
      dispatch({ type: 'MEMBER_CHARACTER_SELECT', payload: value });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Maps);
