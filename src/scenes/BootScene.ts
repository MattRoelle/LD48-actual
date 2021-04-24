
export class BootScene extends Phaser.Scene {
    constructor() {
        super("boot");
    }

    preload() {
        this.load.image("bg", "/assets/export-bg.png");
        this.load.image("body", "/assets/Body.png");
        this.load.image("planet1", "/assets/Planet1.png");
        this.load.image("planet2", "/assets/Planet2.png");
        this.load.image("solar", "/assets/Solar.png");
        this.load.image("star1", "/assets/Star1.png");
        this.load.image("star2", "/assets/Star2.png");
    }

    create() {
        // @ts-ignore
        window.game = this.game;
        this.anims.createFromAseprite("character");

        const game = this.game;
        // phaserBridge.subscribe(scene => {
        //     game.scene.start(scene);
        // });
        this.scene.start("main");
    }
}
