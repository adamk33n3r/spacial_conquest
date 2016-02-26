import * as Messages from '../../../shared/Messages';

export default class Spaceship {
    // game: Phaser.Game;
    // player: Phaser.Sprite;
    // body: Phaser.Physics.P2.Body;
    // cursors: Phaser.CursorKeys;
    move: Messages.Movements;

    constructor(follow: boolean) {
        // this.game = game;
        // this.player = this.game.add.sprite(0, 0, 'player');
        // this.player.anchor.setTo(0.5, 0.5);
        // this.game.physics.p2.enable(this.player, true);

        // this.body = this.player.body;
        // this.body.mass = 1;
        // this.body.collideWorldBounds = true;

        if (follow) {
            // this.game.camera.follow(this.body.sprite);
        }

        // this.cursors = game.input.keyboard.createCursorKeys();
    }

    destroy() {
        // this.player.destroy();
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
        let oldMovement: Messages.Movements = this.move;

        this.move = Messages.Movements.Idle;
        /*
        if (this.cursors.up.isDown) {
            this.move |= Messages.Movements.ForwardThrust;
        }
        else if (this.cursors.down.isDown) {
            this.move |= Messages.Movements.ReverseThrust;
        }

        if (this.cursors.left.isDown) {
            this.move |= Messages.Movements.LeftThrust;
        }
        else if (this.cursors.right.isDown) {
            this.move |= Messages.Movements.RightThrust;
        }
        */
        return (oldMovement !== this.move);
    }
}
