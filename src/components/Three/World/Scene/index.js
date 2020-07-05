import React, { Component } from 'react';
import * as THREE from 'three';

import Spinner from '../../../UI/Spinner';

import './styles.css';

// const node = {
//   type: 'model',
//   x: 0,
//   y: -3,
//   width: 216,
//   height: 216,
//   rotation: { x: 0, y: 0, z: 0 },
//   textures: {
//     map: {
//       width: 211,
//       height: 211,
//       repeat: { s: 2, t: 1 },
//       image: '/static/images/extracts/maps/director/io/02af-00000201_1.png',
//     },
//   },
//   light: 'right',
//   speed: 0.7,
// };

const node = {
  type: 'model',
  y: 2,
  width: 320,
  height: 320,
  textures: {
    map: {
      width: 648,
      height: 324,
      opacity: 1,
      image: '/static/images/extracts/maps/director/earth/01A3-0743.png',
    },
    overlay: {
      width: 345,
      height: 345,
      repeat: { s: 2, t: 1 },
      image: '/static/images/extracts/maps/director/earth/01a3-00000836_1.png',
    },
  },
  light: 'top',
  speed: -1,
};

class Scene extends Component {
  state = {
    loading: true,
    error: false,
  };

  ref_mount = React.createRef();

  componentDidMount() {
    this.scene();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize, false);

    this.stop();

    this.ref_mount.current.removeChild(this.renderer.domElement);
  }

  scene = async () => {
    const { threeDebug: debug, shadows } = this.props;

    const lightShadows = {
      enabled: shadows,
      type: THREE.PCFSoftShadowMap,
      mapSize: {
        width: 1024,
        height: 1024,
      },
      radius: 2,
    };

    const width = 320;
    const height = 320;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);
    this.renderer.shadowMap.enabled = lightShadows.enabled;
    this.renderer.shadowMap.type = lightShadows.type;

    this.clock = new THREE.Clock();
    this.time = 0;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(30, width / height, 1, 2000);

    this.camera.position.set(0, 0, 100);

    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    this.group = new THREE.Group();

    this.scene.add(this.group);

    this.ref_mount.current.appendChild(this.renderer.domElement);

    window.addEventListener('resize', this.handleResize, false);

    this.start();

    Object.keys(node.textures).forEach((key) => {
      const map = node.textures[key];

      const loader = new THREE.TextureLoader();
      loader.load(map.image, (texture) => {
        const repeat = map.repeat ? map.repeat : { s: 1, t: 1 };

        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(repeat.s, repeat.t);

        const geometry = new THREE.SphereGeometry(25, 32, 32);
        const material = new THREE.MeshPhongMaterial({
          color: map.color ? map.color : 0xffffffff,
        });
        material.map = texture;
        //material.side = THREE.DoubleSide;
        material.transparent = true;
        material.shininess = 0;
        //material.specular = new THREE.Color(0xffffffff);
        if (map.opacity) material.opacity = map.opacity;

        var mesh = new THREE.Mesh(geometry, material);
        mesh.renderOrder = key == 'overlay' ? 1 : 0.5;

        if (node.rotation) {
          //console.log('Rotation', node.rotation);
          mesh.rotation.x = (node.rotation.x * Math.PI) / 180;
          mesh.rotation.y = (node.rotation.y * Math.PI) / 180;
          mesh.rotation.z = (node.rotation.z * Math.PI) / 180;
        }

        if (node.parentRotation) {
          //console.log('ParentRotation', node.parentRotation);
          this.group.rotation.x = (node.parentRotation.x * Math.PI) / 180;
          this.group.rotation.y = (node.parentRotation.y * Math.PI) / 180;
          this.group.rotation.z = (node.parentRotation.z * Math.PI) / 180;
        }

        this.group.add(mesh);
      });
      // end textureloader

      var ambient = new THREE.AmbientLight(0x22222222, 0.5);
      ambient.name = 'AmbientLight';
      this.group.add(ambient);

      var light = new THREE.PointLight(0xffffff, 1, 0);
      light.name = 'Light';

      //backLight.position.set(0, 0, -30);
      var lightX = 50;
      var lightY = 50;
      var lightZ = 60;
      switch (node.light) {
        case 'left':
          //light.position.set(-70, 100, 100);
          light.position.set(-lightX, lightY, lightZ);
          break;
        case 'right':
          //light.position.set(70, 100, 100);
          light.position.set(lightX, lightY, lightZ);
          break;
        case 'top':
          light.position.set(0, 70, 100);
          break;
      }

      this.group.add(light);
    });
    // end ovject.keys
  };

  handleResize = () => {
    const width = this.ref_mount.current.clientWidth;
    const height = this.ref_mount.current.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  };

  start = () => {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate);
    }
  };

  stop = () => {
    cancelAnimationFrame(this.frameId);
  };

  animate = () => {
    // if (this.group) {
    //   const delta = this.clock.getDelta();
    //   this.time += delta;

    //   this.group.position.y = 0.03 + Math.abs(Math.sin(this.time * 1)) * 0.02;
    // }

    const speed = 0.001 * (node.speed != undefined ? node.speed : 1);

    for (var i = 0; i < this.group.children.length; i++) {
      var child = this.group.children[i];
      child.rotation.y -= speed;
    }

    this.renderScene();
    this.frameId = window.requestAnimationFrame(this.animate);
  };

  renderScene = () => {
    this.renderer.render(this.scene, this.camera);
  };

  render() {
    const { loading, error } = this.state;

    return (
      <>
        {/* {loading ? <Spinner /> : null} */}
        <div className='render' ref={this.ref_mount} />
      </>
    );
  }
}

export default Scene;
