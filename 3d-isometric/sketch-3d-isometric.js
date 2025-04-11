// Grid settings
let tileWidth = 20;
let tileHeight = 10;
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
  // Optional: Load CP437 font
  // gameFont = loadFont('Px437_IBM_VGA8.ttf');
}

function setup() {
  createCanvas(800, 800);
  // Set text properties
  textAlign(CENTER, CENTER);
  textFont(gameFont || 'Courier New');
  textSize(tileHeight * 1.5); // Slightly larger for visibility
  // Initialize 3D grid
  grid = [];
  for (let z = 0; z < gridDepth; z++) {
    grid[z] = [];
    for (let y = 0; y < gridHeight; y++) {
      grid[z][y] = [];
      for (let x = 0; x < gridWidth; x++) {
        grid[z][y][x] = 0; // All empty initially
      }
    }
  }
  // Add walls only on cube faces (sparse to show inner content)
  for (let z = 0; z < gridDepth; z++) {
    for (let y = 0; y < gridHeight; y++) {
      for (let x = 0; x < gridWidth; x++) {
        if (x === 0 || x === gridWidth - 1 || y === 0 || y === gridHeight - 1 || z === 0 || z === gridDepth - 1) {
          grid[z][y][x] = 1; // Wall
        }
      }
    }
  }
  // Add inner walls
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
  // Render all tiles, back to front
  let drawnTiles = 0;
  for (let z = gridDepth - 1; z >= 0; z--) { // High Z to low Z (closer tiles last)
    for (let y = gridHeight - 1; y >= 0; y--) { // Back to front
      for (let x = 0; x < gridWidth; x++) {
        let tile = grid[z][y][x];
        // Draw all tiles (even empty) to debug
        let px = (x - y) * tileWidth / 2;
        let py = (x + y) * tileHeight / 4 - z * tileHeight;
        px += width / 2;
        py += height / 3;
        let charToDraw;
        if (tile === 1) {
          fill(100, 200); // Gray, semi-transparent
          charToDraw = '█';
        } else if (tile === 2) {
          fill(0, 0, 255); // Blue
          charToDraw = '☺';
        } else if (tile === 3) {
          fill(255, 255, 0); // Yellow
          charToDraw = '♦';
        } else {
          fill(20, 100); // Faint gray for empty
          charToDraw = ' '; // Space
        }
        text(charToDraw, px, py);
        drawnTiles++;
      }
    }
  }
  // Debug info
  fill(255);
  textSize(16);
  text(`Pos: (${playerX}, ${playerY}, ${playerZ})`, 10, height - 40);
  text(`Tiles drawn: ${drawnTiles}`, 10, height - 20);
  textSize(tileHeight * 1.5);
}

function keyPressed() {
  let newX = playerX;
  let newY = playerY;
  let newZ = playerZ;
  if (keyCode === LEFT_ARROW) {
    newX--;
  } else if (keyCode === RIGHT_ARROW) {
    newX++;
  } else if (keyCode === UP_ARROW) {
    newY--;
  } else if (keyCode === DOWN_ARROW) {
    newY++;
  } else if (key === 'w' || key === 'W') {
    newZ--;
  } else if (key === 's' || key === 'S') {
    newZ++;
  }
  if (
    newX >= 0 && newX < gridWidth &&
    newY >= 0 && newY < gridHeight &&
    newZ >= 0 && newZ < gridDepth
  ) {
    if (grid[newZ][newY][newX] !== 1) {
      grid[playerZ][playerY][playerX] = 0;
      playerX = newX;
      playerY = newY;
      playerZ = newZ;
      if (grid[newZ][newY][newX] === 3) {
        grid[newZ][newY][newX] = 0; // Collect gem
      }
      grid[playerZ][playerY][playerX] = 2;
    }
  }
}