var game_over = function(game){};

game_over.prototype = {

    preload: function(){
       
        ball.visible = false;
        ball.body.x = INIT_BALL_X;
        ball.body.moves = false;
        ball.destroy();
        
        musics[track].stop();
    
        contPoint = 0;
        helicopterTimer = 0;
        jetSeconds = 0;
    },
    
    init: function(score){
        var bestMessage, message;
        
        /*try{
            setTimeout(function(){
                banner.show();    
            }, 400); 
        } catch(e){}
        
        try{
            socialService.submitScore( score, function(error){});
        } catch(e){}
        
        if (best){
            bestMessage = '\n New high score!';
        }
        else{
            bestMessage = '';
        }
        */
       
        message = 'Your score: \n' + score; 
     
        modal.createModal({
            type:"game_over",
            includeBackground: false,
            modalCloseOnInput: false,
            itemsArr: 
            [
                 {
                    type: "image",
                    content: "panel",
                    contentScale: 1.35
                },
                {
                    type: "text",
                    content: message,
                    fontFamily: font,
                    fontSize: 36,
                    offsetY: -100,
                    color: "0x00ff00",
                    stroke: "0xff0000",
                    strokeThickness: 2
                },
                {
                    type: "image",
                    content: "inst",
                    offsetY: 70,
                    offsetX: 60,
                    callback: function () { // menu
                        game.state.start('Preloader');
                    }
                },            
                {
                    type: "image",
                    content: "replay",
                    offsetY: 70,
                    offsetX: -60,
                    callback: function () { // new game
                        game.state.start('Menu');
                    }
                }
            ]
        });   
            
        modal.showModal("game_over");
        for (n=0; n<4; n++){
            game.add.tween(modal.getModalItem('game_over',n)).from( { y: - 800 }, 500, Phaser.Easing.Linear.In, true);
        }
        
        replayImg = modal.getModalItem('game_over',2);
        replayImg.input.useHandCursor = true;
        
        playImg = modal.getModalItem('game_over',3);
        playImg.input.useHandCursor = true;
    }
};
