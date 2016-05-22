var menu = function(game){
    ballChosen = 'mr';
};
 
menu.prototype = {
    preload: function(){ 

    },
    
    create: function(){  
                
        logo = game.add.image(0,0,'logo');
        
        logoText = game.add.text(230, 165, 'Choose your character:', { font: "28px "  + font, fill: "#002800"});
        logoText2 = game.add.text(70, 18, 'B O U N C Y !', { font: "35px "  + font, fill: "darkblue"});
        logoText3 = game.add.text(340, 35, 'The Ball That Bounces Much', { font: "22px "  + font, fill: "#965000"});
        logoText4 = game.add.text(320, 440, 'Tap to Start', { font: "28px "  + font, fill: "#A52A2A"});
        
        logoImg1 = game.add.image(315, 300,'ball');
        logoImg2 = game.add.image(460, 300,'miss_ball');
        logoImg1.inputEnabled = true;
        logoImg2.inputEnabled = true;
        logoImg1.input.useHandCursor = true;
        logoImg2.input.useHandCursor = true;
        logoImg1.events.onInputDown.add(chooseBall, this);
        logoImg2.events.onInputDown.add(chooseBall, this);

        logoImgText = game.add.text(255, 220,'Mr. Bouncy \n (higher jumps but slower & heavier)', { font: "17px "  + font, fill: "darkblue"});
        chooseImg = game.add.image(305,290,'choose');
        
        storyText = game.add.text(60,380, "Ms. Bouncy was kidnapped by the evil mr. fish! it's up to you to save her!" , { font: "18px "  + font, fill: "#002800"});

        chooseLevelImg = game.add.image(55+((bestUserLevel-1)*70),80,'choose2');

        if (levelColorImg[0] == undefined){
            for (n=0; n<10; n++){
                levelColorImg[n] = game.add.image(55 + (n * 70), 80, 'color1');
                levelColorImg[n].alpha = round((n / 10) + 0.1, 1);
                levelColorImg[n].inputEnabled = true;
                levelColorImg[n].events.onInputDown.add(chooseLevel, this);
                levelColorImg[n].input.useHandCursor = true;
                
                if (n > bestUserLevel-1) levelLockImg[n] = game.add.image(75 + (n * 70), 100, 'lock');
                chooseLevelText[n] = game.add.text(70 + (n * 70), 90, 'Level \n    ' + (n + 1),  { font: "14px "  + font, fill: "lightyellow"});
            }
        }
        chooseLevelImg.x = 55 + ((bestUserLevel - 1) * 70);

        clouds = game.add.group();
        clouds.enableBody = true;
        clouds.physicsBodyType = Phaser.Physics.ARCADE;
        clouds.alpha = 0.6;
        
        createClouds();
        
        cursors = game.input.keyboard.createCursorKeys();
    }, 
    
    update: function(){           
        if(game.input.activePointer.isDown){
            this.game.state.start("Game"); 
        }
        
        level = (chooseLevelImg.x - 55) / 70;
        
        if (cursors.left.isDown) chooseBall(logoImg1);
        else if (cursors.right.isDown) chooseBall(logoImg2);
        else if (cursors.down.isDown && chooseLevelImg.x > 55){
            chooseLevelImg.x -= 70;  
            level = (chooseLevelImg.x-55)/70;   
        }
        else if (cursors.up.isDown && chooseLevelImg.x < 55 + ((bestUserLevel - 1) * 70)){
            chooseLevelImg.x += 70; 
            level = (chooseLevelImg.x - 55 ) / 70;
            levelText.text = '' + ((chooseLevelImg.x - 55) / 70 + 1);
        }
    }
};

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

function chooseLevel(_level){
    factor = _level.alpha * 10;
    if (factor < bestUserLevel + 1) chooseLevelImg.x = (factor) * 70 - 15;
}
