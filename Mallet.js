class Mallet {
    constructor(x, y, color) {
        this.pos = createVector(x, y);
        this.vel = createVector(0, 0);
        this.color = color;
        this.radius = 30;
    }
    update() {
        noStroke();
        fill(this.color);
        ellipse(this.pos.x, this.pos.y, this.radius * 2, this.radius * 2);
        fill(0, 0, 0, 50);
        ellipse(this.pos.x, this.pos.y, this.radius, this.radius);
    }
    setPos(x, y) {
        this.vel = createVector(x, y).sub(this.pos).limit(10);
        this.pos.x = x;
        this.pos.y = y;
    }
}