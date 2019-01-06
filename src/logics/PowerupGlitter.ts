import { ObjectCreationData } from '../model/ObjectData';
import DynamicObject from '../object/DynamicObject';
import MapDisplay from '../scenes/MapDisplay';
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;

export default class PowerupGlitter extends DynamicObject {
  constructor(scene: MapDisplay, mainLayer: DynamicTilemapLayer, object: ObjectCreationData) {
    super(scene, mainLayer, {
      x: object.x,
      y: object.y,
      z: object.z + 1,
      logic: 'PowerupGlitter',
      texture: 'GAME',
      image: 'GAME_GLITTER',
      animation: 'GAME_CYCLE100',
      frame: 1,
    }, undefined, true);
  }
}