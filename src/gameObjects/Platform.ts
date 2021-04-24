export class BasicPlatform extends Phaser.GameObjects.GameObject{
    mainSprite: Phaser.Types.Physics.Arcade.SpriteWithStaticBody;
    constructor(scene: Phaser.Scene, public config: {
        x: number,
        y: number
    }) {
        super(scene, 'basic-platform');
        scene.add.existing(this);
        this.mainSprite = this.scene.physics.add.staticSprite(config.x, config.y, 'basic-platform');
    }

    update() {
    }
}