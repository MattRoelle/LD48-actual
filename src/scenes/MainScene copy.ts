import { DRAG, SCREEN_HEIGHT, SCREEN_WIDTH, TILE_SIZE } from "../constants";
import { ShipRoom } from "../gameObjects/ShipRoom";
import { store, LD48State } from "../store";
import { addxy, timesxy } from "../utils";

export class MainScene extends Phaser.Scene {
    unsub: any;
    graphics: Phaser.GameObjects.Graphics;

    anchorPosition: XY = { x: SCREEN_WIDTH / 2, y: SCREEN_HEIGHT / 2 }
    podPosition: XY = { x: SCREEN_WIDTH / 2, y: SCREEN_HEIGHT * 3 / 4 }
    topBorderWidth: number = 0;
    velocity: XY = { x: 0, y: 1 }
    keys: Record<string, Phaser.Input.Keyboard.Key> = {};
    introPlaying: boolean = true;
    darkness: number = 0;
    lightest = 0x6495ED;
    darkest = 0x335077;

    constructor() {
        super("main");
    }

    async create() {
        this.graphics = this.add.graphics()

        this.input.addPointer();

        this.unsub = store.subscribe(() => {
            this.onStateChange();
        });

        this.initialize();

        this.tweens.add({
            targets: this.anchorPosition,
            y: SCREEN_HEIGHT / 8,
            duration: 1400,
            ease: Phaser.Math.Easing.Quadratic.InOut
        });

        this.tweens.add({
            targets: this,
            darkness: 0.35,
            duration: 2000,
            ease: Phaser.Math.Easing.Quadratic.InOut
        });

        this.tweens.add({
            targets: this,
            topBorderWidth: 8,
            duration: 2000,
            ease: Phaser.Math.Easing.Quadratic.InOut
        })

        this.tweens.add({
            targets: this.podPosition,
            y: SCREEN_HEIGHT / 2,
            duration: 2000,
            ease: Phaser.Math.Easing.Bounce.In,
            onComplete: () => this.introPlaying = false
        })

        this.keys = {
            ...this.input.keyboard.addKeys("W,A,S,D")
        };
    }

    initialize() {
        const state = store.getState();

    }

    onStateChange() {
        const state = store.getState()
        console.log('state', state);
    }

    drawAnchor() {
        const { x, y } = this.anchorPosition;

        const oscillatingY = y + Math.sin(Date.now() / 400) * 10;

        const r = 50;
        this.graphics
            .moveTo(0, 0)
            .fillStyle(0xeeeeee)
            .fillRect(0, 0, SCREEN_WIDTH, y + r)
            .fillStyle(0xFFFFFF)
            .lineStyle(6, 0x000000)
            .strokeRoundedRect(x - 100, oscillatingY + r / 2, 200, r, 10)
            .fillRoundedRect(x - 100, oscillatingY + r / 2, 200, r, 10)
            .lineStyle(4, 0x000000)
            .fillCircle(x, oscillatingY, r)
            .strokeCircle(x, oscillatingY, r)
    }

    drawLine() {
        const { x: startx, y: starty } = this.anchorPosition;
        const { x: endx, y: endy } = this.podPosition;

        this.graphics
            .moveTo(0, 0)
            .lineStyle(4, 0x000000)
            .beginPath()
            .moveTo(startx, starty)
            .lineTo(endx, endy)
            .strokePath();
    }

    drawPod() {
        const { x, y } = this.podPosition;
        const r = 80;
        this.graphics
            .moveTo(0, 0)
            .fillStyle(0xFFFFFF)
            .lineStyle(4, 0x000000)
            .fillCircle(x, y, r)
            .strokeCircle(x, y, r);
    }

    draw() {
        this.graphics.clear();
        this.drawLine();
        this.drawAnchor();
        this.drawPod();
    }

    applyDrag() {
    }

    update(time: number) {
        this.draw();

        const bg =
            Phaser.Display.Color.Interpolate.ColorWithColor(
                Phaser.Display.Color.HexStringToColor('#6495ED'),
                Phaser.Display.Color.HexStringToColor('#335077'),
                1,
                this.darkness
            );

        this.cameras.main.backgroundColor = new Phaser.Display.Color(bg.r, bg.g, bg.b)

        if (this.introPlaying) return;

        let dx = 0, dy = 0;

        if (this.keys['W'].isDown) dy = -1;
        if (this.keys['A'].isDown) dx = -1;
        if (this.keys['S'].isDown) dy = 1;
        if (this.keys['D'].isDown) dx = 1;

        if (dy || dx) {
            const theta = Math.atan2(dy, dx);
            this.velocity = addxy(this.velocity, {
                x: Math.cos(theta) * 0.5,
                y: Math.sin(theta) * 0.5,
            })
        }

        this.podPosition = addxy(this.podPosition, this.velocity);
        this.velocity = timesxy(this.velocity, DRAG);

        // this.cameras.main.x = -(this.podPosition.x - SCREEN_WIDTH/2);
        // this.cameras.main.y = -(this.podPosition.y - SCREEN_HEIGHT/2);

        // console.log('dx, dy', dx, dy);
        // console.log('this.podPosition', this.podPosition);
        // console.log('this.velocity', this.velocity);

    }
}
