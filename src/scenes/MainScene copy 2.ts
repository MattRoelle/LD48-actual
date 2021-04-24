// import { DRAG, SCREEN_HEIGHT, SCREEN_WIDTH, TILE_SIZE } from "../constants";
// import { BasicPlatform } from "../gameObjects/Platform";
// import { PlatformingPlayer } from "../gameObjects/PlatformingPlayer";
// import { ShipRoom } from "../gameObjects/ShipRoom";
// import { store, LD48State } from "../store";
// import { addxy, timesxy } from "../utils";

// export class MainScene extends Phaser.Scene {
//     unsub: any;
//     graphics: Ph           overlapBias: 2,aser.GameObjects.Graphics;

//     keys: Record<string, Phaser.Input.Keyboard.Key> = {};
//     introPlaying: boolean = true;
//     player: PlatformingPlayer;
//     leftWall: Phaser.Types.Physics.Arcade.SpriteWithStaticBody;
//     rightWall: Phaser.Types.Physics.Arcade.SpriteWithStaticBody;
//     platforms: {
//         mainSprite: Phaser.Types.Physics.Arcade.SpriteWithStaticBody;
//     }[] = [];

//     constructor() {
//         super("main");
//     }

//     async create() {
//         this.graphics = this.add.graphics()

//         this.input.addPointer();

//         this.unsub = store.subscribe(() => {
//             this.onStateChange();
//         });

//         this.initialize();

//         this.keys = {
//             ...this.input.keyboard.addKeys("W,A,S,D")
//         };

//         this.add.sprite(0, 0, 'bg').setOrigin(0, 0)

//         this.player = new PlatformingPlayer(SCREEN_WIDTH / 2, 40, this);

//         this.leftWall = this.physics.add.staticSprite(0, 0, 'walls-left');
//         this.leftWall.setOrigin(0, 0)
//         // this.wall1.setPosition(0, 200)
//         this.leftWall.body.updateFromGameObject();
//         this.leftWall.debugBodyColor = 0xff0000;
//         this.leftWall.debugShowBody = true;
//         this.leftWall.debugShowVelocity = true;

//         this.rightWall = this.physics.add.staticSprite(0, 0, 'walls-right');
//         this.rightWall.setOrigin(1, 0)
//         this.rightWall.setPosition(SCREEN_WIDTH, 0)
//         this.rightWall.body.updateFromGameObject();
//         this.rightWall.debugBodyColor = 0xff0000;
//         this.rightWall.debugShowBody = true;
//         this.rightWall.debugShowVelocity = true;

//         const platform = new BasicPlatform(this, {
//             x: SCREEN_WIDTH/2,
//             y: SCREEN_HEIGHT/2
//         });
//         this.platforms.push(platform);
//     }

//     initialize() {
//         const state = store.getState();
//     }

//     onStateChange() {
//         const state = store.getState()
//         console.log('state', state);
//     }

//     update(time: number, delta: number) {
//         // let dx = 0, dy = 0;

//         // if (this.keys['W'].isDown) dy = -1;
//         // if (this.keys['A'].isDown) dx = -1;
//         // if (this.keys['S'].isDown) dy = 1;
//         // if (this.keys['D'].isDown) dx = 1;

//         // if (dy || dx) {
//         //     const theta = Math.atan2(dy, dx);
//         //     // this.velocity = addxy(this.velocity, {
//         //     //     x: Math.cos(theta) * 0.5,
//         //     //     y: Math.sin(theta) * 0.5,
//         //     // })
//         // }

//         this.player.update(time, delta);

//         this.physics.world.collide(this.player.sprite, [
//             this.leftWall,
//             this.rightWall,
//             ...this.platforms.map(p => p.mainSprite)
//         ]);
//     }
// }
