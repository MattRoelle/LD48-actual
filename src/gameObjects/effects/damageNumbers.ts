export function damageNumbers(scene: Phaser.Scene, input: {
    val: string,
    x: number,
    y: number,
}) {
    const container = scene.add.container(input.x, input.y);
    const graphics = scene.add.graphics();
    graphics.fillStyle(0xFFFFFF);
    // graphics.fillRect(-100, -40, 200, 80);
    container.add(graphics);
    const text = scene.add.text(0, 0, input.val, {
        color: '#333333',
        fontSize: '40px',
        fontFamily: 'Dosis',
        align: 'center'
    });
    container.add(text);
    scene.tweens.add({
        targets: container,
        duration: 1000,
        y: input.y - 400,
        alpha: 0,
        onComplete: () => {
            container.destroy();
        }
    });
}