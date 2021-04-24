import { DRAG, SCREEN_HEIGHT, SCREEN_WIDTH, TILE_SIZE } from "../constants";
import { store, LD48State } from "../store";
import { addxy, timesxy } from "../utils";

export class MainScene extends Phaser.Scene {
    unsub: any;
    graphics: Phaser.GameObjects.Graphics;
    keys: Record<string, Phaser.Input.Keyboard.Key> = {};
    introPlaying: boolean = true;
    body: Phaser.GameObjects.Sprite;
    shipContainer: Phaser.GameObjects.Container;
    flySpeed: number = 1;

    stars: {
        sprite: Phaser.GameObjects.Sprite;
        speed: number
    }[] = [];
    state: LD48State;

    constructor() {
        super("main");
    }

    async create() {
        this.graphics = this.add.graphics()

        this.graphics.fillStyle(0x2d3952).fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)

        this.input.addPointer();

        this.unsub = store.subscribe(() => {
            this.onStateChange();
        });

        this.initialize();

        this.keys = {
            ...this.input.keyboard.addKeys("W,A,S,D,SPACE")
        };

        this.keys['SPACE'].onUp = () => {
            const state = store.getState();
            store.dispatch({
                type: 'pause',
                value: !state.paused
            });
        };

        this.makeStarfield();

        this.shipContainer = this.add.container(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2);
        this.shipContainer.setScale(0.5, 0.5)
        this.body = this.add.sprite(0, 0, 'body')
        this.shipContainer.add(this.body);

        this.time.addEvent({
            loop: true,
            delay: 1000,
            callback: () => {
                const state = store.getState();
                if (!state.paused && !state.activity) {
                    store.dispatch({
                        type: 'advance'
                    });
                }
            }
        })

        this.time.addEvent({
            delay: 500,
            loop: true,
            callback: () => {
                const x = this.shipContainer.x - 350;
                const y = this.shipContainer.y - 30;
                const spr = this.add.sprite(x, y, 'star1')
                spr.scale = 4 + (Math.random() * 2)
                spr.scale *= 0.5 + (this.flySpeed*0.5);
                spr.alpha = 0.5 + (Math.random() * 0.5)
                // this.shipContainer.add(spr);
                spr.x = x ;
                this.tweens.add({
                    targets: spr,
                    duration: 1200 + ((1 - this.flySpeed) * 3000),
                    x: x - 500,
                    angle: 1000,
                    scale: 0,
                    onComplete: () => {
                        spr.destroy();
                    }
                })
            }
        })
    }

    makeStarfield() {
        for (let i = 0; i < 100; i++) {
            const sprite = this.add.sprite(Math.random() * SCREEN_WIDTH, Math.random() * SCREEN_HEIGHT, Math.random() < 0.5 ? 'star1' : 'star2');
            sprite.angle = Math.random() * 360;
            sprite.scale = 0.4 + Math.random() * 0.4;
            this.stars.push({
                sprite,
                speed: Math.random()
            })
        }
    }

    initialize() {
        const state = store.getState();
        this.state = state;
    }

    onStateChange() {
        const state = store.getState()
        this.state = state;
        console.log('state', state);

        this.tweens.add({
            targets: this,
            flySpeed: !!state.activity ? 0.1 : 1,
            duration: 2000,
            ease: Phaser.Math.Easing.Quadratic.Out
        })
    }

    update(time: number, delta: number) {
        this.shipContainer.y = (SCREEN_HEIGHT / 2) + Math.sin(time / 400) * 50;

        for (let s of this.stars) {
            s.sprite.x -= s.speed * delta * this.flySpeed;
            s.sprite.angle += delta*0.1;
            if (s.sprite.x < -100) {
                s.sprite.x = SCREEN_WIDTH + 100;
            }
        }
    }
}
