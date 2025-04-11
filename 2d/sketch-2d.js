// Grid settings
let tileSize = 32;
let gridWidth = 20;
let gridHeight = 20;
let grid;

// Player position
let playerX = 1;
let playerY = 1;

// Font variable
let gameFont;

function preload() {
  // Optional: Load a CP437 font (e.g., Perfect DOS VGA 437)
  // Download from http://www.int10h.org/oldschool-pc-fonts/
  // gameFont = loadFont('Px437_IBM_VGA8.ttf');
}

function setup() {
  createCanvas(gridWidth * tileSize, gridHeight * tileSize);
  // Set text properties
  textAlign(CENTER, CENTER);
  textFont(gameFont || 'Courier New');
  textSize(tileSize * 0.8); // Fits CP437 characters well
  // Initialize grid
  grid = [];
  for (let y = 0; y < gridHeight; y++) {
    grid[y] = [];
    for (let x = 0; x < gridWidth; x++) {
      if (x === 0 || x === gridWidth - 1 || y === 0 || y === gridHeight - 1) {
        grid[y][x] = 1; // Wall
      } else {
        grid[y][x] = 0; // Empty
      }
    }
  }
  // Add inner walls
  grid[5][5] = 1;
  grid[5][6] = 1;
  grid[10][10] = 1;
  // Add gems
  grid[3][3] = 3;
  grid[7][7] = 3;
  // Place player
  grid[playerY][playerX] = 2;
}

function draw() {
  background(0);
  // Render grid
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      let px = x * tileSize + tileSize / 2;
      let py = y * tileSize + tileSize / 2;
      let charToDraw;
      if (grid[y][x] === 1) {
        fill(100); // Gray for walls
        charToDraw = '█'; // CP437 full block
      } else if (grid[y][x] === 2) {
        fill(0, 0, 255); // Blue for player
        charToDraw = '☺'; // CP437 smiley
      } else if (grid[y][x] === 3) {
        fill(255, 255, 0); // Yellow for gems
        charToDraw = '♦'; // CP437 diamond
      } else {
        fill(0); // Black for empty
        charToDraw = ' '; // CP437 space
      }
      text(charToDraw, px, py);
    }
  }
}

function keyPressed() {
  let newX = playerX;
  let newY = playerY;
  if (keyCode === LEFT_ARROW) {
    newX--;
  } else if (keyCode === RIGHT_ARROW) {
    newX++;
  } else if (keyCode === UP_ARROW) {
    newY--;
  } else if (keyCode === DOWN_ARROW) {
    newY++;
  }
  if (newX >= 0 && newX < gridWidth && newY >= 0 && newY < gridHeight) {
    if (grid[newY][newX] !== 1) {
      grid[playerY][playerX] = 0;
      playerX = newX;
      playerY = newY;
      if (grid[newY][newX] === 3) {
        grid[newY][newX] = 0; // Collect gem
      }
      grid[playerY][playerX] = 2;
    }
  }
}