import Movements from '../../../shared/Movements';

export default class Spaceship {
    player: PIXI.Sprite;
    stage: PIXI.Container;
    move: Movements;

    constructor(stage: PIXI.Container, follow: boolean) {
        this.stage = stage;

        let texture: PIXI.Texture = PIXI.Texture.fromImage('/images/player.png');
        this.player = new PIXI.Sprite(texture);
        this.player.anchor.x = 0.5;
        this.player.anchor.y = 0.5;
        this.player.position.x = 100;
        this.player.position.y = 100;
        this.stage.addChild(this.player);
    }

    destroy() {
        this.stage.removeChild(this.player);
    }

    setState(
        position: number[],
        velocity: number[],
        force: number[],
        angle: number,
        angularVelocity: number,
        angularForce: number) {
        /*
        this.body.data.position = position;
        this.body.data.velocity = velocity;
        this.body.data.force = force;
        this.body.data.angle = angle;
        this.body.data.angularVelocity = angularVelocity;
        this.body.data.angularForce = angularForce;
        */
    }

    update() {
        let oldMovement: Movements = this.move;

        this.move = Movements.Idle;
        /*
        if (this.cursors.up.isDown) {
            this.move |= Movements.ForwardThrust;
        }
        else if (this.cursors.down.isDown) {
            this.move |= Movements.ReverseThrust;
        }

        if (this.cursors.left.isDown) {
            this.move |= Movements.LeftThrust;
        }
        else if (this.cursors.right.isDown) {
            this.move |= Movements.RightThrust;
        }
        */
        return (oldMovement !== this.move);
    }
}
