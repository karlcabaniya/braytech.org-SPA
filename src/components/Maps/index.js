import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import cx from 'classnames';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Map } from 'react-leaflet';

import maps from '../../data/maps';

import actions from '../../store/actions';
import { resolveMap, getMapCenter } from '../../utils/maps';
import { checklists, checkup } from '../../utils/checklists';

import MapLayer from './Layers/Map';
import BackgroundLayer from './Layers/Background';
import CloudLayer from './Layers/Cloud';
import Loading from './Loading';
import Static from './Nodes/Static';
import Borders from './Nodes/Borders';
import Checklists from './Nodes/Checklists';
import Runtime from './Nodes/Runtime';
import Speciality from './Nodes/Specialty';
// import Graphs from './Graphs';

import Characters from './Controls/Characters';
import ProfileState from './Controls/ProfileState';
import Destinations from './Controls/Destinations';
import Zoom from './Controls/Zoom';
import Settings from './Controls/Settings';
import Inspect from './Controls/Inspect';
import Surveyor from './Controls/Surveyor';

import './styles.css';
import { useParams } from 'react-router-dom';

function getViewport(viewport, params) {
  const { destinationId, destinationHash } = resolveMap(params.map);

  let center = getMapCenter(destinationId);
  let zoom = 0;

  if (params.highlight) {
    const checklistLookup = checkup({ key: 'checklistHash', value: +params.highlight });
    const recordLookup = checkup({ key: 'recordHash', value: +params.highlight });

    const entry = (checklistLookup?.checklistId && checklistLookup) || (recordLookup?.checklistId && recordLookup);

    const checklist = entry?.checklistId && checklists[entry.checklistId]({ requested: entry.recordHash ? { key: 'recordHash', array: [entry.recordHash] } : { key: 'checklistHash', array: [entry.checklistHash] } });
    const checklistItem = checklist?.items?.length && checklist.items[0];

    if (checklistItem?.map?.points?.[0] && checklistItem?.destinationHash === destinationHash) {
      const markerY = checklistItem.map.points[0].y || 0;
      const markerX = checklistItem.map.points[0].x || 0;

      center = [maps[destinationId].map.height / 2 + markerY, maps[destinationId].map.width / 2 + markerX];
    }
  }

  // Initially display more on high DPI mobile devices
  if (viewport.width <= 600) {
    zoom = -1;
  }

  return {
    destinationHash,
    zoom,
    center,
  };
}

export default function Maps() {
  const settings = useSelector((state) => state.settings);
  const viewport = useSelector((state) => state.viewport);
  const params = useParams();
  const dispatch = useDispatch();

  // map state
  const [mapState, setMapState] = useState({
    loading: true,
    loaded: [],
    error: false,
  });

  // viewport state
  const [viewportState, setViewportState] = useState(() => getViewport(viewport, params));

  // controls state
  const [controlsState, setControlsState] = useState({
    inspect: false,
    debug: {
      clicked: {},
    },
  });

  useEffect(() => {
    window.scrollTo(0, 0);

    dispatch(actions.theme.scrollbars('dark'));

    return () => {
      dispatch(actions.theme.scrollbars());
    };
  }, [dispatch]);

  useEffect(() => {
    const { destinationId, destinationHash } = resolveMap(params.map);

    if (viewportState.destinationHash !== destinationHash) {
      console.log('Map change');

      const { center } = getViewport(viewport, params);

      setViewportState((state) => ({
        ...state,
        center,
      }));
    }
  }, [params.map]);

  useEffect(() => {
    dispatch(actions.tooltips.rebind());
  }, [
    dispatch,
    params,
    mapState.loading, // map loading
    controlsState.inspect, // inspect
    viewportState,
  ]);

  const handler_hideInspect = (e) => {
    setControlsState((state) => ({
      ...state,
      inspect: false,
    }));
  };

  const handler_showInspect = (props) => (e) => {
    if (viewport.width > 600) {
      setControlsState((state) => ({
        ...state,
        inspect: props,
      }));
    }
  };

  const handler_zoomIncrease = (e) => {
    setViewportState((state) => ({
      ...state,
      zoom: state.zoom + 1,
    }));
  };

  const handler_zoomDecrease = (e) => {
    setViewportState((state) => ({
      ...state,
      zoom: state.zoom - 1,
    }));
  };

  const handler_map_layersReady = () => {
    setMapState((state) => ({ ...state, loading: false }));
  };

  const handler_map_layersPartial = (loaded) => {
    setMapState((state) => ({ ...state, loaded }));
  };

  const handler_map_layerAdd = (e) => {};

  const handler_map_move = (e) => { };

  const handler_map_moveEnd = (e) => {
    // if (this.mounted) this.props.rebindTooltips();
  };

  const handler_map_zoomEnd = (e) => {
    // if (this.mounted) this.props.rebindTooltips();
  };

  // const [clicks, setClicks] = useState([]);

  const handler_map_mouseDown = (e) => {
    if (!settings.maps.debug || !settings.maps.logDetails) return;

    const destination = resolveMap(params.map);

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

    // console.log(JSON.stringify({ x: originalX, y: originalY }));

    // this.setState({
    //   debug: {
    //     clicked: {
    //       x: originalX,
    //       y: originalY,
    //       destinationHash: destination.destinationHash,
    //     },
    //   },
    // });

    // setClicks((state) => [...state, [originalX, originalY]])
    
  };

  const handler_map_viewportChanged = (viewport) => {
    if (typeof viewport.zoom === 'number') {
      setViewportState((state) => ({ ...state, zoom: viewport.zoom }));
    }
  };

  const handler_map_viewportChange = (e) => {
    if (!settings.maps.debug || !settings.maps.logDetails) return;

    // console.log(e);
  };

  const destination = resolveMap(params.map);
  const map = maps[destination.destinationId].map;
  const bounds = [
    [0, 0],
    [map.height, map.width],
  ];

  return (
    <div className={cx('map-omega', `zoom-${viewportState.zoom}`, { loading: mapState.loading, debug: settings.maps.debug, 'highlight-no-screenshot': settings.maps.noScreenshotHighlight })}>
      <div className='leaflet-pane leaflet-background-pane tinted'>
        <BackgroundLayer {...destination} />
      </div>
      <Map
        // Hello from Seattle
        center={viewportState.center}
        zoom={viewportState.zoom}
        minZoom='-2'
        maxZoom='2'
        maxBounds={bounds}
        crs={L.CRS.Simple}
        attributionControl={false}
        zoomControl={false}
        zoomAnimation={false}
        onViewportChange={handler_map_viewportChange}
        onViewportChanged={handler_map_viewportChanged}
        onLayerAdd={handler_map_layerAdd}
        // onMove={handler_map_move}
        onMoveEnd={handler_map_moveEnd}
        onZoomEnd={handler_map_zoomEnd}
        onMouseDown={handler_map_mouseDown}
      >
        {/* the Maps */}
        <MapLayer {...destination} ready={handler_map_layersReady} partial={handler_map_layersPartial} />
        {/* Text nodes, fast travels, vendors, dungeons, ascendant challenges, forges, portals */}
        <Static {...destination} selected={controlsState.inspect} handler={handler_showInspect} />
        {/* <Borders {...destination} debug={clicks} /> */}
        {/* Checklists... */}
        <Checklists {...destination} selected={controlsState.inspect} handler={handler_showInspect} />
        {/* Dynamic nodes i.e. those that are bound to weekly cycles */}
        <Runtime {...destination} selected={controlsState.inspect} handler={handler_showInspect} />
        {/* Latent memory fragments on Mars, etc. */}
        <Speciality handler={handler_showInspect} />
        {/* Unique graphs */}
        {/* <Graphs {...destination} /> */}
        {/* <CloudLayer {...destination} /> */}
      </Map>
      <Loading loaded={mapState.loaded} />
      {viewport.width > 1024 ? <Zoom increase={handler_zoomIncrease} decrease={handler_zoomDecrease} now={viewportState.zoom} /> : null}
      {viewport.width > 600 && controlsState.inspect ? <Inspect {...controlsState.inspect} handler={handler_hideInspect} /> : null}
      <div className='controls left'>
        {viewport.width > 600 ? <ProfileState /> : null}
        <Characters />
        <div className='coupled'>
          <Destinations {...destination} />
          <Settings />
        </div>
        {viewport.width > 600 && settings.maps.debug && <Surveyor {...controlsState.debug} />}
      </div>
    </div>
  );
}
