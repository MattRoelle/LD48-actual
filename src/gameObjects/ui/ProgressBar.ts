export class ProgressBar extends Phaser.GameObjects.Container {
    value: number;
    maxValue: number;
    text: Phaser.GameObjects.Text;
    graphics: Phaser.GameObjects.Graphics;

    constructor(scene: Phaser.Scene, public config: {
        x: number,
        y: number,
        width: number,
        height: number,
        value: number,
        backdropColor: number,
        color: number,
        maxValue: number,
        showValueText: boolean
    }) {
        super(scene, config.x, config.y);
        this.scene.add.existing(this);

        this.graphics = this.scene.add.graphics();
        this.add(this.graphics);

        if (config.showValueText) {
            const textStyle: Phaser.Types.GameObjects.Text.TextStyle = {
                color: '#ffffff',
                fontSize: (Math.round(config.height)).toString() + 'px',
                fontFamily: 'Dosis',
                shadow: {
                    color: '#444444',
                    blur: 0,
                    offsetX: 2,
                    offsetY: 2,
                    fill: true,
                    stroke: true
                }
            };

            this.text = this.scene.add.text(2, -2, "", textStyle);
            this.add(this.text);
        }

        this.setValue(config.value, config.maxValue);
    }

    setValue(value: number, maxValue?: number) {
        if (maxValue) {
            this.maxValue = maxValue;
        }
        this.value = Math.max(0, Math.min(value, this.maxValue));

        if (this.text) {
            this.text.text = `${value}`    ;
        }

        const width = this.value / this.maxValue;
        
        this.graphics.clear();
        
        this.graphics.fillStyle(this.config.backdropColor);
        this.graphics.fillRect(0, 0, this.config.width, this.config.height);

        this.graphics.fillStyle(this.config.color);
        this.graphics.fillRect(0, 0, this.config.width * width, this.config.height);

        this.graphics.lineStyle(2, 0x444444);
        this.graphics.strokeRect(0, 0, this.config.width, this.config.height);
    }
}
