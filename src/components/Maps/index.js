import React from 'react';
import { connect } from 'react-redux';
import { debounce } from 'lodash';
import cx from 'classnames';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Map } from 'react-leaflet';

import maps from '../../data/maps';

import { resolveMap, getMapCenter } from '../../utils/maps';
import { checklists, checkup } from '../../utils/checklists';

import { Layers, BackgroundLayer } from './Layers';
import Loading from './Loading';
import Static from './Nodes/Static';
import Checklists from './Nodes/Checklists';
import Runtime from './Nodes/Runtime';
import Speciality from './Nodes/Speciality';
import Graphs from './Graphs';

import Characters from './Controls/Characters';
import ProfileState from './Controls/ProfileState';
import Destinations from './Controls/Destinations';
import Settings from './Controls/Settings';
import Inspect from './Controls/Inspect';
import Surveyor from './Controls/Surveyor';
// import DataLayers from './Controls/DataLayers';

import './styles.css';

class Maps extends React.Component {
  state = {
    loading: true,
    loaded: [],
    error: false,
    viewport: undefined,
    ui: {
      inspect: false,
    },
    debug: {
      clicked: {},
    },
  };

  static getDerivedStateFromProps(p, s) {
    // If viewport defined, skip.
    if (s.viewport) {
      return null;
    }

    // Prepare to define viewport based on props i.e. route params
    const resolved = resolveMap(p.params.map).destinationId;

    let center = getMapCenter(resolved);
    let zoom = 0;

    if (p.params.highlight) {
      const map = maps[resolved].map;
      const destination = maps[resolved].destination;
      const hash = +p.params.highlight;

      const checklistLookup = checkup({ key: 'checklistHash', value: hash });
      const recordLookup = checkup({ key: 'recordHash', value: hash });

      const entry = (checklistLookup?.checklistId && checklistLookup) || (recordLookup?.checklistId && recordLookup);

      const checklist = entry?.checklistId && checklists[entry.checklistId]({ requested: entry.recordHash ? { key: 'recordHash', array: [entry.recordHash] } : { key: 'checklistHash', array: [entry.checklistHash] } });
      const checklistItem = checklist?.items?.length && checklist.items[0];

      if (checklistItem?.map?.points?.[0] && checklistItem?.destinationHash === destination.hash) {
        const markerY = checklistItem.map.points[0].y || 0;
        const markerX = checklistItem.map.points[0].x || 0;

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

    this.props.setScrollbars('dark');
  }

  componentWillUnmount() {
    this.mounted = false;

    this.props.setScrollbars();
  }

  componentDidUpdate(p, s) {
    if (p.params.map !== this.props.params.map) {
      this.setDestination(this.props.params.map);
    }

    // if (s.ui.inspect !== this.state.ui.inspect) {
    //   this.props.rebindTooltips();
    // }
  }

  setDestination = (destination) => {
    const resolved = resolveMap(destination);

    if (this.mounted) {
      this.setState((state) => ({
        viewport: {
          ...state.viewport,
          center: getMapCenter(resolved.destinationId),
        },
      }));
    }
  };

  handler_hideInspect = (e) => {
    this.setState((state) => ({
      ui: {
        ...state.ui,
        inspect: false,
      },
    }));
  };

  handler_showInspect = (props) => (e) => {
    if (this.props.viewport.width > 600) {
      this.setState((state) => ({
        ui: {
          ...state.ui,
          inspect: {
            ...props,
          },
        },
      }));
    }
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
    if (!this.props.settings.maps.debug || !this.props.settings.maps.logDetails) return;

    const destination = resolveMap(this.props.params.map);

    const map = maps[destination.destinationId].map;

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

    console.log(JSON.stringify({ x: originalX, y: originalY }));

    this.setState({
      debug: {
        clicked: {
          x: originalX,
          y: originalY,
          destinationHash: destination.destinationHash,
        },
      },
    });
  };

  handler_map_viewportChanged = (viewport) => {
    // if (typeof viewport.zoom === 'number' && viewport.center && viewport.center.length === 2) this.setState({ viewport });
    if (typeof viewport.zoom === 'number') this.setState((p) => ({ viewport: { ...p.viewport, zoom: viewport.zoom } }));
  };

  handler_map_viewportChange = (e) => {
    if (!this.props.settings.maps.debug || !this.props.settings.maps.logDetails) return;

    // console.log(e);
  };

  render() {
    const { viewport, settings, params } = this.props;

    const destination = resolveMap(params.map);
    const map = maps[destination.destinationId].map;
    const bounds = [
      [0, 0],
      [map.height, map.width],
    ];

    return (
      <div className={cx('map-omega', `zoom-${this.state.viewport.zoom}`, { loading: this.state.loading, debug: settings.maps.debug, 'highlight-no-screenshot': settings.maps.noScreenshotHighlight })}>
        <div className='leaflet-pane leaflet-background-pane tinted'>
          <BackgroundLayer {...destination} />
        </div>
        <Map center={this.state.viewport.center} zoom={this.state.viewport.zoom} minZoom='-2' maxZoom='2' maxBounds={bounds} crs={L.CRS.Simple} attributionControl={false} zoomControl={false} zoomAnimation={false} onViewportChange={this.handler_map_viewportChange} onViewportChanged={this.handler_map_viewportChanged} onLayerAdd={this.handler_map_layerAdd} onMove={this.handler_map_move} onMoveEnd={this.handler_map_moveEnd} onZoomEnd={this.handler_map_zoomEnd} onMouseDown={this.handler_map_mouseDown}>
          {/* the Maps */}
          <Layers {...destination} ready={this.handler_map_layersReady} partial={this.handler_map_layersPartial} />
          {/* Text nodes, fast travels, vendors, dungeons, ascendant challenges, forges, portals */}
          <Static {...destination} selected={this.state.ui.inspect} handler={this.handler_showInspect} />
          {/* Checklists... */}
          <Checklists {...destination} highlight={params.highlight} selected={this.state.ui.inspect} handler={this.handler_showInspect} />
          {/* Dynamic nodes i.e. those that are bound to weekly cycles */}
          <Runtime {...destination} selected={this.state.ui.inspect} handler={this.handler_showInspect} />
          {/* Latent memory fragments on Mars, etc. */}
          <Speciality {...destination} selected={this.state.ui.inspect} handler={this.handler_showInspect} />
          {/* Unique graphs */}
          <Graphs {...destination} />
        </Map>
        <Loading loaded={this.state.loaded} />
        <div className='controls left'>
          {viewport.width > 600 ? <ProfileState /> : null}
          <Characters />
          <div className='coupled'>
            <Destinations {...destination} />
            <Settings />
          </div>
          {viewport.width > 600 && 1 === 2 && settings.maps.debug && <Surveyor {...this.state.debug} />}
          {/* <DataLayers {...destination} /> */}
        </div>
        {viewport.width > 600 && this.state.ui.inspect ? <Inspect {...this.state.ui.inspect} handler={this.handler_hideInspect} /> : null}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    settings: state.settings,
    viewport: state.viewport,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    rebindTooltips: () => {
      dispatch({ type: 'REBIND_TOOLTIPS' });
    },
    setScrollbars: (payload) => {
      dispatch({ type: 'SET_SCROLLBARS', payload });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Maps);
