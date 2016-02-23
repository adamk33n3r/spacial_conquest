export default class Spaceship {
    static ACCELERATION: number = 400;
    static ROTATION: number = 300;
    static DRAG: number = 200;
    static ANGULARDRAG: number = 200;
    static MAXSPEED: number = 400;

    player: Phaser.Sprite;
    cursors: Phaser.CursorKeys;

    constructor(game: Phaser.Game) {
        this.player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
        this.player.anchor.setTo(0.5, 0.5);
        game.physics.enable(this.player);
        this.player.body.collideWorldBounds = true;

        this.player.body.maxVelocity.setTo(Spaceship.MAXSPEED, Spaceship.MAXSPEED);
        this.player.body.maxAngular = Spaceship.MAXSPEED;
        this.player.body.drag.setTo(Spaceship.DRAG, Spaceship.DRAG);
        this.player.body.angularDrag = Spaceship.ANGULARDRAG;

        game.camera.follow(this.player);

        this.cursors = game.input.keyboard.createCursorKeys();
    }

    update(game: Phaser.Game) {
        if (this.cursors.left.isDown) {
            this.player.body.angularAcceleration = -Spaceship.ROTATION;
        }
        else if (this.cursors.right.isDown) {
            this.player.body.angularAcceleration = Spaceship.ROTATION;
        }
        else {
            this.player.body.angularAcceleration = 0;
        }

        if (this.cursors.up.isDown) {
            game.physics.arcade.accelerationFromRotation(
                this.player.rotation,
                Spaceship.ACCELERATION,
                this.player.body.acceleration);
        }
        else if (this.cursors.down.isDown) {
            game.physics.arcade.accelerationFromRotation(
                this.player.rotation,
                -Spaceship.ACCELERATION,
                this.player.body.acceleration);
        }
        else {
            this.player.body.acceleration.set(0);
        }
    }
}
