import * as Phaser from 'phaser';
import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './ui/App';
import { MainScene } from './scenes/MainScene';
import { HomeScene } from './scenes/HomeScene';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from './constants';
import { BootScene } from './scenes/BootScene';

const game = new Phaser.Game({
    type: Phaser.WEBGL,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    scene: [
        BootScene,
        MainScene
    ],
    render: {
        pixelArt: true,
        roundPixels: true,
    },
    callbacks: {
        postBoot: () => {
            const uiRoot = document.getElementById('ui-root');

            function adjustUiRoot() {
                const clientRect = game.canvas.getBoundingClientRect();
                uiRoot.style.height = clientRect.height + 'px';
                uiRoot.style.top = clientRect.top + 'px';
                uiRoot.style.width = clientRect.width + 'px';
                uiRoot.style.left = clientRect.left + 'px';
            }

            adjustUiRoot();

            window.addEventListener('resize', () => {
                adjustUiRoot();
            });
        },
    },
    scale: {
        mode: Phaser.Scale.FIT
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: { y: 300 },
            overlapBias: 2,
        }
    },
    // plugins: {
    //     scene: [
    //         {
    //             key: 'rexUI',
    //             plugin: RexUIPlugin,
    //             mapping: 'rexUI'
    //         }
    //     ]
    // }
});

ReactDOM.render(
    <App />,
    document.getElementById('ui-root')
);



