import {
  createSea,
  placeRandomShips,
  hit,
  sunkCheck,
  surroundShip,
  noShips,
  getRecursiveRandomPoint,
  isValidCoordinate,
  totalShipDecks,
} from './gameLogic';
import { ROWS, COLS, SHIPS } from './config';
import type { GameState, Sea } from './types';

const ALPHABET = 'abcdefghij';

interface Game {
  user_sea: Sea;
  user_visible: Sea;
  bot_sea: Sea;
  bot_visible: Sea;
  is_user_turn: boolean;
  finished: boolean;
  winner: string | null;
}

function initGame(): Game {
  const user_sea = createSea(ROWS, COLS);
  const bot_sea = createSea(ROWS, COLS);
  const user_visible = createSea(ROWS, COLS);
  const bot_visible = createSea(ROWS, COLS);
  placeRandomShips(user_sea, SHIPS);
  placeRandomShips(bot_sea, SHIPS);
  return {
    user_sea,
    user_visible,
    bot_sea,
    bot_visible,
    is_user_turn: true,
    finished: false,
    winner: null,
  };
}

let game: Game = initGame();

export function getState(): GameState {
  return {
    user_sea: game.user_sea,
    user_visible: game.user_visible,
    bot_sea: game.bot_sea,
    bot_visible: game.bot_visible,
    is_user_turn: game.is_user_turn,
    game_over: game.finished,
    winner: game.winner,
  };
}

export function resetGame(): GameState {
  game = initGame();
  return getState();
}

export interface PlayerMoveResult {
  result: 'hit' | 'miss';
  sunk?: boolean;
  bot_result?: { result: string; sunk?: boolean; message?: string };
  message?: string;
}

export function playerMove(coord: string): PlayerMoveResult {
  const coordinate = coord.toLowerCase().trim();

  if (game.finished) {
    return { result: 'miss', message: 'Game is already finished' };
  }
  if (!game.is_user_turn) {
    return { result: 'miss', message: "It's not your turn" };
  }
  if (!isValidCoordinate(coordinate)) {
    throw new Error('Invalid coordinate format (use a1–j10)');
  }

  const row = parseInt(coordinate.slice(1), 10) - 1;
  const col = ALPHABET.indexOf(coordinate[0]);

  const cell = game.bot_sea[row][col];
  if (cell === 'X' || cell === '~') {
    return { result: 'miss', message: 'Already targeted' };
  }

  if (hit(game.bot_sea, row, col)) {
    game.bot_visible[row][col] = '#';
    game.bot_sea[row][col] = 'X';
    const sunkResult = sunkCheck(game.bot_sea, row, col);
    if (sunkResult.sunk) {
      surroundShip(
        game.bot_visible,
        sunkResult.row,
        sunkResult.col,
        sunkResult.direction,
        sunkResult.length
      );
    }
    if (noShips(game.bot_sea, totalShipDecks)) {
      game.finished = true;
      game.winner = 'user';
      return {
        result: 'hit',
        sunk: sunkResult.sunk,
        message: 'You win!',
      };
    }
    return { result: 'hit', sunk: sunkResult.sunk };
  }

  game.bot_visible[row][col] = '~';
  game.is_user_turn = false;
  const botResult = botMove();
  return { result: 'miss', bot_result: botResult };
}

export function botMove(): { result: string; sunk?: boolean; message?: string } {
  if (game.finished) {
    return { result: 'miss', message: 'Game already over' };
  }

  const [row, col] = getRecursiveRandomPoint(game.user_visible);

  if (hit(game.user_sea, row, col)) {
    game.user_visible[row][col] = '#';
    game.user_sea[row][col] = 'X';
    const sunkResult = sunkCheck(game.user_sea, row, col);
    game.is_user_turn = false;

    botMove(); // keep shooting until miss

    if (sunkResult.sunk) {
      surroundShip(
        game.user_visible,
        sunkResult.row,
        sunkResult.col,
        sunkResult.direction,
        sunkResult.length
      );
      botMove(); // extra turn after sinking
    }

    if (noShips(game.user_sea, totalShipDecks)) {
      game.finished = true;
      game.winner = 'bot';
      return { result: 'hit', sunk: sunkResult.sunk, message: 'Bot wins!' };
    }
    return { result: 'hit', sunk: sunkResult.sunk };
  }

  game.user_visible[row][col] = '~';
  game.is_user_turn = true;
  return { result: 'miss' };
}
