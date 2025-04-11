// Grid settings
let tileSize = 32;
let gridWidth = 20;
let gridHeight = 20;
let gridDepth = 20;
let grid;

// Player position
let playerX = 1;
let playerY = 1;
let playerZ = 1;

// Font variable
let gameFont;

function preload() {
  // Optional: Load CP437 font (e.g., Perfect DOS VGA 437)
  // gameFont = loadFont('Px437_IBM_VGA8.ttf');
}

function setup() {
  createCanvas(gridWidth * tileSize, gridHeight * tileSize);
  // Set text properties
  textAlign(CENTER, CENTER);
  textFont(gameFont || 'Courier New');
  textSize(tileSize * 0.8);
  // Initialize 3D grid
  grid = [];
  for (let z = 0; z < gridDepth; z++) {
    grid[z] = [];
    for (let y = 0; y < gridHeight; y++) {
      grid[z][y] = [];
      for (let x = 0; x < gridWidth; x++) {
        // Borders on all faces of the cube
        if (x === 0 || x === gridWidth - 1 || y === 0 || y === gridHeight - 1 || z === 0 || z === gridDepth - 1) {
          grid[z][y][x] = 1; // Wall
        } else {
          grid[z][y][x] = 0; // Empty
        }
      }
    }
  }
  // Add inner walls on various Z levels
  grid[5][5][5] = 1;
  grid[5][5][6] = 1;
  grid[10][10][10] = 1;
  grid[15][8][8] = 1;
  // Add gems
  grid[3][3][3] = 3;
  grid[7][7][7] = 3;
  grid[12][5][5] = 3;
  // Place player
  grid[playerZ][playerY][playerX] = 2;
}

function draw() {
  background(0);
  // Render the XY plane at playerZ
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      let px = x * tileSize + tileSize / 2;
      let py = y * tileSize + tileSize / 2;
      let charToDraw;
      if (grid[playerZ][y][x] === 1) {
        fill(100); // Gray for walls
        charToDraw = '█'; // CP437 full block
      } else if (grid[playerZ][y][x] === 2) {
        fill(0, 0, 255); // Blue for player
        charToDraw = '☺'; // CP437 smiley
      } else if (grid[playerZ][y][x] === 3) {
        fill(255, 255, 0); // Yellow for gems
        charToDraw = '♦'; // CP437 diamond
      } else {
        fill(0); // Black for empty
        charToDraw = ' '; // CP437 space
      }
      text(charToDraw, px, py);
    }
  }
  // Display current Z level
  fill(255);
  textSize(20);
  text(`Floor: ${playerZ}`, tileSize, tileSize * gridHeight - tileSize / 2);
  textSize(tileSize * 0.8); // Reset for grid
}

function keyPressed() {
  let newX = playerX;
  let newY = playerY;
  let newZ = playerZ;
  // Handle movement
  if (keyCode === LEFT_ARROW) {
    newX--;
  } else if (keyCode === RIGHT_ARROW) {
    newX++;
  } else if (keyCode === UP_ARROW) {
    newY--;
  } else if (keyCode === DOWN_ARROW) {
    newY++;
  } else if (key === 'w' || key === 'W') {
    newZ--; // Move up a floor
  } else if (key === 's' || key === 'S') {
    newZ++; // Move down a floor
  }
  // Check boundaries and collisions
  if (
    newX >= 0 && newX < gridWidth &&
    newY >= 0 && newY < gridHeight &&
    newZ >= 0 && newZ < gridDepth
  ) {
    if (grid[newZ][newY][newX] !== 1) {
      grid[playerZ][playerY][playerX] = 0; // Clear old position
      playerX = newX;
      playerY = newY;
      playerZ = newZ;
      if (grid[newZ][newY][newX] === 3) {
        grid[newZ][newY][newX] = 0; // Collect gem
      }
      grid[playerZ][playerY][playerX] = 2; // Set new position
    }
  }
}