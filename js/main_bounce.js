var game_main = function(game){
    var score, lives, level, timeBonus, reason, countJetSeconds, endLevelStuff, name;
    var thisX,newX,oldX, jumpDistance, notHidden, logoImg1, logoImg2, chooseLevelImg, track;
    
    screenNames = ['Welcome!','Ups & downs','Break the wall!','Ground control to Major Bouncy','Hot potato'
    ,'Run Bouncy, Run!','Icarus','A most elusive fish...','Eclectic bounce','The maze of doom, Mu-hahaha!'];
    
    objects = [];
    levelColorImg = [];
    levelLockImg = [];
    chooseLevelText = [];
    allSfx = [];

    INIT_BALL_X = 50;
    INIT_BALL_Y = 80;
    
    BALL_GRAV_X = 100;
    BALL_GRAV_Y = 150;
    BALL_BOUNCE_Y = 0.85;
    
    ANG_VELOCITY = 60;
    
    gameOn = false;
    gameStarted = false;
    KillInProgress = false;
    notHidden = true;
    contPoint = 0;
    starsInLevel = 0;
    starsBonus = 0;
    
    jetSeconds = 0;
    jetOpened = false;
    jetSfxOn = false;
    
    fishTimer = 0;
    anotherFishTimer = 0;
    movingFish = true;
    
    soundOn = true;
    
    helicopterTimer = 0;
    
    timeFromLastCollision = 0;
    greatJump = false;
    jumpTextTimer = 0;
    biggestJump = 0;
    longestFlight = 0;
    bestUserLevel = 1;
    
    font = 'Fontdiner Swanky';
};

game_main.prototype = {
        
    create: function(){
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
        scoreText = game.add.text(360, 10, '' + score, { font: "22px " + font, fill: "#a65200", align:'left'});
        scoreText.fixedToCamera = true;
        scoreText.anchor.x = 0.5;
       
        livesText = game.add.text(140, 10, 'X ' + lives, { font: "24px "  + font, fill: "beige"});
        livesText.fixedToCamera = true;
    
        levelText = game.add.text(34, 8, '' + (level+1), { font: "23px "  + font, fill: "grey"});
        levelText.fixedToCamera = true;
        levelText.anchor.x = 0.5;
        
        timeBonusText = game.add.text(555, 10, '' + timeBonus, { font: "21px "  + font, fill: "#d66a00"});
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
        
        clouds = game.add.group();
        clouds.enableBody = true;
        clouds.physicsBodyType = Phaser.Physics.ARCADE;
        clouds.alpha = 0.6;
    
        sea = game.add.tileSprite(0, HEIGHT-134, ROOM_WIDTH, 134, 'sea');
        sea.alpha = 0.9;

        pauseText = game.add.text(335, 50, 'Game Paused', { font: "22px "  + font, fill: "yellow"});
        pauseText.fixedToCamera = true;
        pauseText.visible = false;

        modal = new gameModal(game);
        
        objects = [colors, colors4, enemies, holes, coins, contBtns, jets, fishes, springs, helicopters, clouds, trees];
        
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

        if (!this.game.device.desktop){
            try{ mc.destroy(); } catch(e){}
            
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
            
            /*mc.on("swipeup", function(ev) {
                 if(!ev.handled){
                     turnPlane('up');
                 };
            });*/
            
            mc.on("swipedown", function(ev) {
                if(!ev.handled){
                    ball.body.gravity.y += 5;
                    ball.body.angularVelocity *= 0.8;
                    
                    ball.body.gravity.x = 0;
                    ball.body.velocity.x /= 2;
                    
                    if (ball.angle > 2) ball.body.angularVelocity = -ANG_VELOCITY * 1.25;
                    else if (ball.angle < -2) ball.body.angularVelocity = ANG_VELOCITY * 1.25; 
                    else{ ball.body.angularVelocity = 0; };
                };
            });
            
            /*mc.on('doubletap', function(ev) {
                togglePause();
            });*/
        }
        
        newLevelText = game.add.text(420, 270, "Level " + [level+1] + ": \n" + screenNames[level], { font: "40px Fontdiner Swanky", fill: "#a65200"});
        newLevelText.anchor.x = 0.5;
        
        game.time.events.add(2000, function() {
            game.add.tween(newLevelText).to({y: -100}, 2000, Phaser.Easing.Linear.None, true);
            game.add.tween(newLevelText).to({alpha: 0}, 2000, Phaser.Easing.Linear.None, true);
        }, this);
        
        themeMusic.fadeOut(500);
        startMusic();

        initBall();
    },
    
    update: function(){
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
        } catch(e){}
            
        if (!gameOn && gameStarted){
             if(game.input.activePointer.isDown){
                goToNextLevel(); 
            }
        }
           
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
    
            if (ball.body.y < 40) ball.body.y = 80;
            
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
                 ball.body.gravity.y = BALL_GRAV_Y; 
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
};

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
        BALL_GRAV_X = 100;
        BALL_GRAV_Y = 150;
        BALL_BOUNCE_Y = 0.85;
    }
    else if (ballChosen == 'miss'){
        ball = game.add.sprite(INIT_BALL_X, INIT_BALL_Y, 'miss_ball');  
        BALL_GRAV_X = 125;
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
    game.state.start('GameOver', false, false, score); 
}

function save_scroe(){
    return null;
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
        if (cursors.up.isUp){
            try{ 
                clearInterval(countJetSeconds);
            } catch(e){};
        }
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
