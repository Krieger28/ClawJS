import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../config';
import Game from '../game';
import MapDisplay from './MapDisplay';
import SceneWithMenu from './SceneWithMenu';
import InGameMenu from '../menus/InGameMenu';

export default class GameHUD extends SceneWithMenu {
  game: Game;
  static key = 'GameHUD';

  private mapDisplay: MapDisplay;
  private scoreText: Phaser.GameObjects.Text;
  private hpText: Phaser.GameObjects.Text;
  private centerText: Phaser.GameObjects.Text;
  private powerupTimeText: Phaser.GameObjects.Text;
  private fpsText: Phaser.GameObjects.Text;
  private powerupTime = 0;
  private centerTextTime = 0;
  private fade: Phaser.GameObjects.Rectangle;
  showFPS = false;

  isMenuOn = false;

  constructor() {
    super({ key: GameHUD.key });
  }

  preload() {

  }

  create() {
    this.scoreText = this.add.text(10, 10, 'Score: 0', { font: '24px Arial', fill: '#ffff00' });
    this.hpText = this.add.text(CANVAS_WIDTH - 10, 10, 'Health: 100', { font: '24px Arial', fill: '#ff0000' });
    this.hpText.setOrigin(1, 0);
    this.centerText = this.add.text(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, '', { font: '12px Arial', fill: '#ffffff' });
    this.centerText.setOrigin(0.5, 0.5);
    this.fpsText = this.add.text(10, CANVAS_HEIGHT - 10, '', { font: '12px Arial', fill: '#ffffff' });
    this.fpsText.setOrigin(0, 1);
    this.powerupTimeText = this.add.text(10, 30, 'Time: 0', { font: '24px Arial', fill: '#ffff00' });
    this.powerupTimeText.visible = false;
    this.mapDisplay = this.scene.get(MapDisplay.key) as MapDisplay;
    this.fade = this.add.rectangle(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, 0, 1);
    this.fade.setOrigin(0, 0);
    this.fade.alpha = 0;

    this.mapDisplay.events.on('ScoreChange', function (this: GameHUD, newScoreValue: number) {
      this.scoreText.setText('Score: ' + newScoreValue);
    }, this);

    this.mapDisplay.events.on('HealthChange', function (this: GameHUD, newHealthValue: number) {
      this.hpText.setText('Health: ' + newHealthValue);
    }, this);

    this.mapDisplay.events.on('PowerupTimeChange', function (this: GameHUD, newPowerupTime: number) {
      if (this.powerupTime && newPowerupTime) {
        this.powerupTime += newPowerupTime;
      } else {
        this.powerupTime = newPowerupTime;
      }
      this.powerupTimeText.visible = true;
    }, this);

    this.input.keyboard.on('keydown_ESC', () => this.togglePause());
    this.input.keyboard.on('keydown_M', () => {
      if (this.isMenuOn) {
        this.game.dataManager.set('musicVolume', '0.0');
      }
    });

    this.menu = new InGameMenu(this);
    super.create();
  }

  update(time: number, delta: number) {
    if (this.centerTextTime > 0) {
      this.centerTextTime -= delta;
    } else {
      this.centerText.visible = false;
    }

    if (this.powerupTime > 0) {
      if (!this.isMenuOn) {
        this.powerupTime -= delta;
        this.powerupTimeText.setText('Time: ' + Math.round(this.powerupTime / 1000));

        if (this.powerupTime <= 0) {
          this.mapDisplay.claw.powerup = undefined;
          this.game.musicManager.resumePaused();
        }
      }
    } else {
      this.powerupTimeText.visible = false;
    }

    if (this.showFPS) {
      this.fpsText.setText('FPS: ' + Math.round(this.game.loop.actualFps));
      this.fpsText.visible = true;
    } else {
      this.fpsText.visible = false;
    }
  }

  textOut(text: string) {
    this.centerText.setText(text);
    this.centerText.visible = true;
    this.centerTextTime = 2000;
  }

  togglePause(skipSound?: boolean) {
    this.isMenuOn = !this.isMenuOn;
    this.fade.alpha = this.isMenuOn ? 0.5 : 0;

    if (this.isMenuOn) {
      this.mapDisplay.claw.inputs = {
        LEFT: false,
        RIGHT: false,
        UP: false,
        DOWN: false,
        JUMP: false,
        ATTACK: false,
      };
      this.scene.pause(MapDisplay.key);
      this.menu.show();
    } else {
      this.scene.resume(MapDisplay.key);
      this.menu.hide();
    }

    if (!skipSound) {
      this.sound.playAudioSprite('sounds', 'GAME_SELECT');
    }
  }
}
