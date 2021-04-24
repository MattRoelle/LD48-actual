import { TILE_SIZE } from "../constants";

export class ShipRoom extends Phaser.GameObjects.Container {
    graphics: Phaser.GameObjects.Graphics;

    constructor(scene: Phaser.Scene, public config: {
        x: number,
        y: number,
        roomPosition: XY,
        width: number,
        height: number,
    }) {
        super(scene, config.x, config.y);
        scene.add.existing(this);

        this.graphics = scene.add.graphics();
        this.add(this.graphics);
    }

    update() {
        this.graphics.clear();
        this.graphics.lineStyle(2, 0xFFFFFF, 0.5);
        for (let i = 0; i < this.config.width; i++) {
            for (let j = 0; j < this.config.height; j++) {
                const x = (i * TILE_SIZE);
                const y = (j * TILE_SIZE);
                this.graphics.strokeRect(x, y, TILE_SIZE, TILE_SIZE);
            }
        }
    }
}
