// import { GRID_TILE_HEIGHT, GRID_TILE_WIDTH } from "../../constants";
// import { addxy, left, midpoint, xy } from "../../utils";
// import { BattleActorObject } from "../BattleActorObject";
// import { damageNumbers } from "../effects/damageNumbers";
// import { Sequence } from "./sequence";

// export const respawnSequence: Sequence<{
//     actor: BattleActorObject,
//     x: number,
//     y: number
// }> = function* (scene, input) {
//     input.actor.playWalkAnim();

//     const s = Math.abs(input.actor.spr.scaleX || 1)

//     input.actor.spr.scale = 5;
//     input.actor.container.x = input.x * GRID_TILE_WIDTH;
//     input.actor.container.y = input.y * GRID_TILE_HEIGHT;

//     yield {
//         type: 'tweens',
//         tweens: [
//             {
//                 targets: [input.actor.container],
//                 alpha: 1,
//                 duration: 1000,
//                 ease: Phaser.Math.Easing.Quadratic.InOut
//             },
//             {
//                 targets: [input.actor.spr],
//                 scale: s,
//                 duration: 2000,
//                 ease: Phaser.Math.Easing.Quadratic.InOut
//             },
//         ]
//     }

//     input.actor.playIdleAnim();
// }