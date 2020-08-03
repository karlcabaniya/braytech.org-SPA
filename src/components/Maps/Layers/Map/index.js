import React from 'react';
import { ImageOverlay } from 'react-leaflet';

import { destinations } from '../../../../utils/maps';
import maps from '../../../../data/maps';

export default class MapLayer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      error: false,
      destinations: destinations.map((d) => ({ ...d, loading: true, error: false, layers: [] })),
    };
  }

  componentDidMount() {
    this.mounted = true;

    this.prepareLayers(this.props.destinationId);
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentDidUpdate(p, s) {
    if (s.loading && !this.state.loading) {
      this.props.ready();
    }

    if (s.destinations !== this.state.destinations) {
      this.props.partial(this.state.destinations.map((d) => ({ destinationHash: d.destinationHash, loading: d.loading })));
    }
  }

  loadLayers = async (target) => {
    try {
      const layers = await Promise.all(
        maps[target.destinationId].map.layers
          .filter((layer) => layer.type !== 'background')
          .map(async (layer) => {
            if (layer.nodes) {
              await Promise.all(
                layer.nodes.map(async (layer) => {
                  return await fetch(layer.image)
                    .then((r) => {
                      return r.blob();
                    })
                    .then((blob) => {
                      const objectURL = URL.createObjectURL(blob);

                      layer.image = objectURL;
                      return layer;
                    })
                    .catch((e) => {
                      console.log(e);
                    });
                })
              );

              return layer;
            } else {
              return await fetch(layer.image)
                .then((r) => {
                  return r.blob();
                })
                .then((blob) => {
                  const objectURL = URL.createObjectURL(blob);

                  layer.image = objectURL;
                  return layer;
                })
                .catch((e) => {
                  console.log(e);
                });
            }
          })
      );

      if (this.mounted) {
        this.setState((p) => ({
          destinations: p.destinations.map((d) => {
            if (d.destinationHash === target.destinationHash) {
              return {
                ...d,
                loading: false,
                error: false,
                layers,
              };
            } else {
              return d;
            }
          }),
        }));
      }
    } catch (e) {
      console.log(e);

      if (this.mounted) {
        this.setState((p) => ({
          destinations: p.destinations.map((d) => {
            if (d.destinationHash === target.destinationHash) {
              return {
                ...d,
                loading: false,
                error: true,
              };
            } else {
              return d;
            }
          }),
        }));
      }
    }
  };

  prepareLayers = async (destination) => {
    try {
      // await this.loadLayers(this.props.destinationId);

      // if (this.mounted) {
      //   this.setState({ loading: false });
      //   this.props.softReady();
      // };

      await Promise.all(
        this.state.destinations
          .filter((d) => d.loading)
          .map(async (d) => {
            await this.loadLayers(d);
          })
      );

      if (this.mounted) {
        this.setState({ loading: false });
        // this.props.ready();
      }

      // console.log('done');
    } catch (e) {
      console.log(e);

      if (this.mounted) this.setState({ loading: false, error: true });
    }
  };

  render() {
    if (this.state.loading || this.state.error) {
      return null;
    } else {
      const map = maps[this.props.destinationId].map;

      const viewWidth = 1920;
      const viewHeight = 1080;

      const mapXOffset = (map.width - viewWidth) / 2;
      const mapYOffset = -(map.height - viewHeight) / 2;

      const destination = this.state.destinations.find((d) => d.destinationHash === this.props.destinationHash);

      return destination.layers
        .filter((layer) => layer.type === 'map')
        .map((layer) => {
          const layerX = layer.x ? layer.x : 0;
          const layerY = layer.y ? -layer.y : 0;

          const layerWidth = layer.width * 1;
          const layerHeight = layer.height * 1;

          let offsetX = (map.width - layerWidth) / 2;
          let offsetY = (map.height - layerHeight) / 2;

          offsetX += -offsetX + layerX + mapXOffset;
          offsetY += offsetY + layerY + mapYOffset;

          const bounds = [
            [offsetY, offsetX],
            [layerHeight + offsetY, layerWidth + offsetX],
          ];

          if (layer.nodes) {
            return layer.nodes.map((node) => {
              const nodeX = node.x ? node.x : 0;
              const nodeY = node.y ? node.y : 0;

              const nodeWidth = node.width * 1;
              const nodeHeight = node.height * 1;

              const nodeOffsetY = offsetY + (layerHeight - nodeHeight) / 2 + nodeY;
              const nodeOffsetX = offsetX + (layerWidth - nodeWidth) / 2 + nodeX;

              const bounds = [
                [nodeOffsetY, nodeOffsetX],
                [nodeHeight + nodeOffsetY, nodeWidth + nodeOffsetX],
              ];

              return <ImageOverlay key={node.id} url={node.image} bounds={bounds} opacity={node.opacity || 1} />;
            });
          } else {
            return <ImageOverlay key={layer.id} url={layer.image} bounds={bounds} opacity={layer.opacity || 1} />;
          }
        });
    }
  }
}
