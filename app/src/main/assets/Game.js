class aSprite
{
     constructor(x, y, imageSRC)
     {
         this.zindex = 0;
         this.x = x;
         this.y = y;
         this.vx = 0;
         this.vy = 0;
         this.sImage = new Image();
         this.sImage.src = imageSRC;
     }

     // Getter
     get xPos()
     {
        return this.x;
     }

     get yPos()
     {
         return this.y;
     }

     // Setter
     set xPos(newX)
     {
        this.x = newX;
     }

     set yPos(newY)
     {
         this.y = newY;
     }

     // Method
     render()
     {
        canvasContext.drawImage(this.sImage,this.x, this.y);
     }

     update(elapsed)
     {
        this.xPos += this.vx * elapsed;
        this.yPos += this.vy * elapsed;
     }

    // Method
     sPos(newX,newY)
     {
        this.x = newX;
        this.y = newY;

     }
     // Method
     sVel(newX, newY)
     {
        this.vx = newX;
        this.vy = newY;
     }

     //Static Method
     static distance(a, b)
     {
        const dx = a.x - b.x;
        const dy = a.y - b.y;

        return Math.hypot(dx, dy);
     }

 }

 //Background Class--------------------------------------------------------------------
 class Background extends aSprite
 {
     constructor(x, y, imageSRC, sx, sy)
     {
     super(x, y, imageSRC);
     this.sx = sx;
     this.sy = sy;
     this.vx = bkgdSpeedDef;
     }

     render()
     {
        canvasContext.drawImage(this.sImage, this.x, this.y, this.sx, this.sy);
        canvasContext.drawImage(this.sImage, this.x + canvas.width, this.y, this.sx, this.sy);
     }

     update(elapsed)
     {
         super.update(elapsed);
         this.vx = bkgdSpeedDef * gameSpeed;
         if(this.x < -canvas.width)
         {
           this.x = 0;
         }
    }
 }


 //Asteroids Class--------------------------------------------------------------------
 class Asteroids extends aSprite
 {
     constructor(x, y, imageSRC, sx, sy)
     {
     super(x, y, imageSRC);
     this.sx = sx;
     this.sy = sy;
     this.vx = asteroidsSpeedDef;
     }

     render()
     {
     //canvasContext.save();
     //canvasContext.translate (-this.x, -this.y);
     //canvasContext.rotate(45);
     canvasContext.drawImage(this.sImage, this.x, this.y, this.sx, this.sy);
     //canvasContext.restore();
     }

      update(elapsed)
      {
      super.update(elapsed);
          if (this.x < -100)
          {
            var asteroidWidth = Math.random() * (200-50) + 50; //Random value between 50 and 200
            this.x = canvas.width + asteroidWidth;
            var asteroidHeight = Math.random();
            this.y = asteroidHeight * canvas.height;
          }
          this.vx = asteroidsSpeedDef * gameSpeed;
      }
}

 //Spaceship Class--------------------------------------------------------------------
 class Spaceship extends aSprite
 {
     constructor(x, y, imageSRC, sx, sy)
     {
         super(x, y, imageSRC);
         this.sx = sx;
         this.sy = sy;
         this.speed = 10;
     }

     render() {
        canvasContext.drawImage(this.sImage, this.x, this.y, this.sx, this.sy);
     }

     update(elapsed)
     {
        if (lastPt != null)
        {
             var dir = 1;
             var disSquared = Math.pow(this.y - (lastPt.y - this.sy * 0.5), 2);
             if (this.y > lastPt.y-this.sy*0.5) dir = -1;
             this.y += dir * this.speed * elapsed * ((disSquared / (this.speed* this.speed)));
             if (disSquared < 15) this.y = lastPt.y - this.sy * 0.5;
        }
     }
 }

  //Buttons Class--------------------------------------------------------------------
  class Button extends aSprite
  {
      constructor(x, y, imageSRC, sx, sy)
      {
          super(x, y, imageSRC);
          this.sx = sx;
          this.sy = sy;
          this.vx = asteroidsSpeedDef;
      }

      render()
      {
        canvasContext.drawImage(this.sImage, this.x, this.y, this.sx, this.sy);
      }

       update(elapsed)
       {
        super.update(elapsed);

       }
  }

 //Global variables
 var canvas;
 var canvasContext;
 var score = 0;
 var highScore = 0;
 var gameSpeed = 1;
 var speedUpCounter = 0;
 var bkgdSpeedDef = -190;
 var asteroidsSpeedDef = -420;
 var elapsed = 0;

 var backgroundImg;
 var asteroids = [7];
 var spaceship;
 var playButton;
 var lastPt = null;
 var lastPtX = 0;
 var lastPtY = 0;

 var soundMgr;
 var GAMESTATE = "MENU";

 var showSpeedUpText = "NO";
 var speedUpText = "OFF";
 var speedUpWaitTimer = 0.5;


 //Set canvas size to window size
 function resizeCanvas()
 {
     canvas.width = window.innerWidth;
     canvas.height = window.innerHeight;
 }

 /*
 Set up the game:
    Set the canvas
    Check if storage is available for use
    Run the initialise function
 */
 function load()
 {
     canvas = document.getElementById('gameCanvas');
     canvasContext = canvas.getContext('2d');

     if (storageAvailable('localStorage'))
     {
        console.log("local storage available");
        if(localStorage.getItem('player_score'))
        {
            console.log("we got score ");
            highScore = localStorage.getItem('player_score');
        }
        else
        {
            localStorage.setItem('player_score', 0);
        }
     }
     else
     {
        console.log("Local storage not available");
     }
     init();
 }


 /*
 Does the initial set up of the game:
    Checks if the canvas can be found (for debugging purposes)
    Sets all the event listeners for touches and mouse actions
    Sets the canvas size to the correct size through the resizeCanvas function
    Loads the background images, the asteroids, the spaceship and the button into variables
    Plays the music of the game
    Saves the current time into a variable for later usage
    Goes inside the game loop function
 */
 function init()
 {
     if (canvas.getContext)
     {
         //Set Event Listeners for window, mouse and touch

         window.addEventListener('resize', resizeCanvas, false);
         window.addEventListener('orientationchange', resizeCanvas, false);

         canvas.addEventListener("touchstart", touchDown, false);
         canvas.addEventListener("touchmove", touchXY, true);
         canvas.addEventListener("touchend", touchUp, false);
         document.body.addEventListener("touchcancel", touchUp, false);

         canvas.addEventListener("mousedown", mouseDown, false);
         canvas.addEventListener("mousemove", mouseMove, false);

         resizeCanvas();

         backgroundImg = new Background(0, 0, 'Background.png', canvas.width, canvas.height);
         backgroundMenu = new Background(0, 0, 'menuBackground.png', canvas.width, canvas.height);

            for (i = 0; i < 7; i++)
            {
                 var asteroidHeight = Math.random();
                 var asteroidWidth = canvas.width + (i*300);
                 asteroids[i] = new Asteroids(asteroidWidth, canvas.height * asteroidHeight, 'asteroid.png', 50, 50);
            }

         spaceship = new Spaceship(0, canvas.height - 160, 'spaceship.png', 50, 50);

         playButton = new Button(canvas.width/2 - 50, canvas.height/2 + 50, 'play.png', 100, 100);

         if (soundMgr != null) soundMgr.playMusic(0); //Play main music

         startTimeMS = Date.now();
         gameLoop();
    }
 }

 /*
 This function is being used to switch to PLAY game state from the MENU or OVER ones
 It sets all needed variables to default values
 Reloads the asteroids and spaceship in order to reset their position and make sure weird behavior doesn't appear
 Resets the start time variable to the current time
 */
 function resetGame()
 {
     score = 0;
     gameSpeed = 1;
     speedUpCounter = 0;

        for (i = 0; i < 7; i++)
        {
             var asteroidHeight = Math.random();
             var asteroidWidth = canvas.width + (i*300);
             asteroids[i] = new Asteroids(asteroidWidth, canvas.height * asteroidHeight, 'asteroid.png', 50, 50);
        }

     spaceship = new Spaceship (0, canvas.height - 160, 'spaceship.png', 50, 50);

     startTimeMS = Date.now();
 }

/*
All non-per-class and non-rendering behavior is handled here
A switch statement is being used to check in which games tate the game is
OVER and MENU game states need touch detection and nothing else, in order to detect button presses
PLAY game state counts the score, speeds up game under certain conditions and checks for collision detection
*/
 function gameLoop()
 {
    elapsed = (Date.now() - startTimeMS)/1000;

    switch(GAMESTATE)
    {
        case "MENU":
            touchDetection();
        break;

        case "PLAY":

            score += elapsed;
            speedUpCounter += elapsed;
            if (speedUpCounter > 10 && gameSpeed < 2)
            {
                gameSpeed += 0.15;
                speedUpCounter = 0;
                if(soundMgr != null) soundMgr.playSound(1); //Play speedup sound
            }

            collisionDetection();
            update(elapsed);

        break;

        case "OVER":
            touchDetection();
        break;
    }

     render(elapsed);
     startTimeMS = Date.now();
     requestAnimationFrame(gameLoop);
 }


 /*
 All rendering-related functionality is handled here
 Before anything is added to the screen, the canvas gets cleared (we don't need to write on top of the previous frame)
 In the three game states, all text on screen is being handled here
 For the PLAY game state, we render the background image, as well as all asteroids and the spaceship
 For the MENU one, we render the background menu, add in text and render the play button. Nothing else is needed in this scene
 For the OVER one, we render both the play background image as well as asteroids, play button and spaceship and all needed text
 */
 function render(elapsed)
 {

    canvasContext.clearRect(0,0,canvas.width, canvas.height);


    switch(GAMESTATE)
    {
        case "PLAY":

            backgroundImg.render();
             for (i = 0; i < 7; i++)
             {
                asteroids[i].render();
             }
            canvasContext.font = "25px Courier";
            canvasContext.textAlign = "center";
            canvasContext.fillStyle = "magenta";
            canvasContext.fillText("Score: " + Math.round(score), canvas.width*0.85, canvas.height*0.1);
            spaceship.render();

            if (speedUpCounter <= 3 && score > 5)
            {
                displaySpeedUpText();
            }
        break;


        case "MENU":
            backgroundMenu.render();

            canvasContext.font = "55px Garamond";
            canvasContext.strokeStyle = "yellow";
            canvasContext.textAlign = "center";
            canvasContext.strokeText("Asteroids", canvas.width/2, canvas.height*0.25);

            canvasContext.font = "20px Courier";
            canvasContext.fillStyle = "black";
            canvasContext.textAlign = "center";
            canvasContext.fillText("Touch the display to avoid the asteroids with your spaceship!", canvas.width/2, canvas.height*0.45);

            playButton.render();
        break;


        case "OVER":
            backgroundImg.render();
            for (i = 0; i < 7; i++)
            {
                asteroids[i].render();
            }
            canvasContext.font = "60px Impact";
            canvasContext.strokeStyle = "magenta";
            canvasContext.textAlign = "center";
            canvasContext.strokeText("GAME OVER!", canvas.width/2, canvas.height*0.2);
            canvasContext.font = "40px Comic Sans MS";
            canvasContext.fillStyle = "red";
            canvasContext.fillText("High Score: " + Math.round(highScore), canvas.width/2, canvas.height*0.33);
            canvasContext.font = "40px Comic Sans MS";
            canvasContext.fillStyle = "cyan";
            canvasContext.fillText("Score: " + Math.round(score), canvas.width/2, canvas.height*0.5);
            playButton.render();
            spaceship.render();

        break;
    }

 }

 //Goes through the update method of all objects
 function update(elapsed)
 {
     backgroundImg.update(elapsed);

     for (i = 0; i < 7; i++)
     {
        asteroids[i].update(elapsed);
     }

     spaceship.update(elapsed);
 }

/*
Handles the speed up text
Checks if text is currently being displayed
It appears for 0.5s (handled with speedUpWaitTimer)
Goes back and forth between rendering and not of text to infinity
Need to handle for how long this method should be run through conditions when calling it!
*/
function displaySpeedUpText()
{
    if (speedUpText === "OFF")
    {
        canvasContext.textAlign = "center";
        canvasContext.font = "40px Comic Sans MS";
        canvasContext.fillText("Game Speeds Up!", canvas.width/2, canvas.height/2);
        speedUpWaitTimer -= elapsed;
        if (speedUpWaitTimer <= 0)
        {
            speedUpText = "ON";
            speedUpWaitTimer = 0.5;
        }
    }
    else
    {
        speedUpWaitTimer -= elapsed;
        if (speedUpWaitTimer <= 0)
        {
            speedUpText = "OFF";
            speedUpWaitTimer = 0.5;
        }
    }
}


/*
AABB collision detection
Goes through all asteroids through a loop and checks if the spaceship intersects with any of them
When it does, it plays a sound, sets the game state to over, rounds up the score
If the new score is better than the previous record, it updates the highScore variable
It then proceeds to save the new highScore variable into local storage
*/
 function collisionDetection()
 {
    for (i = 0; i < 7; i++)
    {
        if(spaceship.x < asteroids[i].x + asteroids[i].sx &&
            spaceship.x + spaceship.sx > asteroids[i].x &&
            spaceship.y < asteroids[i].y + asteroids[i].sy &&
            spaceship.y + spaceship.sy > asteroids[i].y)
        {
            if(soundMgr != null) soundMgr.playSound(0); //Play hit sound
            console.log("Collision Detected");
            GAMESTATE = "OVER";
            score = Math.round(score);
            if (score > highScore)
            {
                highScore = score;
                localStorage.setItem('player_score', highScore);
            }
        }
    }
 }

/*
Checks if local storage is available
For debugging purposes
If current browser doesn't support local storage, it returns an error
*/
 function storageAvailable(type){
 try
 {
 var storage = window[type],
 x = '__storage_test__';
 storage.setItem(x, x);
 storage.removeItem(x);
 return true;
 }
 catch(e)
 {
 return e instanceof DOMException && (e.code === 22 || e.code === 1014 || e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') && storage.length !== 0;
 }
 }


/*
Checks if the last touch position's coordinates overlap with the button's coordinates
If they do, touch and mouse coordinates are reset (for debugging reasons)
resetGame function is called and game state is set to PLAY
*/
 function touchDetection()
 {
    if (lastPtX > playButton.x && lastPtX < playButton.x + playButton.sx
    && lastPtY > playButton.y && lastPtY < playButton.y + playButton.sy)
    {
        lastPtX = 0;
        lastPtY = 0;
        lastPt = null;
        resetGame();
        GAMESTATE = "PLAY";
    }
 }

 //touch events-----------------------------------------------------------------
 function touchUp(evt)
 {
     evt.preventDefault();
     // Terminate touch path
     lastPt=null;
 }

 function touchDown(evt)
 {
     evt.preventDefault();
     if(gameOverScreenScreen)
     {
        return;
     }
     touchXY(evt);
 }

 function touchXY(evt)
 {
     evt.preventDefault();
     lastPt = {x:evt.touches[0].pageX, y:evt.touches[0].pageY};
     lastPtX = evt.touches[0].pageX;
     lastPtY = evt.touches[0].pageY;
 }

 function mouseMove(evt)
 {
     evt.preventDefault();
     lastPt = { x: evt.pageX, y: evt.pageY };
 }

  function mouseDown(evt)
  {
      evt.preventDefault();
      lastPtX = evt.pageX;
      lastPtY = evt.pageY;
  }