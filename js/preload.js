var preloader = function(game){};
 
preloader.prototype = {
    preload: function(){ 
        // create progress % text

        this.progress = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 30, '',{
             font: '25px ' + font, fill: 'white', fontWeight: 'normal', align: 'center'
        });
        this.progress.anchor.setTo(0.5, 0.5);
        this.game.load.onFileComplete.add(this.fileComplete, this);

        this.add.text(this.game.world.centerX - 37,  this.game.world.centerY - 150, "", {
            font: '18px ' + font, fill: 'lightgrey', fontWeight: 'normal', align: 'center'
        });

        // load assets

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
        game.load.image('panel', 'images/bouncey/panel.png');
        game.load.image('inst', 'images/bouncey/inst.png');
        game.load.image('replay', 'images/bouncey/replay.png');
    
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

        themeMusic = new buzz.sound("sounds/theme_music.wav", {
            preload: true,
            loop: true
        });
        
        music1 = new buzz.sound("sounds/music1.wav", {
            preload: true,
            loop: true
        });
        
        music2 = new buzz.sound("sounds/music2.wav", {
            preload: true,
            loop: true
        });
        
        musics = [music1, music2, themeMusic];
    },
    
    create: function(){
        this.game.state.start("Game");  
    }, 
    
    update: function(){           

    }
};

preloader.prototype.fileComplete = function (progress, cacheKey, success, totalLoaded, totalFiles) {
    this.progress.text ="";
   // console.log(progress, cacheKey, success);
};
