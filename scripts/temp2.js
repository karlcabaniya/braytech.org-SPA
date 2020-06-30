const fse = require('fs-extra');
const fetch = require('node-fetch');
const path = require("path");


const json = {
  success: true,
  data: {
    map: {
      width: 1920,
      height: 1080,
      zoom: 0,
      layers: [
        { id: 'background', x: -320, y: -180, width: 2560, height: 1440, image: 'director/forsaken/web/01e3-00001306.png' },
        { id: 'jupiter', x: -210, y: -240, rotation: 180, opacity: 0.3, width: 900, height: 596, image: '01a3-000003C1_1.png' },
        { id: 'saturn', x: -296, y: 241, opacity: 0.3, width: 900, height: 1080, image: '01a3-000003C8_1.png' },
        {
          id: 'io',
          x: 139,
          y: 231,
          width: 212,
          height: 212,
          scale: 0.73,
          page: 'io',
          label: { title: 'Io', x: -50, y: 10, indent: 80 },
          nodes: [
            {
              type: 'model',
              x: 0,
              y: -3,
              width: 216,
              height: 216,
              rotation: { x: 0, y: 0, z: 0 },
              image: 'planets/render_1542208405167.png',
              textures: {
                map: {
                  width: 211,
                  height: 211,
                  repeat: { s: 2, t: 1 },
                  image: '02af-00000201_1.png',
                },
              },
              light: 'right',
              speed: 0.7,
            },
            { id: 'glow', x: 0, y: 0, flipX: true, width: 320, height: 320, image: '01a3-000003BB_1.png' },
            { id: 'outline', x: 0, y: 0, width: 320, height: 320, image: '01a3-000003BE_1.png' },
            { id: 'outline-inner', x: 0, y: 0, width: 320, height: 320, image: '01a3-000003BC_1.png' },
          ],
        },
        {
          id: 'earth',
          x: 810,
          y: 454,
          width: 320,
          height: 320,
          scale: 0.96,
          page: 'earth',
          label: { title: 'Earth', x: -70, y: -6, indent: 120 },
          nodes: [
            { type: 'model', y: 2, width: 320, height: 320, image: 'planets/render_1542208405700.png', textures: { map: { width: 648, height: 324, opacity: 4, image: '01a3-00000743_1.png' }, overlay: { width: 345, height: 345, repeat: { s: 2, t: 1 }, image: '01a3-00000836_1.png' } }, light: 'top', speed: -0.3 },
            { id: 'glow', x: 2, y: 34, width: 960, height: 800, image: '01a3-000003B6_1.png' },
            { id: 'outline', x: 0, y: 0, width: 640, height: 640, image: '01a3-000003B8_1.png' },
          ],
        },
        {
          id: 'titan',
          x: 336,
          y: 740,
          width: 160,
          height: 160,
          scale: 0.88,
          page: 'titan',
          label: { title: 'Titan', x: -40, y: 6, textY: -20, indent: 80 },
          nodes: [
            { type: 'model', x: -3, y: 0, width: 164, height: 164, rotation: { x: 0, y: 0, z: 0 }, image: 'planets/render_1542208406210.png', textures: { map: { width: 211, height: 211, repeat: { s: 2, t: 1 }, image: '02af-0000020A_1.png' } }, light: 'right', speed: 1.1 },
            { id: 'glow', x: -2, y: 0, width: 360, height: 360, image: '01a3-000003CF_1.png' },
            { id: 'outline', x: 0, y: 0, width: 180, height: 180, mirrorX: true, mirrorY: true, image: '01a3-000003D2_1.png' },
            { id: 'outline-inner', x: 0, y: 0, width: 180, height: 180, mirrorX: true, mirrorY: true, image: '01a3-000003D0_1.png' },
          ],
        },
        {
          id: 'nessus',
          x: 1480,
          y: 130,
          width: 168,
          height: 168,
          scale: 0.79,
          page: 'nessus',
          label: { title: 'Nessus', x: -35, y: 0, indent: 50 },
          nodes: [
            { type: 'model', x: 0, y: 2, width: 168, height: 168, rotation: { x: 0, y: 0, z: 0 }, image: 'planets/render_1542208406733.png', textures: { map: { width: 160, height: 160, repeat: { s: 2, t: 1 }, image: '02af-00000203_1.png' } }, light: 'left', speed: 0.6 },
            { id: 'glow', x: 1, y: 0, width: 512, height: 512, image: '01a3-000003C2_1.png' },
            { id: 'outline', x: 0, y: 0, width: 360, height: 360, image: '01a3-000003C5_1.png' },
            { id: 'outline-inner', x: 0, y: 0, width: 360, height: 360, image: '01a3-000003C6_1.png', visible: false },
          ],
        },
        {
          id: 'tower',
          x: 895,
          y: 160,
          width: 144,
          height: 144,
          page: 'tower',
          label: { title: 'Tower', x: -12, y: 12, indent: 48 },
          nodes: [
            { id: 'outline-static', x: 0, y: 0, width: 256, height: 256, image: '01a3-000003D7_1.png' },
            { id: 'traveler', x: 0, y: -2, width: 480, height: 480, image: '01a3-000003D4_1.png' },
            { id: 'debris', type: 'model', x: 0, y: 0, textures: { map: { width: 208, height: 208, image: '01a3-000003FE_1.png' } }, visible: false },
          ],
        },
        {
          id: 'mercury',
          x: 500,
          y: 150,
          width: 140,
          height: 140,
          page: 'mercury',
          label: { title: 'Mercury', x: -2, y: 6, textY: 20, indent: 25 },
          nodes: [
            { id: 'outline', x: 0, y: 0, width: 201, height: 200, image: '02af-00000DE2_1.png' },
            { id: 'outline-inner', x: 0, y: 0, width: 201, height: 200, image: '02af-00000DE6_1.png' },
            { id: 'planet', x: -2, y: 19, flipX: true, width: 348, height: 349, image: '02af-00000DE0_1.png' },
          ],
        },
        {
          id: 'mars',
          x: 458,
          y: 400,
          width: 220,
          height: 220,
          scale: 0.78,
          page: 'mars',
          label: { title: 'Mars', x: -50, y: 10, indent: 100 },
          nodes: [
            { type: 'model', x: 0, y: 0, width: 222, height: 222, parentRotation: { x: -40, y: 0, z: 50 }, rotation: { x: 0, y: 0, z: 0 }, image: 'planets/render_1542208407244.png', textures: { map: { width: 211, height: 211, repeat: { s: 1, t: 1 }, image: '02AF-00000F8D_1.png' } }, light: 'right', speed: -0.9 },
            { id: 'glow', x: 0, y: 0, width: 512, height: 512, image: '02AF-00000F8B_1.png' },
            { id: 'outline', x: 0, y: 0, width: 361, height: 361, image: '0354-0000066F_1.png' },
            { id: 'outline-inner', x: 0, y: 0, width: 360, height: 360, image: '0354-00000670_1.png' },
          ],
        },
        { id: 'dreaming-city-placeholder', x: 1576, y: 330, width: 178, height: 178, visible: false, nodes: [{ id: 'outline', x: 0, y: 0, width: 212, height: 212, image: 'director/forsaken/01e3-000012a7.png' }] },
        {
          id: 'dreaming-city',
          x: 1621,
          y: 420,
          width: 178,
          height: 178,
          page: 'dreaming-city',
          label: { title: 'Dreaming City', x: -70, y: -35, textAlign: 'top', textY: 60, indent: 90 },
          nodes: [
            { id: 'outline', x: 0, y: 0, width: 212, height: 212, image: 'director/forsaken/01e3-000012a7.png' },
            { id: 'outline-inner', x: 0, y: 0, width: 398, height: 398, image: 'director/forsaken/01e3-000012ba.png' },
            { id: 'tower-faded', x: -4, y: -118, width: 350, height: 330, image: 'director/forsaken/01e3-000012bf.png' },
            { id: 'tower', x: -4, y: -118, width: 350, height: 330, image: 'director/forsaken/01e3-000012bb.png' },
          ],
        },
        { id: 'tangled-shore-clouds', x: 1030, y: 290, width: 960, height: 850, nodes: [{ id: 'foreground-cloud', x: 0, y: 0, width: 960, height: 850, opacity: 0.6, image: 'director/forsaken/web/01e3-000012f2.png' }] },
        {
          id: 'tangled-shore-placeholder',
          x: 1429,
          y: 601,
          width: 138,
          height: 138,
          visible: false,
          nodes: [
            { id: 'outer-background', class: 'rotate-left', x: 8, y: 3, width: 560, height: 556, image: 'director/forsaken/01e3-000012f3.png' },
            { id: 'inner-background', class: 'rotate-right', x: 0, y: 0, width: 117, height: 117, image: 'director/forsaken/01a3-00001d8f.png' },
            { id: 'inner-overlay', class: 'rotate-left', x: 0, y: 0, width: 272, height: 270, image: 'director/forsaken/01a3-00001d91.png' },
            { id: 'inner-icon', x: 0, y: 0, width: 87, height: 87, image: 'director/forsaken/01a3-00001d89.png' },
            { id: 'debris-a', x: 68, y: -100, width: 342, height: 242, image: 'director/forsaken/01e3-000012eb.png' },
            { id: 'debris-b', x: 7, y: -135, width: 613, height: 192, image: 'director/forsaken/01e3-000012e8.png' },
          ],
        },
        {
          id: 'tangled-shore',
          x: 1474,
          y: 691,
          width: 138,
          height: 138,
          page: 'tangled-shore',
          label: { title: 'Tangled Shore', x: 0, y: 0, textAlign: 'top', textY: 120, indent: 50 },
          nodes: [
            { id: 'outer-background', class: 'rotate-left', x: 8, y: 3, width: 560, height: 556, image: 'director/forsaken/01e3-000012f3.png' },
            { id: 'shore-light', x: -5, y: -85, width: 501, height: 348, image: 'director/forsaken/01e3-000012f7.png' },
            { id: 'shore-debris-a', x: 0, y: 0, width: 244, height: 244, imageWidth: 231, imageHeight: 243, wrap: true, image: 'director/forsaken/01e3-000012fa.png' },
            { id: 'shore-debris-b', x: 8, y: 4, width: 360, height: 360, imageWidth: 244, imageHeight: 179, wrap: true, image: 'director/forsaken/01e3-000012fb.png' },
            { id: 'shore-light-b', x: 0, y: -30, width: 258, height: 474, image: 'director/forsaken/02af-00001de3.png', opacity: 0.4 },
            { id: 'debris-a', x: 68, y: -100, width: 342, height: 242, image: 'director/forsaken/01e3-000012eb.png' },
            { id: 'debris-b', x: 7, y: -135, width: 613, height: 192, image: 'director/forsaken/01e3-000012e8.png' },
          ],
        },
        {
          id: 'tangled-shore-belt',
          x: 1285,
          y: 770,
          width: 622,
          height: 204,
          nodes: [
            { id: 'debris-a', x: 0, y: 0, width: 622, height: 204, image: 'director/forsaken/01e3-000012df.png' },
            { id: 'debris-b', x: 265, y: 25, width: 272, height: 130, image: 'director/forsaken/01e3-000012dd.png' },
            { id: 'debris-rock', x: 178, y: 115, width: 148, height: 113, image: 'director/forsaken/01e3-000012e2.png' },
          ],
        },
        {
          id: 'moon',
          x: 1200,
          y: 320,
          width: 191,
          height: 191,
          scale: 0.79,
          page: 'moon',
          label: { title: 'Moon', x: 0, y: 0, indent: 50, textY: 30 },
          nodes: [
            { id: 'moon', x: 0, y: 0, width: 191, height: 191, image: 'shadowkeep/01a3-00001617.png' },
            { id: 'outline', x: 0, y: 0, width: 220, height: 220, image: 'shadowkeep/01a3-00001610.png', opacity: 0.4 },
            { id: 'outline-inner', x: 0, y: 0, width: 220, height: 220, image: 'shadowkeep/01a3-00001608.png', opacity: 0.6 },
          ],
        },
      ],
    },
  },
};

function doFetch(id, pth) {
  fetch(`https://lowlidev.com.au/destiny/d2/maps/${pth}`)
    .then((x) => x.arrayBuffer())
    .then((x) => fse.outputFile(`public/static/images/extracts/maps/director/${id}/${path.basename(pth)}`, Buffer.from(x)));
}

async function work() {
  json.data.map.layers.forEach((layer) => {
    if (layer.image) doFetch(layer.id, layer.image);
    if (layer.nodes) {
      layer.nodes.forEach((node) => {
        if (node.image) doFetch(layer.id, node.image);
        if (node.textures) {
          Object.values(node.textures).forEach(texture => {
            doFetch(layer.id, texture.image);
          })
        }
      });
    }
  });
}

work();
