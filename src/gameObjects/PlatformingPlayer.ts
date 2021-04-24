export class PlatformingPlayer extends Phaser.GameObjects.GameObject {
    animIdle: boolean | Phaser.Animations.Animation;
    sprite: Phaser.GameObjects.Sprite;
    keyUp: Phaser.Input.Keyboard.Key;
    keyDown: Phaser.Input.Keyboard.Key;
    keyLeft: Phaser.Input.Keyboard.Key;
    keyRight: Phaser.Input.Keyboard.Key;
    speed: number = 1.5;
    initialJumpForce: number = -16000;
    progressiveJumpForce: number = -11.5;
    progressiveJumpDuration: number = 700;
    jumpLimitInterval: number = 400;
    lastJumpAt: number = -1000;

    get spriteBody() {
        return this.sprite.body as Phaser.Physics.Arcade.Body;
    }

    constructor(x: number, y: number, scene: Phaser.Scene) {
        super(scene, 'Player');
        scene.add.existing(this);

        this.sprite = scene.physics.add.sprite(x, y, 'character');
        this.sprite.setOrigin(0.5, 0.5);
        this.sprite.setSize(14, 31);

        this.keyUp = this.scene.input.keyboard.addKey('w');
        this.keyDown = this.scene.input.keyboard.addKey('s');
        this.keyLeft = this.scene.input.keyboard.addKey('a');
        this.keyRight = this.scene.input.keyboard.addKey('d');

        this.spriteBody.setBounce(0, 0);
        this.spriteBody.setDrag(700, 0);
        this.spriteBody.setMaxVelocity(220, 500);

        this.spriteBody.debugBodyColor = 0xff0000;
        this.spriteBody.debugShowBody = true;
        this.spriteBody.debugShowVelocity = true;

        this.spriteBody.x = x;
        this.spriteBody.y = y;

        this.sprite.anims.play({ key: 'walk', repeat: -1 }, true);
    }

    collide() {
    }

    update(time: number, delta: number) {
        const isGrounded =
            this.spriteBody.touching.down ||
            this.spriteBody.wasTouching.down ||
            this.spriteBody.blocked.down;

        console.log('isGrounded', isGrounded);

        const lastJumpDelta = time - this.lastJumpAt;


        if (this.keyLeft.isDown) {
            this.spriteBody.velocity.x -= this.speed * delta;
        }

        if (this.keyRight.isDown) {
            this.spriteBody.velocity.x += this.speed * delta;
        }

        if (this.keyUp.isDown) {
            if (!isGrounded && lastJumpDelta < this.progressiveJumpDuration) {
                console.log('continuing jump');
                let ddt = lastJumpDelta / this.progressiveJumpDuration;
                ddt = 1 - ddt;
                const progJumpForce = this.progressiveJumpForce * ddt
                console.log(progJumpForce);
                this.spriteBody.velocity.y += progJumpForce;
            } else if (isGrounded && lastJumpDelta > this.jumpLimitInterval) {
                console.log('starting jump');
                this.lastJumpAt = time;
                this.spriteBody.setVelocityY(this.initialJumpForce);
            }
        }

        if (Math.abs(this.spriteBody.velocity.x) > 1) {
            this.sprite.flipX = this.spriteBody.velocity.x < 0;
        }

        if (!isGrounded) {
            this.sprite.anims.play('player-jump', true);
        } else {
            if (Math.abs(this.spriteBody.velocity.x) > 1) {
                this.sprite.anims.play('player-run', true);
            } else {
                this.sprite.anims.play('player-idle', true);
            }
        }

        // this.spriteBody.drawDebug(globals.DEBUG_GRAPHICS);
    }

    destroy() {
        this.sprite.destroy();
        super.destroy();
    }
}
