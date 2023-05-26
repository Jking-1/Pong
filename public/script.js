const canvas = document.getElementById('pong');
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

class Vec {
    constructor(x=0, y=0){
        this.x = x;
        this.y = y;
    }
    get len (){
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    set len (value){
        const fact = value / this.len;
        this.x *= fact;
        this.y *= fact;
    }
}

class Rect {
    constructor(w,h){
        this.pos = new Vec;
        this.size = new Vec(w, h);
    }
    get left(){
        return this.pos.x -(this.size.x/2);;
    }
    get right(){
        return this.pos.x + (this.size.x / 2);
    }
    get top(){
        return this.pos.y - (this.size.y/2);
    }
    get bottom(){
        return this.pos.y + (this.size.y / 2);
    }
}

class Ball extends Rect{
    constructor(){
        super(10,10);
        this.vel = new Vec;
    }
}

class Player extends Rect {
    constructor(){
        super(20,100);
        this.score = 0;
    }
}

class Pong {
    constructor(canvas){
        this._canvas = canvas;
        this.context = canvas.getContext('2d');

        this.ball = new Ball;

        this.ball.pos.x = WIDTH/2;
        this.ball.pos.y = HEIGHT/2;

        this.ball.vel.x = 300 * (Math.random() > .5 ? 1 : -1);
        this.ball.vel.y = 300 * (Math.random() * 2 - 1);
        this.ball.vel.len = 200;

        this.scoreLimit = 1;

        this.players = [
            new Player,
            new Player,
        ];

        this.players[0].pos.x = 40;
        this.players[1].pos.x = WIDTH - 40;
        this.players.forEach(player => {
            player.pos.y = HEIGHT / 2;
        });

        let lastTime;

        const callback = (millis) =>{
            if(lastTime){
                this.update((millis - lastTime) / 1000);
            }
            lastTime = millis;
            requestAnimationFrame(callback)
        };
        callback();
        this.reset();

    }

    collide(player, ball){
        if((player.left < ball.right) && (player.right > ball.left) && (player.top < ball.bottom) && (player.bottom > ball.top)){
            const len = this.ball.vel.len;
            this.ball.vel.x = -this.ball.vel.x;
            this.ball.vel.y += 500 * (Math.random() - 0.5);
            this.ball.vel.len = len *  1.1;
        }
    }

    draw(){
        this.context.fillStyle = '#000';
        this.context.fillRect(0,0,WIDTH, HEIGHT);

        this.drawRect(this.ball);
        
        this.players.forEach(player => this.drawRect(player));

        this.drawScore();
    }

    drawScore(){
        // var scale = window.devicePixelRatio; 
        // console.log(scale)
        let player = this.players[0].score;
        let computer = this.players[1].score;
        let bar = "|"
        // this.context.scale(scale, scale);
        this.context.font = '5vh Copperplate';
        this.context.fillStyle = '#fff';
        this.context.display = 'flex';
        this.context.fillText(player, WIDTH/3, 50);
        this.context.fillText(bar, WIDTH/2, 50);
        this.context.fillText(computer, (WIDTH/3)*2, 50);

    }

    drawRect(rect){
        this.context.fillStyle = '#fff';
        this.context.fillRect(rect.left, rect.top, rect.size.x, rect.size.y);
    }

    reset(){
        this.ball.pos.x = WIDTH/2;
        this.ball.pos.y = HEIGHT/2;
        this.ball.vel.x = 300 * (Math.random() > .5 ? 1 : -1);
        this.ball.vel.y = 300 * (Math.random() * 2 + 1);
        this.ball.vel.len = 200;
    }

    update (deltaTime){
        this.ball.pos.x += this.ball.vel.x * deltaTime;
        this.ball.pos.y += this.ball.vel.y * deltaTime;
    
        if(this.ball.left < 0 || this.ball.right > WIDTH){
            const playerId = this.ball.left < 0 ? 1 : 0;
            this.players[playerId].score++;
            if(this.players[playerId].score == this.scoreLimit){
                if(playerId === 0){
                    console.log("You won!!")
                }else{
                    console.log("You lost :(")
                }
            }
            this.reset();
        }
        if(this.ball.top < 0 || this.ball.bottom > HEIGHT){
            this.ball.vel.y = -this.ball.vel.y;
        }

        this.players[1].pos.y = this.ball.pos.y;
        this.players.forEach(player => {
            this.collide(player, this.ball);
        })

        this.draw();
    
    }
}
const pong = new Pong(canvas);
canvas.addEventListener('mousemove', event => {
    pong.players[0].pos.y = event.offsetY;
})



















// for making the ball a circle 

// context.beginPath();
// context.arc(10, 10, 10, 0, 2*Math.PI);
// context.fillStyle = '#fff';
// context.fill();
