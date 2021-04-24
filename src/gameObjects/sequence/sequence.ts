export type SequenceResult = {
    type: 'wait',
    duration: number
} | {
    type: 'tween',
    tween: Phaser.Types.Tweens.TweenBuilderConfig
} | {
    type: 'tweens',
    tweens: Phaser.Types.Tweens.TweenBuilderConfig[]
} | {
    type: 'delayed-call',
    duration: number,
    fn: () => void
};

export type SequenceGenerator = Generator<SequenceResult, void, unknown>;
export type Sequence<TParams> = (scene: Phaser.Scene, input: TParams) => SequenceGenerator;

function processSequenceResult(scene: Phaser.Scene, result: SequenceResult, onDone: () => void) {
    switch (result.type) {
        case 'delayed-call':
            scene.time.delayedCall(result.duration, result.fn);
            onDone();
            break;
        case 'wait':
            scene.time.delayedCall(result.duration, onDone);
            break;
        case 'tween':
            scene.tweens.add({
                ...result.tween,
                onComplete: onDone
            });
            break;
        case 'tweens':
            let numDone = 0;

            const completeTween = () => {
                numDone++;
                if (result.tweens.length <= numDone) {
                    onDone();
                }
            }

            for (let t of result.tweens) {
                scene.tweens.add({
                    ...t,
                    onComplete: completeTween
                });
            }
            break;
    }
}

export async function playSequence(scene: Phaser.Scene, sequence: SequenceGenerator) {
    return new Promise<void>((resolve, reject) => {
        function next() {
            const result = sequence.next();
            if (result && result.value && !result.done) {
                processSequenceResult(scene, result.value, next);
            } else {
                resolve();
            }
        }
        next();
    });
}