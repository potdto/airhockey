class Puck {
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.radius = 20;
        this.vel = createVector(0, 0);
    }
    score(place) {
        score[place == BOTTOM ? 0 : 1]++;
        this.vel.setMag(0);
        this.pos.x = width / 2;
        this.pos.y = place == BOTTOM ? height * 3 / 4 : height / 4;
    }
    update() {
        fill(255);
        ellipse(this.pos.x, this.pos.y, this.radius * 2, this.radius * 2);
        this.pos.add(this.vel);
        const betweenGoal = this.pos.x >= (width - goalWidth) / 2 && this.pos.x < (width + goalWidth) / 2;

        if (this.pos.x + this.radius >= width || this.pos.x <= this.radius) this.vel.x = -this.vel.x;
        if (this.pos.y + this.radius >= height) { // at bottom
            if (betweenGoal) {
                return this.score(BOTTOM);
            }
            this.vel.mult(-1);
        }
        if (this.pos.y <= this.radius) { // at top
            if (betweenGoal) {
                return this.score(TOP);
            }
            this.vel.mult(-1);
        }

    }
    setPos(x, y) {
        this.vel = createVector(x, y).sub(this.pos);
        this.pos.x = x;
        this.pos.y = y;
    }
    malletCollisionLogic(mallet) {
        const colliding = () => abs(dist(mallet.pos.x, mallet.pos.y, this.pos.x, this.pos.y)) < mallet.radius + this.radius;


        if (colliding()) {
            let normal = mallet.pos.copy().sub(this.pos).normalize();
            let relVel = mallet.vel.copy().sub(this.vel);
            let sepVel = relVel.copy().dot(normal);
            let newSepVel = -sepVel;
            let sepVelVec = normal.copy().mult(newSepVel);

            if (mallet.vel.equals(createVector(0, 0))) return (this.vel = sepVelVec.mult(-1));

            this.vel.add(sepVelVec.mult(-1));

            while (colliding())
                this.pos.add(sepVelVec.normalize());
        }
    }
}