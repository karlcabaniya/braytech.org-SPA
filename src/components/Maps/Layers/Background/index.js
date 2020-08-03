import React from 'react';
import cx from 'classnames';

import maps from '../../../../data/maps';

import './styles.css';

export default class BackgroundLayer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      error: false,
      layers: [
        {
          id: 'background-upper',
          blob: false,
        },
        {
          id: 'background-lower',
          blob: false,
        },
      ],
    };
  }

  componentDidMount() {
    this.mounted = true;

    this.init();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentDidUpdate(p) {
    if (p.destinationId !== this.props.destinationId) {
      this.init();
    }
  }

  load = async (layers) => {
    try {
      const loaded = await Promise.all(
        layers.map(async (layer) => {
          return await fetch(layer.image)
            .then((r) => {
              return r.blob();
            })
            .then((blob) => {
              const objectURL = URL.createObjectURL(blob);

              layer.blob = objectURL;

              return {
                ...layer,
              };
            })
            .catch((e) => {
              console.log(e);
            });
        })
      );

      return loaded;
    } catch (e) {
      console.log(e);
    }
  };

  tint = async (layers) => {
    try {
      const tinted = await Promise.all(
        layers.map(async (layer) => {
          if (layer.color) {
            const image = document.createElement('img');
            image.src = layer.blob;

            await new Promise((resolve) => {
              image.onload = (e) => resolve();
            });

            const canvas = document.createElement('canvas');
            canvas.width = layer.width;
            canvas.height = layer.height;
            const context = canvas.getContext('2d');

            context.fillStyle = layer.color;
            context.fillRect(0, 0, layer.width, layer.height);

            context.globalCompositeOperation = 'destination-atop';
            context.drawImage(image, 0, 0, layer.width, layer.height);

            layer.tinted = canvas.toDataURL();

            return layer;
          } else {
            return layer;
          }
        })
      );

      return tinted;
    } catch (e) {
      console.log(e);
    }
  };

  init = async () => {
    try {
      if (!maps[this.props.destinationId].map.layers.filter(l => l.type === 'background').length) return;

      this.setState({ loading: true, error: false });

      const layers = this.state.layers.map((layer) => ({
        ...layer,
        ...maps[this.props.destinationId].map.layers.find((l) => l.id === layer.id),
      }));

      // console.log(layers)

      const blobs = (layers.filter((l) => l.blob).length < 2 && (await this.load(layers))) || layers;
      const tinted = blobs && (await this.tint(blobs));

      if (this.mounted) {
        this.setState((p) => ({
          ...p,
          loading: false,
          error: false,
          layers: tinted,
        }));
      }

      // console.log('background layers composited');
    } catch (e) {
      console.log(e);

      this.setState({ loading: false, error: true });
    }
  };

  render() {
    const map = maps[this.props.destinationId].map;

    if (this.state.loading || this.state.error) {
      return map.layers
        .filter((layer) => layer.type === 'background')
        .map((l) => {
          return <img key={`${this.props.destinationId}_${l.id}`} alt={l.id} className={cx('layer-background', `layer-${l.id}`, { 'interaction-none': true })} />;
        });
    } else {
      return map.layers
        .filter((layer) => layer.type === 'background')
        .map((l) => {
          const layer = this.state.layers.find((layer) => layer.id === l.id);

          return <img key={`${this.props.destinationId}_${l.id}`} alt={l.id} src={layer.tinted} className={cx('layer-background', `layer-${l.id}`, 'dl', { 'interaction-none': true })} />;
        });
    }
  }
}
