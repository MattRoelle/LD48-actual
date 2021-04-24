// import { BattleClient, BattleConfig, LocalBattleClient } from "../src/lib/battle";
// import { uuidv4 } from "../src/utils";

// export const SAMPLE_CONFIG: BattleConfig = {
//     teams: [
//         {
//             id: 'player',
//             name: 'Player',
//             type: 'friendly',
//             members: [
//                 {
//                     id: 'p1',
//                     teamId: 'player',
//                     hp: 100,
//                     mp: 100,
//                     name: 'Player 1',
//                     stats: { maxHp: 100, maxMp: 100, speed: 1000 },
//                     gcdTime: 64,
//                     stateChangedAt: 0,
//                     state: {
//                         type: 'on-cooldown',
//                         until: 64,
//                     },
//                 },
//             ]
//         },
//         {
//             id: 'enemy',
//             name: 'Enemy',
//             type: 'enemy',
//             members: [
//                 {
//                     id: 'e1',
//                     teamId: 'enemy',
//                     hp: 100,
//                     mp: 100,
//                     name: 'Enemy 1',
//                     stats: { maxHp: 100, maxMp: 100, speed: 1000 },
//                     gcdTime: 64,
//                     stateChangedAt: 0,
//                     state: {
//                         type: 'on-cooldown',
//                         until: 40,
//                     }
//                 },
//             ]
//         }
//     ]
// };

// describe("battleEngine", () => {
//     it("Works", async () => {
//         const client = new LocalBattleClient(SAMPLE_CONFIG);
//         const result = await client.process({ });
//         // console.log('result', JSON.stringify(result, null, 2));
//         const result2 = await client.process({
//             'e1': {
//                 type: 'attack',
//                 targetId: 'p1'
//             }
//         });
//         // console.log('result2', JSON.stringify(result2, null, 2));
//         const result3 = await client.process({
//             'p1': {
//                 type: 'attack',
//                 targetId: 'e1'
//             }
//         });
//         console.log('result3', JSON.stringify(result2, null, 2));
//     });
// });