const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#4488aa',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload,
        create,
        update
    },
    parent: 'game-container'
};

let player;
let cursors;
let bullets;
let lastFired = 0;
let enemies;
let score = 0;
let scoreText;

const game = new Phaser.Game(config);

function preload() {
    this.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-dude.png');
    this.load.image('bullet', 'https://labs.phaser.io/assets/sprites/bullet.png');
    this.load.image('enemy', 'https://labs.phaser.io/assets/sprites/space-baddie.png');
}

function create() {
    player = this.physics.add.sprite(400, 500, 'player').setCollideWorldBounds(true);

    bullets = this.physics.add.group({
        defaultKey: 'bullet',
        maxSize: 10
    });

    enemies = this.physics.add.group({
        key: 'enemy',
        repeat: 5,
        setXY: { x: 50, y: 50, stepX: 120 }
    });

    cursors = this.input.keyboard.createCursorKeys();

    scoreText = this.add.text(16, 16, 'امتیاز: 0', { fontSize: '24px', fill: '#fff' });

    this.physics.add.overlap(bullets, enemies, hitEnemy, null, this);
}

function update(time) {
    if (cursors.left.isDown) {
        player.setVelocityX(-300);
    } else if (cursors.right.isDown) {
        player.setVelocityX(300);
    } else {
        player.setVelocityX(0);
    }

    if (cursors.space.isDown && time > lastFired) {
        const bullet = bullets.get(player.x, player.y - 20);
        if (bullet) {
            bullet.setActive(true).setVisible(true);
            bullet.body.velocity.y = -400;
            lastFired = time + 300;
        }
    }
}

function hitEnemy(bullet, enemy) {
    bullet.disableBody(true, true);
    enemy.disableBody(true, true);

    score += 10;
    scoreText.setText('امتیاز: ' + score);
}