import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../config';
import Game from '../game';
import SceneWithMenu from './SceneWithMenu';
import MainMenu from '../menus/MainMenu';
import p from '../../package.json';

export default class MenuScene extends SceneWithMenu {
  background: Phaser.GameObjects.Image;
  socialIcons: Phaser.GameObjects.Image[] = [];

  game: Game;
  static key = 'MenuScene';

  constructor() {
    super({ key: MenuScene.key });
  }

  preload() {
    this.load.image('MENU_BG', `screens/MENU.png`);
    this.load.image('CREDITS_BG', `screens/CREDITS.png`);
    this.load.image('HELP_BG', `screens/HELP.png`);
    this.load.atlas('social-icons', 'ui/social-icons.png', 'ui/social-icons.json');

    this.load.atlas('fonts', 'ui/FONTS.png', 'ui/FONTS.json');

    //  The XML data for the fonts in the atlas
    this.load.xml('REGULAR', 'ui/REGULAR.xml');
    this.load.xml('SELECTED', 'ui/SELECTED.xml');

    this.load.audioSprite('sounds', 'sounds/SOUNDS.json');
    this.load.audio('menu_music', [
      `music/MENU.ogg`,
    ]);
  }

  create() {
    this.sound.pauseOnBlur = false;
    Phaser.GameObjects.BitmapText.ParseFromAtlas(this, 'regular', 'fonts', 'MENU_DEFAULT.png', 'REGULAR');
    Phaser.GameObjects.BitmapText.ParseFromAtlas(this, 'selected', 'fonts', 'MENU_SELECTED.png', 'SELECTED');
    Phaser.GameObjects.BitmapText.ParseFromAtlas(this, 'disabled', 'fonts', 'MENU_DISABLED.png', 'REGULAR');

    this.background = this.add.image(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 'MENU_BG');

    [
      { icon: 'facebook', url: 'https://www.facebook.com/Zax37' },
      { icon: 'twitter', url: 'https://twitter.com/Crew37Zax' },
      { icon: 'youtube', url: 'https://www.youtube.com/channel/UCyj4Zn9wuIfOVz547rtXLJw' },
      { icon: 'twitch', url: 'https://www.twitch.tv/zax37' },
      { icon: 'discord', url: 'https://discordapp.com/users/185756278335864833' },
    ].forEach((social, i) => {
      const image = this.add.image(CANVAS_WIDTH / 2 - 50 + i * 48, CANVAS_HEIGHT / 2 + 84, 'social-icons', social.icon);
      image.setScale(0.5, 0.5);
      image.visible = false;
      image.setInteractive({ useHandCursor: true });

      image.on('pointerover', () => image.setTint(0xcc3737));
      image.on('pointerout', () => image.clearTint());
      image.on('pointerdown', () => image.setTint(0x370000));

      image.on('pointerup', () => {
        window.open(social.url, '_blank');
        image.clearTint();
      });

      this.socialIcons.push(image);
    });

    const version = this.add.text(CANVAS_WIDTH - 58, CANVAS_HEIGHT - 48, p.version, { font: '12px Arial', fill: '#ffffff' }).setOrigin(1, 1);

    /*let icons: Phaser.GameObjects.Image[] = [];
    for (let i = 0; i < 15; i++) {
      let x = CANVAS_WIDTH / 2, y = CANVAS_HEIGHT / 2;
      if (i === 14) {
        y += 128;
      } else {
        x += i % 7 * 64 - 192;
        y += i >= 7 ? 64 : 0;
      }
      icons.push(this.add.image(x, y, 'icons', `${i + 1}.png`).setInteractive({ useHandCursor: true }));
    }*/

    this.menu = new MainMenu(this);
    this.game.soundsManager.setScene(this);
    this.game.musicManager.play(this.sound.add('menu_music'));
    super.create();

    /*let manager = this;
    icons.forEach((icon, i) => {
      icon.on('pointerover', function (this: Phaser.GameObjects.Image) {
        this.setTint(0xff0000);
      });

      icon.on('pointerout', function (this: Phaser.GameObjects.Image) {
        this.clearTint();
      });

      icon.on('pointerdown', function (this: Phaser.GameObjects.Image) {
        this.setTint(0x660000);
      });

      icon.on('pointerup', function (this: Phaser.GameObjects.Image) {
        manager.game.startLevel(i + 1);
      });
    });

    const el = document.getElementsByTagName('body')[0];
    const requestFullScreen = el.requestFullscreen;

    if (requestFullScreen) {
      el.addEventListener('dblclick', requestFullScreen);
    }*/
  }

  menuConfirm() {
    if (!this.isMenuOn) {
      this.background.setTexture('MENU_BG');
      this.isMenuOn = true;
      this.menu.show();
      this.setSocialIconsVisible(false);
    } else {
      super.menuConfirm();
    }
  }

  setSocialIconsVisible(on: boolean) {
    this.socialIcons.forEach((icon) => icon.visible = on);
  }
}
