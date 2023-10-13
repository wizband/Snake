const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 10;
let snakeBody = [];
let velocityX = 0, velocityY = 0;
let setIntervalId;
let score = 0;

// getting high score from the local storage...
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

const changeFoodPosition = () => {
  // passing a random 0 - 30 value as food position
  foodX = Math.floor(Math.random() * 30) + 1;
  foodY = Math.floor(Math.random() * 30) + 1;
}

const handleGameOver = () => {
  // clearing the time and reloading the on game over..
  clearInterval(setIntervalId);
  alert("Game Over!! Press ok to reply....");
  location.reload();
}

const changeDirection = (e) => {
  // changing velocity value based on key pressed
  if(e.key === "ArrowUp" && velocityY != 1) {
    velocityX = 0;
    velocityY = -1;
  } else if(e.key === "ArrowDown"  && velocityY != -1) {
    velocityX = 0;
    velocityY = 1;
  } else if(e.key === "ArrowLeft"  && velocityX != 1) {
    velocityX = -1;
    velocityY = 0;
  } else if(e.key === "ArrowRight"  && velocityX != -1) {
    velocityX = 1;
    velocityY = 0;
  }
}

controls.forEach(key => {
  key.addEventListener("click", () => changeDirection({key: key.dataset.key}));
})

const initGame = () => {
  if(gameOver) return handleGameOver();
  let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;
  
  if(snakeX === foodX && snakeY === foodY) {
    changeFoodPosition();
    snakeBody.push([foodX, foodY]); // pushing food position to snake body array.
    score++; // increase score by one
    
    highScore = score >= highScore ? score : highScore;
    localStorage.setItem("high-score", highScore);
    scoreElement.innerText = `Score: ${score}`;
    //highScoreElement.innerText = `High Score: ${highScore}`;
  }
  
  for(let i = snakeBody.length - 1; i > 0; i--){
    // shifting forward the values of the element in the snakw body one by one .
    snakeBody[i] = snakeBody[i - 1];
  }
  
  snakeBody[0] = [snakeX, snakeY]; // setting first element of snake body to current snake position.
  
  // updating the snake head position base on the current velocity
  snakeX += velocityX;
  snakeY += velocityY;
  
  // checking if the snake head is out of wall if so setting game over to true.
  if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY >30){
    gameOver = true;
  }
  
  for(let i = 0; i < snakeBody.length; i++){
    // adding a div for each part of the snake body
    htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
    // check if the snake head hit its body if so set game over
    if(i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]){
      gameOver = true;
    }
  }
  playBoard.innerHTML = htmlMarkup;
}
changeFoodPosition();
setIntervalId = setInterval(initGame, 125);
document.addEventListener("keydown", changeDirection);