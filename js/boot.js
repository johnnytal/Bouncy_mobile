//document.addEventListener("deviceready", start, false);
window.onload = start;

function start(){
    WIDTH = 800; 
    HEIGHT = 720;
    ROOM_WIDTH = 2400;
    
    w = window.innerWidth * window.devicePixelRatio;
    h = window.innerHeight * window.devicePixelRatio;

    game = new Phaser.Game(WIDTH, HEIGHT, Phaser.CANVAS, 'game');

    game.state.add("Boot", boot);
    game.state.add("Preloader", preloader);
    game.state.add("Game", game_main);
    game.state.add("GameOver", game_over);

    game.state.start("Boot");  
};

var boot = function(game){};

boot.prototype = {
    preload: function(){

    },
    
    create: function(){  
        font = 'Fontdiner Swanky';      
        game.stage.backgroundColor = '#f1f1f1';
        
        bannerNotCraeted = true;
        
        frame = 0;
        name = '';
        googlelogindone = false;
        var socialService;

        if (this.game.device.desktop){
            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            
         
            
            this.scale.maxWidth = w; 
            this.scale.maxHeight = h; 
            
            this.game.scale.pageAlignHorizontally = true;
        } 
        
        else {
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

            this.scale.maxWidth = w;
            this.scale.maxHeight = h;
            
            this.scale.forceOrientation(false, true);
        }
        
        game.state.start('Preloader');
    }
};


