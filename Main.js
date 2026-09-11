/*Vortex is a game inspired by Geometry Dash, more specifically the rocket ship parts
in the game and works by having the user click the space bar to move their player.
The goal is to dodge the obstacles for as long as possible to get a high score.*/

//Amount of time set for a timer function 
const DELAY = 10;

//Song added when game is played, each time run is pressed, a random song from 
//this list plays
let mySongList = ["https://codehs.com/uploads/596b7e88daefd73f928ad289c1d2b9d7",
"https://codehs.com/uploads/5eefb3cb83135d230d5cec0a702e8489",
"https://codehs.com/uploads/71255a93729a4793d4d5bbfd4280047c",
"https://codehs.com/uploads/e0139f4bb288233c7a425865347aa358"]; 

let mySong;
 
//Variables for the players (arrows) to initalize them
let player;
const TRAIL_SIZE = 10;
const PLAYER_OFFSET = 150;
const PLAYER_SIZE = 30;
let playerSpeed = 2;

//Keeps track of the trail objects
let trail = [];

//Initalizes the players position before moved
let dy = 0;
const MAX = 6; //Max speed the player can move

//Collects the top and bottom bricks that move
let brickTop = [];
let brickBottom = [];

//Variables that initialize the bricks
const BRICK_SIZE = 50;
const BRICK_COLOR = "#96e394"; 
const BRICK_OFFSET = 5;
let BRICK_SPEED = -playerSpeed; //Sets the brick speed with respect to the players speed

//Variables responsible for background
let back;
let backSquare;
let backSquareColor = ['#7cfa6b', '#77eaf7', '#f390fc']; //Color for the squares in the background
let backColor = ["#aaff9e", '#9ff3fc', "#f5a2fc"]; //COlor for the background
let value = Randomizer.nextInt(0, 2); //This assigins a random number, which is used to decide the color for the background
let movingBackSquare = []; //Responsible for moving back squares

//Creates the point display variable
let pointDisplay;
let score = 0; // Initialize score

//Holds the potential characters that the user can choose from
//Selects the number in the array corresponding to the user's input
let chosenPlayer = ["https://codehs.com/uploads/e3ae3806ec43fc1348fdadbdbf881cbc",
    "https://codehs.com/uploads/0f5a22dd4b4842bb128553e99f086235",
    "https://codehs.com/uploads/4ca32e18215290174c26b56d6aec5cc8"
];

const obsImage = "https://codehs.com/uploads/feae5ad2bd3753f6beeef0519f8d7b68"

//Variable for the play button that appears  on the screen
let playButton = new WebImage("https://codehs.com/uploads/aed468affba5dbf424e381368afa3c7f");

//Variable for the title that appears on the screen
let title = new WebImage("https://codehs.com/uploads/cb95ce1606040389f2f366921be108d4");

//Variable for title that appears when player loses
let lostTitle=new WebImage("https://codehs.com/uploads/765dcbad2acdb08731d1b60c43c15568");

let gameStarted = false; //Initialize gameStarted, meaning the game hasn't started 

//Obstacles are pushed into this array once they are made 
let obs1 = [];
let OBJ_SPEED = -5; //Initialize speed of the obstacles

//First thing shown when code is run
function main() {
    setSize(1920 / 3, 1080 / 3); //Set size of the canvas

//Functions are called to show the opening screen before the game is started    
    background();
    backPattern();
    backgroundBorder();
    initBrick();
    
    let num = Randomizer.nextInt(mySongList.length);
    mySong = new Audio(mySongList[num]);
    mySong.play();
    mySong.loop = true;

    setTimer(drawBrick, DELAY); 
    setTimer(moveBack, DELAY * 1.5); 

    mouseClickMethod(startGame); //Starts the game
    openingScreen(); //Shows the play button and the name of the game
}

//This function starts the game and calls all of the functions necessary for gameplay
function startGame(e) {
    let elem = getElementAt(e.getX(),e.getY()); //Tracks where the user's mouse is
    
    //If user clicks the play button, the game starts
    if (elem != null && elem.getType() == "WebImage") {
        gameStarted = true;
        remove(playButton);
        remove(title);
        
        player = initPlayer(); 
        background();
        backPattern();
        backgroundBorder();
        initBrick();
        initPoints(); // Initialize points display
    
        setTimer(drawPlayer, DELAY); 
        setTimer(drawBrick, DELAY);
        setTimer(increaseSpeed, 10000);
        setTimer(moveBack, DELAY * 1.5);
        setTimer(addObs, 2500);
        setTimer(drawObs, DELAY);
        setTimer(obsCollision, 100);
        
        //Moves the player up and down depending on the key that is pressed
        keyDownMethod(keyDown);
        keyUpMethod(keyUp);
    }
}

//Displays the play button and the title of the game on the screen
function openingScreen() {
    playButton.setPosition(getWidth() / 2 - 150 / 2, getHeight() / 2 - 130 / 2+40);
    playButton.setSize(150, 130);
    add(playButton);
    playButton.layer = 13;
    
    title.setPosition(getWidth()/2-320/2, getHeight()/2-220/2);
    title.setSize(320,100);
    add(title);
    title.layer=12;
}

//Increases the speed of the player and the bricks as the game progresses
//Making it harder for the player to dodge obstacles
function increaseSpeed() {
    playerSpeed += 0.25;

    if (playerSpeed >= MAX) {
        playerSpeed = MAX;
        stopTimer(increaseSpeed);
    }

    BRICK_SPEED = -playerSpeed; //Increases the speed of parallax
}

//Sets the background color
function background() {
    back = new Rectangle(getWidth(), getHeight());
    back.setColor(backColor[value]);
    back.layer = 1;
    add(back);
}
//Creates the small square pattern in the backround
function backPattern() {
    for (let i = 0; i < 10; i++) {
        let backSize = Randomizer.nextInt(10, 60); //Randomizes size of square
        backSquare = new Rectangle(backSize, backSize);
        backSquare.setColor(backSquareColor[value]);

        let x, y; 
        let z = backSize;

        while (true) {
            x = Randomizer.nextInt(z, getWidth() - backSize);
            y = Randomizer.nextInt(100, 440);
            if (squareOverlap(x, y, backSize)) {
                break;
            }
        }

        backSquare.setPosition(x, y);
        add(backSquare);
        movingBackSquare.push(backSquare); //Adds square into array
        z = z + 30;
    }
}

//Checks for overlapping squares and moves them to a different position
function squareOverlap(x, y, backSize) {
    for (let i = x; i < x + backSize; i++) {
        let elem = getElementAt(i, y);
        if (elem != null && elem != back) {
            return false;
        }
        
        let elem2 = getElementAt(i, y + backSize);
        if (elem != null && elem != back) {
            return false;
        }
    }

    for (let i = y; i < y + backSize; i++) {
        let elem = getElementAt(x, i);
        if (elem != null && elem != back) {
            return false;
        }
        
        let elem2 = getElementAt(x + backSize, i);
        if (elem != null && elem != back) {
            return false;
        }
    }

    return true;
}

//Moves the background squares across the screen and when they go off screen,
//a new square pattern is drawn
function moveBack() {
    for (let i = 0; i < movingBackSquare.length; i++) {
        movingBackSquare[i].move(BRICK_SPEED, 0);

        if (movingBackSquare[i].getX() + BRICK_SIZE <= 0) {
            remove(movingBackSquare[i]);
            movingBackSquare.splice(i, 1);
        }
        if (movingBackSquare[movingBackSquare.length - 1].getX() < 0) {
            backPattern();
        }
    }
}

//Creates the border of the background
function backgroundBorder() {
    //Creates the top boarder and adds it
    let rect = new Rectangle(getWidth(), BRICK_SIZE + 10);
    rect.setColor("black");
    add(rect);

    //Creates bottom border and adds it
    let rectBottom = new Rectangle(getWidth(), BRICK_SIZE + 10);
    rectBottom.setColor("black");
    rectBottom.setPosition(0, getHeight() - rect.getHeight());
    add(rectBottom);
}

//Asks for user input to choose a player 
function choosePlayer() {
    let choice = readInt("Choose a character: 1, 2 or 3: ");

//While a number other than 1,2, or 3 is chosen, the user will be asked to choose
//a player again
    while (choice == "0" || choice > 3) {
        console.log("Invalid Character");
        choice = readInt("Please choose a valid number: 1, 2 or 3");
    }
    //Choice is returned 
    return choice;
}
//Player is initalized based on the user's choice and is placed on the screen
function initPlayer() {
    let playerSelect = choosePlayer();
    let player = new WebImage(chosenPlayer[playerSelect - 1]); //Grabs player from stored array
    player.setPosition(player.getWidth() + PLAYER_OFFSET, getHeight() / 2);
    player.setRotation(90);
    player.setSize(PLAYER_SIZE, PLAYER_SIZE);
    add(player);
    player.layer = 11;
    chosenPlayer.push(player);
    return player;
}

//The bricks on the top and bottom of the screen are initialized 
function initBrick() {
    for (let i = 0; i < getWidth() / (BRICK_SIZE + BRICK_OFFSET); i++) {
        let x = 0 + (BRICK_SIZE + BRICK_OFFSET) * i;
        let y = BRICK_OFFSET;

        let rect = new Rectangle(BRICK_SIZE, BRICK_SIZE);
        rect.setColor(BRICK_COLOR);
        rect.setPosition(x, y);
        add(rect);

        brickTop.push(rect); //Top bricks are pushed into its array
    }

    for (let i = 0; i < getWidth() / (BRICK_SIZE + BRICK_OFFSET); i++) {
        let x = 0 + (BRICK_SIZE + BRICK_OFFSET) * i;
        let y = BRICK_OFFSET;

        let rectBottom = new Rectangle(BRICK_SIZE, BRICK_SIZE);
        rectBottom.setColor(BRICK_COLOR);
        rectBottom.setPosition(x, getHeight() - BRICK_SIZE - BRICK_OFFSET);
        add(rectBottom);

        brickBottom.push(rectBottom); //Bottom bricks are pushed into its array
    }
}

//Precondition: A black rectangle is shown on the top and bottom as the border
//Postcondition: Green bricks are added on top of the rectangle in the border 
function addBrick(y) {
    let x = getWidth();

    let rect = new Rectangle(BRICK_SIZE, BRICK_SIZE);
    rect.setPosition(x, y);
    rect.setColor(BRICK_COLOR);
    add(rect);

    if (y == BRICK_OFFSET) {
        brickTop.push(rect);
    } else {
        brickBottom.push(rect);
    }
}

//A trail of rectangles are added behind the player 
function addTrail() {
    let rect = new Rectangle(TRAIL_SIZE, TRAIL_SIZE);
    rect.setColor("white");
    rect.setPosition(player.getX() + TRAIL_SIZE / 2, player.getY() + TRAIL_SIZE / 2); //Trail follows player
    rect.layer = 10;
    add(rect);

    trail.layer = 2;
    trail.push(rect); //Trail is stored in this array
}

//Makes the player go up when space bar is pressed
function keyDown(e) {
    if (e.key == " ") {
        dy = -playerSpeed;
        if (player.getY() > BRICK_SIZE + 10) {
            player.setRotation(49);
        }
    }
}

//Makes player go down when space bar is released
function keyUp(e) {
    dy = playerSpeed;
    player.setRotation(140);
}

//Draws the player and the trail
function drawPlayer() {
    addTrail();

    for (let i = 0; i < trail.length; i++) {
        trail[i].move(-playerSpeed, 0);

        if (trail[i].getX() + TRAIL_SIZE <= 0) {
            remove(trail[i]);
            trail.splice(i, 1);
        }
    }

//Checks for collisions of the player and the boarder
//If the player hits the boarder, it goes straight
    if (player.getY() + player.getHeight() >= getHeight() - BRICK_SIZE - 10) {
        if (dy < 0) {
            player.move(0, dy);
        } else {
            player.setRotation(90);
            player.setPosition(player.getX(), getHeight() - BRICK_SIZE - 10 - player.getHeight());
        }
    } else if (player.getY() <= BRICK_SIZE + 10) {
        if (dy > 0) {
            player.move(0, dy);
        } else {
            player.setRotation(90);
            player.setPosition(player.getX(), BRICK_SIZE + 10);
        }
    } else {
        player.move(0, dy);
    }
    // Increase score every time the player moves forward and checks for collision with obstacles
    updateScore();
}

//Uses a for loop to draw bricks along the border
function drawBrick() {
    for (let i = 0; i < brickTop.length; i++) {
        brickTop[i].move(BRICK_SPEED, 0);

        if (brickTop[i].getX() + BRICK_SIZE <= 0) {
            remove(brickTop[i]);
            brickTop.splice(i, 1);
        }
        if (brickTop[brickTop.length - 1].getX() < (getWidth() - BRICK_SIZE - BRICK_OFFSET)) {
            addBrick(BRICK_OFFSET);
            addBrick(getHeight() - BRICK_SIZE - BRICK_OFFSET);
        }
    }

    for (let i = 0; i < brickBottom.length; i++) {
        brickBottom[i].move(BRICK_SPEED, 0);

        if (brickBottom[i].getX() + BRICK_SIZE <= 0) {
            remove(brickBottom[i]);
            brickBottom.splice(i, 1);
        }
        if (brickBottom[brickBottom.length - 1].getX() < (getWidth() - BRICK_SIZE - BRICK_OFFSET)) {
            addBrick(BRICK_OFFSET);
            addBrick(getHeight() - BRICK_SIZE - BRICK_OFFSET);
        }
    }
}

//The number of obstacles are randomized and added to the screen
function addObs() {
    let size = 30;
    let positions = [
    Randomizer.nextInt(60, 110),
    Randomizer.nextInt(140, 190),
    Randomizer.nextInt(220, 270)
];

for (let y of positions) {
    let obs = new WebImage(obsImage);
    obs.setSize(size, size);
    obs.setPosition(getWidth(), y);
    obs.layer = 13;
    add(obs);
    
    obs1.push(obs);
}
}

//moves the obstacles across the screen
function drawObs() {
    obs1.forEach(item => {
        item.move(OBJ_SPEED, 0);
        
        if(item.getX() + item.getWidth() <= 0){
            remove(item);
            obs1.splice(obs1.indexOf(item),1);
        }
    });
}

// Initialize points display
function initPoints() {
    pointDisplay = new Text(score, "20pt Courier New");
    pointDisplay.setPosition(15,90);
    pointDisplay.layer = 4;
    
    add(pointDisplay);
}

// Update the points display
function updateScore() {
    score++;
    pointDisplay.setText(score);
}

function obsCollision() {
    // Check the player's position and look for collision with any obstacle in obs1

    
    let elem=getElementAt(player.getX()+player.getHeight(),player.getY()+player.getHeight());
    if (elem!=null && obs1.includes(elem)==true){
        gameOver();
    }
    
    elem=getElementAt(player.getX()+player.getHeight(),player.getY()+player.getHeight()/2);
    if (elem!=null && obs1.includes(elem)==true){
        gameOver();
    }
}
//Called when player collides with an obstacle
//Stops all timers and displays game over message
function gameOver(){
    mySong.pause();
    
    // Stop all timers
    stopTimer(drawPlayer);
    stopTimer(drawBrick);
    stopTimer(increaseSpeed);
    stopTimer(moveBack);
    stopTimer(addObs);
    stopTimer(drawObs);
    
    removeAll();

    // Display game over message 
    let rect = new Rectangle(getWidth(),getHeight());
    rect.setColor(backColor[value]);
    add(rect);
    
    lostTitle.setSize(670,130);
    lostTitle.setPosition(getWidth()/2-500/2+25,getHeight()/2-lostTitle.getHeight()/2);
    add(lostTitle);

    
    let txt = new Text("SCORE: "+score,"30pt Courier New");
    txt.setPosition(getWidth() / 2 - txt.getWidth()/2, getHeight() / 2 + txt.getWidth()/2 );
    txt.setColor("black");
    add(txt);
}

main();