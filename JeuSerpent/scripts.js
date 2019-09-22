window.onload = function(){
  var canvas;
  var ctx;
  var canvasWidth=900;
  var canvasHeight=600;
  var blockSize=30;
  var delay = 100;
  var snaky;
  var apply;
  var widthInBlocks = canvasWidth/blockSize;
  var heightInBlocks = canvasHeight/blockSize;
  var score;
  init();
  function init(){
    canvas = document.createElement('canvas');
    canvas.width=canvasWidth;
    canvas.height=canvasHeight;
    canvas.style.border = "30px solid grey";
    canvas.style.margin = "50px auto";
    canvas.style.display = "block";
    canvas.style.backgroundColor = "#ddd";
    document.body.appendChild(canvas);
    ctx = canvas.getContext("2d");
    snaky = new snak([[6,4],[5,4],[4,4],[3,4],[2,4]],"right");
    apply = new Apple([10,10]);
    score=0;
    refrechCanvas();
  }
  function refrechCanvas(){
    snaky.advance();
    if (snaky.checkCollision()) {
        gameOver();
    }
    else{
      if(snaky.isEatApple(apply)) {
        //le serpent a mangé la pomme
        score++;
        snaky.eatApple=true;
        do {
          apply.setPosition();
        } while (apply.isOnSnake(snaky));
      }
    ctx.clearRect(0,0,canvasWidth,canvasHeight);
    drawScore();
    snaky.draw();
    apply.draw();
    setTimeout(refrechCanvas,delay);
    }
  }

  function gameOver(){
    var centerX = canvasWidth/2,centerY = canvasHeight/2;
    ctx.save();
    ctx.font="bold 40px sans-serif";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.strokeStyle = "white";
    ctx.lineWidth = 5;
    ctx.textBaseline = "middle";
    ctx.strokeText("Game Over",centerX,centerY-180);
    ctx.strokeText("Pour rejouer, Appuyez sur Espace",centerX,centerY-120);
    ctx.fillText("Game Over",centerX,centerY-180);
    ctx.fillText("Pour rejouer, Appuyez sur Espace",centerX,centerY-120);
    ctx.restore();
  }
  function restart(){
    score=0;
    snaky = new snak([[6,4],[5,4],[4,4],[3,4],[2,4]],"right");
    apply = new Apple([10,10]);
    refrechCanvas();
  }
  function drawScore(){
    ctx.save();
    ctx.font="bold 200px sans-serif";
    ctx.fillStyle = "grey";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    var centerX = canvasWidth/2,centerY = canvasHeight/2;

    ctx.fillText(score.toString(),centerX,centerY);

    //ctx.fillStyle = "grey";
    //ctx.textalign = "center";
    ctx.restore();
  }

  function drawBlock(ctx,pos){
    var x = pos[0] * blockSize;
    var y = pos[1] * blockSize;
    ctx.fillRect(x,y,blockSize,blockSize);
  }
  function snak(body,direction){
    this.body=body;
    this.direction = direction;
    this.eatApple = false;
    this.draw=function(){
      ctx.save();
      ctx.fillStyle = "#ff0000";
      for (var i = 0; i < this.body.length; i++) {
        drawBlock(ctx,this.body[i]);
      }
      ctx.restore();
    }
    this.advance=function(){
      var nextPos= this.body[0].slice();
      switch(this.direction){
        case "right":
        nextPos[0]+=1;
        break;
        case "left":
        nextPos[0]-=1;
        break;
        case "up":
        nextPos[1]-=1;
        break;
        case "down":
        nextPos[1]+=1;
        break;
      }
      this.body.unshift(nextPos);
      if (!this.eatApple) {
        this.body.pop();
      }
      else
        this.eatApple=false;
    }
    this.setDirection = function(newDirection){
      var allowedDirection;
      switch(this.direction){
        case "right":
        case "left":
          allowedDirection=["up","down"];
        break;
        case "up":
        case "down":
          allowedDirection=["right","left"];
        break;
      }

      if (allowedDirection.indexOf(newDirection)>-1) {
        this.direction = newDirection;
      }

    }

    this.checkCollision = function(){
      var wallCollision = false;
      var SnakeCollision = false;
      var head = this.body[0];
      var rest = this.body.slice(1);
      var snakeX = head[0],snakeY = head[1];
      var minX=0,minY=0,maxX=widthInBlocks-1,maxY=heightInBlocks-1;
      var isNotBHW = snakeX < minX || snakeX > maxX;
      var isNotBVW = snakeY < minY || snakeY > maxY;
      if (isNotBHW||isNotBVW) {
        wallCollision = true;
      }
      for (var i = 0; i < rest.length; i++) {
        if (snakeX === rest[i][0] && snakeY === rest[i][1]) {
          SnakeCollision = true;
        }
      }
      return SnakeCollision || wallCollision;
    }

    this.isEatApple = function(pomme){
      var head = this.body[0];
      if (head[0] ==  pomme.position[0] &&
          head[1] ==  pomme.position[1]) {
        return true;
      }
      else{
        return false;
      }
    }

  }

  function Apple(position){
    this.position=position;
    this.draw = function(){
      ctx.save();
      ctx.fillStyle = "#04d9c1";
      ctx.beginPath();
      var radius = blockSize/2;
      var x = this.position[0]*blockSize + radius;
      var y = this.position[1]*blockSize + radius;
      ctx.arc(x,y,radius,0,Math.PI*2,true);
      ctx.fill();
      ctx.restore();
    }
    this.setPosition = function(){
      var newX,newY;
      newX=Math.round(Math.random()*(widthInBlocks-1));
      newY=Math.round(Math.random()*(heightInBlocks-1));
      this.position = [newX,newY];
    }
    this.isOnSnake = function(snakeToCheck){
      var isOnSnake = false;
      for (var i = 0; i < snakeToCheck.body.length; i++) {
        if(this.position[0]==snakeToCheck.body[i][0] &&
            this.position[1]==snakeToCheck.body[i][1]){
          isOnSnake = true;
        }
      }
      return isOnSnake;
    }
  }

  document.onkeydown = function handlKeyDown(e){
    var key= e.keyCode;
    var newDirection;
    switch (key){
      case 37:
        newDirection = "left";
        break;
      case 38:
        newDirection = "up";
        break;
      case 39:
        newDirection = "right";
        break;
      case 40:
        newDirection = "down";
        break;
      case 32:
        restart();
        return;
      default:
        newDirection = "down";

    }
    snaky.setDirection(newDirection);
  }



}
