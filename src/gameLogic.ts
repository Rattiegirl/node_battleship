import { ROWS, COLS, SHIPS, totalShipDecks } from './config';
import type { Sea, Cell } from './types';

export { totalShipDecks };

export function createSea(rows: number, cols: number): Sea {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => '.' as Cell)
  );
}

export function inSea(sea: Sea, rId: number, cId: number): boolean {
  if (rId > sea.length - 1 || rId < 0) return false;
  if (cId > sea[rId].length - 1 || cId < 0) return false;
  return true;
}

export function spotIsAvailable(sea: Sea, rId: number, cId: number): boolean {
  if (!inSea(sea, rId, cId)) return false;
  return sea[rId][cId] === '.';
}

export function placeInSea(
  sea: Sea,
  rId: number,
  cId: number,
  sign: Cell = '-'
): void {
  if (inSea(sea, rId, cId)) {
    sea[rId][cId] = sign;
  }
}

/** Place ship with 0-based row, col. direction=true = horizontal (right), false = vertical (down) */
export function placeShip(
  sea: Sea,
  row: number,
  col: number,
  length: number,
  direction: boolean
): boolean {
  const rowIndex = row;
  const colIndex = col;

  if (direction) {
    for (let x = 0; x < length; x++) {
      if (!spotIsAvailable(sea, rowIndex, colIndex + x)) return false;
    }
    for (let x = 0; x < length; x++) {
      sea[rowIndex][colIndex + x] = '#';
      placeInSea(sea, rowIndex, colIndex + x + 1);
      placeInSea(sea, rowIndex, colIndex - 1);
      for (let i = 0; i < length + 2; i++) {
        placeInSea(sea, rowIndex - 1, colIndex - 1 + i);
        placeInSea(sea, rowIndex + 1, colIndex - 1 + i);
      }
    }
  } else {
    for (let x = 0; x < length; x++) {
      if (!spotIsAvailable(sea, rowIndex + x, colIndex)) return false;
    }
    for (let x = 0; x < length; x++) {
      sea[rowIndex + x][colIndex] = '#';
      placeInSea(sea, rowIndex + x + 1, colIndex);
      placeInSea(sea, rowIndex - 1, colIndex);
      for (let i = 0; i < length + 2; i++) {
        placeInSea(sea, rowIndex - 1 + i, colIndex - 1);
        placeInSea(sea, rowIndex - 1 + i, colIndex + 1);
      }
    }
  }
  return true;
}

export function placeRandomShips(sea: Sea, ships: readonly number[]): void {
  for (const ship of ships) {
    while (true) {
      const rowIndex = Math.floor(Math.random() * sea.length);
      const colIndex = Math.floor(Math.random() * sea[0].length);
      const direction = Math.random() < 0.5;
      if (placeShip(sea, rowIndex, colIndex, ship, direction)) break;
    }
  }
}

export function noShips(sea: Sea, total: number): boolean {
  let hitDecks = 0;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (sea[r][c] === 'X') hitDecks++;
    }
  }
  return hitDecks === total;
}

export function hit(sea: Sea, row: number, col: number): boolean {
  return sea[row][col] === '#';
}

export type SunkResult =
  | { sunk: true; row: number; col: number; length: number; direction: boolean }
  | { sunk: false; row: null; col: null; length: null; direction: null };

export function sunkCheck(sea: Sea, row: number, col: number): SunkResult {
  const rows = sea.length;
  const cols = sea[0].length;

  if (
    (row === 0 || sea[row - 1][col] === '-') &&
    (col === 0 || sea[row][col - 1] === '-') &&
    (row === rows - 1 || sea[row + 1][col] === '-') &&
    (col === cols - 1 || sea[row][col + 1] === '-')
  ) {
    return { sunk: true, row, col, length: 1, direction: true };
  }

  let direction = false;
  if (
    (col !== 0 && (sea[row][col - 1] === '#' || sea[row][col - 1] === 'X')) ||
    (col !== cols - 1 &&
      (sea[row][col + 1] === '#' || sea[row][col + 1] === 'X'))
  ) {
    direction = true;
  }

  if (direction) {
    let startCol = col;
    while (startCol > 0) {
      if (sea[row][startCol - 1] === '#')
        return { sunk: false, row: null, col: null, length: null, direction: null };
      if (sea[row][startCol - 1] === 'X') startCol--;
      else break;
    }
    let endCol = col;
    while (endCol < cols - 1) {
      if (sea[row][endCol + 1] === '#')
        return { sunk: false, row: null, col: null, length: null, direction: null };
      if (sea[row][endCol + 1] === 'X') endCol++;
      else break;
    }
    return {
      sunk: true,
      row,
      col: startCol,
      length: endCol - startCol + 1,
      direction: true,
    };
  } else {
    let startRow = row;
    while (startRow > 0) {
      if (sea[startRow - 1][col] === '#')
        return { sunk: false, row: null, col: null, length: null, direction: null };
      if (sea[startRow - 1][col] === 'X') startRow--;
      else break;
    }
    let endRow = row;
    while (endRow < rows - 1) {
      if (sea[endRow + 1][col] === '#')
        return { sunk: false, row: null, col: null, length: null, direction: null };
      if (sea[endRow + 1][col] === 'X') endRow++;
      else break;
    }
    return {
      sunk: true,
      row: startRow,
      col,
      length: endRow - startRow + 1,
      direction: false,
    };
  }
}

export function surroundShip(
  sea: Sea,
  startRow: number,
  startCol: number,
  direction: boolean,
  length: number
): void {
  if (direction) {
    let minCol = 0;
    let maxCol = COLS - 1;
    if (startCol > 0) {
      sea[startRow][startCol - 1] = '-';
      minCol = startCol - 1;
    }
    if (startCol + length < COLS) {
      sea[startRow][startCol + length] = '-';
      maxCol = startCol + length;
    }
    if (startRow > 0) {
      for (let i = minCol; i <= maxCol; i++) {
        sea[startRow - 1][i] = '-';
      }
    }
    if (startRow < ROWS - 1) {
      for (let i = minCol; i <= maxCol; i++) {
        sea[startRow + 1][i] = '-';
      }
    }
  } else {
    let minRow = 0;
    let maxRow = ROWS - 1;
    if (startRow > 0) {
      sea[startRow - 1][startCol] = '-';
      minRow = startRow - 1;
    }
    if (startRow + length < ROWS) {
      sea[startRow + length][startCol] = '-';
      maxRow = startRow + length;
    }
    if (startCol > 0) {
      for (let i = minRow; i <= maxRow; i++) {
        sea[i][startCol - 1] = '-';
      }
    }
    if (startCol < COLS - 1) {
      for (let i = minRow; i <= maxRow; i++) {
        sea[i][startCol + 1] = '-';
      }
    }
  }
}

export function getRecursiveRandomPoint(seaVisible: Sea): [number, number] {
  const row = Math.floor(Math.random() * ROWS);
  const col = Math.floor(Math.random() * COLS);
  if (seaVisible[row][col] === '.') return [row, col];
  return getRecursiveRandomPoint(seaVisible);
}

const COORD_REGEX = /^[a-j](?:10|[1-9])$/;
export function isValidCoordinate(coord: string): boolean {
  return COORD_REGEX.test(coord.toLowerCase());
}
