let puck, myMallet, opponentMallet, peer, opponentPeerId, connected, connectionData;

function setup() {
    createCanvas(400, 500);
    puck = new Puck(width / 2, height / 2);
    myMallet = new Mallet(width / 2, height * 3 / 4, "red");
    opponentMallet = new Mallet(width / 2, height / 4, "blue");
    textAlign(CENTER);
    connected = false;
}

function draw() {

    sendData({
        mallet: {
            xpos: myMallet.pos.x,
            ypos: myMallet.pos.y,
            xvel: myMallet.vel.x,
            yvel: myMallet.vel.y,
        },
        puck: {
            xpos: puck.pos.x,
            ypos: puck.pos.y,
            xvel: puck.vel.x,
            yvel: puck.vel.y,
        }
    });


    if (!connected) return;
    background(0);
    fill(100);
    rectMode(CORNER);
    rect(0, height / 2 - puck.radius, width, puck.radius * 2);
    textSize(24);
    fill(255)
    text(score[0], width - 20, 30); // my score
    text(score[1], width - 20, height - 15) // opponent score
    rectMode(CENTER);
    rect(width / 2, 5, goalWidth, 10)
    rect(width / 2, height - 5, goalWidth, 10)


    puck.update();
    myMallet.update();
    opponentMallet.update();


    myMallet.setPos(
        constrain(mouseX, myMallet.radius, width - myMallet.radius),
        constrain(mouseY, height / 2 + myMallet.radius, height - myMallet.radius)
    );

    puck.malletCollisionLogic(opponentMallet);
    puck.malletCollisionLogic(myMallet);
}

const peerId = Math.random().toString(36).substring(2, 7);
peer = new Peer(peerId);
peer.on('open', id => {
    document.getElementById("peer-id").innerText = id;
    const inputField = document.getElementById("peer-input");
    inputField.addEventListener("keydown", (e) => {
        if (e.key == "Enter") {
            connect(inputField.value);
        }
    });
});



function connect(id) {
    const conn = peer.connect(id);




    conn.on('open', () => {
        connected = true;
        document.getElementById("connmsg").style.display = "none";
        setInterval(() => conn.send(connectionData));
    });
    conn.on('data', data => {
        opponentMallet.vel.x = data.mallet.xvel;
        opponentMallet.vel.y = -data.mallet.yvel;
        opponentMallet.pos.x = data.mallet.xpos;
        opponentMallet.pos.y = height - data.mallet.ypos;
    });
}
function sendData(data) {
    connectionData = data;
}


peer.on('connection', conn => {
    conn.on('open', () => {
        connected = true;
        document.getElementById("connmsg").style.display = "none";
        setInterval(() => conn.send(connectionData));
    })
    conn.on('data', data => {
        opponentMallet.vel.x = data.mallet.xvel;
        opponentMallet.vel.y = -data.mallet.yvel;
        opponentMallet.pos.x = data.mallet.xpos;
        opponentMallet.pos.y = height - data.mallet.ypos;
        puck.pos.x = data.puck.xpos;
        puck.pos.y = height - data.puck.ypos;
        puck.vel.x = data.puck.xvel;
        puck.vel.y = -data.puck.yvel;
    })
});