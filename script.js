const board = document.getElementById("game-board");
const turnDisplay = document.getElementById("turn-display");

const SIZE = 8;
let currentPlayer = "black";

// ゲーム盤の状態 (null, "black", "white")
const cells = Array.from({ length: SIZE }, () => Array(SIZE).fill(null));

// 盤面初期化
function initBoard() {
  board.innerHTML = "";
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.x = x;
      cell.dataset.y = y;
      cell.addEventListener("click", handleClick);
      board.appendChild(cell);
    }
  }

  // 初期配置
  cells[3][3] = "white";
  cells[3][4] = "black";
  cells[4][3] = "black";
  cells[4][4] = "white";
  render();
}

function render() {
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const cell = board.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
      cell.innerHTML = "";
      if (cells[y][x]) {
        const disc = document.createElement("div");
        disc.classList.add(cells[y][x]);
        cell.appendChild(disc);
      }
    }
  }

  turnDisplay.textContent = `現在のターン: ${currentPlayer === "black" ? "黒" : "白"}`;
}

// 石を挟める方向を返す
function getFlippableDiscs(x, y, color) {
  if (cells[y][x]) return [];

  const directions = [
    [1, 0], [-1, 0], [0, 1], [0, -1],
    [1, 1], [-1, -1], [1, -1], [-1, 1]
  ];

  const opponent = color === "black" ? "white" : "black";
  const flippable = [];

  for (let [dx, dy] of directions) {
    let nx = x + dx;
    let ny = y + dy;
    const candidates = [];

    while (nx >= 0 && nx < SIZE && ny >= 0 && ny < SIZE && cells[ny][nx] === opponent) {
      candidates.push([nx, ny]);
      nx += dx;
      ny += dy;
    }

    if (nx >= 0 && nx < SIZE && ny >= 0 && ny < SIZE && cells[ny][nx] === color && candidates.length > 0) {
      flippable.push(...candidates);
    }
  }

  return flippable;
}

function handleClick(e) {
  const x = parseInt(e.currentTarget.dataset.x);
  const y = parseInt(e.currentTarget.dataset.y);

  const toFlip = getFlippableDiscs(x, y, currentPlayer);
  if (toFlip.length === 0) return;

  cells[y][x] = currentPlayer;
  for (const [fx, fy] of toFlip) {
    cells[fy][fx] = currentPlayer;
  }

  currentPlayer = currentPlayer === "black" ? "white" : "black";
  render();
}

initBoard();
