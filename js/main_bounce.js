WebFontConfig = {google: {families: ['Fontdiner Swanky']}};

getHighScore();
getAnyoneScore();

var score, lives, level, timeBonus, reason, countJetSeconds, endLevelStuff, name;
var thisX,newX,oldX, jumpDistance, notHidden, logoImg1, logoImg2, chooseLevelImg;
var musics, music1, music2, track;

var screenNames = ['Welcome!','Ups & downs','Break the wall!','Ground control to Major Bouncy','Hot potato'
,'Run Bouncy, Run!','Icarus','A most elusive fish...','Eclectic bounce','The maze of doom, Mu-hahaha!'];

var objects = [];
var levelColorImg = [];
var levelLockImg = [];
var chooseLevelText = [];
var allSfx = [];
var ballChosen = 'mr';

var WIDTH = 800;
var HEIGHT = 720;
var ROOM_WIDTH = 2400;

var INIT_BALL_X = 50;
var INIT_BALL_Y = 80;

var BALL_GRAV_X = 200;
var BALL_GRAV_Y = 150;
var BALL_BOUNCE_Y = 0.85;

var ANG_VELOCITY = 60;

var gameOn = false;
var gameStarted = false;
var KillInProgress = false;
var notHidden = true;
var contPoint = 0;
var starsInLevel = 0;
var starsBonus = 0;

var jetSeconds = 0;
var jetOpened = false;
var jetSfxOn = false;

var fishTimer = 0;
var anotherFishTimer = 0;
var movingFish = true;

var soundOn = true;

var helicopterTimer = 0;

var timeFromLastCollision = 0;
var greatJump = false;
var jumpTextTimer = 0;
var biggestJump = 0;
var longestFlight = 0;
var bestUserLevel = 1;

var game = new Phaser.Game(WIDTH, HEIGHT, Phaser.CANVAS, 'game', {preload: preload, create: create, update: update}, true);

var themeMusic = new buzz.sound("sounds/theme_music.wav", {
    preload: true,
    loop: true
});
var music1 = new buzz.sound("sounds/music1.wav", {
    preload: true,
    loop: true
});
var music2 = new buzz.sound("sounds/music2.wav", {
    preload: true,
    loop: true
});
var musics = [music1, music2, themeMusic];

function preload(){  
    game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
    
    game.load.image('room', 'images/bouncey/newBG2.png');
    game.load.image('choose', 'images/bouncey/choose.png');
    game.load.image('choose2', 'images/bouncey/choose2.png');
    game.load.image('color1', 'images/bouncey/1.png');
    game.load.image('color2', 'images/bouncey/2.png');
    game.load.image('color4', 'images/bouncey/4.png');
    game.load.image('enemy', 'images/bouncey/bug.png');
    game.load.image('hole', 'images/bouncey/hole.png');
    game.load.image('fish', 'images/bouncey/fish2.png');
    game.load.image('sea', 'images/bouncey/sea.png');
    game.load.image('jetPack', 'images/bouncey/jetPack.png');
    game.load.image('firstAid', 'images/bouncey/firstaid.png');
    game.load.image('coin', 'images/bouncey/star.png');
    game.load.image('logo', 'images/bouncey/newBG.jpg');
    game.load.image('levelBg', 'images/bouncey/levelBg.png');
    game.load.image('helicopter', 'images/bouncey/helicopter.png');
    game.load.image('cloud1', 'images/bouncey/cloud1.png');
    game.load.image('cloud2', 'images/bouncey/cloud2.png');
    game.load.image('tree', 'images/bouncey/tree.png');
    game.load.image('tree2', 'images/bouncey/tree2.png');
    game.load.image('tree3', 'images/bouncey/tree3.png');
    game.load.image('tree4', 'images/bouncey/tree4.png');
    game.load.image('lock', 'images/bouncey/lock.png');

    game.load.spritesheet('ball', 'images/bouncey/creature.png', 47, 44);
    game.load.spritesheet('miss_ball', 'images/bouncey/miss_creature.png', 47, 44);
    game.load.spritesheet('spring', 'images/bouncey/spring_c.png', 45, 39);
    game.load.spritesheet('splash', 'images/bouncey/splash.png', 314, 137, 6);
    game.load.spritesheet('color3', 'images/bouncey/3.png', 72, 72, 3);
    game.load.spritesheet('contBtn', 'images/bouncey/continue.png', 45, 46, 2);
    game.load.spritesheet('debris', 'images/bouncey/debris.png', 40, 17, 4);
    game.load.spritesheet('debris_b', 'images/bouncey/debris_b.png', 40, 30, 4);
    game.load.spritesheet('debris_p', 'images/bouncey/debris_p.png', 40, 30, 4);
    game.load.spritesheet('speaker', 'images/bouncey/speaker.png',30,26,2);
    
    game.load.audio('sfxSplash', 'sounds/splash2.wav');
    game.load.audio('sfxStar', 'sounds/star.wav');
    game.load.audio('sfxSucked', 'sounds/sucked.wav');
    game.load.audio('sfxLife', 'sounds/life.wav');
    game.load.audio('sfxCntBtn', 'sounds/cnt_btn.wav');
    game.load.audio('sfxBadTile', 'sounds/bad_tile.wav');
    game.load.audio('sfxJet', 'sounds/jet.wav');
    game.load.audio('sfxSpring', 'sounds/spring.wav');
    game.load.audio('sfxHit', 'sounds/hit.wav');
    game.load.audio('sfxBounce', 'sounds/bounce.wav');
    game.load.audio('sfxJetTaken', 'sounds/jetTaken.wav');  
    game.load.audio('sfxScore', 'sounds/score.wav');
    game.load.audio('sfxNew_life', 'sounds/new_life.wav');
}

function create(){
    if (game.load.hasLoaded) loadComplete('Game resources');

    // init vars
    score = 0;
    lives = 3;
    level = 0;
    timeBonus = 1000;
  
    // create room
    bg = game.add.tileSprite(0, 0, ROOM_WIDTH, HEIGHT, 'room');
    bg.fixedToCamera = true;

    game.world.setBounds(0, 0, ROOM_WIDTH, HEIGHT);
    game.physics.startSystem(Phaser.Physics.P2JS);

    floor = game.add.sprite(0, HEIGHT-85, null);
    game.physics.enable(floor, Phaser.Physics.ARCADE);
    floor.body.setSize(ROOM_WIDTH, 85);
    floor.body.immovable = true;
    
    ceiling = game.add.sprite(0, 0, null);
    game.physics.enable(ceiling, Phaser.Physics.ARCADE);
    ceiling.body.setSize(ROOM_WIDTH, 50);
    ceiling.body.immovable = true;
    
    // create texts
    scoreText = game.add.text(360, 10, '' + score, { font: "22px Fontdiner Swanky", fill: "#a65200", align:'left'});
    scoreText.fixedToCamera = true;
    scoreText.anchor.x = 0.5;
   
    livesText = game.add.text(140, 10, 'X ' + lives, { font: "24px Fontdiner Swanky", fill: "beige"});
    livesText.fixedToCamera = true;

    levelText = game.add.text(34, 8, '' + (level+1), { font: "23px Fontdiner Swanky", fill: "grey"});
    levelText.fixedToCamera = true;
    levelText.anchor.x = 0.5;
    
    timeBonusText = game.add.text(555, 10, '' + timeBonus, { font: "21px Fontdiner Swanky", fill: "#d66a00"});
    timeBonusText.fixedToCamera = true;
    timeBonusText.anchor.x = 0.5;  
    
    jetSecsText = game.add.text(715, 15,''+ jetSeconds, { font: "18px arial", fill: "darkred"});
    jetSecsText.fixedToCamera = true;
    jetSecsText.anchor.x = 0.5;

    // groups
    
    trees = game.add.group();

    colors = game.add.group();
    colors.enableBody = true;
    colors.physicsBodyType = Phaser.Physics.ARCADE;
    
    colors4 = game.add.group();
    colors4.enableBody = true;
    colors4.physicsBodyType = Phaser.Physics.ARCADE;

    springs = game.add.group();
    springs.enableBody = true;
    springs.physicsBodyType = Phaser.Physics.ARCADE;
    
    helicopters = game.add.group();
    helicopters.enableBody = true;
    helicopters.physicsBodyType = Phaser.Physics.ARCADE;

    holes = game.add.group();
    holes.enableBody = true;
    holes.physicsBodyType = Phaser.Physics.ARCADE;

    jets = game.add.group();
    jets.enableBody = true;
    jets.physicsBodyType = Phaser.Physics.ARCADE;

    coins = game.add.group();

    enemies = game.add.group();
    enemies.enableBody = true;
    enemies.physicsBodyType = Phaser.Physics.ARCADE;
    
    fishes = game.add.group();
    fishes.enableBody = true;
    fishes.physicsBodyType = Phaser.Physics.ARCADE;

    contBtns = game.add.group();
    contBtns.enableBody = true;
    contBtns.physicsBodyType = Phaser.Physics.ARCADE;

    sea = game.add.tileSprite(0, HEIGHT-134, ROOM_WIDTH, 134, 'sea');
    sea.alpha = 0.9;
    
    logo = game.add.image(0,0,'logo');

    clouds = game.add.group();
    clouds.enableBody = true;
    clouds.physicsBodyType = Phaser.Physics.ARCADE;
    clouds.alpha = 0.6;
    
    logoText = game.add.text(230, 165, 'Choose your character:', { font: "28px Fontdiner Swanky", fill: "#002800"});
    logoText2 = game.add.text(70, 18, 'B O U N C Y !', { font: "35px Fontdiner Swanky", fill: "darkblue"});
    logoText3 = game.add.text(340, 35, 'The Ball That Bounces Much', { font: "22px Fontdiner Swanky", fill: "#965000"});
    logoText4 = game.add.text(245, 415, 'Press ENTER to start', { font: "28px Fontdiner Swanky", fill: "#A52A2A"});
    
    logoImg1 = game.add.image(315, 300,'ball');
    logoImg2 = game.add.image(460, 300,'miss_ball');
    logoImg1.inputEnabled = true;
    logoImg2.inputEnabled = true;
    logoImg1.input.useHandCursor = true;
    logoImg2.input.useHandCursor = true;
    logoImg1.events.onInputDown.add(chooseBall, this);
    logoImg2.events.onInputDown.add(chooseBall, this);
   
    logoImgText = game.add.text(255, 220,'Mr. Bouncy \n (higher jumps but slower & heavier)', { font: "17px Fontdiner Swanky", fill: "darkblue"});
    chooseImg = game.add.image(305,290,'choose');
    
    storyText = game.add.text(60,380, "Ms. Bouncy was kidnapped by the evil mr. fish! it's up to you to save her!" , { font: "18px Fontdiner Swanky", fill: "#002800"});
    instText1 = game.add.text(235,465, 'MOVE LEFT & RIGHT - left & right arrows', { font: "15px Fontdiner Swanky", fill: "#802A2A"});
    instText2 = game.add.text(235,500, 'GAIN BOUNCE MOMENTUM - down arrow', { font: "15px Fontdiner Swanky", fill: "#802A2A"});
    instText3 = game.add.text(295,535, 'TURN ON JETS - up arrow', { font: "15px Fontdiner Swanky", fill: "#802A2A"});
    instText4 = game.add.text(225,570, 'pause - P   hide sidebars - H   restart level - R', { font: "15px Fontdiner Swanky", fill: "#802A2A"});
    creditText = game.add.text(10,638, 'C r e a t e d  b y  J o h n n y  T a l ,  2 0 1 5  ©', { font: "11px Fontdiner Swanky", fill: "lightyellow"});
    creditText2 = game.add.text(10,655, 'j o h n n y t a l 9 @ g m a i l . c o m', { font: "11px Fontdiner Swanky", fill: "lightyellow"});
    
    chooseLevelImg = game.add.image(55+((bestUserLevel-1)*70),80,'choose2');
    
    setTimeout(function(){
        if (levelColorImg[0] == undefined){
            for (n=0; n<10; n++){
                levelColorImg[n] = game.add.image(55+(n*70),80,'color1');
                levelColorImg[n].alpha = round((n/10)+0.1,1);
                levelColorImg[n].inputEnabled = true;
                levelColorImg[n].events.onInputDown.add(chooseLevel, this);
                levelColorImg[n].input.useHandCursor = true;
                
                if (n > bestUserLevel-1) levelLockImg[n] = game.add.image(75+(n*70),100,'lock');
                chooseLevelText[n] = game.add.text(70+(n*70),90,'Level \n    ' + (n+1),  { font: "14px Fontdiner Swanky", fill: "lightyellow"});
            }
        }
        chooseLevelImg.x = 55+((bestUserLevel-1)*70);
        loadComplete("User's level");
    },1200);

    pauseText = game.add.text(335, 50, 'Game Paused', { font: "22px Fontdiner Swanky", fill: "yellow"});
    pauseText.fixedToCamera = true;
    pauseText.visible = false;
    
    logoStuff = [logo, logoText, logoText2, logoText3, logoText4, instText1, instText2, storyText,
    instText3, instText4, logoImg1, logoImgText, logoImg2, chooseImg, chooseLevelImg, creditText, creditText2];
    
    createClouds();
    
    objects = [colors, colors4, enemies, holes, coins, contBtns, jets, fishes, springs, helicopters, clouds, trees];
    
    speaker = game.add.image(767,10,'speaker');
    speaker.inputEnabled = true;
    speaker.fixedToCamera = true;
    speaker.input.useHandCursor = true;
    speaker.events.onInputDown.add(toggleSound, this);
    speaker.frame = 1;
    
    //sfx
    sfxSplash = game.add.audio('sfxSplash');
    sfxStar = game.add.audio('sfxStar');
    sfxSucked = game.add.audio('sfxSucked');
    sfxLife = game.add.audio('sfxLife');
    sfxCntBtn = game.add.audio('sfxCntBtn');
    sfxBadTile = game.add.audio('sfxBadTile',0.4);
    sfxJet = game.add.audio('sfxJet');
    sfxSpring = game.add.audio('sfxSpring');
    sfxHit = game.add.audio('sfxHit');
    sfxBounce = game.add.audio('sfxBounce');
    sfxJetTaken = game.add.audio('sfxJetTaken');
    sfxScore = game.add.audio('sfxScore',0.8,true);
    sfxNew_life = game.add.audio('sfxNew_life',true);
    
    allSfx = [sfxSplash,sfxStar,sfxSucked,sfxLife,sfxCntBtn,sfxBadTile,sfxJet,sfxSpring,sfxHit,sfxBounce,sfxJetTaken,
    sfxScore,sfxNew_life];

    // keys
    cursors = game.input.keyboard.createCursorKeys();
    
    game.camera.deadzone = new Phaser.Rectangle(100, 100, 350, 400);

    themeMusic.load();
    themeMusic.setVolume(40).play();
    
    themeMusic.bind("canplaythrough", function(e) {loadComplete('Music');});
    
    
    if (!this.game.device.desktop){
            try{ mc.destroy(); }catch(e){}
            
            screen = document.getElementById('game');
            mc = new Hammer(screen);
            mc.get('swipe').set({ direction: Hammer.DIRECTION_ALL, threshold: 20 });
            
            mc.on("swiperight", function(ev) {
                if (!ev.handled){
                    ball.body.gravity.x = BALL_GRAV_X;
                    ball.body.angularVelocity = ANG_VELOCITY;
                };   
            });
            
            mc.on("swipeleft", function(ev) {
                if (!ev.handled){
                    ball.body.gravity.x = -BALL_GRAV_X;
                    ball.body.angularVelocity = -ANG_VELOCITY;
                };  
            });
            
        /*    mc.on("swipeup", function(ev) {
                 if(!ev.handled){
                     turnPlane('up');
                 };
            });*/
            
            mc.on("swipedown", function(ev) {
                 if(!ev.handled){
                    ball.body.gravity.y += 5;
                    ball.body.angularVelocity *= 0.8;
                 };
            });
            
           /* mc.on('doubletap', function(ev) {
                togglePause();
            });*/
        }
}

function chooseLevel(_level){
    factor = _level.alpha*10;
    if(factor < bestUserLevel+1) chooseLevelImg.x = (factor)*70-15;
}

function chooseBall(kindOfBall){
    if(kindOfBall.key == "miss_ball"){
        chooseImg.x = 450;
        ballChosen = 'miss';
        
        logoImgText.text = 'Ms. Bouncy \n (faster & lighter but lower jumps)';
        storyText.text = "Mr. Bouncy was kidnapped by the evil mr. fish! it's up to you to save him!";
        logoImgText.x = 415;
        logoImgText.y = 220;
        logoImgText.fill = "darkred";
    }
    else{
        chooseImg.x = 305;
        ballChosen = 'mr';
        
        logoImgText.text = 'Mr. Bouncy \n (higher jumps but slower & heavier)';
        storyText.text = "Ms. Bouncy was kidnapped by the evil mr. fish! it's up to you to save her!";
        logoImgText.x = 255;
        logoImgText.y = 220;
        logoImgText.fill = "darkblue";
    }
}

function removeLogo(){
    if (!gameStarted){
        for(x=0; x<logoStuff.length; x++) logoStuff[x].destroy();
        for(x=0; x<levelColorImg.length; x++) levelColorImg[x].destroy(); levelColorImg = [];
        for(x=0; x<chooseLevelText.length; x++) chooseLevelText[x].destroy();
        for(x=9; x>bestUserLevel-1; x--) levelLockImg[x].destroy();
        
        newLevelText = game.add.text(420, 270, "Level " + [level+1] + ": \n" + screenNames[level], { font: "40px Fontdiner Swanky", fill: "#a65200"});
        newLevelText.anchor.x = 0.5;
        
        game.time.events.add(2000, function() {
            game.add.tween(newLevelText).to({y: -100}, 2000, Phaser.Easing.Linear.None, true);
            game.add.tween(newLevelText).to({alpha: 0}, 2000, Phaser.Easing.Linear.None, true);
        }, this);
        
        themeMusic.fadeOut(500);
        startMusic();

        initBall();
    }     
}

function startMusic(){
    if (!(pauseText.visible)){
        track = Math.round(Math.random() * 2);
        musics[track].fadeIn(7500);
    }
}

function initBall(){ 
    levelText.text = '' + (level+1); 
    if (ballChosen == 'mr'){
        ball = game.add.sprite(INIT_BALL_X, INIT_BALL_Y, 'ball');
        BALL_GRAV_X = 200;
        BALL_GRAV_Y = 150;
        BALL_BOUNCE_Y = 0.85;
    }
    else if (ballChosen == 'miss'){
        ball = game.add.sprite(INIT_BALL_X, INIT_BALL_Y, 'miss_ball');  
        BALL_GRAV_X = 250;
        BALL_GRAV_Y = 130;
        BALL_BOUNCE_Y = 0.77;  
    }
    game.physics.enable(ball, Phaser.Physics.ARCADE);
    ball.enableBody = true;
    ball.body.gravity.y = BALL_GRAV_Y;
    ball.body.bounce.y = BALL_BOUNCE_Y;
    ball.body.bounce.x = 0.47;
    ball.body.collideWorldBounds = true;
    ball.anchor.setTo(0.5, 0.5);
    
    game.camera.follow(ball);
    gameStarted = true; 
    gameOn = true;
    
    if (level == 9){
        if (ballChosen == 'mr') game.add.image(765,270,'miss_ball');
        else if (ballChosen == 'miss') game.add.image(765,270,'ball');
    }
    
    locateObjects();
}

function update(){ 
    if(!gameStarted){
        
        if(game.input.activePointer.isDown){
            removeLogo(); 
        }
        
        level = (chooseLevelImg.x-55)/70;
        if (cursors.left.isDown) chooseBall(logoImg1);
        else if (cursors.right.isDown) chooseBall(logoImg2);
        else if (cursors.down.isDown && chooseLevelImg.x > 55){
            chooseLevelImg.x -= 70;  
            level = (chooseLevelImg.x-55)/70;   
        }
        else if (cursors.up.isDown && chooseLevelImg.x < 55+((bestUserLevel-1)*70)){
            chooseLevelImg.x += 70; 
            level = (chooseLevelImg.x-55)/70;
            levelText.text = '' + ((chooseLevelImg.x-55)/70+1);
        }
    }
    try{
        if (fishLocationX[level].length > 0){ // fish stuff    
             fishes.forEach(function(fish){
                if (fish.body.y > 602) fish.body.y = 602;
    
                if (movingFish && fish.body.y >= 602){
                    fish.body.moves = false; 
                    anotherFishTimer = 0; 
                    fishTimer++;
                    
                    if (fishTimer == 120 + ((fishLocationX[level].length-1)*75)) movingFish = false;           
                }
                
                else if (!movingFish){
                    fish.body.moves = true;
                    fishTimer = 0;
                    anotherFishTimer++;
               
                    if (anotherFishTimer > 5 + ((fishLocationX[level].length-1)*200) && fish.body.y >= 602) movingFish = true; 
                }
                
                else if (fish.body.y < 603){
                    fish.body.moves = true;
                    if (fish.body.velocity.y > 325) fish.body.velocity.y = 325;             
                }
            });
        }
    }catch(e){}
   
    if (gameOn){
        oldX = thisX;
        timeFromLastCollision += game.time.elapsed;
        
        if (timeBonus > 0){ // subtract time bonus
            timeBonus -= 0.2;
            timeBonusText.text = '' + Math.round(timeBonus);
        }
        
        if (greatJump){
            jumpTextTimer += game.time.elapsed;
            if (jumpTextTimer > 2500){
                try{jumpText.destroy();}catch(e){}
                try{jumpText2.destroy();}catch(e){}
                jumpTextTimer = 0;
                greatJump = false;
            }
        }

        if (ball.body.y<40) ball.body.y = 80;
        
        if (cursors.up.isUp && jetOpened) closeJet();
          
        if (cursors.left.isDown){
            ball.body.gravity.x = -BALL_GRAV_X;
            ball.body.angularVelocity = -ANG_VELOCITY;
            if (jetOpened && jetSeconds < 1) closeJet();
        }
        
        else if (cursors.right.isDown){
            ball.body.gravity.x = BALL_GRAV_X;
            ball.body.angularVelocity = ANG_VELOCITY;
            if (jetOpened && jetSeconds < 1) closeJet();
        }
        
        else if (cursors.down.isDown){
            ball.body.gravity.y += 5;
            ball.body.angularVelocity *= 0.8;
            if (jetOpened && jetSeconds < 1) closeJet();
        }
        
        else if (cursors.up.isDown){ // jet pack stuff
            if (jetSeconds > 0){
                ball.frame = 1;
                
                if (!jetOpened){
                    jetOpened = true;
                    countJetSeconds = setInterval(function(){
                        if (jetSeconds > 0){
                            ball.body.gravity.y -= 1.5;
                            jetSeconds--;
                            jetSecsText.text = '' + jetSeconds;
                            if (!jetSfxOn){
                                jetSfxOn = true;
                                sfxJet.play();
                            }
                        } 
                    },10);
                }
            }
            else{closeJet();}
        }

        else{
            ball.body.gravity.x = 0;
            ball.body.gravity.y = BALL_GRAV_Y; 
            
            if (ball.angle > 2) ball.body.angularVelocity = -ANG_VELOCITY*1.25;
            else if (ball.angle < -2) ball.body.angularVelocity = ANG_VELOCITY*1.25; 
            else{ ball.body.angularVelocity = 0; }
        }
        
        colors.forEach(function(item){
            if (item.key == "color2") item.body.velocity.x = 0;   
        });
        
        coins.forEach(function(item){
            checkOverlap_ball_coin(ball, item);
        });

        if (color4LocationX[level].length > 0){ // helicopter stuff
            helicopterTimer += 1;
            if (helicopterTimer >= 270){
                helicopterTimer -= 270;
                for (var x=0; x<color4LocationX[level].length; x++){
                    helicopter = helicopters.create(color4LocationX[level][x], color4LocationY[level][x]-50, 'helicopter');
                    helicopter.body.gravity.y = -10;
                }
            }
          
            helicopters.forEach(function(_helicopter) {
                if (_helicopter.body.x < ball.body.x) _helicopter.body.velocity.x = 50;
                else {_helicopter.body.velocity.x = -50;}
                 
                if (_helicopter.body.y < ball.body.y) _helicopter.body.velocity.y = 20;
                else {_helicopter.body.velocity.y = -20;}  
            });
        }

        // collissions
        game.physics.arcade.collide(colors, ball, ballHitColor, null, this);
        game.physics.arcade.collide(ceiling, ball, null, null, this);
        game.physics.arcade.collide(contBtns, ball, contOn, null, this);
        game.physics.arcade.collide(jets, ball, takeObj, null, this);
        game.physics.arcade.collide(holes, ball, nextLevel, null, this);
        game.physics.arcade.collide(springs, ball, springAnimation, null, this);
        game.physics.arcade.collide(colors4, ball, null, null, this);
        
        game.physics.arcade.collide(floor, ball, splashAnimation, null, this);
        game.physics.arcade.collide(enemies, ball, killBall, null, this);
        game.physics.arcade.collide(fishes, ball, killBall, null, this);
        game.physics.arcade.collide(helicopters, ball, killByHelicopter, null, this);
       
        game.physics.arcade.collide(ceiling, colors, null, null, this);
        game.physics.arcade.collide(floor, colors, null, null, this);
        game.physics.arcade.collide(colors, colors, null, null, this);
        game.physics.arcade.collide(colors, contBtns, null, null, this);
        game.physics.arcade.collide(helicopters, colors, killHeli, null, this);
    }
}

function closeJet(){
    ball.body.gravity.y = BALL_GRAV_Y; 
    clearInterval(countJetSeconds);
    ball.frame = 0;
    
    sfxJet.stop(300);
    jetSfxOn = false;
    
    jetOpened = false;         
}

function checkOverlap_ball_coin(_ball, _coin) {
    var boundsA = _ball.getBounds();
    var boundsB = _coin.getBounds();

    if (Phaser.Rectangle.intersects(boundsA, boundsB)){
        _coin.destroy();
        if (_coin.key == "coin"){
            sfxStar.play();
            score += 50;
            scoreText.text = '' + score; 
            starsInLevel++;
        }
        else if (_coin.key == "firstAid"){
            sfxLife.play();
            lives++;
            livesText.text = 'X ' + lives; 
        }
    }
}

function ballHitColor(_ball,_color){ 
    thisX = ball.body.x;
    newX = ball.body.x;
    jumpDistance = Math.round(Math.abs(newX - oldX));
    
    if (ball.body.touching.down){
        if (jumpDistance > 725){
            greatJump = true;
            jumpText = game.add.text(600, 140, null,{ font: "19px Fontdiner Swanky", fill: "darkred", align:"center"});
            jumpText.text = 'SUPER BOUNCE! \n' + jumpDistance + ' ft.';
            jumpText.fixedToCamera = true;
            if (jumpDistance > biggestJump) biggestJump = jumpDistance;
        }
        if (timeFromLastCollision > 3800){
            var flightTime = round(timeFromLastCollision/1000,2);
            greatJump = true;
            jumpText2 = game.add.text(600, 80, null, { font: "19px Fontdiner Swanky", fill: "#CD661D", align:"center"});
            jumpText2.text = 'FLYING BOUNCY! \n' + "Air time: " + flightTime + " sec.";
            jumpText2.fixedToCamera = true;
            if (flightTime > longestFlight) longestFlight = flightTime;
        } 
    }
    
    if (timeFromLastCollision > 100 && _ball.body.y < _color.body.y){
        switch(_color.key){
            case "color1":
                debris = game.add.sprite(ball.body.x, ball.body.y+31, 'debris');
                debris.animations.add('walk');
                debrisIt = debris.animations.play('walk', 18, false, true);
                sfxBounce.play();
            break;
            case "color2":
                debris_p = game.add.sprite(ball.body.x, ball.body.y+22, 'debris_p');
                debris_p.animations.add('walk');
                debris_pIt = debris_p.animations.play('walk', 22, false, true);
                sfxBounce.play();
            break;
            case "color3":
                debris_b = game.add.sprite(ball.body.x, ball.body.y+14, 'debris_b');
                debris_b.animations.add('walk');
                debris_bIt = debris_b.animations.play('walk', 22, false, true);
            break;      
        }  
    }
    
    timeFromLastCollision = 0;
  
    if(_color.key == "color3"){
        sfxBadTile.play();
        if (_color.frame == 2) _color.destroy();
        else{ _color.frame++; }
    }
}

function takeObj(_ball, _obj){
    if (_obj.key == 'jetPack'){
        _obj.destroy();
        jetSeconds += 700;
        jetSecsText.text = '' + jetSeconds;
        sfxJetTaken.play();
    }
}

function contOn(_ball,_btn){
    if (_btn.frame == 0) sfxCntBtn.play();
    _btn.frame = 1;
    contPoint = 1;
}

function nextLevel(){
    musics[track].fadeOut(3000);
    ball.kill();
    initBall();
    ball.visible = false;

    pauseGame();
    
    sfxSucked.play();
    sfxJet.stop();
    
    var notChoseBall = 'Mr. Bouncy';
    if (ballChosen == 'mr') notChoseBall = 'Ms. Bouncy';

    var color = 'grey';
    var percent = round((starsInLevel/coinLocationX[level].length)*100,1);
    if (percent > 33) {starsBonus = 100; color = 'darkred';}
    if (percent > 66) {starsBonus = 200; color = 'lightblue';}
    if (percent > 99) {starsBonus = 400; color = 'lightgreen';}

    endLevelImg = game.add.image(WIDTH/2-222, HEIGHT/2-223,'levelBg');
    endLevelImg.alpha = 0.9;
    endLevelText2 = game.add.text(390, 265, 'Time Bonus: ' + Math.round(timeBonus), { font: "34px Fontdiner Swanky", fill: "darkgreen"});
    endLevelText3 = game.add.text(195, 335, 'Stars taken: ' + starsInLevel + " / " + coinLocationX[level].length + '  ('+percent+'%)', 
    { font: "30px Fontdiner Swanky", fill: "yellow"});
    endLevelText5 = game.add.text(400, 400, 'Stars bonus: ' + starsBonus, { font: "30px Fontdiner Swanky", fill: color});
   
    if (level+2 != 11){
         endLevelText = game.add.text(220, 160, 'Level ' + (level+1) + ' Complete!', { font: "38px Fontdiner Swanky", fill: "darkblue"});
         endLevelText4 = game.add.text(205, 510, 'Press ENTER for level ' + (level+2), { font: "30px Fontdiner Swanky", fill: "white"});
    }
    else{
         endLevelText = game.add.text(200, 160, 'You won! \n'+ notChoseBall +' is saved!', { font: "36px Fontdiner Swanky", fill: "darkblue"});
         endLevelText4 = game.add.text(290, 510, 'Press ENTER', { font: "30px Fontdiner Swanky", fill: "white"});
    }
    
    endLevelText2.anchor.x = 0.5;
    endLevelText5.anchor.x = 0.5;
    endLevelStuff = [endLevelImg, endLevelText2, endLevelText3, endLevelText, endLevelText4, endLevelText5];
    
    for(n=0; n<endLevelStuff.length; n++) endLevelStuff[n].fixedToCamera = true;

    coolBonus1 = setTimeout(function(){
        sfxScore.play();
        coolBonus2 = setInterval(function(){
            if(Math.round(timeBonus) > 0){
                timeBonus--;
                score++;
                endLevelText2.text = 'Time Bonus: ' + Math.round(timeBonus);
                scoreText.text = '' + score;
            }
            else{
                sfxScore.stop();
            }
        },1);
    },1200);
  
    ketEnter = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    ketEnter.onDown.add(goToNextLevel, this);
}

function goToNextLevel(){
        musics[track].stop();

        pauseGame();
        game.input.keyboard.removeKey(Phaser.Keyboard.ENTER);
        clearTimeout(coolBonus1);
        try{clearInterval(coolBonus2); sfxScore.stop();} catch(e){};
        
        score += Math.round(timeBonus);
        score += starsBonus;
        
        scoreText.text = '' + score;
        
        if (level+2 != 11){ 
            newLevelText = game.add.text(420, 270, "Level " + [level+2] + ": \n" + screenNames[level+1], { font: "40px Fontdiner Swanky", fill: "#a65200"});
            newLevelText.anchor.x = 0.5;
        }
        
        game.time.events.add(2000, function() {
            game.add.tween(newLevelText).to({y: -100}, 2000, Phaser.Easing.Linear.None, true);
            game.add.tween(newLevelText).to({alpha: 0}, 2000, Phaser.Easing.Linear.None, true);
        }, this);
    
    if (level+1 < holeLocationX.length){
        for (n=0; n<endLevelStuff.length; n++) endLevelStuff[n].kill();
        level++;
        levelText.text = '' + (level+1); 
        starsInLevel = 0;
        contPoint = 0;
        timeBonus = 1000;
        
        locateObjects();
     
        ball.kill();
        initBall();
        ball.visible = true;
        startMusic();
    }
    
    else{
        endGame();   
    }
}

function springAnimation(_ball,_spring){
    ball.body.bounce.y = 0;
    ball.body.velocity.y = 0;
    _spring.animations.play('down');
    _spring.body.checkCollision.up = false;

    setTimeout(function(){
        if (Math.abs(ball.body.x - _spring.body.x) < 24){
            sfxSpring.play();
            ball.body.velocity.y = -500;  
            _spring.body.checkCollision.up = true;
            ball.body.bounce.y = BALL_BOUNCE_Y;
        }
    },350); 
}

function splashAnimation(){  
    if (!KillInProgress){
        KillInProgress = true;

        splash = game.add.sprite(ball.body.x-130, ball.body.y-85, 'splash');
        splash.animations.add('walk');

        sfxSplash.play(); 
        splashIt = splash.animations.play('walk', 15, false, true);
        
        killBall('splashing');
    }
}

function killByHelicopter(_ball, _helicopter){
   killHeli(_helicopter);
   killBall('heli'); 
}

function killHeli(_helicopter){
    _helicopter.kill();
}

function killBall(reason){
    init_Ball_attr();
    
    if(contPoint == 0) ball.body.x = INIT_BALL_X;
    else{ball.body.x = contLocationX[level][0];}
    
    lives--;
    livesText.text = 'X ' + lives;
   
    ball.visible = false;
    game.camera.follow(null);

    if (reason == 'splashing') splashIt.onComplete.add(killAnimEnded, this);

    else{
       killAnimEnded();
       sfxHit.play(); 
    }
}

function killAnimEnded(sprite, animation) {
    if (lives == 0) endGame(); // game over
    else{
        ball.visible = true;
        game.camera.follow(ball);
        resetColors();
        sfxNew_life.play();
    }
}

function locateObjects(){  
   /* pauseKey = game.input.keyboard.addKey(Phaser.Keyboard.P); 
    pauseKey.onDown.add(pauseGame, this);
    
    hsKey = game.input.keyboard.addKey(Phaser.Keyboard.H); 
    hsKey.onDown.add(hideHs, this);
    
    restartKey = game.input.keyboard.addKey(Phaser.Keyboard.R); 
    restartKey.onDown.add(restartLevel, this);*/

    for (o=0; o<objects.length; o++) objects[o].removeAll(true); // destroy all objects
    
    createClouds();
    
    resetColors();

    for (var x=0; x<bugLocationX[level].length; x++){
        enemy = enemies.create(bugLocationX[level][x], bugLocationY[level][x], 'enemy');
        enemy.body.immovable = true;
        enemy.anchor.setTo(0.8, 0.8);
        enemy.body.angularVelocity = 150;
    }
    
    for (var x=0; x<contLocationY[level].length; x++){
        contBtn = contBtns.create(contLocationX[level][x], contLocationY[level][x], 'contBtn');
        contBtn.body.immovable = true;
    }    
 
    for (x=0; x<coinLocationX[level].length; x++){
        coin = coins.create(coinLocationX[level][x], coinLocationY[level][x], 'coin');
    } 
    
    for (x=0; x<aidLocationX[level].length; x++){
        aidKit = coins.create(aidLocationX[level][x], aidLocationY[level][x], 'firstAid');
    } 

    for (x=0; x<holeLocationX.length; x++){
        hole = holes.create(holeLocationX[level], holeLocationY[level], 'hole');
        hole.body.immovable = true;
    }   
    
    for (x=0; x<jetLocationX[level].length; x++){
        jet = jets.create(jetLocationX[level][x], jetLocationY[level][x], 'jetPack');
        jet.body.immovable = true;
    } 
    
    for (x=0; x<springLocationX[level].length; x++){
        spring = springs.create(springLocationX[level][x], springLocationY[level][x], 'spring');
        spring.body.immovable = true;
        spring.animations.add('down', [0, 1, 2, 3, 2, 1, 0], 10, false);
        spring.body.checkCollision.down = false;
        spring.body.checkCollision.right = false;
        spring.body.checkCollision.left = false;
    }   
    
    for (x=0; x<fishLocationX[level].length; x++){
        fish = fishes.create(fishLocationX[level][x], HEIGHT, 'fish');
        fish.body.collideWorldBounds = true;
        fish.body.immovable = true;
        fish.body.velocity.y = -325;
        fish.body.gravity.y = 165+x*13;
        fish.body.bounce.y = 1;
    } 
    
    for (x=0; x<treeLocationX[level].length; x++){
        tree = trees.create(treeLocationX[level][x], treeLocationY[level][x], 'tree');
    } 
    for (x=0; x<tree2LocationX[level].length; x++){
        tree2 = trees.create(tree2LocationX[level][x], tree2LocationY[level][x], 'tree2');
    } 
    for (x=0; x<tree3LocationX[level].length; x++){
        tree3 = trees.create(tree3LocationX[level][x], tree3LocationY[level][x], 'tree3');
    } 
    for (x=0; x<tree4LocationX[level].length; x++){
        tree4 = trees.create(tree4LocationX[level][x], tree4LocationY[level][x], 'tree4');
    }   
}

function resetColors(){
    thisX = undefined;
    timeFromLastCollision = 0;
    reason = null;
    helicopterTimer = 0;

    colors.forEach(function(item){ item.kill(); });   
    helicopters.forEach(function(item){ item.kill(); });
    
    for (var x=0; x<color1LocationX[level].length; x++){
        color1 = colors.create(color1LocationX[level][x], color1LocationY[level][x], 'color1');
        color1.body.immovable = true;
    } 
    
    for (var x=0; x<color2LocationX[level].length; x++){
        color2 = colors.create(color2LocationX[level][x], color2LocationY[level][x], 'color2');
        color2.body.gravity.y = -100;
        color2.body.bounce.y = 1;
    }
        
    for (var x=0; x<color3LocationX[level].length; x++){
        color3 = colors.create(color3LocationX[level][x], color3LocationY[level][x], 'color3');
        color3.body.immovable = true;
    } 
    
    for (var x=0; x<color4LocationX[level].length; x++){
        color4 = colors4.create(color4LocationX[level][x], color4LocationY[level][x], 'color4');
        color4.body.immovable = true;
    }
    
    KillInProgress = false;  
}

function createClouds(){
    aX = Math.floor(Math.random() * (2200 - 1700 + 1)) + 1500; aY = Math.floor(Math.random() * (450 - 380 + 1)) + 380;
    bX = Math.floor(Math.random() * (1700 - 1200 + 1)) + 1200; bY = Math.floor(Math.random() * (400 - 350 + 1)) + 350;
    cX = Math.floor(Math.random() * (1200 - 800 + 1)) + 800; cY = Math.floor(Math.random() * (350 - 280 + 1)) + 280;
    dX = Math.floor(Math.random() * (800 - 250 + 1)) + 250; dY = Math.floor(Math.random() * (280 - 200 + 1)) + 200;
    eX = Math.floor(Math.random() * (250 - 100 + 1)) + 100; eY = Math.floor(Math.random() * (200 - 100 + 1)) + 100;

    randomX1 = [aX,cX,dX]; randomY1 = [aY,cY,dY];
    randomX2 = [eX,cX,dX,bX]; randomY2 = [bY,aY,eY,cY];
    
    for (var n=0; n<randomX1.length; n++){
        cloud1 = clouds.create(randomX1[n],randomY1[n],'cloud1');
        cloud1.body.velocity.x = -7*(n+1);
    }
    
    for (var n=0; n<randomX2.length; n++){
        cloud2 = clouds.create(randomX2[n],randomY2[n],'cloud2');
        cloud2.body.velocity.x = 7*(n+1);
    }
}

function endGame(){   
    initBall(); 
    ball.visible = false;
    ball.body.x = INIT_BALL_X;
    ball.body.moves = false;
    musics[track].stop();

    contPoint = 0;
    helicopterTimer = 0;
    jetSeconds = 0;
    
    game.input.keyboard.removeKey(Phaser.Keyboard.P);
    game.input.keyboard.removeKey(Phaser.Keyboard.R);
    game.input.keyboard.removeKey(Phaser.Keyboard.H);    
    
    $('#endFrame').show();
    $('#endFrame').css('left',($(document).width()/2)-146);
    $('#gameOver').html("Game over! Your score: " + score);
    $('#userLast').html(score);
    $('#name').focus();
    if (userName != undefined) $('#name').val(userName);

    $('#restart').click(function(){
        if ($('#name').val() != '' && $('#name').val() != undefined){
            name = $('#name').val();
            
            if (score >= 250){
                sendHighScore();
                setTimeout(function(){getHighScore();},1000);
            }  
             
            $('#endFrame').hide();
            
            locateObjects();
            ball.body.moves = true;
    
            $('#game').focus();

            gameStarted = false;
            gameOn = false;
            game.camera.x = 0;
            create(); 
        }
    });
}

function init_Ball_attr(){
    ball.body.y = INIT_BALL_Y;
    ball.body.velocity.y = 0;
    ball.body.velocity.x = 0;
    ball.body.gravity.x = BALL_GRAV_X; 
    ball.body.gravity.y = BALL_GRAV_Y;
    ball.body.bounce.y = BALL_BOUNCE_Y; 
}

function pauseGame(){
    if (gameStarted){
        pauseText.visible = !(pauseText.visible);
    
        gameOn = !gameOn;
        ball.body.moves = !ball.body.moves;
        
        colors.forEach(function(item) {if (item.key == "color2") item.body.moves = !item.body.moves;});
        fishes.forEach(function(item) {item.body.moves = !item.body.moves;});
        enemies.forEach(function(item) {item.body.moves = !item.body.moves;});
        
        sfxJet.pause();
        if (cursors.up.isUp) clearInterval(countJetSeconds);
    }
}

function round(num, places) {
    var multiplier = Math.pow(10, places);
    return Math.round(num * multiplier) / multiplier;
}

function restartLevel(){
    if (lives == 1) {endGame();}
    else{
        killBall();
        locateObjects();
        ball.destroy();  
        initBall(); 
        init_Ball_attr();
    }
}

function sendHighScore(){  
    $.ajax({
        url: 'http://www.johnnytal.com/php/bouncy.php',
        type: 'POST',
        cache: false,
        data: {name:name, score:score, level:level+1, userId:userId, biggestJump:biggestJump, longestFlight:longestFlight}
    }).done(function(){
        getUserScore();
    });    
}

function getHighScore(){
    $.ajax({                            
        url: 'http://www.johnnytal.com/php/getBouncyScore.php',         
        dataType: 'html'
    }).done(function(response){
        $('#output').html(response);
        loadComplete('High Scores');
    });
}

function getUserScore(userId){
    $.ajax({
        url: 'http://www.johnnytal.com/php/getUserScore.php',
        type: 'POST',
        cache: false,
        data: {userId:userId},
        dataType:"json",
    }).done(function(result){
        getResults(result);
        loadComplete("User's statistics");
    });  
}

function getAnyoneScore(){
    $.ajax({
        url: 'http://www.johnnytal.com/php/getAnyoneScore.php',
        type: 'POST',
        cache: false,
        dataType:"json",
    }).done(function(result){
        getAnyoneResults(result);
    });  
}

function getResults(result){
    if (result[0] != undefined && result[0] != NaN){
        userHi = parseInt(result[0]);
        $('#userHi').html(userHi);
    }
    if (result[1] != undefined && result[1] != NaN){
        userBiggest = parseInt(result[1]);
        $('#userJump').html(userBiggest + " ft.");
    }
    if (result[2] != undefined && result[2] != NaN){
        userLongest = parseFloat(result[2]);
        $('#userFlight').html(userLongest + " sec.");
    }
}

function getAnyoneResults(result){
    if (result[0] != undefined &&  result[0] != NaN){
        biggestEver = parseInt(result[0]);
        $('#biggestJump').html(biggestEver + " ft.");
    }
    if (result[1] != undefined &&  result[1] != NaN){
        longestEver = parseFloat(result[1]);
        $('#longestEver').html(longestEver + " sec.");
    }      
}

function onLogIn(){
    try{
        for(x=9; x>bestUserLevel-1; x--) levelLockImg[x].destroy();
        setTimeout(function(){
            for (n=0; n<10; n++){
                if (n > bestUserLevel-1) levelLockImg[n] = game.add.image(75+(n*70),100,'lock');
            }
            chooseLevelImg.x = 55+((bestUserLevel-1)*70);
        },1200);
    } catch(e){}
}
 
function loadComplete(what){
    try{
        document.getElementById('loaded').innerHTML = what + "...";   
        nOfStuffToLoad++;
        if (connected && nOfStuffToLoad == 7) setTimeout(function(){$('#loader').remove();},1000);
        else if (!connected && nOfStuffToLoad == 4) setTimeout(function(){$('#loader').remove();},1000);
    }catch(e){}
}

function toggleSound(){
    if(speaker.frame == 1){
        speaker.frame = 0;
        soundOn = false;
        for(x=0; x<allSfx.length; x++) allSfx[x].volume = 0;
        for (n=0; 0<musics.length; n++) musics[n].mute();
    }
    else{
        speaker.frame = 1; 
        soundOn = true; 
        for(x=0; x<allSfx.length; x++) allSfx[x].volume = 1;
        allSfx[5].vloume = 0.4;
        allSfx[11].vloume = 0.8;
        for (n=0; 0<musics.length; n++) musics[n].unmute();
    }
}